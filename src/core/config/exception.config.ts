import { INestApplication } from '@nestjs/common';
import { AllExceptionsFilter } from '../filters/http-exception.filter';

export function setupGlobalExceptions(app: INestApplication): void {
  app.useGlobalFilters(new AllExceptionsFilter());
}
