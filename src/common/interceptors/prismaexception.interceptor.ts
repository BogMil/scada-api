import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import { NotFoundInDbPrismaException } from '../exceptions/notfoundindb.exception';
import { UniqueConstaintFailedPrismaException } from '../exceptions/uniqueconstaintfailedprisma.exception';

@Injectable()
export class PrismaExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((e) => {
        if (e.code === 'P2025')
          return throwError(
            () => new NotFoundInDbPrismaException(e.meta.cause),
          );
        if (e.code === 'P2002')
          return throwError(
            () => new UniqueConstaintFailedPrismaException(e.meta.target),
          );
        return throwError(() => e);
      }),
    );
  }
}
