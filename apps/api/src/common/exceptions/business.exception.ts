import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(message: string, statusCode: HttpStatus = HttpStatus.BAD_REQUEST) {
    super(message, statusCode);
  }
}

export class EntityNotFoundException extends BusinessException {
  constructor(entityName: string, id?: string) {
    const message = id
      ? `${entityName} with id '${id}' not found`
      : `${entityName} not found`;
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class DuplicateEntityException extends BusinessException {
  constructor(entityName: string, field: string, value: string) {
    super(
      `${entityName} with ${field} '${value}' already exists`,
      HttpStatus.CONFLICT,
    );
  }
}

export class ValidationException extends BusinessException {
  constructor(message: string) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}