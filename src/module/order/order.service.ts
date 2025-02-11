import { JwtPayload } from 'jsonwebtoken';

import { Torder } from './order.interface';
import OrderModel from './order.model';
import Car from '../car/car.model';
import AppError from '../../error/AppError';
import { StatusCodes } from 'http-status-codes';
import { isUserExistByEmail } from '../users/user.utills';

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
  const result = await OrderModel.create(payload);

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

export const orderService = {
  createOrder,
};
