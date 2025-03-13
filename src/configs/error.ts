// Imports
import { HttpException, HttpStatus } from '@nestjs/common';

export function HTTPError(options: {
  parameter?: any;
  value?: any;
  message?: string;
  statusCode?: number;
  error?: any;
  is_billable?: boolean;
}) {
  let statusCode = options.statusCode ?? 500;
  const errorObj: any = {
    status: statusCode,
    error: options.error,
    message: options.message,
  };
  if (options?.parameter) {
    errorObj.error = `Required parameter missing`;
    errorObj.parameter = options.parameter;
    statusCode = HttpStatus.BAD_REQUEST;
  } else if (options?.value) {
    errorObj.error = `Parameter having invalid value`;
    errorObj.parameter = options?.value;
    statusCode = HttpStatus.BAD_REQUEST;
  }
  errorObj.status = statusCode;
  errorObj.valid = false;
  if (!errorObj?.error) errorObj.error = errorMessage[statusCode] ?? '';
  if (options?.message) errorObj.message = options.message;

  throw new HttpException(errorObj, statusCode, {
    cause: options?.error ?? '',
  });
}

const errorMessage = {
  [HttpStatus.FORBIDDEN]: 'Forbidden',
  [HttpStatus.UNAUTHORIZED]: 'Unauthorized error',
  [HttpStatus.BAD_REQUEST]: 'Bad request',
  [HttpStatus.CONFLICT]: 'Already exists',
  [HttpStatus.NOT_FOUND]: 'No data found',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL ERROR',
  [HttpStatus.NOT_ACCEPTABLE]: 'Data not update',
};

export function raiseNotFound(message?: string) {
  throw new HTTPError({
    message: message,
    statusCode: HttpStatus.NOT_FOUND,
  });
}

export function raiseBadRequest(message?: string) {
  throw new HTTPError({
    message: message,
    statusCode: HttpStatus.BAD_REQUEST,
  });
}
