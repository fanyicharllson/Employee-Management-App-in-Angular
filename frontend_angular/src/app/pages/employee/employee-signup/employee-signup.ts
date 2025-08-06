import {Component, inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {EmployeeService} from "../../../services/employee/employee.service";

@Component({
  selector: 'employee-signup',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: 'employee-signup.html'
})

export class EmployeeSignupComponent implements OnInit{
  signupForm: FormGroup;
  showPassword = false;
  isSubmitting = false;
  companyName: string | null | undefined = null;
  userEmail: string | null = null;
  isLoading = true;
  private employeeService = inject(EmployeeService);

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).*$/)
      ]]
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

      // Simulate API call
      console.log('Form submitted:', this.signupForm.value);

      // Replace this with your actual API call
      setTimeout(() => {
        this.isSubmitting = false;
        // Handle success/error here
        alert('Account setup completed successfully!');
      }, 2000);
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
            email: data.email
          });

        }

        this.isLoading = false;

      },
      error: (error) => {
        console.error('Failed to load company data:', error);
        this.isLoading = false;
      }
    });
  }
}
