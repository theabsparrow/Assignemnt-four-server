/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from 'jsonwebtoken';
import { Torder, TTrackingInfo } from './order.interface';
import Car from '../car/car.model';
import AppError from '../../error/AppError';
import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import Order from './order.model';
import { User } from '../users/user.model';
import { createTrackingID, dateFormat, orderUtills } from './order.utills';
import { paymentStatus } from './order.const';
import mongoose from 'mongoose';
import { generateOrderHTML } from '../../utills/orderPdfTemplate';
import { generateOrderPdf } from '../../utills/generateOrderPdf';
import { sendEmail } from '../../utills/sendEmail';
import fs from 'fs/promises';
import { USER_ROLE } from '../users/user.constant';

// create an order service
const createOrder = async (
  orderData: Partial<Torder>,
  payload: { id: string; ip: string; user: JwtPayload },
) => {
  const { ip, id, user } = payload;
  const { userEmail } = user;
  const isUser = await User.findOne({ email: userEmail, isDeleted: false });
  const userID = isUser?._id;
  const carData = await Car.findById(id);
  if (!carData) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'This car is not available right now',
    );
  }
  if (!carData?.inStock) {
    throw new AppError(
      StatusCodes.EXPECTATION_FAILED,
      'this car isn`t in stock right now',
    );
  }
  orderData.estimatedDeliveryTime = dateFormat(
    orderData?.estimatedDeliveryTime as string,
  );
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const totalPrice = carData?.price + orderData.deliveryCost!;
    orderData.totalPrice = totalPrice;
    orderData.userID = userID;
    orderData.quantity = 1;
    orderData.car = carData._id;
    const order = await Order.create([orderData], { session });
    if (!order.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'failed to create order');
    }
    const id = order[0]._id;
    const shurjopayPayload = {
      amount: totalPrice,
      order_id: id,
      currency: 'BDT',
      customer_name: `${isUser?.name?.firstName} ${isUser?.name?.lastName}`,
      customer_address: orderData?.location
        ? orderData?.location
        : orderData?.nearestDealer,
      customer_email: isUser?.email,
      customer_phone: isUser?.phoneNumber,
      customer_city: isUser?.currentAddress ? isUser?.currentAddress : 'N/A',
      client_ip: ip,
    };
    const paymentResult = await orderUtills.makePayment(shurjopayPayload);
    if (paymentResult?.transactionStatus) {
      const updatePayment = await Order.findByIdAndUpdate(
        id,
        {
          orderID: paymentResult?.sp_order_id,
          transactionStatus: paymentResult?.transactionStatus,
        },
        { new: true, runValidators: true, session },
      );
      if (!updatePayment) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'failed to create order');
      }
    }
    await session.commitTransaction();
    await session.endSession();
    return paymentResult.checkout_url;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(StatusCodes.BAD_REQUEST, err);
  }
};

