import { NextFunction, Request, Response } from 'express';
import { orderService } from './order.service';
import { catchAsync } from '../../utills/catchAsync';
import { sendResponse } from '../../utills/sendResponse';
import { StatusCodes } from 'http-status-codes';
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

const createOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = req.user;
    const result = await orderService.createOrder(payload, user);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'order created successfully',
      data: result,
    });
  },
);

export const orderController = {
  createOrder,
};
