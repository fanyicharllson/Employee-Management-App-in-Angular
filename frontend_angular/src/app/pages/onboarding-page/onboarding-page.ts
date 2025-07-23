import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserInfoService } from '../../reuse.user.info/user-info.service';
import { OnBoardingService } from '../../services/onboarding.service/on-boarding.service';
import { UserloginService } from '../../services/user.service/user.login.service';

@Component({
  selector: 'app-onboarding-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './onboarding-page.html',
  styleUrl: './onboarding-page.css',
})
export class OnboardingComponent implements OnInit {
  onboardingForm!: FormGroup;
  isLoading = false;
  onboardingError = '';
  currentStep = 1;
  totalSteps = 3;

  // Company info (passed from login or user service)
  companyName = '';
  companySize = '';
  currentRole = '';

  // Add Math to template
  Math = Math;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userInfoService: UserInfoService,
    private onboardingService: OnBoardingService,
    private userloginService: UserloginService, // Add this service
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    // Additional check - if user has already completed onboarding, redirect
    this.checkOnboardingStatus();

    this.loadCompanyInfo();

    // Set value directly into form
    this.onboardingForm
      .get('teamSize')
      ?.setValue(this.userInfoService.getCompanySize());
  }

  private checkOnboardingStatus(): void {
    const currentUser = this.userloginService.getCurrentUser();

    // If user is not logged in or has completed onboarding, redirect
    if (!currentUser || !currentUser.onboarding) {
      console.log(
        'User should not be on onboarding page, redirecting to dashboard',
      );
      this.router.navigate(['/dashboard']);
      return;
    }
  }

  private initializeForm(): void {
    const userRole = this.userInfoService.getRole();

    this.onboardingForm = this.fb.group({
      //  Role & Department
      jobTitle: [userRole, [Validators.required]],
      department: ['', [Validators.required]],
      roleType: [userRole, [Validators.required]],

      //  Team & Hiring Info
      teamSize: [this.companySize], // Required only if HR
      totalHires: [0, [Validators.required, Validators.min(0)]],
      salaryRange: [''],
      experience: ['', [Validators.required]],

      // Preferences
      goals: this.fb.array([]),
      notifications: [true],
    });

    // Add conditional validator for teamSize
    this.onboardingForm.get('roleType')?.valueChanges.subscribe((value) => {
      const teamSizeControl = this.onboardingForm.get('teamSize');
      if (value === 'HR') {
        teamSizeControl?.setValidators([Validators.required]);
      } else {
        teamSizeControl?.clearValidators();
        teamSizeControl?.setValue('');
      }
      teamSizeControl?.updateValueAndValidity();
    });
  }

  private loadCompanyInfo(): void {
    // Load company info from your UserInfoService
    this.companyName = this.userInfoService.getCompanyName();
    this.companySize = this.userInfoService.getCompanySize();

    this.currentRole = this.userInfoService.getRole();

    // Or subscribe to userInfo$ if you want real-time updates
    this.userInfoService.userInfo$.subscribe((userInfo) => {
      this.companyName = userInfo.companyName;
      this.companySize = userInfo.companySize;
    });
  }

  nextStep(): void {
    if (this.isCurrentStepValid() && this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  isCurrentStepValid(): boolean {
    switch (this.currentStep) {
      case 1:
        return !!(
          this.onboardingForm.get('jobTitle')?.valid &&
          this.onboardingForm.get('department')?.valid &&
          this.onboardingForm.get('roleType')?.valid
        );
      case 2:
        const isManagerValid =
          this.onboardingForm.get('roleType')?.value !== 'HR' ||
          this.onboardingForm.get('teamSize')?.valid;
        return !!(
          isManagerValid &&
          this.onboardingForm.get('totalHires')?.valid &&
          this.onboardingForm.get('experience')?.valid
        );
      case 3:
        return true; // Step 3 has no required fields
      default:
        return false;
    }
  }

  onGoalChange(event: any): void {
    const goalsArray = this.onboardingForm.get('goals') as FormArray;
    const value = event.target.value;

    if (event.target.checked) {
      goalsArray.push(this.fb.control(value));
    } else {
      const index = goalsArray.controls.findIndex((x) => x.value === value);
      if (index !== -1) {
        goalsArray.removeAt(index);
      }
    }
  }

  async onSubmit(): Promise<void> {
    if (this.onboardingForm.valid) {
      this.isLoading = true;
      this.onboardingError = '';

      try {
        const formData = this.prepareFormData();

        await this.onboardingService.completeOnboarding(formData);

        // Update user info locally after successful onboarding
        const currentUser = this.userloginService.getCurrentUser();
        if (currentUser) {
          currentUser.onboarding = false;
          this.userloginService.setCurrentUser(currentUser);
        }

        // Navigate to dashboard
        this.router.navigate(['/dashboard']);
      } catch (error: any) {
        this.onboardingError =
          error.message || 'An error occurred during setup. Please try again.';
        console.error('Onboarding error:', error);
      } finally {
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private prepareFormData(): any {
    const formValue = this.onboardingForm.value;

    return {
      jobTitle: formValue.jobTitle,
      department: formValue.department,
      roleType: formValue.roleType,
      teamSize: formValue.roleType === 'HR' ? formValue.teamSize : null,
      totalHires: formValue.totalHires,
      salaryRange: formValue.salaryRange,
      experience: formValue.experience,
      goals: formValue.goals || [],
      notifications: formValue.notifications,
      onboarding: false, //reset onboarding to false so user doesn't see onboarding after completing it
    };
  }

  private markFormGroupTouched(): void {
    Object.keys(this.onboardingForm.controls).forEach((key) => {
      const control = this.onboardingForm.get(key);
      control?.markAsTouched();

      if (control instanceof FormArray) {
        control.controls.forEach((c) => c.markAsTouched());
      }
    });
  }

  navigateBack(): void {
    // Instead of going to login, go to dashboard if user is authenticated
    const currentUser = this.userloginService.getCurrentUser();
    if (currentUser) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  // Utility method to check if a goal is selected
  isGoalSelected(goal: string): boolean {
    const goalsArray = this.onboardingForm.get('goals') as FormArray;
    return goalsArray.controls.some((control) => control.value === goal);
  }
}
