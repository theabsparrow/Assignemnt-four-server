import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { TUser } from './user.interface';
import { User } from './user.model';
import { isUserExists } from './user.utills';

const createUser = async (payload: TUser) => {
  payload.name.firstName =
    payload.name.firstName.charAt(0).toUpperCase() +
    payload.name.firstName.slice(1);
  if (payload.name.middleName) {
    payload.name.middleName =
      payload.name.middleName.charAt(0).toUpperCase() +
      payload.name.middleName.slice(1);
  }
  payload.name.lastName =
    payload.name.lastName.charAt(0).toUpperCase() +
    payload.name.lastName.slice(1);

  const isEmailExists = await User.findOne({ email: payload.email });
  if (isEmailExists) {
    throw new AppError(StatusCodes.CONFLICT, 'this email is already in used');
  }

  const isPhoneExists = await User.findOne({
    phoneNumber: payload.phoneNumber,
  });
  if (isPhoneExists) {
    throw new AppError(
      StatusCodes.CONFLICT,
      'this phone number is already in used',
    );
  }
  const result = await User.create(payload);
  return result;
};

const getAllUser = async () => {
  const result = await User.find({ isDeleted: false }).select(
    'name email status role',
  );
  return result;
};

const getASingleUSer = async (id: string) => {
  const result = await isUserExists(id);
  return result;
};

const updateUSerStatus = async (id: string, payload: string) => {
  const userExistence = await isUserExists(id);
  if (userExistence?.status === payload) {
    throw new AppError(StatusCodes.CONFLICT, `this user is already ${payload}`);
  }
  const result = await User.findByIdAndUpdate(
    id,
    { status: payload },
    { new: true },
  );
  return result;
};

const deleteUser = async (id: string) => {
  await isUserExists(id);
  const result = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

const makeAdmin = async (id: string, payload: string) => {
  const userExistence = await isUserExists(id);
  if (userExistence?.role === payload) {
    throw new AppError(
      StatusCodes.CONFLICT,
      `this user is already an ${payload}`,
    );
  }
};

export const userSrevice = {
  createUser,
  getAllUser,
  getASingleUSer,
  updateUSerStatus,
  deleteUser,
  makeAdmin,
};
