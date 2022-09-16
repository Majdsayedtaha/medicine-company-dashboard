import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders } from '@angular/common/http';
import { take, exhaustMap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { throwError } from 'rxjs';
import { User } from './user.model';
@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user: User | null) => {
        if (!user) {
          return next.handle(req).pipe(
            catchError(err => {
              return throwError(() => err.error.message);
            })
          );
        }
        const modifiedReq = req.clone({
          headers: new HttpHeaders().set('Access-Control-Allow-Origin', '*'),
          setHeaders: {
            'Access-Control-Allow-Origin': '*',
          },
          setParams: {
            'access-token': user.getToken(),
          },
        });
        return next.handle(modifiedReq).pipe(
          catchError(err => {
            return throwError(() => err.error.message);
          })
        );
      })
    );
  }
}