// verify order
const verifyPayment = async (order_id: string) => {
  const verifiedPayment = await orderUtills.verifyPayment(order_id);
  if (!verifiedPayment || verifiedPayment.length === 0) {
    throw new Error('No verified payment found.');
  }
  const paymentInfo = {
    transactionStatus: verifiedPayment[0]?.bank_status,
    bank_status: verifiedPayment[0]?.bank_status,
    sp_code: verifiedPayment[0]?.sp_code,
    sp_message: verifiedPayment[0]?.sp_message,
    method: verifiedPayment[0]?.method,
    date_time: verifiedPayment[0]?.date_time,
  };
  const status =
    verifiedPayment[0].bank_status == paymentStatus.success
      ? 'Paid'
      : verifiedPayment[0].bank_status == paymentStatus.failed
        ? 'Pending'
        : verifiedPayment[0].bank_status == paymentStatus.cancel && 'Cancelled';

  const tracking: TTrackingInfo = {};

  if (status === 'Paid') {
    const trackingID = await createTrackingID();
    tracking.trackingID = trackingID;
    tracking.isTracking = false;
    tracking.trackingStatus = 'Order Placed';
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const updatedData = await Order.findOneAndUpdate(
      { orderID: order_id },
      {
        $set: {
          ...paymentInfo,
          status,
          tracking,
        },
      },
      { new: true, session, runValidators: true },
    );

    if (!updatedData) {
      throw new AppError(StatusCodes.BAD_GATEWAY, 'faild to verify order');
    }
    const isUser = await User.findById(updatedData?.userID);
    if (!isUser) {
      throw new AppError(StatusCodes.BAD_GATEWAY, 'no user found');
    }

    const carID = updatedData?.car;
    const carInfo = await Car.findById(carID);
    if (!carInfo) {
      throw new AppError(StatusCodes.BAD_GATEWAY, 'no car data found found');
    }

    if (
      verifiedPayment[0].bank_status === paymentStatus.success &&
      carInfo?.inStock
    ) {
      const updatecarData = await Car.findByIdAndUpdate(
        carID,
        { inStock: false },
        {
          new: true,
          session,
          runValidators: true,
        },
      );
      if (!updatecarData) {
        throw new AppError(StatusCodes.BAD_GATEWAY, 'faild to verify order');
      }
    }

    let pdfPath;

    if (updatedData?.status === 'Paid' && carInfo?.inStock) {
      const html = generateOrderHTML({
        userInfo: isUser,
        carInfo,
        orderInfo: updatedData,
      });
      pdfPath = await generateOrderPdf(html, updatedData?.orderID);
    }

    if (pdfPath) {
      const info = await sendEmail({
        to: isUser?.email,
        subject: 'Your order document',
        text: 'your full order information is here print it for future use',
        attachments: [
          {
            filename: `${order_id}.pdf`,
            path: pdfPath,
          },
        ],
      });
      if (info.accepted.length > 0) {
        await fs.unlink(pdfPath);
        console.log('file deleted successfully');
      }
    }
    await session.commitTransaction();
    await session.endSession();
    return verifiedPayment;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(StatusCodes.BAD_REQUEST, err);
  }
};

// get all orders by admin superadmin
const getAllOrder = async (query: Record<string, unknown>) => {
  const orderQuery = new QueryBuilder(Order.find(), query)
    .search(['userEmail'])
    .filter()
    .sort()
    .paginateQuery()
    .fields();
  const result = await orderQuery.modelQuery;
  const meta = await orderQuery.countTotal();
  return { result, meta };
};

const getMyOwnOrders = async (
  query: Record<string, unknown>,
  user: JwtPayload,
) => {
  const { userEmail } = user;
  const isUSer = await User.findOne({ email: userEmail });
  const userID = isUSer?._id;
  const myOrderQuery = new QueryBuilder(
    Order.find({ userID, isDeleted: false }),
    query,
  )
    .search(['userEmail'])
    .filter()
    .sort()
    .paginateQuery()
    .fields();
  const result = await myOrderQuery.modelQuery;
  const meta = await myOrderQuery.countTotal();
  return { result, meta };
};

const getASingleOrder = async (id: string, user: JwtPayload) => {
  const { userEmail, userRole } = user;
  const isUSer = await User.findOne({ email: userEmail });
  const useriD = isUSer?._id;
  const result = await Order.findById(id);
  if (!result) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'this order information is not available',
    );
  }

  if (
    userRole === USER_ROLE.user &&
    useriD?.toString() !== result?.userID.toString()
  ) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'you have no permission to view this order',
    );
  }
  if (userRole === USER_ROLE.user && result?.isDeleted) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'this order information is not available',
    );
  }
  return result;
};

const switchTracking = async (id: string, payload: boolean) => {
  const result = await Order.findByIdAndUpdate(
    id,
    { 'tracking.isTracking': payload },
    { new: true },
  );
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'faild to track order info');
  }
  return result;
};

const deleteOrder = async (id: string) => {
  const result = await Order.findByIdAndDelete(id);
  return result;
};

const deleteMyOwnOrder = async (id: string, user: JwtPayload) => {
  const { userEmail } = user;
  const result = await Order.findOneAndUpdate(
    { _id: id, userEmail },
    { isDeleted: false },
    { new: true },
  );
  return result;
};

const deleteAllOrders = async (ids: string[], user: JwtPayload) => {
  const { userEmail } = user;
  if (!ids.length) {
    throw new Error('No order IDs provided.');
  }
  const result = await Order.updateMany(
    { _id: { $in: ids }, userEmail },
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const orderService = {
  createOrder,
  getAllOrder,
  getMyOwnOrders,
  getASingleOrder,
  deleteOrder,
  deleteMyOwnOrder,
  deleteAllOrders,
  verifyPayment,
  switchTracking,
};
