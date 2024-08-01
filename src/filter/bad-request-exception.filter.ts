import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter, Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { FailResponse } from '../common/dto/fail-response-body.response';
import {API_LOGGER} from "../modules/winston/provider/api-logger.provider";
import {Logger} from "winston";

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  constructor(
      @Inject(API_LOGGER) private readonly logger: Logger,
  ) {}

  catch(exception: BadRequestException, host: ArgumentsHost): any {
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
      .status(400)
      .json(new FailResponse(request.url,'BAD_REQUEST', exception.message, request.id));
  }
}
