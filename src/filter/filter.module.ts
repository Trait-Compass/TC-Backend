import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { BadRequestExceptionFilter } from './bad-request-exception.filter';
import { CatchAllFilter } from './catch-all.filter';
import { EntityNotFoundErrorFilter } from './entity-not-found-error.filter';
import { HttpErrorFilter } from './http-error.filter';
import { HttpExceptionFilter } from './http-exception.filter';
import { NotFoundExceptionFilter } from './not-found-exception.filter';

@Module({
  providers: [
    // NestJs match filter from last to first. More specific exception filter should place later.
    {
      provide: APP_FILTER,
      useClass: CatchAllFilter,
    },
    {
      provide: APP_FILTER,
      useClass: EntityNotFoundErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: BadRequestExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
  ],
})
export class FilterModule {}
