import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Observable } from 'rxjs';

@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const correlationId =
      request.headers['x-correlation-id'] || randomUUID();

    request.correlationId = correlationId;
    context.switchToHttp().getResponse().setHeader(
      'x-correlation-id',
      correlationId,
    );

    return next.handle();
  }
}
