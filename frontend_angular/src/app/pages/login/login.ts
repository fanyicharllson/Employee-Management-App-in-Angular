import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ShowNotification } from '../../component/show-notification/show-notification';
import { UserloginService } from '../../services/user.service/user.login.service';
import { finalize } from 'rxjs/operators';
import { Subject, takeUntil } from 'rxjs';
import { AuthMessageService } from '../../services/user.service/auth-message/auth-messaging';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ShowNotification],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  private userloginService = inject(UserloginService);
  private authMessageService = inject(AuthMessageService); // Add this
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  constructor() {
    // Don't call handleRouteParams here - wait for ngOnInit
  }

  ngOnInit(): void {
    this.handleRouteParams();
    this.checkExistingSession();
    this.checkForNotification();
    this.subscribeToAuthMessages(); 
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  showPassword = false;
  isLoading = false;
  loginError = '';
  isCheckingSession = true;

  // Notification
  showSuccess = false;
  successMessage = '';
  showError = false;
  errorMessage = '';

  // session message
  sessionExpired = false;

  private async checkExistingSession(): Promise<void> {
    // If user has stored data, verify if session is still valid
    if (this.userloginService.hasStoredUser()) {
      try {
        const isValid = await this.userloginService.verifySession();
        if (isValid) {
          // User is already logged in, redirect to dashboard
          this.router.navigate(['/dashboard']);
          return;
        } else {
          // Session expired, show message
          this.showSessionExpiredMessage();
        }
      } catch (error) {
        console.warn('Session verification failed:', error);
        // Continue to login form
      }
    }

    this.isCheckingSession = false;
    this.cdr.detectChanges();
  }

  private showSessionExpiredMessage(): void {
    this.sessionExpired = true;
    this.showError = true;
    this.errorMessage = 'Your session has expired. Please log in again.';
    this.cdr.detectChanges(); // Force change detection

    // Auto-hide after 5s
    setTimeout(() => {
      this.hideNotification();
    }, 5000);
  }

  private handleRouteParams(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        // Handle session expired
        if (params['sessionExpired'] === 'true') {
          this.hideNotification();
          this.showSessionExpiredMessage();
          this.clearQueryParams(['sessionExpired']);
        }

        // Handle unauthorized access from AuthGuard
        if (params['redirectReason'] === 'unauthorized') {
          this.hideNotification();
          this.showUnauthorizedMessage();
          this.clearQueryParams(['redirectReason']);
        }

        // Handle access required
        if (params['access'] === 'required') {
          this.hideNotification();
          this.showAccessRequiredMessage();
          this.clearQueryParams(['access']);
        }
      });
  }

  private showUnauthorizedMessage(): void {
    this.showError = true;
    this.errorMessage = 'Please log in to access this page.';
    this.cdr.detectChanges();

    setTimeout(() => {
      this.hideNotification();
    }, 5000);
  }

  private showAccessRequiredMessage(): void {
    this.showError = true;
    this.errorMessage = 'Authentication required. Please log in to continue.';
    this.cdr.detectChanges();

    setTimeout(() => {
      this.hideNotification();
    }, 5000);
  }

  private clearQueryParams(params: string[]): void {
    const queryParamsToRemove: any = {};
    params.forEach((param) => {
      queryParamsToRemove[param] = null;
    });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParamsToRemove,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private checkForNotification(): void {
    // Get notification from router state
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || history.state;

    if (state && state['notification']) {
      this.showSuccess = true;
      this.successMessage = state['notification'];
      this.showError = false;
      this.errorMessage = '';
      this.cdr.detectChanges(); // Force change detection

      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        this.hideNotification();
      }, 5000);

      // Clear the state to prevent showing notification on page refresh
      this.clearNavigationState();
    }
  }

  private clearNavigationState(): void {
    // Replace current state to prevent notification from persisting on refresh
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  hideNotification(): void {
    this.showError = false;
    this.errorMessage = '';
    this.showSuccess = false;
    this.successMessage = '';
    this.sessionExpired = false;
    this.cdr.detectChanges(); // Force change detection
  }

  private subscribeToAuthMessages(): void {
    this.authMessageService.message$
      .pipe(takeUntil(this.destroy$))
      .subscribe((authMessage) => {
        if (authMessage) {
          this.hideNotification();

          if (authMessage.type === 'error') {
            this.showError = true;
            this.errorMessage = authMessage.message;
          } else if (authMessage.type === 'warning') {
            this.showError = true;
            this.errorMessage = authMessage.message;
          } else if (authMessage.type === 'info') {
            this.showSuccess = true;
            this.successMessage = authMessage.message;
          }

          this.cdr.detectChanges();

          // Auto-hide after 5 seconds
          setTimeout(() => {
            this.hideNotification();
            this.authMessageService.clearMessage(); // Clear the message
          }, 5000);
        }
      });
  }

  // Login form binding
  loginForm = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ],
    ],
    password: ['', [Validators.required, Validators.minLength(8)]],
    remember: [false],
  });

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.clearAllMessages();

      const { email, password } = this.loginForm.value;

      if (!email || !password) {
        this.loginError = 'Email and password are required';
        this.isLoading = false;
        this.cdr.detectChanges();
        return;
      }

      this.userloginService
        .login(email, password)
        .pipe(
          finalize(() => {
            this.isLoading = false;
            this.cdr.detectChanges();
          }),
        )
        .subscribe({
          next: (response) => {
            console.log('User info:', response.user);
            console.log('Current user role is: ', response.user.role);

            this.toastr.success(
              `Welcome back, ${response.user.name}!`,
              'Login Successful!',
            );

            this.showSuccess = true;
            this.successMessage = response.message;
            this.cdr.detectChanges();

            console.log("Current onbaording: ", response.user.onboarding)

            // Check if the uer is to redirect to obarding paage
            if(response.user.onboarding) {
              this.router.navigate(['/onboarding']);
            } else {
              this.router.navigate(['/dashboard']);
            }
          },
          error: (error) => {
            console.error('Login failed:', error);

            if (error.status === 401) {
              this.loginError = 'Invalid email or password';
              this.showError = true;
              this.errorMessage =
                'Invalid credentials. Please check your email and password.';
            } else if (error.status === 500) {
              this.loginError = 'Server error. Please try again later.';
              this.showError = true;
              this.errorMessage = 'Server error. Please try again later.';
            } else {
              this.loginError =
                error.error?.error || 'Login failed. Please try again.';
              this.showError = true;
              this.errorMessage = this.loginError;
            }

            this.cdr.detectChanges(); // Force change detection after error

            setTimeout(() => {
              this.hideNotification();
            }, 5000);
          },
        });
    } else {
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.get(key)?.markAsTouched();
      });

      this.showError = true;
      this.errorMessage = 'Please fill in all required fields correctly.';
      this.cdr.detectChanges();
    }
  }

  private clearAllMessages(): void {
    this.loginError = '';
    this.sessionExpired = false;
    this.showError = false;
    this.showSuccess = false;
    this.successMessage = '';
    this.errorMessage = '';
    this.cdr.detectChanges();
  }

  // Navigate back to the previous page
  navigateBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  // Show toastr notification
  showSuccessS() {
    this.toastr.info(
      'Service currently not available! Please sign in with your credentials',
      'Info',
    );
  }

  getCurrentUser() {
    return this.userloginService.getCurrentUser();
  }

  // Optional: Method to check if user is logged in
  isLoggedIn(): boolean {
    return this.userloginService.getCurrentUser() !== null;
  }
}
