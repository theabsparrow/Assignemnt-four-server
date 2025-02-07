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
import { isUserExistByEmail } from '../users/user.utills';
import { sendEmail } from '../../utills/sendEmail';
import { Otp } from '../otp/otp.model';
import { otpEmailTemplate } from '../../utills/otpEmailTemplate';

const login = async (payload: TLogin) => {
  const email = payload.email;
  const password = payload.password;
  const isUserExistence = await User.findOne({ email: email });
  if (!isUserExistence) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'the email you provide does not match',
    );
  }
  const userDelete = isUserExistence?.isDeleted;
  if (userDelete) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'the email you provide does not match',
    );
  }
  const userStatus = isUserExistence?.status;
  if (userStatus === 'deactive') {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'you are not authorized to login',
    );
  }
  const userPass = isUserExistence?.password;
  const isPasswordMatched = await passwordMatching(password, userPass);
  if (!isPasswordMatched) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'the password you have provided is wrong',
    );
  }
  const jwtPayload = {
    userEmail: isUserExistence?.email,
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

const changePassword = async (payload: TChangePassword, user: JwtPayload) => {
  const { userEmail } = user;
  const { oldPassword, newPassword } = payload;
  const saltNumber = Number(config.bcrypt_salt_round);
  const userInfo = await isUserExistByEmail(userEmail);
  const userPass = userInfo?.password;
  const isPasswordMatched = await passwordMatching(oldPassword, userPass);
  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'password doesn`t match');
  }
  const hashedPassword = await bcrypt.hash(newPassword, saltNumber);
  await User.findOneAndUpdate(
    { email: userEmail },
    { password: hashedPassword, passwordChangedAt: new Date() },
    { new: true },
  );
  return null;
};

const generateAccessToken = async (refreshToken: string) => {
  const secret = config.jwt_refresh_secret as string;
  const token = refreshToken.split(' ')[1];
  const decoded = verifyToken(token, secret);
  const { userEmail, iat } = decoded as JwtPayload;

  const result = await isUserExistByEmail(userEmail);
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
    userEmail: result?.email,
    userRole: result?.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );
  return accessToken;
};

const forgetPassword = async (email: string) => {
  const result = await isUserExistByEmail(email);
  const jwtPayload = {
    userEmail: result?.email,
    userRole: result?.role,
  };
  const resetAccessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '5m',
  );
  const otp = generateOTP().toString();
  const user = result?._id;
  const userEmail = result?.email;
  if (resetAccessToken && otp) {
    const resetToken = `Bearer ${resetAccessToken}`;
    sendEmail(userEmail, otpEmailTemplate(otp));
    await Otp.findOneAndUpdate(
      { user },
      { otp },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    return resetToken;
  } else {
    throw new AppError(StatusCodes.BAD_REQUEST, 'something went wrong');
  }
};
export const authService = {
  login,
  changePassword,
  generateAccessToken,
  forgetPassword,
};
