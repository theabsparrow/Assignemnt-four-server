import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { User } from '../users/user.model';
import { TChangePassword, TLogin } from './auth.interface';
import bcrypt from 'bcrypt';
import {
  createToken,
  generateOTP,
  passwordMatching,
  timeComparison,
  verifyToken,
} from './auth.utills';
import config from '../../config';
import { JwtPayload } from 'jsonwebtoken';
import { sendEmail } from '../../utills/sendEmail';
import { otpEmailTemplate } from '../../utills/otpEmailTemplate';
import { TUSerRole } from '../users/user.interface';

const login = async (payload: TLogin) => {
  const email = payload.email;
  const password = payload.password;
  // user existance section
  const isUserExistence = await User.findOne({ email: email }).select(
    'password isDeleted status role',
  );
  if (
    !isUserExistence ||
    isUserExistence?.isDeleted ||
    isUserExistence?.status === 'deactive'
  ) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  // password matching section
  const userPass = isUserExistence?.password;
  const isPasswordMatched = await passwordMatching(password, userPass);
  if (!isPasswordMatched) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'the password you have provided is wrong',
    );
  }
  // jwt section
  const jwtPayload = {
    userId: isUserExistence?._id.toString(),
    userRole: isUserExistence?.role,
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
  return {
    access,
    refresh,
  };
};

const changePassword = async (payload: TChangePassword, userId: string) => {
  const { oldPassword, newPassword } = payload;
  const saltNumber = Number(config.bcrypt_salt_round);
  // match password
  const userInfo = await User.findById(userId).select('password role');
  const userPass = userInfo?.password as string;
  const isPasswordMatched = await passwordMatching(oldPassword, userPass);
  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'password doesn`t match');
  }
  const hashedPassword = await bcrypt.hash(newPassword, saltNumber);
  await User.findByIdAndUpdate(
    userId,
    { password: hashedPassword, passwordChangedAt: new Date() },
    { new: true },
  );
  const jwtPayload = {
    userId: userInfo?._id.toString() as string,
    userRole: userInfo?.role as string,
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
  return { access, refresh };
};

const generateAccessToken = async (refreshToken: string) => {
  const secret = config.jwt_refresh_secret as string;
  const token = refreshToken.split(' ')[1];
  const decoded = verifyToken(token, secret);
  const { userId, iat } = decoded as JwtPayload;

  const result = await User.findById(userId).select(
    'passwordChangedAt email role',
  );
  if (result?.passwordChangedAt) {
    const passwordChangedTime = result?.passwordChangedAt as Date;
    const passwordChangedTimeComparison = timeComparison(
      passwordChangedTime,
      iat as number,
    );
    if (passwordChangedTimeComparison) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'you are not authorized');
    }
  }
  const jwtPayload = {
    userId: result?._id.toString() as string,
    userRole: result?.role as TUSerRole,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );
  const access = `Bearer ${accessToken}`;
  return access;
};

const getUser = async (id: string) => {
  const userId = id.split(' ')[0];
  const result = await User.findById(userId).select(
    'isDeleted status profileImage name',
  );
  if (!result || result?.isDeleted || result?.status === 'deactive') {
    throw new AppError(StatusCodes.NOT_FOUND, 'No account found ');
  }
  return result;
};

const forgetPassword = async (email: string) => {
  // check user existance
  const result = await User.findOne({ email: email }).select(
    'isDeleted status profileImage name',
  );
  if (!result || result?.isDeleted || result?.status === 'deactive') {
    throw new AppError(StatusCodes.NOT_FOUND, 'No account found ');
  }
  return result;
};

const retrivePassword = async (id: string, payload: { email: string }) => {
  const saltNumber = Number(config.bcrypt_salt_round);
  const result = await User.findById(id).select('email role');
  if (result?.email !== payload.email) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'this is not your email address ',
    );
  }
  const otp = generateOTP().toString();
  const hashedOTP = await bcrypt.hash(otp, saltNumber);
  const jwtPayload = {
    userId: `${id} ${hashedOTP}`,
    userRole: result?.role as TUSerRole,
  };
  const refreshToken3 = createToken(
    jwtPayload,
    config.jwt_reset_secret as string,
    config.jwt_reset_expires_in as string,
  );
  if (refreshToken3) {
    const refresh = `Bearer ${refreshToken3}`;
    const html = otpEmailTemplate(otp);
    await sendEmail({
      to: result?.email,
      html,
      subject: 'Your one time password(OTP)',
      text: 'This one time password is valid for only 5 minutes',
    });
    return { refresh };
  } else {
    throw new AppError(StatusCodes.BAD_REQUEST, 'something went wrong');
  }
};

const sendOTP = async (id: string) => {
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
    return { refresh };
  } else {
    throw new AppError(StatusCodes.BAD_REQUEST, 'something went wrong');
  }
};

const resetPassword = async (userId: string, otp: string) => {
  const id = userId.split(' ')[0];
  const hashedOtp = userId.split(' ')[1];
  // check user existence
  const userInfo = await User.findById(id).select('isDeleted status role');
  if (!userInfo || userInfo?.isDeleted || userInfo?.status === 'deactive') {
    throw new AppError(StatusCodes.NOT_FOUND, 'user not found');
  }
  // check the otp
  const isOtpMatched = await passwordMatching(otp, hashedOtp);
  if (!isOtpMatched) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'OTP didn`t match');
  }
  const jwtPayload = {
    userId: userInfo?._id.toString(),
    userRole: userInfo?.role,
  };
  // jwt refresh token creation
  const refreshToken1 = createToken(
    jwtPayload,
    config.jwt_reset_secret as string,
    config.jwt_reset_expires_in as string,
  );
  // jwt accesstoken creation
  const accessToken1 = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_reset_expires_in as string,
  );
  const refresh = `Bearer ${refreshToken1}`;
  const access = `Bearer ${accessToken1}`;
  return { refresh, access };
};

const setNewPassword = async (userId: string, newPassword: string) => {
  const saltNumber = Number(config.bcrypt_salt_round);
  const hashedPassword = await bcrypt.hash(newPassword, saltNumber);
  const result = await User.findByIdAndUpdate(
    userId,
    { password: hashedPassword, passwordChangedAt: new Date() },
    { new: true },
  );
  if (!result) {
    throw new AppError(StatusCodes.GATEWAY_TIMEOUT, 'time out');
  }
  const userInfo = await User.findById(userId).select('email password');
  return userInfo;
};

export const authService = {
  login,
  changePassword,
  generateAccessToken,
  forgetPassword,
  resetPassword,
  setNewPassword,
  sendOTP,
  getUser,
  retrivePassword,
};
