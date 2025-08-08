import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../services/employee/employee.service';
import { EmployeeRegisterService } from '../../../services/employee/employee.register.service';
import { ApiResponse } from '../../../../../types/user.registration.types';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'employee-signup',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: 'employee-signup.html',
})
export class EmployeeSignupComponent implements OnInit {
  signupForm: FormGroup;
  showPassword = false;
  isSubmitting = false;
  companyName: string | null | undefined = null;
  userEmail: string | null = null;
  isLoading = true;
  private employeeService = inject(EmployeeService);
  private employeeRegistrationService = inject(EmployeeRegisterService);
  private toast = inject(ToastrService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d).*$/),
        ],
      ],
    });
  }

  ngOnInit() {
    this.employeeService.initializeFromStorage();

    this.loadCompanyData();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  getPasswordRequirement(requirement: string): { valid: boolean } {
    const password = this.signupForm.get('password')?.value || '';

    switch (requirement) {
      case 'length':
        return { valid: password.length >= 8 };
      case 'uppercase':
        return { valid: /[A-Z]/.test(password) };
      case 'number':
        return { valid: /\d/.test(password) };
      default:
        return { valid: false };
    }
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.isSubmitting = true;

      const fromValue = this.signupForm.value;
      const formData = {
        email: fromValue.email ?? '',
        password: fromValue.password ?? '',
      };

      // console.log("Employee Registering Form Data: ", formData);

      this.employeeRegistrationService.registerUser(formData).subscribe({
        next: (response: ApiResponse) => {
          this.isSubmitting = false;
          if (response.success) {
            const message = response.message;
            this.toast.success(message, 'Success');

            setTimeout(() => {
              this.toast.success(message, 'Success');
              this.router.navigate(['/login'], {
                state: {
                  redirect:
                    '/login'
                },
              });
            }, 3000);
          } else {
            this.isSubmitting = false;
            const message = response.message;
            this.toast.error(message, 'Error');
            console.error('Error: ', message);
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          this.toast.error('Something went wrong! Please try again.', 'Error');
          console.error('Error: ', error);
        },
      });
    }
  }

  private loadCompanyData(): void {
    this.employeeService.getCompanyData$().subscribe({
      next: (data) => {
        this.companyName = data.companyName;
        this.userEmail = data.email;

        if (data.companyName == null || data.companyName === '') {
          this.companyName = this.employeeService.getCompanyName();
        }

        if (data.email) {
          this.signupForm.patchValue({
            email: data.email,
          });
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load company data:', error);
        this.isLoading = false;
      },
    });
  }
}
