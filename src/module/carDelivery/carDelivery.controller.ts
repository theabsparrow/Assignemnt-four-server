/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { catchAsync } from '../../utills/catchAsync';
import { NextFunction, Request, Response } from 'express';
import { sendResponse } from '../../utills/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { carDeliveryService } from './carDelivery.service';

const updateCarDeliveryInfo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payload = req.body;
    const result = await carDeliveryService.updateCarDeliveryInfo(id, payload);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'delivery info is updated successfully',
      data: result,
    });
  },
);

export const carDeliveryController = {
  updateCarDeliveryInfo,
};
