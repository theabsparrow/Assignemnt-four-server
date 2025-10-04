/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { TJwtPayload } from './auth.interface';
import AppError from '../../error/AppError';
import { StatusCodes } from 'http-status-codes';
import config from '../../config';

export const createToken = (
  jwtPayload: TJwtPayload,
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn: expiresIn as SignOptions['expiresIn'],
  });
};

export const verifyToken = (token: string, secret: string) => {
  const decoded = jwt.verify(token, secret);
  return decoded;
};

export const timeComparison = (time: Date, comparedTime: number) => {
  const timeInNumber = new Date(time).getTime() / 1000;
  return timeInNumber > comparedTime;
};

export const passwordMatching = async (password: string, userPass: string) => {
  const result = await bcrypt.compare(password, userPass);
  return result;
};

export const generateOTP = (): number => {
  const number = Math.floor(100000 + Math.random() * 900000);
  return number;
};

export const decodeToken = (token: string) => {
  const SPlitToken = token.split(' ')[1];
  if (!SPlitToken) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'you are not authorized');
  }
  let decoded;
  try {
    decoded = verifyToken(SPlitToken, config.jwt_reset_secret as string);
  } catch (err: any) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      `you are not authorized ${err}`,
    );
  }
  const { userId } = decoded as JwtPayload;
  const hashedOtp = userId.split(' ')[1];
  const id = userId.split(' ')[0];
  return { id, hashedOtp };
};
