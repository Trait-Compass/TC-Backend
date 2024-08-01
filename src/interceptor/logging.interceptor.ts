import {
  CallHandler,
  ExecutionContext, Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { map, Observable, tap } from 'rxjs';
import { Logger } from 'winston';
import {API_LOGGER} from "../modules/winston/provider/api-logger.provider";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
      @Inject(API_LOGGER) private readonly logger: Logger,
  ) {}

  intercept(
      context: ExecutionContext,
      next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    if (context.switchToHttp().getRequest<Request>().url === '/health') {
      return next.handle();
    }

    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    const id = randomUUID();
    const time = Date.now();
    const { body } = req;

    this.logger.log({
      level: 'info',
      traceId: id,
      method: req.method,
      url: req.url.slice(0, 200),
      authorization: req.headers.authorization,
      message: `[request] {${JSON.stringify(body)}}`,
      body,
    });

    req.id = id;

    return next.handle().pipe(
        tap((v) => {
          this.logger.log({
            level: 'info',
            traceId: id,
            statusCode: res.statusCode,
            method: req.method,
            executionTime: `${Date.now() - time}ms`,
            url: req.url.slice(0, 200),
            authorization: req.headers.authorization,
            message: `[response] ${JSON.stringify(v)}`,
            request: body,
            response: v
          });
        }),
        map((v) => ({
          status: true,
          path: req.url,
          statusCode: res.statusCode,
          result: v,
        })),
    );
  }
}

declare module 'express' {
  export interface Request {
    id: string;
  }
}
