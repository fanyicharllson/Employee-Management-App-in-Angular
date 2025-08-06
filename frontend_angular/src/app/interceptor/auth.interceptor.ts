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

  // routes that should not trigger authentication redirects
  private readonly EXEMPT_ROUTES = [
    '/login',
    '/register',
    '/employee-login',
    '/confirm-invite-email',
    '/confirm-email',
    '/me'
  ];

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    // Clone request with credentials enabled
    const cloned = req.clone({
      withCredentials: true
    });

    return next.handle(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          const isExemptRoute = this.EXEMPT_ROUTES.some(route =>
            req.url.includes(route) || window.location.pathname.includes(route)
          );

          if (!isExemptRoute) {
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
