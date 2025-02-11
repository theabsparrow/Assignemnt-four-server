/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from 'jsonwebtoken';

import { Torder } from './order.interface';
import Car from '../car/car.model';
import AppError from '../../error/AppError';
import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import Order from './order.model';
import { USER_ROLE } from '../users/user.constant';
import { User } from '../users/user.model';
import { orderUtills } from './order.utills';
import { paymentStatus } from './order.const';
import mongoose from 'mongoose';

// create an order service
const createOrder = async (
  payload: Partial<Torder>,
  user: JwtPayload,
  client_ip: string,
) => {
  const { userEmail } = user;
  const isUser = await User.findOne({ email: userEmail });
  const userID = isUser?._id;
  const { car } = payload;
  const carData = await Car.findById(car);
  const quantity = payload?.quantity as number;
  if (!carData) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'This car is not available right now',
    );
  }
  if (quantity > carData?.quantity) {
    throw new AppError(
      StatusCodes.EXPECTATION_FAILED,
      'stock is insufficient right now',
    );
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const totalPrice = carData?.price * quantity;
    payload.totalPrice = totalPrice;
    payload.userEmail = userEmail;
    payload.userID = userID;

    const order = await Order.create([payload], { session });
    if (!order.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'failed to create order');
    }
    const id = order[0]._id;
    const shurjopayPayload = {
      amount: totalPrice,
      order_id: id,
      currency: 'BDT',
      customer_name: `${isUser?.name?.firstName} ${isUser?.name?.lastName}`,
      customer_address: isUser?.currentAddress ? isUser?.currentAddress : 'N/A',
      customer_email: isUser?.email,
      customer_phone: isUser?.phoneNumber,
      customer_city: isUser?.currentAddress ? isUser?.currentAddress : 'N/A',
      client_ip,
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

const verifyPayment = async (order_id: string) => {
  const verifiedPayment = await orderUtills.verifyPayment(order_id);
  if (!verifiedPayment || verifiedPayment.length === 0) {
    throw new Error('No verified payment found.');
  }
  const paymentInfo = {
    transactionStatus: verifiedPayment[0].bank_status,
    bank_status: verifiedPayment[0].sp_code,
    sp_code: verifiedPayment[0].sp_message,
    sp_message: verifiedPayment[0].transaction_status,
    method: verifiedPayment[0].method,
    date_time: verifiedPayment[0].date_time,
  };
  const status =
    verifiedPayment[0].bank_status == paymentStatus.success
      ? 'Paid'
      : verifiedPayment[0].bank_status == paymentStatus.failed
        ? 'Pending'
        : verifiedPayment[0].bank_status == paymentStatus.cancel
          ? 'Cancelled'
          : '';

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const updatedData = await Order.findOneAndUpdate(
      { orderID: order_id },
      { $set: { ...paymentInfo, status } },
      { new: true, session, runValidators: true },
    );
    if (!updatedData) {
      throw new AppError(StatusCodes.BAD_GATEWAY, 'faild to verify order');
    }
    const quantity = updatedData?.quantity as number;
    const carID = updatedData?.car;
    const carData = await Car.findById(carID).select('quantity');
    if (
      carData?.quantity &&
      verifiedPayment[0].bank_status == paymentStatus.success
    ) {
      const newQuantity = carData?.quantity - quantity;
      const updatedData = {
        quantity: newQuantity,
        inStock: newQuantity > 0 ? true : false,
      };
      const updatecarData = await Car.findByIdAndUpdate(carID, updatedData, {
        new: true,
        session,
        runValidators: true,
      });
      if (!updatecarData) {
        throw new AppError(StatusCodes.BAD_GATEWAY, 'faild to verify order');
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
  const myOrderQuery = new QueryBuilder(
    Order.find({ userEmail, isDeleted: false }),
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
  const { userRole, userEmail } = user;
  let result;
  if (userRole === USER_ROLE.user) {
    result = await Order.findOne({ _id: id, userEmail, isDeleted: false });
  }
  result = await Order.findById(id);
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
};
