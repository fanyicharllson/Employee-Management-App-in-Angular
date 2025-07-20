import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  ApiResponse,
  RegistrationPayload,
} from '../../../../types/user.registration.types';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}`;

  // Register user
  registerUser(payload: RegistrationPayload): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/user-registration`,
      payload,
    );
  }

  // Resend token
  resendToken(email: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/user-registration/resend-token?email=${encodeURIComponent(email)}`,
      {},
    );
  }
}
