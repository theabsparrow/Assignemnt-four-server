/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { catchAsync } from '../../utills/catchAsync';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '../../utills/sendResponse';
import { registrationdataService } from './registrationData.service';

const updateRegistrationData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payload = req.body;
    const result = await registrationdataService.updateRegistrationdata(
      id,
      payload,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'registration info updated successfully',
      data: result,
    });
  },
);

export const registrationController = {
  updateRegistrationData,
};
