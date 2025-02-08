/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../utills/catchAsync';
import { userSrevice } from './user.service';
import { sendResponse } from '../../utills/sendResponse';
import { StatusCodes } from 'http-status-codes';

const createUSer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await userSrevice.createUser(payload);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'user created successfully',
      data: result,
    });
  },
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userSrevice.getAllUser();
    sendResponse(res, {
      success: true,
      statusCode: result.length > 0 ? StatusCodes.OK : StatusCodes.NOT_FOUND,
      message:
        result.length > 0
          ? 'users are retrived successfully'
          : 'no user right now',
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

export const userController = {
  createUSer,
  getAllUsers,
  getASingleUSer,
  updateUserStatus,
  deleteUser,
  makeAdmin,
  getMe,
};
