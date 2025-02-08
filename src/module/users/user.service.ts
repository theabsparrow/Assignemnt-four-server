import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { TUser, TUserStatus } from './user.interface';
import { User } from './user.model';
import { isUserExistByEmail, isUserExists } from './user.utills';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLE } from './user.constant';

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

const getASingleUSer = async (id: string, user: JwtPayload) => {
  const { userRole } = user;
  const result = await isUserExists(id);
  const role = result?.role;
  if (
    userRole === USER_ROLE.admin &&
    (role === USER_ROLE.admin || role === USER_ROLE.superAdmin)
  ) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'you can`t see the details of an admin as well as super admin',
    );
  }
  return result;
};

const updateUSerStatus = async (id: string, payload: TUserStatus) => {
  const { status, userRole } = payload;
  const userExistence = await isUserExists(id);
  if (userExistence?.status === status) {
    throw new AppError(StatusCodes.CONFLICT, `this user is already ${status}`);
  }
  const role = userExistence?.role;
  if (
    userRole === USER_ROLE.admin &&
    (role === USER_ROLE.admin || role === USER_ROLE.superAdmin)
  ) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'you can`t change the status of an admin as well as super admin',
    );
  }
  const result = await User.findByIdAndUpdate(
    id,
    { status: status },
    { new: true },
  );
  return result;
};

const deleteUser = async (id: string, user: JwtPayload) => {
  const { userRole } = user;
  const userInfo = await isUserExists(id);
  const role = userInfo?.role;
  if (
    userRole === USER_ROLE.admin &&
    (role === USER_ROLE.admin || role === USER_ROLE.superAdmin)
  ) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'you can`t an admin as well as super admin',
    );
  }
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
  const result = await User.findByIdAndUpdate(
    id,
    { role: payload },
    { new: true },
  );
  return result;
};

const getMe = async (user: JwtPayload) => {
  const { userEmail } = user;
  const result = await isUserExistByEmail(userEmail);
  return result;
};
export const userSrevice = {
  createUser,
  getAllUser,
  getASingleUSer,
  updateUSerStatus,
  deleteUser,
  makeAdmin,
  getMe,
};
