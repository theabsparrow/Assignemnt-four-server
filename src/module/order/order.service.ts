import { JwtPayload } from 'jsonwebtoken';

import { Torder } from './order.interface';
import Car from '../car/car.model';
import AppError from '../../error/AppError';
import { StatusCodes } from 'http-status-codes';
import { isUserExistByEmail } from '../users/user.utills';
import QueryBuilder from '../../builder/QueryBuilder';
import Order from './order.model';
import { USER_ROLE } from '../users/user.constant';

// create an order service
const createOrder = async (payload: Partial<Torder>, user: JwtPayload) => {
  const { userEmail } = user;
  const isUSerExists = await isUserExistByEmail(userEmail);
  const userID = isUSerExists?._id;
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
  const totalPrice = carData?.price * quantity;
  payload.totalPrice = totalPrice;
  payload.userEmail = userEmail;
  payload.userID = userID;
  const result = await Order.create(payload);
  if (result) {
    const newQuantity = carData.quantity - quantity;
    const updatedData = {
      quantity: newQuantity,
      inStock: newQuantity > 0 ? true : false,
    };
    await Car.findByIdAndUpdate(car, updatedData, { new: true });
  }
  return result;
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
};
