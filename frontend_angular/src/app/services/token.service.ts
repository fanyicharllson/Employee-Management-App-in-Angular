import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse, TokenStatus } from '../../../types/user.registration.types';


@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly API_BASE_URL = `${environment.employeeApiUrl}`
  private verificationToken: string | null = null;

  private tokenStatusSubject = new BehaviorSubject<TokenStatus | null>(null);
  public tokenStatus$ = this.tokenStatusSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeFromStorage();
  }

  private initializeFromStorage(): void {
    // Check localStorage first (persistent across browser sessions)
    const storedToken = localStorage.getItem('employeeInviteToken') ||
      sessionStorage.getItem('verificationToken');
    const storedStatus = localStorage.getItem('employeeTokenStatus') ||
      sessionStorage.getItem('tokenStatus');

    if (storedToken) {
      this.verificationToken = storedToken;
      // console.log('Token recovered from storage:', storedToken.substring(0, 8) + '...');
    }

    if (storedStatus) {
      try {
        const parsedStatus: TokenStatus = JSON.parse(storedStatus);
        if (this.isCacheValid(parsedStatus.lastChecked)) {
          this.tokenStatusSubject.next(parsedStatus);
          // console.log('Token status recovered from storage');
        } else {
          this.clearExpiredCache();
        }
      } catch (error) {
        // console.error('Error parsing stored token status:', error);
        this.clearExpiredCache();
      }
    }
  }

  // Store token persistently (survives browser close)
  setVerificationToken(token: string, persistent: boolean = true): void {
    this.verificationToken = token;

    if (persistent) {
      localStorage.setItem('employeeInviteToken', token);
      console.log('Token stored persistently');
    } else {
      sessionStorage.setItem('verificationToken', token);
    }
  }

  getVerificationToken(): string | null {
    if (this.verificationToken) {
      return this.verificationToken;
    }

    // Try localStorage first, then sessionStorage
    const token = localStorage.getItem('employeeInviteToken') ||
      sessionStorage.getItem('verificationToken');

    if (token) {
      this.verificationToken = token;
    }

    return token;
  }

  // Check token status for route guarding
  checkTokenStatusForGuard(): Observable<ApiResponse> {
    const token = this.getVerificationToken();

    if (!token) {
      throw new Error('No token available for verification');
    }

    const params = new HttpParams().set('token', token);

    return this.http.get<ApiResponse>(`${this.API_BASE_URL}/token-hasAccount-used`, { params })
      .pipe(
        tap(response => {
          if (response.success) {
            const isUsed = response.value === 'true';
            const hasAccount = response.code === 'true';

            this.updateTokenStatus({
              isUsed,
              hasAccount,
              isConfirmed: isUsed, // If used, it means confirmed
              lastChecked: Date.now()
            });
          }
        })
      );
  }

  private updateTokenStatus(status: Partial<TokenStatus>): void {
    const currentStatus = this.tokenStatusSubject.value || {} as TokenStatus;
    const newStatus = { ...currentStatus, ...status };

    this.tokenStatusSubject.next(newStatus);

    // Store persistently
    localStorage.setItem('employeeTokenStatus', JSON.stringify(newStatus));
  }

  private isCacheValid(lastChecked: number): boolean {
    const oneHour = 60 * 60 * 1000;
    return (Date.now() - lastChecked) < oneHour;
  }

  private clearExpiredCache(): void {
    localStorage.removeItem('employeeTokenStatus');
    sessionStorage.removeItem('tokenStatus');
  }

  // Check if user can access employee routes
  canAccessEmployeeRoutes(): boolean {
    const status = this.tokenStatusSubject.value;
    const hasToken = !!this.getVerificationToken();

    return hasToken && status?.isConfirmed === true && !status?.hasAccount;
  }

  // Clear all token data (logout/cleanup)
  clearTokenData(): void {
    this.verificationToken = null;
    localStorage.removeItem('employeeInviteToken');
    localStorage.removeItem('employeeTokenStatus');
    sessionStorage.removeItem('verificationToken');
    sessionStorage.removeItem('tokenStatus');
    this.tokenStatusSubject.next(null);
  }
}
