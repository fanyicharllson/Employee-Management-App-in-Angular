import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiResponse } from '../../../../types/user.registration.types';
import { LoadingScreen } from '../../component/loading-screen/loading-screen';
import { EmployeeService } from '../../services/employee/employee.service';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'employee-confirm-token',
  imports: [CommonModule, LoadingScreen],
  templateUrl: './employee-confirm-token.html',
})
export class EmployeeConfirmToken implements OnInit {
  isLoading = true;
  hasError = false;
  tokenService = inject(TokenService);

  // Loading messages
  loadingMessage = 'TeamNest is verifying you...';
  loadingSubtext = 'Hang on tight buddy😉!';

  // Success messages
  successMessage = 'You have been Verified!';
  successSubtext =
    'TeamNest has successfully verify you. You will be redirected to complete account setup in a few seconds...';

  // Error messages
  errorMessage = 'Verification Failed';
  errorSubtext = 'Unable to verify! Please try again.';

  private route = inject(ActivatedRoute);
  private employeeService = inject(EmployeeService);
  private toast = inject(ToastrService);
  private router = inject(Router);
  private token: string | null = null;

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');

    // console.log(
    //   'Token received from route:',
    //   this.token?.substring(0, 8) + '...',

    if (this.token) {
      this.tokenService.setVerificationToken(this.token, true);
      // console.log('Token stored in TokenService');

      this.verifyEmail();
    } else {
      this.toast.error(`No token provided: ${this.token}`, 'Error');
      this.handleError(
        'Invalid verification link',
        'The verification link is invalid or expired.',
      );
    }
  }

  private verifyEmail(): void {
    if (!this.token) return;

    this.employeeService.confirmEmployeeInviteEmail(this.token).subscribe({
      next: (res: ApiResponse) => {
        if (res.success) {
          if (res.token) {
            this.tokenService.setVerificationToken(res.token, true);
            console.log('Updated token stored from API response');
          }

          this.handleSuccess(res.message, res.value);
        } else {
          this.handleError('Verification Failed', res.message);
        }
      },
      error: (err) => {
        const errorMessage =
          err.error?.message || 'An unexpected error occurred';
        this.handleError('Verification Failed', errorMessage);
      },
    });
  }

  private handleSuccess(message?: string, email?: string): void {
    this.isLoading = false;
    this.hasError = false;
    this.successMessage = 'Congratulations! TeamNest has Verify you. 🎉';
    this.successSubtext =
      message ||
      'You have been verified successfully by TeamNest! You will be redirected to complete account setup in a few seconds...';

    // Navigate employeee special login
    setTimeout(() => {
      this.router.navigate(['/employee-login'], {
        state: {
          notification:
            'You has been verified. Redirecting to special login...',
        },
      });
    }, 2500);
  }

  private handleError(title: string, message: string): void {
    this.isLoading = false;
    this.hasError = true;
    this.errorMessage = title;
    this.errorSubtext = message;

    console.log('Verification failed, redirecting to login...');

    // Clear token on error
    this.tokenService.clearTokenData();

    // Navigate to login after error
    setTimeout(() => {
      this.router.navigate(['/login'], {
        state: {
          notification: this.errorSubtext,
        },
      });
    }, 2000);
  }

  // Handle retry action
  onRetry(): void {
    if (this.token) {
      console.log('Retrying verification...');
      this.isLoading = true;
      this.hasError = false;
      this.verifyEmail();
    } else {
      // Try to get token from TokenService as fallback
      this.token = this.tokenService.getVerificationToken();

      if (this.token) {
        // console.log('Token recovered from TokenService, retrying...');
        this.isLoading = true;
        this.hasError = false;
        this.verifyEmail();
      } else {
        // console.log('No token available, redirecting to login...');
        this.toast.info('Please request a new verification link', 'Info');
        this.router.navigate(['/login']);
      }
    }
  }
}
