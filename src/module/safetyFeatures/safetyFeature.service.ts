import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import Car from '../car/car.model';
import { TSafetyFeature } from './safetyFeature.interface';
import { SafetyFeature } from './safetyFeature.model';

const updateSafetyFeature = async (id: string, payload: TSafetyFeature) => {
  const iscarExists = await Car.findOne({ carEngine: id }).select('isDeleted');
  if (!iscarExists || iscarExists?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'this car info not found');
  }
  const result = await SafetyFeature.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'faild to update safety feature info',
    );
  }
  return result;
};

export const safetyFeatureService = {
  updateSafetyFeature,
};
