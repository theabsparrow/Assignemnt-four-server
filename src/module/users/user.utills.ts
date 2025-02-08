import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { User } from './user.model';

export const isUserExists = async (id: string) => {
  const result = await User.findById(id);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'this user is not available');
  }
  if (result?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'this user is not available');
  }
  return result;
};

export const isUserExistByEmail = async (email: string) => {
  const result = await User.findOne({ email: email });
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'this user is not available');
  }
  if (result?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'this user is not available');
  }
  if (result?.status === 'deactive') {
    throw new AppError(StatusCodes.BAD_REQUEST, 'you are not authorized');
  }
  return result;
};

export const calculateAge = (dob: string) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};
