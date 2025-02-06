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
