import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service/user.service';
import { CommonModule } from '@angular/common';
import { ApiResponse } from '../../../../types/user.registration.types';
import { LoadingScreen } from '../../component/loading-screen/loading-screen';

@Component({
  selector: 'app-confirm-email',
  imports: [CommonModule, LoadingScreen],
  templateUrl: './confirm-email.html',
  styleUrl: './confirm-email.css',
})
export class ConfirmEmail implements OnInit {
  isLoading = true;
  hasError = false;

  // Loading messages
  loadingMessage = 'Verifying your email...';
  loadingSubtext = 'Hang on tight buddy😉!';

  // Success messages
  successMessage = 'Email Verified!';
  successSubtext = 'Your email has been verified successfully!';

  // Error messages
  errorMessage = 'Verification Failed';
  errorSubtext = 'Unable to verify your email. Please try again.';

  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private router = inject(Router);
  private token: string | null = null;

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    console.log('Param from token: ', this.token);

    if (this.token) {
      this.verifyEmail();
    } else {
      this.handleError(
        'Invalid verification link',
        'The verification link is invalid or expired.',
      );
    }
  }

  private verifyEmail(): void {
    if (!this.token) return;

    this.userService.confirmEmail(this.token).subscribe({
      next: (res: ApiResponse) => {
        if (res.success) {
          this.handleSuccess(res.message);
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

  private handleSuccess(message?: string): void {
    this.isLoading = false;
    this.hasError = false;
    this.successMessage = 'Congratulations! 🎉';
    this.successSubtext =
      message || 'Your email has been verified successfully!';

    // Navigate to login after success
    setTimeout(() => {
      this.router.navigate(['/login'], {
        state: {
          notification: 'Your email has been verified. Please log in.',
        },
      });
    }, 2000);
  }

  private handleError(title: string, message: string): void {
    this.isLoading = false;
    this.hasError = true;
    this.errorMessage = title;
    this.errorSubtext = message;

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
      this.isLoading = true;
      this.hasError = false;
      this.verifyEmail();
    } else {
      // Redirect to request new verification: TODO: Implement this route
      this.router.navigate(['/login']);
    }
  }
}
