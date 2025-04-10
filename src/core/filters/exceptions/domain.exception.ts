/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpException, HttpStatus } from '@nestjs/common';

export class DomainException extends HttpException {
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    cause?: Error,
  ) {
    super(
      {
        message: cause ? `${message}: ${cause.message}` : message,
        error: cause?.stack,
        status,
      },
      status,
      { cause },
    );
  }
}

export class EntityNotFoundException extends DomainException {
  constructor(entity: string, cause?: Error) {
    super(`${entity} not found`, HttpStatus.NOT_FOUND, cause);
  }
}

export class EntityAlreadyExistsException extends DomainException {
  constructor(entity: string, cause?: Error) {
    super(`${entity} already exists`, HttpStatus.CONFLICT, cause);
  }
}

export class InvalidCredentialsException extends DomainException {
  constructor(cause?: Error) {
    super('Invalid credentials', HttpStatus.UNAUTHORIZED, cause);
  }
}

export class UnauthorizedException extends DomainException {
  constructor(message: string = 'Unauthorized access', cause?: Error) {
    super(message, HttpStatus.UNAUTHORIZED, cause);
  }
}

export class ValidationException extends DomainException {
  constructor(message: string, cause?: Error) {
    super(message, HttpStatus.BAD_REQUEST, cause);
  }
}
