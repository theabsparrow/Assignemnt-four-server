import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { TUser, TUserStatus } from './user.interface';
import { User } from './user.model';
import { calculateAge, isUserExistByEmail, isUserExists } from './user.utills';
import { JwtPayload } from 'jsonwebtoken';
import { searchableFields, USER_ROLE } from './user.constant';
import { createToken, passwordMatching } from '../auth/auth.utills';
import config from '../../config';
import QueryBuilder from '../../builder/QueryBuilder';

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

  const isEmailExists = await User.findOne({
    email: payload.email,
    isDeleted: false,
  });
  if (isEmailExists) {
    throw new AppError(StatusCodes.CONFLICT, 'this email is already in used');
  }

  const isPhoneExists = await User.findOne({
    phoneNumber: payload.phoneNumber,
    isDeleted: false,
  });
  if (isPhoneExists) {
    throw new AppError(
      StatusCodes.CONFLICT,
      'this phone number is already in used',
    );
  }
  const age = calculateAge(payload.dateOfBirth);
  payload.age = age;
  const result = await User.create(payload);

  const jwtPayload = {
    userEmail: result?.email,
    userRole: result?.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );
  const access = `Bearer ${accessToken}`;
  const refresh = `Bearer ${refreshToken}`;
  return { result, access, refresh };
};

const getAllUser = async (role: string, query: Record<string, unknown>) => {
  let filter = {};
  if (role === USER_ROLE.admin) {
    filter = { isDeleted: false };
  }
  const usersQuery = new QueryBuilder(User.find(filter), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginateQuery()
    .fields();

  const result = await usersQuery.modelQuery;
  const meta = await usersQuery.countTotal();

  return { meta, result };
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

const updateUserInfo = async (user: JwtPayload, payload: Partial<TUser>) => {
  const { name, email, phoneNumber, ...remainingInfo } = payload;
  const { userEmail, userRole } = user;
  const modifiedData: Record<string, unknown> = { ...remainingInfo };
  const isEmailExists = await User.findOne({ email: email, isDeleted: false });
  if (isEmailExists) {
    throw new AppError(StatusCodes.CONFLICT, 'this email is already exists');
  }
  const isPhoneNumberExists = await User.findOne({
    phoneNumber: phoneNumber,
    isDeleted: false,
  });
  if (isPhoneNumberExists) {
    throw new AppError(
      StatusCodes.CONFLICT,
      'this phone number is already exists',
    );
  }
  if (name && name?.firstName) {
    name.firstName =
      name.firstName.charAt(0).toUpperCase() + name.firstName.slice(1);
  }
  if (name && name?.middleName) {
    name.middleName =
      name.middleName.charAt(0).toUpperCase() + name.middleName.slice(1);
  }
  if (name && name?.lastName) {
    name.lastName =
      name.lastName.charAt(0).toUpperCase() + name.lastName.slice(1);
  }

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedData[`name.${key}`] = value;
    }
  }
  if (email) modifiedData.email = email;
  if (phoneNumber) modifiedData.phoneNumber = phoneNumber;
  const updateResult = await User.findOneAndUpdate(
    { email: userEmail, isDeleted: false },
    modifiedData,
    { new: true, runValidators: true },
  );

  if (!updateResult) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found.');
  }

  if (email && email !== userEmail) {
    const jwtPayload = {
      userEmail: email,
      userRole,
    };
    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );
    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string,
    );
    const access = `Bearer ${accessToken}`;
    const refresh = `Bearer ${refreshToken}`;
    return { updateResult, access, refresh };
  } else {
    return updateResult;
  }
};

const deleteAccount = async (password: string, user: JwtPayload) => {
  const { userEmail } = user;
  const userInfo = await User.findOne({ email: userEmail }).select('password');
  const userPass = userInfo?.password as string;
  const isPasswordMatched = await passwordMatching(password, userPass);
  if (!isPasswordMatched) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'the password you have provided is wrong',
    );
  }
  const result = await User.findOneAndUpdate(
    { email: userEmail },
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'account delation failed');
  }
  return null;
};
export const userSrevice = {
  createUser,
  getAllUser,
  getASingleUSer,
  updateUSerStatus,
  deleteUser,
  makeAdmin,
  getMe,
  updateUserInfo,
  deleteAccount,
};
