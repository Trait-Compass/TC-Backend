import { ArgumentsHost, Catch, ExceptionFilter, Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import { FailResponse } from '../common/dto/fail-response-body.response';
import {HttpError} from "../common/exception/HttpError";
import {API_LOGGER} from "../modules/winston/provider/api-logger.provider";
import {Logger} from "winston";

@Catch(HttpError)
export class HttpErrorFilter implements ExceptionFilter {
  constructor(
      @Inject(API_LOGGER) private readonly logger: Logger,
  ) {}

  catch(exception: HttpError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    console.log({
      level: 'error',
      traceId: request.id,
      statusCode: exception.statusCode,
      authorization: request.headers.authorization,
      url: request.url,
      request: request.body,
      message: `[response] ${JSON.stringify(exception)}`,
      stack: exception.stack,
      exceptionName: exception.name,
      exceptionNMessage: exception.message,
    });

    response
      .status(exception.statusCode)
      .json(
        new FailResponse(
            request.url,
          exception.responseCode,
          exception.errorMessage,
          request.id,
        ),
      );
  }
}
