import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { EntityNotFoundError } from 'typeorm'
import { FailResponse } from '../common/dto/fail-response-body.response';

@Catch(EntityNotFoundError)
export class EntityNotFoundErrorFilter implements ExceptionFilter {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

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
