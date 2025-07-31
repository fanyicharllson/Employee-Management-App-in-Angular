import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AddEmployeeInfo, AddEmployeeResponse } from '../../../../types/user';
import {
  BehaviorSubject,
  catchError,
  Observable, of,
  retry,
  shareReplay,
  throwError
} from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private http = inject(HttpClient);
  private employeeData$: Observable<AddEmployeeResponse> | undefined;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  private employeeApiUrl = `${environment.employeeApiUrl}`;

  // Add employee service
  addEmployee(addEmployeeData: AddEmployeeInfo): Observable<AddEmployeeResponse> {
    console.log('Add Employee Data: ', addEmployeeData);
    if (!this.employeeData$) {
      this.loadingSubject.next(true);

      this.employeeData$ = this.http
        .post<AddEmployeeResponse>(
          `${this.employeeApiUrl}/add-employee`,
          addEmployeeData,
          { withCredentials: true },
        )
        .pipe(
          retry(2),
          shareReplay({ bufferSize: 1, refCount: true }),
          catchError((error: HttpErrorResponse) => {
            console.error('Adding employee failed: ', error);
            this.clearEmployeeData();
            return throwError(() => error);
          }),
          finalize(() => {
            this.loadingSubject.next(false);
          }),
        );
    }

    return this.employeeData$;
  }

  // Clear cache data
  clearEmployeeData(): void {
    this.employeeData$ = undefined;
  }
  public getCachedEmployeeData(): Observable<AddEmployeeInfo | null> {
    return this.employeeData$ ?? of(null);
  }

}
