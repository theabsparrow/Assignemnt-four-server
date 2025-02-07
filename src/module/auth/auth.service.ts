import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { User } from '../users/user.model';
import { TLogin } from './auth.interface';
import bcrypt from 'bcrypt';
import { createToken } from './auth.utills';
import config from '../../config';

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
  const isPasswordMatched = await bcrypt.compare(password, userPass);
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

export const authService = {
  login,
};
