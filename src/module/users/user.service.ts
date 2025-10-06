import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { TUser, TUSerRole } from './user.interface';
import { User } from './user.model';
import { calculateAge, capitalizeFirst, isUserExists } from './user.utills';
import { JwtPayload } from 'jsonwebtoken';
import { searchableFields, USER_ROLE } from './user.constant';
import {
  createToken,
  decodeToken,
  generateOTP,
  passwordMatching,
} from '../auth/auth.utills';
import config from '../../config';
import QueryBuilder from '../../builder/QueryBuilder';
import bcrypt from 'bcrypt';
import { otpEmailTemplate } from '../../utills/otpEmailTemplate';
import { sendEmail } from '../../utills/sendEmail';

const createUser = async (payload: TUser) => {
  // check existing user
  const existingUser = await User.findOne({
    isDeleted: false,
    $or: [{ email: payload.email }, { phoneNumber: payload.phoneNumber }],
  }).select('email phoneNumber');

  if (existingUser) {
    if (existingUser.email === payload.email) {
      throw new AppError(StatusCodes.CONFLICT, 'this email is already in use');
    }
    if (existingUser.phoneNumber === payload.phoneNumber) {
      throw new AppError(
        StatusCodes.CONFLICT,
        'this phone number is already in use',
      );
    }
  }
  // check if age is less than 18 years
  const age = calculateAge(payload.dateOfBirth);
  if (age < 18) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'You must be at least 18 years old.',
    );
  }

  // capitalize name
  payload.name.firstName = capitalizeFirst(payload?.name?.firstName);
  if (payload?.name?.middleName) {
    payload.name.middleName = capitalizeFirst(payload.name.middleName);
  }
  payload.name.lastName = capitalizeFirst(payload?.name?.lastName);

  // create user
  const result = await User.create(payload);
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'faild to register.');
  }
  const saltNumber = Number(config.bcrypt_salt_round);
  const otp = generateOTP().toString();
  const hashedOTP = await bcrypt.hash(otp, saltNumber);
  // jwt section
  const jwtPayload = {
    userId: result?._id.toString(),
    userRole: result?.role,
  };
  const jwtOTPPayload = {
    ...jwtPayload,
    userId: `${result?._id.toString()} ${hashedOTP}`,
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
  const resetAccessToken = createToken(
    jwtOTPPayload,
    config.jwt_reset_secret as string,
    config.jwt_reset_expires_in as string,
  );

  if (resetAccessToken) {
    const resetToken = `Bearer ${resetAccessToken}`;
    const html = otpEmailTemplate(otp);
    await sendEmail({
      to: result?.email,
      html,
      subject: 'Your one time password(OTP)',
      text: 'This one time password is valid for only 5 minutes',
    });
    const access = `Bearer ${accessToken}`;
    const refresh = `Bearer ${refreshToken}`;
    return { result, access, refresh, resetToken };
  } else {
    const access = `Bearer ${accessToken}`;
    const refresh = `Bearer ${refreshToken}`;
    return { result, access, refresh };
  }
};

const resendOTP = async (id: string) => {
  const saltNumber = Number(config.bcrypt_salt_round);
  // check user existance
  const result = await User.findById(id).select('isDeleted status email role');
  if (!result || result?.isDeleted || result?.status === 'deactive') {
    throw new AppError(StatusCodes.NOT_FOUND, 'No account found ');
  }
  const otp = generateOTP().toString();
  const hashedOTP = await bcrypt.hash(otp, saltNumber);
  // create refresh  token
  const jwtPayload = {
    userId: `${result?._id.toString()} ${hashedOTP}`,
    userRole: result?.role,
  };
  const refreshToken1 = createToken(
    jwtPayload,
    config.jwt_reset_secret as string,
    config.jwt_reset_expires_in as string,
  );
  // send otp with email
  if (refreshToken1 && result?.email) {
    const refresh = `Bearer ${refreshToken1}`;
    const html = otpEmailTemplate(otp);
    await sendEmail({
      to: result?.email,
      html,
      subject: 'Your one time password(OTP)',
      text: 'This one time password is valid for only 5 minutes',
    });
    return refresh;
  } else {
    throw new AppError(StatusCodes.BAD_REQUEST, 'something went wrong');
  }
};

const verifyEmail = async ({
  userId,
  otp,
  token,
}: {
  userId: string;
  otp: string;
  token: string;
}) => {
  const { id, hashedOtp } = decodeToken(token);
  if (id !== userId) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'you are not authorized');
  }
  const userInfo = await User.findById(userId).select('isDeleted status');
  if (!userInfo || userInfo?.isDeleted || userInfo?.status === 'deactive') {
    throw new AppError(StatusCodes.NOT_FOUND, 'user not found');
  }
  // check the otp
  const isOtpMatched = await passwordMatching(otp, hashedOtp);
  if (!isOtpMatched) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'OTP didn`t match');
  }
  const result = await User.findByIdAndUpdate(
    userId,
    { verifyWithEmail: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'faild to verify email');
  }
  return result;
};

