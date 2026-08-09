import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  StreamableFile,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T> | any
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T> | any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        if (data instanceof StreamableFile) {
          return data;
        }
        return {
          statusCode: response.statusCode,
          message: data?.message || 'Success',
          data: data?.data !== undefined ? data.data : data,
        };
      }),
    );
  }
}
