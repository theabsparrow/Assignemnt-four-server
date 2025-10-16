/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { catchAsync } from '../../utills/catchAsync';
import { NextFunction, Request, Response } from 'express';
import { sendResponse } from '../../utills/sendResponse';
import { JwtPayload } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { commentService } from './comment.service';

const createComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payload = req.body;
    const user = req.user as JwtPayload;
    const { userId } = user;
    const result = await commentService.createComment({ id, userId, payload });
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'comment posted successfully',
      data: result,
    });
  },
);

const getAlComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await commentService.getAlComment(id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'comments are retrived successfully',
      data: result,
    });
  },
);

const getAllReplies = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await commentService.getAllReplies(id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'replies are retrived successfully',
      data: result,
    });
  },
);

const updateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payload = req.body;
    const user = req.user as JwtPayload;
    const { userId } = user;
    const result = await commentService.updateComment({ id, userId, payload });
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'comments are updated successfully',
      data: result,
    });
  },
);

const deleteComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const user = req.user as JwtPayload;
    const { userId } = user;
    const result = await commentService.deleteComment(id, userId);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'comment is deleted successfully',
      data: result,
    });
  },
);

export const commentController = {
  createComment,
  getAlComment,
  getAllReplies,
  updateComment,
  deleteComment,
};