const getAllUser = async (role: string, query: Record<string, unknown>) => {
  const filter: Record<string, unknown> = {};
  if (role === USER_ROLE.admin) {
    filter.isDeleted = false;
    filter.role = USER_ROLE.user;
  }
  query = { ...query, ...filter };
  const usersQuery = new QueryBuilder(User.find(), query)
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

const updateUSerStatus = async ({
  id,
  role,
  payload,
}: {
  id: string;
  role: TUSerRole;
  payload: TUser;
}) => {
  const { status } = payload;
  //  check if the user is exists
  const isUserExists = await User.findById(id).select('status role isDeleted');
  if (!isUserExists || isUserExists?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'this user is not available');
  }
  if (isUserExists?.status === status) {
    throw new AppError(StatusCodes.CONFLICT, `this user is already ${payload}`);
  }
  // check if the user role didn`t conflict
  const userRole = isUserExists?.role;
  if (
    role === USER_ROLE.admin &&
    (userRole === USER_ROLE.admin || userRole === USER_ROLE.superAdmin)
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
  // check if the user is exists
  const isUserExists = await User.findById(id).select(' role isDeleted');
  if (!isUserExists || isUserExists?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'this user is not available');
  }
  // check if the user role didn`t conflict
  const role = isUserExists?.role;
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
    { isDeleted: true },
    { new: true },
  );
  return result;
};

const makeAdmin = async (id: string, payload: TUser) => {
  const isUserExists = await User.findById(id).select('role isDeleted');
  if (!isUserExists || isUserExists?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'this user is not available');
  }
  // check if the user role didn`t conflict
  const role = isUserExists?.role;
  if (role === USER_ROLE.superAdmin) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'role super admin can`t be change ',
    );
  }
  if (role === payload?.role) {
    throw new AppError(
      StatusCodes.CONFLICT,
      `this user is already an ${payload}`,
    );
  }
  const result = await User.findByIdAndUpdate(
    id,
    { role: payload?.role },
    { new: true },
  );
  return result;
};

const getMe = async (user: JwtPayload, query: Record<string, unknown>) => {
  const { userId } = user;
  let result = null;

  if (query.for === 'navbar') {
    result = await User.findById(userId).select('name profileImage');
    if (!result) {
      throw new AppError(StatusCodes.NOT_FOUND, 'information not found');
    }
  } else if (query.for === 'settings') {
    result = await User.findById(userId).select(
      'name email phoneNumber gender dateOfBirth',
    );
    if (!result) {
      throw new AppError(StatusCodes.NOT_FOUND, 'information not found');
    }
  } else {
    result = await User.findById(userId).select(
      '-role -isDeleted -passwordChangedAt -updatedAt -status',
    );
    if (!result) {
      throw new AppError(StatusCodes.NOT_FOUND, 'information not found');
    }
  }

  return result;
};

const updateUserInfo = async (user: JwtPayload, payload: Partial<TUser>) => {
  const { userId } = user;

  const { name, email, phoneNumber, dateOfBirth, ...remainingInfo } = payload;
  const modifiedData: Record<string, unknown> = { ...remainingInfo };

  // check existing user
  const existingUser = await User.findOne({
    isDeleted: false,
    $or: [{ email: email }, { phoneNumber: phoneNumber }],
  }).select('email phoneNumber');

  if (existingUser) {
    if (existingUser.email === email) {
      throw new AppError(StatusCodes.CONFLICT, 'this email is already in use');
    }
    if (existingUser.phoneNumber === phoneNumber) {
      throw new AppError(
        StatusCodes.CONFLICT,
        'this phone number is already in use',
      );
    }
  }
  // check if the user age is under 18
  if (dateOfBirth) {
    const age = calculateAge(dateOfBirth);
    if (age < 18) {
      throw new AppError(
        StatusCodes.CONFLICT,
        'You must be at least 18 years old.',
      );
    } else {
      modifiedData.dateOfBirth = dateOfBirth;
    }
  }

  // capitalize name
  if (name && name?.firstName) {
    name.firstName = capitalizeFirst(name.firstName);
  }
  if (name && name?.middleName) {
    name.middleName = capitalizeFirst(name.middleName);
  }
  if (name && name?.lastName) {
    name.lastName = capitalizeFirst(name.lastName);
  }

  // update operation
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedData[`name.${key}`] = value;
    }
  }
  if (email) {
    modifiedData.email = email;
    modifiedData.verifyWithEmail = false;
  }
  if (phoneNumber) modifiedData.phoneNumber = phoneNumber;
  const result = await User.findByIdAndUpdate(userId, modifiedData, {
    new: true,
  });

  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'faild to update.');
  }

  return result;
};

const deleteAccount = async (password: string, user: JwtPayload) => {
  const { userId } = user;
  const userInfo = await User.findById(userId).select('password');
  const userPass = userInfo?.password as string;
  const isPasswordMatched = await passwordMatching(password, userPass);
  if (!isPasswordMatched) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'the password you have provided is wrong',
    );
  }
  const result = await User.findByIdAndUpdate(
    userId,
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
  resendOTP,
  verifyEmail,
  getAllUser,
  getASingleUSer,
  updateUSerStatus,
  deleteUser,
  makeAdmin,
  getMe,
  updateUserInfo,
  deleteAccount,
};
