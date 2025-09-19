import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { TJwtPayload } from './auth.interface';

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
