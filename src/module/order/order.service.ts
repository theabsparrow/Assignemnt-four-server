/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from 'jsonwebtoken';
import { Torder, TOrderStatus, TTrackingInfo } from './order.interface';
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
import mongoose, { Types } from 'mongoose';
import { generateOrderHTML } from '../../utills/orderPdfTemplate';
import { generateOrderPdf } from '../../utills/generateOrderPdf';
import { sendEmail } from '../../utills/sendEmail';
import fs from 'fs/promises';
import { USER_ROLE } from '../users/user.constant';
import { TOrderUserdata } from './order.controller';

// create an order service
const createOrder = async (
  userData: TOrderUserdata,
  payload: Partial<Torder>,
) => {
  const { ip, id, userId } = userData;
  // check if the car is exists
  const carData = await Car.findById(id).select('isDeleted inStock price');
  if (!carData || carData?.isDeleted || !carData?.inStock) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'This car is not available right now',
    );
  }
  // extraxt the user info
  const isUserExists = await User.findById(userId).select(
    'email phoneNumber name currentAddress',
  );

  // push data in payload object
  const tracking: TTrackingInfo = {};
  const trackingID = await createTrackingID();
  tracking.trackingID = trackingID;
  payload.estimatedDeliveryTime = dateFormat(
    payload?.estimatedDeliveryTime as string,
  );
  payload.totalPrice = carData?.price + payload.deliveryCost!;
  payload.userID = new Types.ObjectId(userId);
  payload.userEmail = isUserExists?.email;
  payload.quantity = 1;
  payload.car = carData._id;
  payload.tracking = tracking;

  // start transaction rollback
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const order = await Order.create([payload], { session });
    if (!order.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'failed to create order');
    }
    const id = order[0]._id;
    const shurjopayPayload = {
      amount: carData?.price + payload.deliveryCost!,
      order_id: id,
      currency: 'BDT',
      customer_name: `${isUserExists?.name?.firstName} ${isUserExists?.name?.lastName}`,
      customer_address: payload?.location,
      customer_email: isUserExists?.email,
      customer_phone: isUserExists?.phoneNumber,
      customer_city: isUserExists?.currentAddress
        ? isUserExists?.currentAddress
        : 'N/A',
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
  const updatePayload: any = {
    ...paymentInfo,
    status,
  };
  if (status === 'Paid') {
    updatePayload['tracking.trackingStatus'] =
      trackingStatusinfo['Order Placed'];
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const updatedData = await Order.findOneAndUpdate(
      { orderID: order_id },
      {
        $set: {
          ...updatePayload,
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
      if (info?.accepted?.length > 0) {
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
// get all orders by user
const getMyOwnOrders = async (
  query: Record<string, unknown>,
  userId: string,
) => {
  const filter: Record<string, unknown> = {};
  filter.userID = userId;
  filter.isDeleted = false;
  const myOrderQuery = new QueryBuilder(Order.find(), query)
    .search(['orderID'])
    .filter()
    .sort()
    .paginateQuery()
    .fields();
  const result = await myOrderQuery.modelQuery;
  const meta = await myOrderQuery.countTotal();
  return { result, meta };
};
// get a single order
const getASingleOrder = async (id: string, user: JwtPayload) => {
  const { userId, userRole } = user;
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
    userId !== result?.userID?._id.toString()
  ) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'this order information is not available',
    );
  }
  return result;
};
// change the order status
const changeOrderStatus = async (id: string, payload: TOrderStatus) => {
  if (payload === orderStatusInfo?.completed) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `order status can't be completed manually`,
    );
  }
  const isOrderExists = await Order.findById(id).select(
    'isDeleted status tracking',
  );
  if (!isOrderExists || isOrderExists?.isDeleted) {
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
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    let result;
    if (payload === orderStatusInfo?.cancelled) {
      result = await Order.findByIdAndUpdate(
        id,
        {
          status: payload,
          'tracking.trackingStatus': orderStatusInfo.cancelled,
        },
        { new: true, session, runValidators: true },
      );
      const carID = result?.car;
      const carData = await Car.findByIdAndUpdate(
        carID,
        { inStock: true },
        { new: true, session, runValidators: true },
      );
      if (!carData) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          `faild to change the order status`,
        );
      }
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
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(StatusCodes.BAD_REQUEST, err);
  }
};
// user cancell the order
const cancellMyOrder = async (id: string) => {
  const isOrderExists = await Order.findById(id).select('isDeleted status');
  if (!isOrderExists || isOrderExists?.isDeleted) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'this order info is not available',
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
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await Order.findByIdAndUpdate(
      id,
      {
        status: orderStatusInfo?.cancelled,
        'tracking.trackingStatus': orderStatusInfo.cancelled,
      },
      { new: true, session, runValidators: true },
    );
    if (!result) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'faild to cancell the order');
    }
    const carId = result?.car;
    const carData = await Car.findByIdAndUpdate(
      carId,
      { inStock: true },
      { new: true, session, runValidators: true },
    );
    if (!carData) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'faild to cancell the order');
    }
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(StatusCodes.BAD_REQUEST, err);
  }
};
// change the tracking status
const changeTrackingStatus = async (id: string, payload: string) => {
  if (payload === trackingStatusinfo?.cancelled) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `tracking can't be cancelled manually`,
    );
  }
  const isOrderExists = await Order.findById(id).select(
    'isDeleted status tracking',
  );
  if (!isOrderExists || isOrderExists?.isDeleted) {
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
// switch the tracking status
const switchTracking = async (id: string, payload: boolean) => {
  // check the order is valid
  const isOrderInfo = await Order.findById(id).select(
    'isDeleted tracking status',
  );
  if (!isOrderInfo || isOrderInfo?.isDeleted) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'the order info you are trying to track is not available',
    );
  }
  // check the order status and tracking
  if (
    !['Paid', 'Cash on Delivery', 'Completed'].includes(isOrderInfo?.status)
  ) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'This order can`t be tracked');
  }
  if (isOrderInfo?.tracking?.trackingStatus === 'Cancelled') {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Faild to track this order');
  }
  // change tracking status operation
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
// permanently delete
const deleteOrder = async (id: string) => {
  const isOrderExist = await Order.findById(id).select('isDeleted');
  if (!isOrderExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'the order does not found');
  }
  const result = await Order.findByIdAndDelete(id);
  return result;
};
// delete a order by a user
const deleteMyOwnOrder = async (id: string, userId: string) => {
  const isOrderExist = await Order.findById(id).select('isDeleted userID');
  if (!isOrderExist || isOrderExist?.isDeleted) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'the order does not found');
  }
  if (isOrderExist?.userID.toString() !== userId) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'the order does not found');
  }
  const result = await Order.findByIdAndUpdate(
    id,
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
  cancellMyOrder,
};
