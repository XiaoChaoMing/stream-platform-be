import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface HttpExceptionResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}

interface ExceptionResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string | string[];
  error?: unknown;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string | string[];
    let error: unknown;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse() as
        | string
        | HttpExceptionResponse;
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : exceptionResponse.message || exception.message;
      error =
        typeof exceptionResponse === 'string'
          ? undefined
          : exceptionResponse.error;
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.stack;
    } else {
      message = 'Internal server error';
      error = exception;
    }

    const responseBody: ExceptionResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: message,
      error: process.env.NODE_ENV === 'development' ? error : undefined,
    };

    // Log error for debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Exception:', {
        ...responseBody,
        stack: exception instanceof Error ? exception.stack : undefined,
      });
    }

    response.status(status).json(responseBody);
  }
}
