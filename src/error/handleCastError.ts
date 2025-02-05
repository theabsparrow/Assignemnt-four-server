import mongoose from 'mongoose';
import { TValidationError } from '../interface/error';
import { StatusCodes } from 'http-status-codes';

const handleCastError = (err: mongoose.Error.CastError): TValidationError => {
  const errorSource = [
    {
      path: err?.path,
      message: err?.message,
    },
  ];
  const statusCode = StatusCodes.BAD_REQUEST;
  return {
    statusCode,
    message: 'Invalid ID',
    errorSource,
  };
};

export default handleCastError;
