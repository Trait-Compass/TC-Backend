import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { FailResponse } from '../common/dto/fail-response-body.response';
import {API_LOGGER} from "../modules/winston/provider/api-logger.provider";
import {Logger} from "winston";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
      @Inject(API_LOGGER) private readonly logger: Logger,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {
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
      .status(exception.getStatus())
      .json(
        new FailResponse(
            request.url,
          exception.name.toUpperCase().split(' ').join('_'),
          exception.message,
          request.id,
        ),
      );
  }
}
