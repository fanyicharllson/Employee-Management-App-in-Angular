import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);

  showPassword = false;
  isLoading = false;
  loginError = '';

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
  showSuccess() {
    this.toastr.info(
      'Service currently not avaliable! Please sign in with your credentials',
      'Info',
    );
  }
}
