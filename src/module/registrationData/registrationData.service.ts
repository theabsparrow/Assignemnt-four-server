import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import Car from '../car/car.model';
import { TRegistrationdata } from './registrationData.interface';
import { RegistrationData } from './registrationData.model';

const updateRegistrationdata = async (
  id: string,
  payload: Partial<TRegistrationdata>,
) => {
  const iscarExists = await Car.findOne({ carEngine: id }).select('isDeleted');
  if (!iscarExists || iscarExists?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'this car info not found');
  }
  const result = await RegistrationData.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'faild to update registration info',
    );
  }
  return result;
};

export const registrationdataService = {
  updateRegistrationdata,
};
