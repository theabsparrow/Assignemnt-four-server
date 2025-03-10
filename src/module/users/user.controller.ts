/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../utills/catchAsync';
import { userSrevice } from './user.service';
import { sendResponse } from '../../utills/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { cookieOptions } from '../auth/auth.const';
import { TUser } from './user.interface';

const createUSer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const dataInfo = await userSrevice.createUser(payload);
    const { access, refresh, result } = dataInfo;
    res.cookie('refreshToken', refresh, cookieOptions);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'user created successfully',
      data: { access, result },
    });
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
    const result = await userSrevice.getMe(user);
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
    const { status } = req.body;
    const user = req.user;
    const { userRole } = user;
    const payload = {
      status,
      userRole,
    };
    const result = await userSrevice.updateUSerStatus(id, payload);
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
    if ('access' in result && 'refresh' in result) {
      const access = result?.access;
      const refresh = result?.refresh;
      const data = result?.updateResult;
      res.cookie('refreshToken', refresh, cookieOptions);
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'User info updated successfully',
        data: { data, access },
      });
    } else {
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'User info updated successfully',
        data: { result },
      });
    }
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
    res.clearCookie('refreshToken', cookieOptions);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'account deleted successfully',
      data: result,
    });
  },
);

export const userController = {
  createUSer,
  getAllUsers,
  getASingleUSer,
  updateUserStatus,
  deleteUser,
  makeAdmin,
  getMe,
  updateUserInfo,
  deleteAccount,
};
