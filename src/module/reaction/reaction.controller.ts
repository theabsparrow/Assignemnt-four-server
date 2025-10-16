/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../utills/catchAsync';
import { sendResponse } from '../../utills/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { reactionService } from './reaction.service';

const createReaction = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const blogId = req.params.id;
    const { userId } = req.user as JwtPayload;
    const result = await reactionService.createReaction({
      userId,
      blogId,
    });
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'you have reacted successfully',
      data: result,
    });
  },
);

const getMyReaction = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const blogId = req.params.id;
    const { userId } = req.user as JwtPayload;
    const result = await reactionService.getMyReaction(blogId, userId);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'successfully retrived',
      data: result,
    });
  },
);

export const reactionController = {
  createReaction,
  getMyReaction,
};
