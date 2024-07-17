import { ArgumentsHost, Catch, ExceptionFilter, Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import { FailResponse } from '../common/dto/fail-response-body.response';

@Catch()
export class CatchAllFilter implements ExceptionFilter {

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    if ((exception as { code: string })?.code === 'ETIMEOUT') {
      response
        .status(500)
        .json(
          new FailResponse(
            'TIMEOUT',
            '요청이 시간 초과되었습니다. 잠시 후 다시 시도해주세요.',
            request.id,
          ),
        );
    } else {
      response
        .status(500)
        .json(
          new FailResponse(
            'UNKNOWN',
            '처리되지 않은 오류가 발생하였습니다.',
            request.id,
          ),
        );
    }

    if (exception instanceof Error) {
      console.log({
        level: 'error',
        statusCode: 500,
        authorization: request.headers.authorization,
        url: request.url,
        traceId: request.id,
        request: request.body,
        message: `[response] ${exception.stack}`,
        stack: exception.stack,
      });
    } else {
      console.log({
        level: 'error',
        hospitalId: request.headers.hospitalId,
        statusCode: 500,
        authorization: request.headers.authorization,
        url: request.url,
        traceId: request.id,
        request: request.body,
        message: `[response] ${exception}`,
        stack: exception,
      });
    }
  }
}
