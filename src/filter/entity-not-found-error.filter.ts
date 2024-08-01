import {ArgumentsHost, Catch, ExceptionFilter, Inject} from '@nestjs/common';
import { Request, Response } from 'express';
import { EntityNotFoundError } from 'typeorm'
import { FailResponse } from '../common/dto/fail-response-body.response';
import {API_LOGGER} from "../modules/winston/provider/api-logger.provider";
import {Logger} from "winston";

@Catch(EntityNotFoundError)
export class EntityNotFoundErrorFilter implements ExceptionFilter {
  constructor(
      @Inject(API_LOGGER) private readonly logger: Logger,
  ) {}
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    console.log({
      level: 'error',
      traceId: request.id,
      statusCode: 404,
      authorization: request.headers.authorization,
      url: request.url,
      request: request.body,
      message: `[response] ${JSON.stringify(exception)}`,
      stack: exception.stack,
      exceptionName: exception.name,
      exceptionNMessage: exception.message,
    });

    response
      .status(404)
      .json(
        new FailResponse(
            request.url,
          'RESOURCE_NOT_FOUND',
          '요청한 리소스를 찾을 수 없습니다.',
          request.id,
        ),
      );
  }
}
