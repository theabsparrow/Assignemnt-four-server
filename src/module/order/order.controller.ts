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
    const ip = req.ip;
    const result = await orderService.createOrder(payload, user, ip!);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'order created successfully',
      data: result,
    });
  },
);

const verifyPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { order_id } = req.query;
    const result = await orderService.verifyPayment(order_id as string);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'order verified successfully',
      data: result,
    });
  },
);

const getAllOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await orderService.getAllOrder(query);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'orders are retrived successfully',
      data: result,
    });
  },
);

const getMyOwnOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const user = req.user;
    const result = await orderService.getMyOwnOrders(query, user);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'orders are retrived successfully',
      data: result,
    });
  },
);

const getASingleOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const user = req.user;
    const result = await orderService.getASingleOrder(id, user);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'order is retrived successfully',
      data: result,
    });
  },
);

const deleteOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await orderService.deleteOrder(id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'order is deleted successfully',
      data: result,
    });
  },
);

const deleteMyOwnOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const user = req.user;
    const result = await orderService.deleteMyOwnOrder(id, user);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'order is deleted successfully',
      data: result,
    });
  },
);

const deleteAllOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ids } = req.body;
    const user = req.user;
    const result = await orderService.deleteAllOrders(ids, user);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'orders are deleted successfully',
      data: result,
    });
  },
);

export const orderController = {
  createOrder,
  getAllOrder,
  getMyOwnOrders,
  getASingleOrder,
  deleteOrder,
  deleteMyOwnOrder,
  deleteAllOrders,
  verifyPayment,
};
