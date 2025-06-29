/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../utills/catchAsync';
import { sendResponse } from '../../utills/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { reactionService } from './reaction.service';

const getMyReaction = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const blogId = req.params.id;
    const { userEmail } = req.user as JwtPayload;
    const result = await reactionService.getMyReaction(blogId, userEmail);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'successfully retrived',
      data: result,
    });
  },
);

export const reactionController = {
  getMyReaction,
};
