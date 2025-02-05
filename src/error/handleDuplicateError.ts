import { StatusCodes } from 'http-status-codes';
import { TErrorSource, TValidationError } from '../interface/error';
/* eslint-disable @typescript-eslint/no-explicit-any */

const handleDuplicateError = (err: any): TValidationError => {
  const match = err.message.match(/"([^*]*)"/);
  const extractedMessage = match && match[1];
  const errorSource: TErrorSource = [
    {
      path: '',
      message: `${extractedMessage} is already exists`,
    },
  ];
  const statusCode = StatusCodes.CONFLICT;
  return {
    statusCode,
    message: 'duplicate key error',
    errorSource,
  };
};
export default handleDuplicateError;
