// employee-route.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TokenService } from '../../services/token.service';

@Injectable({ providedIn: 'root' })
export class EmployeeRouteGuard implements CanActivate {

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    // console.log('Employee route guard activated');

    const token = this.tokenService.getVerificationToken();

    if (!token) {
      // console.log('No token found - redirecting to unauthorized');
      this.router.navigate(['/login'], {
        state: {
          notification: 'You are not authorized to access this page. Please log in.',
        }
      });
      return of(false);
    }

    // Check token status with backend
    return this.tokenService.checkTokenStatusForGuard().pipe(
      map(response => {
        // console.log('Token status response:', response);

        if (!response.success) {
          // console.log('Token validation failed:', response.message);
          alert( `Error: ${response.message}`)
          this.router.navigate(['/register']);
          return false;
        }

        const isTokenUsed = response.value === 'true';
        const hasAccount = response.code === 'true';

        // console.log('Token status:', { isTokenUsed, hasAccount });

        // Token must be used (confirmed) but user shouldn't have account yet
        if (!isTokenUsed) {
          // console.log('Token not confirmed yet - redirecting to confirm: ', !isTokenUsed);
          this.router.navigate(['/confirm-invite-email', token]);
          return false;
        }


        if(isTokenUsed && hasAccount) {
          // console.log('User already has account - redirecting to login');
          this.router.navigate(['/login'], {
            state: {
              notification: 'You are already registered already. Please log in!',
            }
          });
          return false;
        }
        // console.log('Token valid - allowing access to employee routes');

        return true;
      }),
      catchError(error => {
        console.error('Guard error:', error);
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
