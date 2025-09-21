/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import Car from '../car/car.model';
import { TExtendedDeliveryAndPayment } from './carDelivery.interface';
import mongoose from 'mongoose';
import { DeliveryAndPayment } from './carDelivery.model';

const updateCarDeliveryInfo = async (
  id: string,
  payload: Partial<TExtendedDeliveryAndPayment>,
) => {
  const iscarExists = await Car.findOne({ deliveryAndPayment: id }).select(
    'isDeleted',
  );
  if (!iscarExists || iscarExists?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'this car info not found');
  }
  const {
    addPaymentMethod,
    removePaymentMethod,
    addPaymentOption,
    removePaymentOption,
    ...remaining
  } = payload;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // update remaining data
    const updateremainingData = await DeliveryAndPayment.findById(
      id,
      remaining,
      { session, new: true, runValidators: true },
    );
    if (!updateremainingData) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'faild to update the delivery and payment information',
      );
    }
    let result;
    // add payment method
    if (addPaymentMethod && addPaymentMethod.length > 0) {
      result = await DeliveryAndPayment.findByIdAndUpdate(
        id,
        {
          $addToSet: { paymentMethod: { $each: addPaymentMethod } },
        },
        { session, new: true, runValidators: true },
      );
      if (!result) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          'faild to update the delivery and payment information',
        );
      }
    }
    // remove payment method
    if (removePaymentMethod && removePaymentMethod.length > 0) {
      result = await DeliveryAndPayment.findByIdAndUpdate(
        id,
        {
          $pull: { paymentMethod: { $in: removePaymentMethod } },
        },
        { session, new: true, runValidators: true },
      );
      if (!result) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          'faild to update the delivery and payment information',
        );
      }
    }
    // add payment option
    if (addPaymentOption && addPaymentOption.length > 0) {
      result = await DeliveryAndPayment.findByIdAndUpdate(
        id,
        {
          $addToSet: { paymentOption: { $each: addPaymentOption } },
        },
        { session, new: true, runValidators: true },
      );
      if (!result) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          'faild to update the delivery and payment information',
        );
      }
    }
    // remove payment option
    if (removePaymentOption && removePaymentOption.length > 0) {
      result = await DeliveryAndPayment.findByIdAndUpdate(
        id,
        {
          $pull: { paymentOption: { $in: removePaymentOption } },
        },
        { session, new: true, runValidators: true },
      );
      if (!result) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          'faild to update the delivery and payment information',
        );
      }
    }
    session.commitTransaction();
    session.endSession();
    return result;
  } catch (err: any) {
    session.abortTransaction();
    session.endSession();
    throw new AppError(StatusCodes.BAD_REQUEST, err);
  }
};

export const carDeliveryService = {
  updateCarDeliveryInfo,
};
