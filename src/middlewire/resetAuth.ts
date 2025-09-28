/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utills/catchAsync';
import AppError from '../error/AppError';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { User } from '../module/users/user.model';
import { TUSerRole } from '../module/users/user.interface';
import { verifyToken } from '../module/auth/auth.utills';

export const resetAuth = (...requiredRoles: TUSerRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const resetToken = req.headers.authorization;
    const token = resetToken?.split(' ')[1];
    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'you are not authorized');
    }
    let decoded;
    try {
      decoded = verifyToken(token, config.jwt_reset_secret as string);
    } catch (err: any) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        `you are not authorized ${err}`,
      );
    }
    const { userId, userRole } = decoded as JwtPayload;
    const id = userId.split(' ')[0];
    const isUserExists = await User.findById(id).select(
      'isDeleted status role',
    );
    if (
      !isUserExists ||
      isUserExists?.isDeleted ||
      isUserExists?.status === 'deactive'
    ) {
      throw new AppError(StatusCodes.NOT_FOUND, 'user not found');
    }

    if (requiredRoles && !requiredRoles.includes(userRole)) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'you are not authortized');
    }

    req.user = decoded as JwtPayload;
    next();
  });
};
