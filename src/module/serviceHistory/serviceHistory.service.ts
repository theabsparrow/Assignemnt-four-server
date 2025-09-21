import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import Car from '../car/car.model';
import { TserviceHistory } from './serviceHistory.interface';
import { ServiceHistory } from './serviceHistory.moodel';

const updateServiceHistory = async (
  id: string,
  payload: Partial<TserviceHistory>,
) => {
  const iscarExists = await Car.findOne({ carEngine: id }).select('isDeleted');
  if (!iscarExists || iscarExists?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'this car info not found');
  }
  const result = await ServiceHistory.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'faild to update service history info',
    );
  }
  return result;
};

export const serviceHistoryService = {
  updateServiceHistory,
};
