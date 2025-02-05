import { ZodError, ZodIssue } from 'zod';
import { TErrorSource, TValidationError } from '../interface/error';
import { StatusCodes } from 'http-status-codes';

const handleZodError = (err: ZodError): TValidationError => {
  const errorSource: TErrorSource = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue.message,
    };
  });
  const statusCode = StatusCodes.BAD_REQUEST;
  return {
    statusCode,
    message: 'Validation error',
    errorSource,
  };
};
export default handleZodError;
