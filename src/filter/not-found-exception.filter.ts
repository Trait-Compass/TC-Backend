import {
  ArgumentsHost,
  Catch,
  ExceptionFilter, Inject,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { FailResponse } from '../common/dto/fail-response-body.response';
import {API_LOGGER} from "../modules/winston/provider/api-logger.provider";
import {Logger} from "winston";

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  constructor(
      @Inject(API_LOGGER) private readonly logger: Logger,
  ) {}
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    this.logger.log({
      level: 'error',
      traceId: request.id,
      statusCode: exception.getStatus(),
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
          'PATH_NOT_FOUND',
          '존재하지 않는 접근 경로입니다.',
          request.id,
        ),
      );
  }
}
