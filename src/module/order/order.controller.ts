import { NextFunction, Request, Response } from 'express';
import { orderService } from './order.service';
import { catchAsync } from '../../utills/catchAsync';
import { sendResponse } from '../../utills/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

const createOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const orderData = req.body;
    const user = req.user;
    const ip = req.ip as string;
    const payload: { id: string; ip: string; user: JwtPayload } = {
      id,
      ip,
      user,
    };
    const result = await orderService.createOrder(orderData, payload);
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

const changeOrderStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payload = req.body.status;
    const result = await orderService.changeOrderStatus(id, payload);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Order status changed successfully',
      data: result,
    });
  },
);

const cancellMyOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await orderService.cancellMyOrder(id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Order cancelled successfully',
      data: result,
    });
  },
);

const changeTrackingStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payload = req.body.trackingStatus;
    const result = await orderService.changeTrackingStatus(id, payload);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'tracking status updated successfully',
      data: result,
    });
  },
);

const switchTracking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payload = req.body.isTracking;
    const result = await orderService.switchTracking(id, payload);
    const message =
      payload === true
        ? 'tracking on successfully'
        : 'tracking of successfully';
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: message,
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

export const orderController = {
  createOrder,
  getAllOrder,
  getMyOwnOrders,
  getASingleOrder,
  deleteOrder,
  deleteMyOwnOrder,
  verifyPayment,
  switchTracking,
  changeOrderStatus,
  changeTrackingStatus,
  cancellMyOrder,
};
