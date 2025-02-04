import CarModel from '../car/car.model';
import { Torder } from './order.interface';
import OrderModel from './order.model';

// create an order service
const createOrder = async (payload: Torder) => {
  const { car, quantity } = payload;
  const carData = await CarModel.findById(car);

  //   check if the car is not available
  if (!carData) {
    throw new Error('This car is not available right now');
  }

  //    check if there is enough car quantity
  if (quantity > carData.quantity) {
    throw new Error('stock is insufficient right now');
  }

  //   create the order
  const totalPrice = carData.price * quantity;
  payload.totalPrice = totalPrice;
  const orderCreation = await OrderModel.create(payload);

  //   update the quantity and inStock from he Cars collection
  if (orderCreation) {
    const newQuantity = carData.quantity - quantity;
    const updatedData = {
      quantity: newQuantity,
      inStock: newQuantity > 0 ? true : false,
    };
    await CarModel.findByIdAndUpdate(car, updatedData, { new: true });
  }
  return orderCreation;
};

// create the total reveneu service
const totalReveneu = async () => {
  const calculateReveneu = await OrderModel.aggregate([
    { $group: { _id: null, totalreveneu: { $sum: '$totalPrice' } } },
  ]);

  const result = calculateReveneu[0].totalreveneu;
  return result;
};

export const orderService = {
  createOrder,
  totalReveneu,
};
