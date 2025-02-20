/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CookieOptions, NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../utills/catchAsync';
import { authService } from './auth.service';
import { sendResponse } from '../../utills/sendResponse';
import { StatusCodes } from 'http-status-codes';
import config from '../../config';
import { cookieOptions } from './auth.const';

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await authService.login(payload);
    const { access, refresh } = result;
    res.cookie('refreshToken', refresh, cookieOptions);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'login successfully',
      data: access,
    });
  },
);

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('refreshToken', cookieOptions);
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: 'successfully logged out' });
  },
);

const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = req.user;
    const result = await authService.changePassword(payload, user);
    const { access, refresh } = result;
    res.cookie('refreshToken', refresh, cookieOptions);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'password changed successfully',
      data: access,
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

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { otp } = req.body;
    const user = req.user;
    const result = await authService.resetPassword(user, otp);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'password reset successfully',
      data: result,
    });
  },
);

const setNewPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { newPassword } = req.body;
    const user = req.user;
    const result = await authService.setNewPassword(user, newPassword);
    const { access, refresh } = result;
    res.cookie('refreshToken', refresh, cookieOptions);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'new password set successfully',
      data: access,
    });
  },
);

export const authController = {
  login,
  changePassword,
  generateAccessToken,
  forgetPassword,
  resetPassword,
  setNewPassword,
  logout,
};
