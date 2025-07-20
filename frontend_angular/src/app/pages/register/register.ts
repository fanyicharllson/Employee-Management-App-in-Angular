import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  notOnlyNumbersValidator,
  properCompanyNameValidator,
} from '../../helper/UserNameCompanyNameValidator';
import { UserService } from '../../services/user.service/user.service';
import { ApiResponse } from '../../../../types/user.registration.types';
import { ShowNotification } from '../../component/show-notification/show-notification';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ShowNotification],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);

  showPassword = false;
  isSubmitting = false;
  showSuccess = false;

  successMessage = '';
  showError = false;
  errorMessage = '';

  // Form for user registration
  //  It contains fields like email, password, company name, full name, phone,
  registrationForm = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ],
    ],
    password: ['', [Validators.required, Validators.minLength(8)]],
    companyName: ['', [Validators.required, properCompanyNameValidator()]],
    fullName: ['', [Validators.required, notOnlyNumbersValidator()]],
    // phone: ['', Validators.required],    // TEMPORARILY COMMENTED
    companySize: ['', Validators.required],
    hasAcceptTerms: [false, Validators.requiredTrue],
  });

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // Submit data to the backend
  // If the form is valid, it will send the data to the backend
  onSubmit() {
    if (this.registrationForm.valid) {
      this.isSubmitting = true;
      const formValue = this.registrationForm.value;
      const formData = {
        email: formValue.email ?? '',
        password: formValue.password ?? '',
        companyName: formValue.companyName ?? '',
        fullName: formValue.fullName ?? '',
        companySize: formValue.companySize ?? '',
        hasAcceptTerms: formValue.hasAcceptTerms ?? false,
      };

      this.userService.registerUser(formData).subscribe({
        next: (response: ApiResponse) => {
          this.isSubmitting = false;
          if (response.success) {
            // Show success message
            this.successMessage = response.message;
            this.showSuccess = true;
            this.showError = false;

            setTimeout(() => {
              this.showSuccess = false;
              localStorage.setItem('registeredEmail', formData.email);
              this.router.navigate(['/check-email']);
            }, 2000);
          } else {
            // how error message
            this.errorMessage = `Something went wrong: ${response.message}`;
            this.showError = true;
            this.showSuccess = false;

            setTimeout(() => {
              this.showError = false;
            }, 2500);
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Registration failed:', error);
          // backend error message
          this.errorMessage =
            error?.error?.message || 'Registration failed. Please try again.';
          this.showError = true;
          this.showSuccess = false;
        },
      });
    } else {
      Object.keys(this.registrationForm.controls).forEach((key) => {
        this.registrationForm.get(key)?.markAsTouched();
      });
    }
  }

  // Navigate back to the previous page
  navigateBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
