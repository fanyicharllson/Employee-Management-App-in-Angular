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
export class AuthGuard implements CanActivate {
  private userService = inject(UserloginService);
  private router = inject(Router);
  private authMessageService = inject(AuthMessageService);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const currentUser = this.userService.getCurrentUser();

    // Check if user is authenticated
    if (!currentUser) {
      this.authMessageService.setUnauthorizedMessage();
      return this.router.createUrlTree(['/login']);
    }

    const currentRoute = state.url;
    const onboardingRequired = route.data['onboardingRequired'] as boolean;
    const isOnboardingRoute = currentRoute === '/onboarding';

    // Handle onboarding route access
    if (isOnboardingRoute) {
      // If user tries to access onboarding but has already completed it
      if (!currentUser.onboarding) {
        console.log('User already completed onboarding, redirecting to dashboard');
        return this.router.createUrlTree(['/dashboard']);
      }
      // User hasn't completed onboarding, allow access to onboarding
      return true;
    }

    // Handle protected routes that require onboarding completion
    if (onboardingRequired) {
      // If user hasn't completed onboarding, redirect to onboarding
      if (currentUser.onboarding) {
        console.log('User needs to complete onboarding, redirecting to onboarding');
        return this.router.createUrlTree(['/onboarding']);
      }
      // User has completed onboarding, allow access to protected route
      return true;
    }

    // For routes that don't require onboarding, allow access
    return true;
  }
}