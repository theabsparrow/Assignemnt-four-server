import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utills/catchAsync';
import AppError from '../error/AppError';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { User } from '../module/users/user.model';
import { TUSerRole } from '../module/users/user.interface';

export const auth = (...requiredRoles: TUSerRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization;
    const token = accessToken?.split(' ')[1];
    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'you are not authorized');
    }
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;
    if (!decoded) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'you are not authorized');
    }
    const { userEmail, userRole } = decoded;
    const isUserExists = await User.findOne({ email: userEmail });
    if (!isUserExists) {
      throw new AppError(StatusCodes.NOT_FOUND, 'user does not exist');
    }
    const isUSerDelete = isUserExists?.isDeleted;
    if (isUSerDelete) {
      throw new AppError(StatusCodes.NOT_FOUND, 'user does not exist');
    }
    const isUserDeactive = isUserExists?.status;
    if (isUserDeactive === 'deactive') {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'you are not authortized');
    }
    if (requiredRoles && !requiredRoles.includes(userRole)) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'you are not authortized');
    }
    req.user = decoded as JwtPayload;
    next();
  });
};
