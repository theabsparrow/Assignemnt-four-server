/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CookieOptions, NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../utills/catchAsync';
import { authService } from './auth.service';
import { sendResponse } from '../../utills/sendResponse';
import { StatusCodes } from 'http-status-codes';
import config from '../../config';
import { cookieOptions, CookieOptions1 } from './auth.const';
import { JwtPayload } from 'jsonwebtoken';

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await authService.login(payload);
    const { access, refresh } = result;
    res.cookie('refreshToken', refresh, cookieOptions);
    res.clearCookie('refreshToken1', CookieOptions1);
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
    res.clearCookie('refreshToken1', CookieOptions1);
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: 'successfully logged out' });
  },
);
const clearToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('refreshToken1', CookieOptions1);
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: 'successfully logged out' });
  },
);

const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = req.user as JwtPayload;
    const { userId } = user;
    const result = await authService.changePassword(payload, userId);
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

const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { userId } = user;
    const result = await authService.getUser(userId);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'user info retrive successfully',
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
      message: 'user info retrive successfully',
      data: result,
    });
  },
);

const retrivePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const { userId } = req.user as JwtPayload;
    const { refresh } = await authService.retrivePassword(userId, payload);
    res.cookie('refreshToken3', refresh, CookieOptions1);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'otp sent successfully',
      data: null,
    });
  },
);

const sendOTP = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.body;
    const { refresh } = await authService.sendOTP(id);
    res.cookie('refreshToken1', refresh, CookieOptions1);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'sent OTP successfully',
      data: null,
    });
  },
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { otp } = req.body;
    const { userId } = req.user as JwtPayload;
    const { refresh, access } = await authService.resetPassword(userId, otp);
    res.cookie('refreshToken1', refresh, CookieOptions1);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'OTP matched successfully',
      data: access,
    });
  },
);

const setNewPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { newPassword } = req.body;
    const user = req.user as JwtPayload;
    const { userId } = user;
    const result = await authService.setNewPassword(userId, newPassword);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'new password set successfully',
      data: result,
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
  clearToken,
  sendOTP,
  getUser,
  retrivePassword,
};
