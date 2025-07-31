import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserProfile, OnboardingData } from '../../../../types/user';
import {
  BehaviorSubject,
  catchError,
  finalize,
  firstValueFrom,
  Observable,
  of,
  retry,
  shareReplay,
  tap,
} from 'rxjs';
import { OnboardingResponse } from '../../../../types/types.dashboard';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class OnBoardingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.onBoardingApiUrl}`;

  //cache variable
  private onboardingCache$?: Observable<OnboardingResponse>;
  // Track loading state
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  // Track cache timestamp for potential invalidation
  private cacheTimestamp?: number;
  private readonly CACHE_DURATION = 5 * 60 * 1000;

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
        // console.log('OnBoarding Response: ', response);
        return response;
      }
      throw new Error('Invalid response from server');
    } catch (error: any) {
      throw new Error(error.error?.message || 'Failed to complete onboarding');
    }
  }

  /**
   * Fetch onboarding data with enhanced caching
   */
  getOnboarding(forceRefresh = false): Observable<OnboardingResponse> {
    // Check if cache should be invalidated due to age
    if (this.shouldInvalidateCache() || forceRefresh) {
      this.clearOnboardingCache();
    }

    if (!this.onboardingCache$) {
      this.loadingSubject.next(true);

      this.onboardingCache$ = this.http
        .get<OnboardingResponse>( `${this.apiUrl}/onboarding`, {
          withCredentials: true,
        })
        .pipe(
          // Retry failed requests
          retry(2),

          // Track when data is successfully cached
          tap(() => {
            this.cacheTimestamp = Date.now();
          }),

          // Share replay with refCount for automatic cleanup
          shareReplay({ bufferSize: 1, refCount: true }),

          // Handle errors gracefully
          catchError((error: HttpErrorResponse) => {
            console.error('Onboarding fetch failed:', error);
            this.clearOnboardingCache();
            throw error;
          }),

          finalize(() => {
            this.loadingSubject.next(false);
          }),
        );
    }

    return this.onboardingCache$;
  }

  /**
   * Update onboarding data and refresh cache
   */
  updateOnboarding(
    data: Partial<OnboardingResponse>,
  ): Observable<OnboardingResponse> {
    this.loadingSubject.next(true);

    return this.http
      .put<OnboardingResponse>(this.apiUrl, data, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          // Update cache with new data
          this.onboardingCache$ = of(response).pipe(shareReplay(1));
          this.cacheTimestamp = Date.now();
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Onboarding update failed:', error);
          throw error;
        }),
        finalize(() => {
          this.loadingSubject.next(false);
        }),
      );
  }

  /**
   * Clear the cache manually
   */
  clearOnboardingCache(): void {
    this.onboardingCache$ = undefined;
    this.cacheTimestamp = undefined;
  }

  /**
   * Check if cache should be invalidated based on age
   */
  private shouldInvalidateCache(): boolean {
    if (!this.cacheTimestamp) return false;
    return Date.now() - this.cacheTimestamp > this.CACHE_DURATION;
  }

  /**
   * Check if data is currently cached
   */
  isCached(): boolean {
    return !!this.onboardingCache$ && !this.shouldInvalidateCache();
  }

  /**
   * Get cache age in milliseconds
   */
  getCacheAge(): number | null {
    return this.cacheTimestamp ? Date.now() - this.cacheTimestamp : null;
  }

  /**
   * Preload onboarding data (useful for app initialization)
   */
  preloadOnboarding(): void {
    if (!this.isCached()) {
      this.getOnboarding().subscribe({
        next: () => console.log('Onboarding data preloaded'),
        error: (error) => console.warn('Failed to preload onboarding:', error),
      });
    }
  }
}
