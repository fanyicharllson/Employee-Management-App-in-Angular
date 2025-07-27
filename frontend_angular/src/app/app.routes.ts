import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { OnboardingGuard } from './core/guards/onboarding.guard';
import { ConnectionGuard } from './core/guards/connection.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing-page/landing-page').then((m) => m.LandingPage),
    canActivate: [ConnectionGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
    canActivate: [ConnectionGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register').then((m) => m.Register),
    canActivate: [ConnectionGuard],
  },
  {
    path: 'check-email',
    loadComponent: () =>
      import('./auth/email-verification/email-verification').then(
        (m) => m.EmailVerification,
      ),
    canActivate: [ConnectionGuard],
  },
  // Verify email route
  {
    path: 'confirm-email/:token',
    loadComponent: () =>
      import('./pages/confirm-email/confirm-email').then((m) => m.ConfirmEmail),
    canActivate: [ConnectionGuard],
  },

  // Onboarding route - only accessible if user needs to complete onboarding
  {
    path: 'onboarding',
    loadComponent: () =>
      import('./pages/onboarding-page/onboarding-page').then(
        (m) => m.OnboardingComponent,
      ),
    canActivate: [OnboardingGuard, ConnectionGuard], // Use OnboardingGuard instead
  },

  // Dashboard and protected routes
  {
    path: '',
    loadComponent: () => import('./pages/layout/layout').then((m) => m.Layout),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
        canActivate: [AuthGuard, ConnectionGuard],
        data: { onboardingRequired: true },
      },

      {
        path: 'employee',
        loadComponent: () =>
          import('./pages/employee/employee').then((m) => m.Employee),
        canActivate: [AuthGuard, ConnectionGuard],
        data: { onboardingRequired: true },
      },
    ],
  },
  // No internet route
  {
    path: 'no-internet',
    loadComponent: () => import('./pages/no-internet/no-internet.component').then((m) => m.NoInternetComponent)
  },

  // Catch all route
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found').then((m) => m.NotFound),
    canActivate: [ConnectionGuard],
  },

];