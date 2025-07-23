import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserProfile, OnboardingData } from '../../../../types/user';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OnBoardingService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/user';

  /**
   * Complete user onboarding
   */
  async completeOnboarding(
    onboardingData: OnboardingData,
  ): Promise<UserProfile> {
    try {
      // console.log("OnBoarding data", onboardingData)
      const response = await firstValueFrom(
        this.http.post<UserProfile>(
          `${this.apiUrl}/onboarding`,
          onboardingData,
          { withCredentials: true },
        ),
      );

      if (response) {
        // console.log("OnBoarding Response: ", response)
        return response;
      }
      throw new Error('Invalid response from server');
    } catch (error: any) {
      throw new Error(error.error?.message || 'Failed to complete onboarding');
    }
  }
}
