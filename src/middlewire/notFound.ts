import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const statusCode = StatusCodes.NOT_FOUND;
  const message = 'API not found';
  res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: message,
    error: '',
  });
};

export default notFound;
