import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { UserloginService } from '../services/user.service/user.login.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private router = inject(Router);
  private userService = inject(UserloginService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          const isLoginRequest = req.url.includes('/login');
          const isSessionCheck = req.url.includes('/me');

          if (!isLoginRequest && !isSessionCheck) {
            this.userService.setCurrentUser(null);
            this.router.navigate(['/login'], {
              queryParams: { sessionExpired: 'true' },
              state: { sessionExpired: true },
            });
          }
        }
        return throwError(() => error);
      }),
    );
  }
}
