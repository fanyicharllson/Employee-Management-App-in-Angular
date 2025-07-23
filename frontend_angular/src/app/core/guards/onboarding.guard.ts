import { Injectable, inject } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { UserloginService } from '../../services/user.service/user.login.service';
import { AuthMessageService } from '../../services/user.service/auth-message/auth-messaging';

@Injectable({
  providedIn: 'root',
})
export class OnboardingGuard implements CanActivate {
  private userService = inject(UserloginService);
  private router = inject(Router);
  private authMessageService = inject(AuthMessageService);

  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const currentUser = this.userService.getCurrentUser();

    // Check if user is authenticated first
    if (!currentUser) {
      this.authMessageService.setUnauthorizedMessage();
      return this.router.createUrlTree(['/login']);
    }

    // If user has completed onboarding (onboarding = false), redirect to dashboard
    if (!currentUser.onboarding) {
      console.log('User already completed onboarding, redirecting to dashboard');
      return this.router.createUrlTree(['/dashboard']);
    }

    // User needs to complete onboarding, allow access
    return true;
  }
}