import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import Car from '../car/car.model';
import { TCarEngine } from './carEngine.interface';
import { CarEngine } from './carEngine.model';

const updateCarEngine = async (id: string, payload: Partial<TCarEngine>) => {
  const iscarExists = await Car.findOne({ carEngine: id }).select('isDeleted');
  if (!iscarExists || iscarExists?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'this car info not found');
  }
  const result = await CarEngine.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'faild to update engine info');
  }
  return result;
};

export const carEngineService = {
  updateCarEngine,
};
