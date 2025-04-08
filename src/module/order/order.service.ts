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
import {
  orderStatusInfo,
  paymentStatus,
  trackingStatusinfo,
} from './order.const';
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
    orderData.userEmail = userEmail;
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
    .search(['userEmail', 'orderID'])
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
    .search(['orderID'])
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
  const result = await Order.findById(id).populate('userID').populate('car');
  if (!result) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'this order information is not available',
    );
  }
  if (userRole === USER_ROLE.user && result?.isDeleted) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'this order information is not available',
    );
  }
  if (
    userRole === USER_ROLE.user &&
    useriD?.toString() !== result?.userID?._id.toString()
  ) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'this order information is not available',
    );
  }
  return result;
};

const changeOrderStatus = async (id: string, payload: string) => {
  if (payload === orderStatusInfo?.completed) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `order status can't be completed manually`,
    );
  }
  const isOrderExists = await Order.findById(id);
  if (!isOrderExists) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'this order info is not available',
    );
  }
  if (isOrderExists?.isDeleted) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'this order info is not available',
    );
  }
  if (isOrderExists?.status === payload) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `the order status is already ${isOrderExists?.status}`,
    );
  }
  if (
    isOrderExists?.status === orderStatusInfo?.completed ||
    isOrderExists?.status === orderStatusInfo?.cancelled
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `the order status is already ${isOrderExists?.status}. you can't change it`,
    );
  }
  if (
    isOrderExists?.tracking?.trackingStatus === trackingStatusinfo?.delivered
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `faild to change the order status`,
    );
  }
  let result;
  if (payload === orderStatusInfo?.cancelled) {
    result = await Order.findByIdAndUpdate(
      id,
      {
        status: payload,
        'tracking.trackingStatus': orderStatusInfo.cancelled,
      },
      { new: true },
    );
  }
  result = await Order.findByIdAndUpdate(
    id,
    { status: payload },
    { new: true },
  );
  if (!result) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `faild to change the order status`,
    );
  }
  return result;
};

const changeTrackingStatus = async (id: string, payload: string) => {
  if (payload === trackingStatusinfo?.cancelled) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `tracking can't be cancelled manually`,
    );
  }
  const isOrderExists = await Order.findById(id);
  if (!isOrderExists) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'this order info is not available',
    );
  }
  if (isOrderExists?.isDeleted) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'this order info is not available',
    );
  }
  if (isOrderExists?.tracking?.trackingStatus === payload) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `the order status is already ${isOrderExists?.status}`,
    );
  }
  if (
    isOrderExists?.status === orderStatusInfo?.completed ||
    isOrderExists?.status === orderStatusInfo?.cancelled
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `the order status is already ${isOrderExists?.status}. you can't track it`,
    );
  }
  let result;
  if (payload === trackingStatusinfo?.delivered) {
    result = await Order.findByIdAndUpdate(
      id,
      { 'tracking.trackingStatus': payload, status: 'Completed' },
      { new: true },
    );
  }
  result = await Order.findByIdAndUpdate(
    id,
    { 'tracking.trackingStatus': payload },
    { new: true },
  );
  if (!result) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `faild to update tracking status`,
    );
  }
  return result;
};

const switchTracking = async (id: string, payload: boolean) => {
  const isOrderInfo = await Order.findById(id);
  if (!isOrderInfo) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'the order info you are trying to track is not available',
    );
  }
  if (isOrderInfo?.isDeleted) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'the order info you are trying to track is not available',
    );
  }
  if (
    !['Paid', 'Cash on Delivery', 'Completed'].includes(isOrderInfo?.status)
  ) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'This order can`t be tracked');
  }

  if (isOrderInfo?.tracking?.trackingStatus === 'Cancelled') {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Faild to track this order');
  }

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
  const isOrderExist = await Order.findById(id);
  if (!isOrderExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'the order does not found');
  }
  if (isOrderExist?.userEmail !== userEmail) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'the order does not found');
  }
  const result = await Order.findOneAndUpdate(
    { _id: id, userEmail },
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
  verifyPayment,
  switchTracking,
  changeOrderStatus,
  changeTrackingStatus,
};
