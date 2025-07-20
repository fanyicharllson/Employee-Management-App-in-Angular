import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ShowNotification } from '../../component/show-notification/show-notification';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service/user.service';

@Component({
  selector: 'app-email-verification',
  imports: [CommonModule, ShowNotification, RouterModule],
  templateUrl: './email-verification.html',
  styleUrl: './email-verification.css',
})
export class EmailVerification implements OnInit {
  private router = inject(Router);
  private userService = inject(UserService);
  userEmail = '';
  isLoading = false;

  successMessage = '';
  errorMessage = '';
  showSuccess = false;
  showError = false;

  resendDisabled = true;
  timer = 60;

  maskedEmail: string = '';

  ngOnInit(): void {
    this.userEmail = localStorage.getItem('registeredEmail') || '';
    if (this.userEmail) {
      this.userEmail = this.maskEmail(this.userEmail);
      this.maskedEmail = this.userEmail;
      this.startCooldown();
    } else {
      this.router.navigate(['/register']);
    }
  }

  // truncate email
  maskEmail(email: string): string {
    const [name, domain] = email.split('@');
    const masked = name.slice(0, 3) + '***@' + domain;
    return masked;
  }

  startCooldown(): void {
    this.resendDisabled = true;
    this.timer = 60;
    const interval = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        clearInterval(interval);
        this.resendDisabled = false;
      }
    }, 1000);
  }

  resendEmail(): void {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.showSuccess = false;
    this.showError = false;

    // Use the unmasked email from localStorage for the backend call
    const email = localStorage.getItem('registeredEmail') || '';
    if (!email) {
      this.isLoading = false;
      this.errorMessage = 'No email found. Please register again.';
      this.showError = true;
      return;
    }

    this.userService.resendToken(email).subscribe({
      next: (response) => {
        if (response.success) {
          this.isLoading = false;
          this.successMessage =
            response.message || 'Verification email sent successfully!';
          this.showSuccess = true;
          this.showError = false;
          this.startCooldown();

          setTimeout(() => {
            this.showSuccess = false;
          }, 2000);
        } else {
          this.isLoading = false;
          this.errorMessage =
            response.message || 'Failed to resend verification email.';
          this.showError = true;
          this.showSuccess = false;

          setTimeout(() => {
            this.showError = false;
            this.errorMessage = '';
          }, 2500);
        }
      },
      error: (err) => {
        this.isLoading = false;
        const code = err.error?.code;
        this.errorMessage =
          err.error?.message || 'Failed to resend verification email.';
        this.showError = true;
        this.showSuccess = false;
        if (code === 'ACCOUNT_ALREADY_VERIFIED') {
          localStorage.removeItem('registeredEmail');
          this.errorMessage =
            'Account verified already! Redirecting to login...';
          this.showError = true;
          this.showSuccess = false;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2500);
        }
      },
    });
  }
}
