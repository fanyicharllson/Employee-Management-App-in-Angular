import { inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AddEmployeeInfo, AddEmployeeResponse } from '../../../../types/user';

// Employee type is the same as AddEmployeeResponse
type Employee = AddEmployeeResponse;
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
  retry,
  shareReplay,
  throwError,
  tap,
} from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private http = inject(HttpClient);

  // Cache for the last successful employee addition
  private lastEmployeeData$: Observable<HttpResponse<AddEmployeeResponse>> | null = null;
  private lastEmployeeInfo: AddEmployeeInfo | null = null;

  // Cache for all employees list
  private allEmployeesData$: Observable<HttpResponse<Employee[]>> | null = null;
  private allEmployeesList: Employee[] = [];

  // Loading states
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private allEmployeesLoadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  public allEmployeesLoading$ = this.allEmployeesLoadingSubject.asObservable();

  // API URL
  private employeeApiUrl = `${environment.employeeApiUrl}`;

  /**
   * Add employee - with smart caching based on employee data
   */
  addEmployee(addEmployeeData: AddEmployeeInfo): Observable<HttpResponse<AddEmployeeResponse>> {
    console.log('Add Employee Data: ', addEmployeeData);

    // Check if we're trying to add the same employee (cache hit)
    if (this.lastEmployeeData$ && this.isSameEmployeeData(addEmployeeData)) {
      console.log('Returning cached employee data for same employee');
      return this.lastEmployeeData$;
    }

    // Clear previous cache for different employee
    this.clearEmployeeCache();
    this.loadingSubject.next(true);

    // Create new request
    this.lastEmployeeData$ = this.http
      .post<AddEmployeeResponse>(
        `${this.employeeApiUrl}/add-employee`,
        addEmployeeData,
        {
          withCredentials: true,
          observe: 'response',
        },
      )
      .pipe(
        retry(2),
        tap((response) => {
          // Store the employee info on successful response
          this.lastEmployeeInfo = { ...addEmployeeData };
          console.log('Employee added successfully, cached for reuse');

          // Add to local employees list if we have one cached
          if (response.body && this.allEmployeesList.length > 0) {
            // The response.body is already of type AddEmployeeResponse
            // which matches our Employee type
            this.allEmployeesList.unshift(response.body);
            console.log('Added new employee to cached list');
          }
        }),
        shareReplay({ bufferSize: 1, refCount: true }),
        catchError((error: HttpErrorResponse) => {
          console.error('Adding employee failed: ', error);
          this.clearEmployeeCache();
          return throwError(() => error);
        }),
        finalize(() => {
          this.loadingSubject.next(false);
        }),
      );

    return this.lastEmployeeData$;
  }

  /**
   * Get all employees added by the current HR
   */
  getAllEmployees(forceRefresh: boolean = false): Observable<HttpResponse<Employee[]>> {
    console.log('Getting all employees, forceRefresh:', forceRefresh);

    // Return cached data if available and not forcing refresh
    if (this.allEmployeesData$ && !forceRefresh) {
      console.log('Returning cached employees list');
      return this.allEmployeesData$;
    }

    // Clear cache if forcing refresh
    if (forceRefresh) {
      this.clearAllEmployeesCache();
    }

    this.allEmployeesLoadingSubject.next(true);

    // Create new request
    this.allEmployeesData$ = this.http
      .get<Employee[]>(
        `${this.employeeApiUrl}/get-all-employee`,
        {
          withCredentials: true,
          observe: 'response',
        },
      )
      .pipe(
        retry(2),
        tap((response) => {
          // Store employees list for local updates
          this.allEmployeesList = response.body ? [...response.body] : [];
          // console.log(`Cached ${this.allEmployeesList.length} employees`);
        }),
        shareReplay({ bufferSize: 1, refCount: true }),
        catchError((error: HttpErrorResponse) => {
          console.error('Getting all employees failed: ', error);
          this.clearAllEmployeesCache();
          return throwError(() => error);
        }),
        finalize(() => {
          this.allEmployeesLoadingSubject.next(false);
        }),
      );

    return this.allEmployeesData$;
  }

  /**
   * Get cached all employees data
   */
  getCachedAllEmployees(): Observable<HttpResponse<Employee[]> | null> {
    if (this.allEmployeesData$) {
      return this.allEmployeesData$.pipe(
        catchError(() => of(null))
      );
    }
    return of(null);
  }

  /**
   * Get employees count from cache
   */
  getCachedEmployeesCount(): number {
    return this.allEmployeesList.length;
  }

  /**
   * Search employees in cached data
   */
  searchCachedEmployees(searchTerm: string): Employee[] {
    if (!this.allEmployeesList.length) return [];

    const term = searchTerm.toLowerCase();
    return this.allEmployeesList.filter(employee =>
      employee.fullName.toLowerCase().includes(term) ||
      employee.email.toLowerCase().includes(term) ||
      employee.department.toLowerCase().includes(term) ||
      employee.occupation.toLowerCase().includes(term)
    );
  }

  /**
   * Remove employee from cache (useful after deletion)
   */
  removeEmployeeFromCache(employeeId: string): void {
    this.allEmployeesList = this.allEmployeesList.filter(emp => emp.id !== employeeId);
    console.log(`Removed employee ${employeeId} from cache`);
  }

  /**
   * Update employee in cache (useful after updates)
   */
  updateEmployeeInCache(employeeId: string, updatedData: Partial<Employee>): void {
    const index = this.allEmployeesList.findIndex(emp => emp.id === employeeId);
    if (index !== -1) {
      this.allEmployeesList[index] = { ...this.allEmployeesList[index], ...updatedData };
      console.log(`Updated employee ${employeeId} in cache`);
    }
  }

  /**
   * Get cached employee data - returns null if no cache exists
   */
  getCachedEmployeeData(): Observable<HttpResponse<AddEmployeeResponse> | null> {
    if (this.lastEmployeeData$) {
      return this.lastEmployeeData$.pipe(
        catchError(() => of(null))
      );
    }
    return of(null);
  }

  /**
   * Get the last employee info that was successfully added
   */
  getLastEmployeeInfo(): AddEmployeeInfo | null {
    return this.lastEmployeeInfo ? { ...this.lastEmployeeInfo } : null;
  }

  /**
   * Check if cache exists for current employee data
   */
  hasCacheForEmployee(employeeData: AddEmployeeInfo): boolean {
    return (
      this.lastEmployeeData$ !== null && this.isSameEmployeeData(employeeData)
    );
  }

  /**
   * Check if all employees cache exists
   */
  hasAllEmployeesCache(): boolean {
    return this.allEmployeesData$ !== null;
  }

  /**
   * Clear the single employee cache
   */
  clearEmployeeCache(): void {
    this.lastEmployeeData$ = null;
    this.lastEmployeeInfo = null;
    console.log('Single employee cache cleared');
  }

  /**
   * Clear all employees cache
   */
  clearAllEmployeesCache(): void {
    this.allEmployeesData$ = null;
    this.allEmployeesList = [];
    console.log('All employees cache cleared');
  }

  /**
   * Clear all caches
   */
  clearAllCaches(): void {
    this.clearEmployeeCache();
    this.clearAllEmployeesCache();
    console.log('All caches cleared');
  }

  /**
   * Force refresh - clears cache and makes new request
   */
  refreshEmployee(addEmployeeData: AddEmployeeInfo): Observable<HttpResponse<AddEmployeeResponse>> {
    this.clearEmployeeCache();
    return this.addEmployee(addEmployeeData);
  }

  /**
   * Force refresh all employees
   */
  refreshAllEmployees(): Observable<HttpResponse<Employee[]>> {
    return this.getAllEmployees(true);
  }

  /**
   * Compare two employee data objects to determine if they're the same
   */
  private isSameEmployeeData(newData: AddEmployeeInfo): boolean {
    if (!this.lastEmployeeInfo) return false;

    return (
      this.lastEmployeeInfo.email === newData.email &&
      this.lastEmployeeInfo.fullName === newData.fullName &&
      this.lastEmployeeInfo.companyName === newData.companyName &&
      this.lastEmployeeInfo.department === newData.department &&
      this.lastEmployeeInfo.occupation === newData.occupation &&
      this.lastEmployeeInfo.role === newData.role
    );
  }
}
