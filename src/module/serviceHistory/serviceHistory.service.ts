/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import Car from '../car/car.model';
import { TserviceHistory } from './serviceHistory.interface';
import { ServiceHistory } from './serviceHistory.moodel';
import mongoose from 'mongoose';

const updateServiceHistory = async (
  id: string,
  payload: Partial<TserviceHistory>,
) => {
  const iscarExists = await Car.findById(id).select(
    'isDeleted, serviceHistory',
  );
  if (!iscarExists || iscarExists?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'this car info not found');
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    let result;
    if (iscarExists?.serviceHistory) {
      result = await ServiceHistory.findByIdAndUpdate(
        iscarExists?.serviceHistory,
        payload,
        { session, new: true, runValidators: true },
      );
      if (!result) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          'faild to update service history info',
        );
      }
    } else {
      const service = await ServiceHistory.create([payload], { session });
      if (!service.length) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          'faild to update service history info',
        );
      }
      const updateCar = await Car.findByIdAndUpdate(id, {
        serviceHistory: service[0]?._id,
      });
      if (!updateCar) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          'faild to update service history info',
        );
      }
      result = service[0];
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

export const serviceHistoryService = {
  updateServiceHistory,
};
