/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../utills/catchAsync';
import { userSrevice } from './user.service';
import { sendResponse } from '../../utills/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { cookieOptions, CookieOptions1 } from '../auth/auth.const';
import { TUser } from './user.interface';

const createUSer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const dataInfo = await userSrevice.createUser(payload);
    const { access, refresh, result, resetToken } = dataInfo;
    res.cookie('refreshToken', refresh, cookieOptions);
    res.cookie('refreshToken2', resetToken, CookieOptions1);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'user created successfully',
      data: { access, result },
    });
  },
);

const resendOTP = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await userSrevice.resendOTP(id);
    res.cookie('refreshToken2', result, CookieOptions1);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'sent OTP successfully',
      data: null,
    });
  },
);

const verifyEmail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { otp } = req.body;
    const user = req.user as JwtPayload;
    const { userId } = user;
    const { refreshToken2: token } = req.cookies;
    const result = await userSrevice.verifyEmail({ userId, otp, token });
    if (result) {
      res.clearCookie('refreshToken2', CookieOptions1);
    }
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'sent OTP successfully',
      data: null,
    });
  },
);

const clearCookie = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('refreshToken2', CookieOptions1);
    res.status(StatusCodes.OK).json({ success: true, message: 'clear cookie' });
  },
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const query = req.query;
    const { userRole } = user as JwtPayload;
    const result = await userSrevice.getAllUser(userRole, query);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message:
        result?.result.length > 0
          ? 'users are retrived successfully'
          : 'no user right now',
      meta: result?.meta,
      data: result?.result,
    });
  },
);

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const query = req.query;
    const result = await userSrevice.getMe(user, query);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'user info is retrived successfully',
      data: result,
    });
  },
);

const getASingleUSer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const user = req.user;
    const result = await userSrevice.getASingleUSer(id, user);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'user is retrived successfully',
      data: result,
    });
  },
);

const updateUserStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payload = req.body;
    const user = req.user as JwtPayload;
    const { userRole } = user;
    const result = await userSrevice.updateUSerStatus({
      id,
      role: userRole,
      payload,
    });
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'user status is updated successfully',
      data: result,
    });
  },
);

const makeAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const { role } = req.body;
    const result = await userSrevice.makeAdmin(id, role);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'user role is updated successfully',
      data: result,
    });
  },
);

const updateUserInfo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = req.user;
    const result = await userSrevice.updateUserInfo(user, payload);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'User info updated successfully',
      data: result,
    });
  },
);

const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const user = req.user;
    const result = await userSrevice.deleteUser(id, user);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'user is deleted successfully',
      data: result,
    });
  },
);

const deleteAccount = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body;
    const user = req.user;
    const result = await userSrevice.deleteAccount(password, user);
    if (result) {
      res.clearCookie('refreshToken', cookieOptions);
      res.clearCookie('refreshToken1', CookieOptions1);
      res.clearCookie('refreshToken2', CookieOptions1);
    }
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'account deleted successfully',
      data: null,
    });
  },
);

export const userController = {
  createUSer,
  resendOTP,
  verifyEmail,
  clearCookie,
  getAllUsers,
  getASingleUSer,
  updateUserStatus,
  deleteUser,
  makeAdmin,
  getMe,
  updateUserInfo,
  deleteAccount,
};
