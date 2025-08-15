import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { OnboardingGuard } from './core/guards/onboarding.guard';
import { ConnectionGuard } from './core/guards/connection.guard';
import { EmployeeChart } from './pages/employee/employee-chart/employee-chart';
import { EmployeeLeave } from './pages/employee/employee-leave/employee-leave';
import { ManageEmployee } from './pages/employee/manage-employee/manage-employee';
import { EmployeeRouteGuard } from './core/guards/employee.auth.register.guard';
import { Payroll } from './pages/payroll/payroll';
import { AppUnderDevelopment } from './pages/app-underdevelopment/app-under-development';

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
  // Verify email route ==during create account
  {
    path: 'confirm-email/:token',
    loadComponent: () =>
      import('./pages/confirm-email/confirm-email').then((m) => m.ConfirmEmail),
    canActivate: [ConnectionGuard],
  },
  //invite email for employee
  {
    path: 'confirm-invite-email/:token',
    loadComponent: () =>
      import('./pages/employee-confirm-token/employee-confirm-token').then(
        (m) => m.EmployeeConfirmToken,
      ),
  },

  //employee sign up route
  {
    path: 'employee-login',
    loadComponent: () =>
      import('./pages/employee/employee-signup/employee-signup').then(
        (m) => m.EmployeeSignupComponent,
      ),
    canActivate: [EmployeeRouteGuard],
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

  // Dashboard and protected routes===============================================================================================
  //HR dashboard===============
  //==================================================================================================================================
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
        path: 'hr/employees',
        loadComponent: () =>
          import('./pages/employee/employee').then((m) => m.Employee),
        canActivate: [AuthGuard, ConnectionGuard],
        data: { onboardingRequired: true },
        children: [
          { path: '', redirectTo: 'manage', pathMatch: 'full' },
          { path: 'manage', component: ManageEmployee },
          { path: 'chart', component: EmployeeChart },
          { path: 'leave', component: AppUnderDevelopment },
          { path: 'payroll', component: Payroll },
        ],
      },
      {
        path: 'hr/payroll',
        loadComponent: () =>
          import('./pages/app-underdevelopment/app-under-development').then(
            (m) => m.AppUnderDevelopment,
          ),
        canActivate: [AuthGuard, ConnectionGuard],
        data: { onboardingRequired: true },
      },
      {
        path: 'hr/reports',
        loadComponent: () =>
          import('./pages/app-underdevelopment/app-under-development').then(
            (m) => m.AppUnderDevelopment,
          ),
        canActivate: [AuthGuard, ConnectionGuard],
      },
      {
        path: 'hr/timesheet',
        loadComponent: () =>
          import('./pages/app-underdevelopment/app-under-development').then(
            (m) => m.AppUnderDevelopment,
          ),
        canActivate: [AuthGuard, ConnectionGuard],
      },
      {
        path: 'hr/schedule',
        loadComponent: () =>
          import('./pages/app-underdevelopment/app-under-development').then(
            (m) => m.AppUnderDevelopment,
          ),
        canActivate: [AuthGuard, ConnectionGuard],
      },
      {
        path: 'hr/recruitment',
        loadComponent: () =>
          import('./pages/app-underdevelopment/app-under-development').then(
            (m) => m.AppUnderDevelopment,
          ),
        canActivate: [AuthGuard, ConnectionGuard],
      },
    ],
  },

  //Settings page in employeee dasboard
  {
    path: 'hr/setting',
    loadComponent: () =>
      import('./pages/app-underdevelopment/app-under-development').then(
        (m) => m.AppUnderDevelopment,
      ),
    canActivate: [AuthGuard, ConnectionGuard],
  },
  {
    path: 'hr/profile',
    loadComponent: () =>
      import('./pages/app-underdevelopment/app-under-development').then(
        (m) => m.AppUnderDevelopment,
      ),
    canActivate: [AuthGuard, ConnectionGuard],
  },
  {
    path: 'help',
    loadComponent: () =>
      import('./pages/app-underdevelopment/app-under-development').then(
        (m) => m.AppUnderDevelopment,
      ),
    canActivate: [AuthGuard, ConnectionGuard],
  },

  // Dashboard and protected routes===============================================================================================
  //employee dashboard===============
  //==================================================================================================================================
  {
    path: 'employee-dashboard',
    loadComponent: () =>
      import('./pages/employee-dashboard/employee.dashboard').then(
        (m) => m.EmployeeDashboard,
      ),

  },

  // No internet route
  {
    path: 'no-internet',
    loadComponent: () =>
      import('./pages/no-internet/no-internet.component').then(
        (m) => m.NoInternetComponent,
      ),
  },

  // Catch all route
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found').then((m) => m.NotFound),
    canActivate: [ConnectionGuard],
    title: 'Page not found',
  },
];
