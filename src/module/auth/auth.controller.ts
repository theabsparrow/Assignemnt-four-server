/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CookieOptions, NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../utills/catchAsync';
import { authService } from './auth.service';
import { sendResponse } from '../../utills/sendResponse';
import { StatusCodes } from 'http-status-codes';
import config from '../../config';

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await authService.login(payload);
    const { access, refresh } = result;
    const cookieOptions: CookieOptions = {
      secure: config.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 365,
    };
    res.cookie('refreshToken', refresh, cookieOptions);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'login successfully',
      data: access,
    });
  },
);

export const authController = {
  login,
};
