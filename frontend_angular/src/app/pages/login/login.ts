import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ShowNotification } from '../../component/show-notification/show-notification';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ShowNotification],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);

  ngOnInit(): void {
    this.checkForNotification();
  }

  showPassword = false;
  isLoading = false;
  loginError = '';

  // Notification
  showSuccess = false;
  successMessage = '';
  showError = false;
  errorMessage = '';

  private checkForNotification(): void {
    // Get notification from router state
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || history.state;

    if (state && state['notification']) {
      this.showSuccess = true;
      this.successMessage = state['notification'];
      this.showError = false;
      this.errorMessage = '';

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
      this.loginError = '';

      // Simulate API call
      setTimeout(() => {
        // Simulate login logic
        const { email, password } = this.loginForm.value;

        // Mock authentication check
        if (email === 'demo@company.com' && password === 'password') {
          console.log('Login successful:', this.loginForm.value);
          this.isLoading = false;
          // Handle successful login here (redirect, etc.)
          alert('Login successful!');
        } else {
          this.loginError = 'Invalid email or password. Please try again.';
          this.isLoading = false;
        }
      }, 10000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  // Navigate back to the previous page
  navigateBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  //show toastr notification
  showSuccessS() {
    this.toastr.info(
      'Service currently not avaliable! Please sign in with your credentials',
      'Info',
    );
  }
}
