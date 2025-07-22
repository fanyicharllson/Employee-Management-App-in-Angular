import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AuthMessage {
  type: 'error' | 'warning' | 'info';
  message: string;
  reason?: string;
  timestamp?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class AuthMessageService {
  private messageSubject = new BehaviorSubject<AuthMessage | null>(null);
  public message$ = this.messageSubject.asObservable();

  setMessage(message: AuthMessage): void {
    this.messageSubject.next({
      ...message,
      timestamp: new Date(),
    });
  }

  clearMessage(): void {
    this.messageSubject.next(null);
  }

  // Convenience methods
  setUnauthorizedMessage(): void {
    this.setMessage({
      type: 'error',
      message: 'Please log in to access this page.',
      reason: 'unauthorized',
    });
  }

  setSessionExpiredMessage(): void {
    this.setMessage({
      type: 'warning',
      message: 'Your session has expired. Please log in again.',
      reason: 'session_expired',
    });
  }

  setLoginRequiredMessage(): void {
    this.setMessage({
      type: 'info',
      message: 'Authentication required. Please log in to continue.',
      reason: 'login_required',
    });
  }
  setLogoutMessage(): void {
    this.setMessage({
      type: 'info',
      message: 'You have been logged out. You can log in to continue.',
      reason: 'logout',
    });
  }
}
