import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuditLogService } from './audit-log.service.js';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly auditLogService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    // Extract user data if available (e.g. from JWT auth guard)
    const user = request.user;
    const actorId = user?.userId ?? null;
    const actorRole = user?.role ?? null;

    const method = request.method;
    const url = request.url;
    const ipAddress = request.ip || request.connection?.remoteAddress;
    const userAgent = request.headers['user-agent'];

    // Only log mutations (POST, PUT, PATCH, DELETE) for DATA_UPDATE
    const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

    return next.handle().pipe(
      tap(() => {
        if (isMutation) {
          this.auditLogService.createLog({
            action: 'DATA_UPDATE',
            actorId,
            actorRole,
            targetType: 'http_request',
            targetId: url,
            description: `Successful ${method} request to ${url}`,
            ipAddress,
            userAgent,
            metadata: {
              method,
              url,
              body: request.body,
              query: request.query,
            },
          });
        }
      }),
      catchError((error) => {
        if (isMutation) {
          this.auditLogService.createLog({
            action: 'DATA_UPDATE_FAILED',
            actorId,
            actorRole,
            targetType: 'http_request',
            targetId: url,
            description: `Failed ${method} request to ${url}`,
            ipAddress,
            userAgent,
            metadata: {
              method,
              url,
              error: error.message,
            },
          });
        }
        return throwError(() => error);
      }),
    );
  }
}
