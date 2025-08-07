import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ApiResponse, EmployeeRegistrationPayload} from '../../../../types/user.registration.types';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root',
})

export class EmployeeRegisterService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.employeeRegisterApiUrl}`;

  // Register employee
  registerUser(payload: EmployeeRegistrationPayload): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/register`,
      payload,
    );
  }

}
