import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, of, throwError } from 'rxjs';
import { User, LoginResponse } from '../../../../types/user.login.types';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserloginService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private http = inject(HttpClient);
  private apiBaseUrl = `${environment.endapiBaseUrl}`;
  private isSessionVerified = false;
  private sessionVerificationPromise: Promise<boolean> | null = null;

  constructor() {
    this.restoreUserFromStorage();
  }

  private restoreUserFromStorage(): void {
    const userJson = localStorage.getItem('currentUser');
    try {
      if (userJson && userJson !== 'undefined') {
        const user: User = JSON.parse(userJson);
        this.currentUserSubject.next(user);
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('currentUser');
    }
  }

  // Public method to verify session - call this when needed
  verifySession(): Promise<boolean> {
    // Return existing promise if verification is already in progress
    if (this.sessionVerificationPromise) {
      return this.sessionVerificationPromise;
    }

    // If already verified and user exists, return true
    if (this.isSessionVerified && this.getCurrentUser()) {
      return Promise.resolve(true);
    }

    this.sessionVerificationPromise = new Promise((resolve) => {
      this.http
        .get<{ user: User }>(`${this.apiBaseUrl}/me`, { withCredentials: true })
        .pipe(
          catchError((error) => {
            // Handle different error cases
            if (error.status === 401 || error.status === 403) {
              // Session expired or invalid
              this.handleSessionExpired();
              return of(null);
            } else {
              // Network error or server error - don't clear session
              console.warn('Session verification failed due to network/server error:', error);
              return of(null);
            }
          })
        )
        .subscribe({
          next: (response) => {
            if (response?.user) {
              this.setCurrentUser(response.user);
              this.isSessionVerified = true;
              resolve(true);
            } else {
              this.isSessionVerified = true;
              resolve(false);
            }
            this.sessionVerificationPromise = null;
          },
          error: () => {
            this.isSessionVerified = true;
            resolve(false);
            this.sessionVerificationPromise = null;
          }
        });
    });

    return this.sessionVerificationPromise;
  }

  private handleSessionExpired(): void {
    // Clear user data but don't redirect here
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    this.isSessionVerified = true;
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `${this.apiBaseUrl}/login`,
        { email, password },
        { withCredentials: true }
      )
      .pipe(
        tap((response) => {
          if (response.success) {
            this.setCurrentUser(response.user);
            this.isSessionVerified = true;
          }
        })
      );
  }

  setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    this.isSessionVerified = false;
    this.sessionVerificationPromise = null;
    
    this.http
      .post(`${this.apiBaseUrl}/logout`, {}, { withCredentials: true })
      .subscribe({
        error: (error) => {
          console.warn('Logout request failed:', error);
          // Continue with logout even if server request fails
        }
      });
  }

  // Check if user appears to be logged in (has localStorage data)
  hasStoredUser(): boolean {
    return localStorage.getItem('currentUser') !== null;
  }

  // Check if session has been verified
  isSessionValid(): boolean {
    return this.isSessionVerified && this.getCurrentUser() !== null;
  }
}