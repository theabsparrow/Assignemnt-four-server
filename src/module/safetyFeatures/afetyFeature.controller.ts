/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '../../utills/sendResponse';
import { catchAsync } from '../../utills/catchAsync';
import { safetyFeatureService } from './safetyFeature.service';

const updateSafetyFeature = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payload = req.body;
    const result = await safetyFeatureService.updateSafetyFeature(id, payload);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'safety feature info updated successfully',
      data: result,
    });
  },
);

export const safetyFeatireController = { updateSafetyFeature };
