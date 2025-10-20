/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../utills/catchAsync';
import { blogService } from './blog.service';
import { sendResponse } from '../../utills/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';

const createBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = req.user as JwtPayload;
    const { userId } = user;
    const result = await blogService.createBlog(userId, payload);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Blog created successfully',
      data: result,
    });
  },
);

const getAllBlogs = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await blogService.getallBlogs(query);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Blogs are retrived successfully',
      data: result,
    });
  },
);

const getASingleBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await blogService.getASingleBlog(id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Blog is retrived successfully',
      data: result,
    });
  },
);

const getMyBlogs = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const { userEmail } = req.user as JwtPayload;
    const result = await blogService.getMyBlogs(userEmail, query);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Blogs are retrived successfully',
      data: result,
    });
  },
);

const getMySingleBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const { userId } = req.user as JwtPayload;
    const result = await blogService.getMySingleBlog(userId, id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Blog is retrived successfully',
      data: result,
    });
  },
);

const updateMyBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const { userId } = req.user as JwtPayload;
    const payload = req.body;
    const result = await blogService.updateMyBlog({ userId, id, payload });
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Blog is updated successfully',
      data: result,
    });
  },
);

const deleteMyBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const { userId } = req.user as JwtPayload;
    const result = await blogService.deleteMyBlog(id, userId);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Blog is deleted successfully',
      data: result,
    });
  },
);

const deleteBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await blogService.deleteBlog(id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Blog is deleted successfully',
      data: result,
    });
  },
);

export const blogController = {
  createBlog,
  getAllBlogs,
  getASingleBlog,
  getMyBlogs,
  getMySingleBlog,
  updateMyBlog,
  deleteMyBlog,
  deleteBlog,
};
