import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { OnboardingGuard } from './core/guards/onboarding.guard';

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
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register').then((m) => m.Register),
  },
  {
    path: 'check-email',
    loadComponent: () =>
      import('./auth/email-verification/email-verification').then(
        (m) => m.EmailVerification,
      ),
  },
  // Verify email route
  {
    path: 'confirm-email/:token',
    loadComponent: () =>
      import('./pages/confirm-email/confirm-email').then((m) => m.ConfirmEmail),
  },

  // Onboarding route - only accessible if user needs to complete onboarding
  {
    path: 'onboarding',
    loadComponent: () =>
      import('./pages/onboarding-page/onboarding-page').then(
        (m) => m.OnboardingComponent,
      ),
    canActivate: [OnboardingGuard], // Use OnboardingGuard instead
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
        canActivate: [AuthGuard],
        data: { onboardingRequired: true },
      },

      {
        path: 'employee',
        loadComponent: () =>
          import('./pages/employee/employee').then((m) => m.Employee),
        canActivate: [AuthGuard],
        data: { onboardingRequired: true },
      },
    ],
  },

  // Catch all route
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];