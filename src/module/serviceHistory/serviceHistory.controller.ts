/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../utills/catchAsync';
import { sendResponse } from '../../utills/sendResponse';
import { serviceHistoryService } from './serviceHistory.service';

const updateServiceHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payload = req.body;
    const result = await serviceHistoryService.updateServiceHistory(
      id,
      payload,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'service history updated successfully',
      data: result,
    });
  },
);

export const serviceHistoryController = {
  updateServiceHistory,
};
