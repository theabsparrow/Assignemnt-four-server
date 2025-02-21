/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utills/catchAsync';
import AppError from '../error/AppError';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { User } from '../module/users/user.model';
import { TUSerRole } from '../module/users/user.interface';
import { timeComparison, verifyToken } from '../module/auth/auth.utills';

export const auth = (...requiredRoles: TUSerRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization;

    const token = accessToken?.split(' ')[1];
    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'you are not authorized');
    }
    let decoded;
    try {
      decoded = verifyToken(token, config.jwt_access_secret as string);
    } catch (err: any) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        `you are not authorized ${err}`,
      );
    }

    const { userEmail, userRole, iat } = decoded as JwtPayload;
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

    if (isUserExists?.passwordChangedAt) {
      const passwordChangedTime = isUserExists?.passwordChangedAt as Date;
      const passwordChangedTimeComparison = timeComparison(
        passwordChangedTime,
        iat as number,
      );
      if (passwordChangedTimeComparison) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'you are not authorized');
      }
    }

    if (requiredRoles && !requiredRoles.includes(userRole)) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'you are not authortized');
    }

    req.user = decoded as JwtPayload;
    next();
  });
};
