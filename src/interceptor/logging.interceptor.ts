import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import {map, Observable, tap} from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    if (context.switchToHttp().getRequest<Request>().url === '/health')
      return next.handle();
    const req = context.switchToHttp().getRequest<Request>();
    const id = randomUUID();
    const time = Date.now();
    const { body } = req;

    console.log({
      level: 'req info',
      traceId: id,
      method: req.method,
      url: req.url.slice(0, 200),
      authorization: req.headers.authorization,
      message: `[request] {${JSON.stringify(body)}}`,
      body,
    });

    req.id = id;

    return next.handle().pipe(
      map((v) => {
        const res = context.switchToHttp().getResponse();
        console.log({
          level: 'res info',
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

        res.json({
          status: true,
          path: req.url,
          statusCode: res.statusCode,
          result: v,
        });

      }),
    );
  }
}

declare module 'express' {
  export interface Request {
    id: string;
  }
}
