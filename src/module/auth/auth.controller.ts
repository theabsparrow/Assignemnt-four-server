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

const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = req.user;
    const result = await authService.changePassword(payload, user);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'password changed successfully',
      data: result,
    });
  },
);

const generateAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.cookies;
    const result = await authService.generateAccessToken(refreshToken);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'access token generated successfully',
      data: result,
    });
  },
);

const forgetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const result = await authService.forgetPassword(email);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'generate otp successfully',
      data: result,
    });
  },
);
export const authController = {
  login,
  changePassword,
  generateAccessToken,
  forgetPassword,
};
