import { inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  AddEmployeeInfo,
  AddEmployeeResponse,
  CompanyData,
} from '../../../../types/user';

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
import { finalize, map } from 'rxjs/operators';
import { ApiResponse } from '../../../../types/user.registration.types';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private http = inject(HttpClient);

  // Cache for the last successful employee addition
  private lastEmployeeData$: Observable<
    HttpResponse<AddEmployeeResponse>
  > | null = null;
  private lastEmployeeInfo: AddEmployeeInfo | null = null;

  private allEmployeesData$: Observable<HttpResponse<Employee[]>> | null = null;
  private allEmployeesList: Employee[] = [];

  private loadingSubject = new BehaviorSubject<boolean>(false);
  private allEmployeesLoadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  private employeeApiUrl = `${environment.employeeApiUrl}`;

  private verifiedEmailData: { email: string; token: string } | null = null;

  private readonly STORAGE_KEYS = {
    COMPANY_DATA: 'employee_company_data',
    VERIFIED_EMAIL: 'employee_verified_email',
    LAST_EMPLOYEE: 'employee_last_employee',
    ALL_EMPLOYEES: 'employee_all_employees_list',
  } as const;

  companyName: string | null | undefined = null;

  private saveCompanyDataToStorage(data: CompanyData): void {
    try {
      sessionStorage.setItem(
        this.STORAGE_KEYS.COMPANY_DATA,
        JSON.stringify(data),
      );
    } catch (error) {
      console.error('Failed to save company data to storage:', error);
    }
  }


  private loadCompanyDataFromStorage(): CompanyData | null {
    try {
      const stored = sessionStorage.getItem(this.STORAGE_KEYS.COMPANY_DATA);
      if (stored) {
        const data = JSON.parse(stored) as CompanyData;
        return data;
      }
    } catch (error) {
      console.error('Failed to load company data from storage:', error);
    }
    return null;
  }


  private saveVerifiedEmailToStorage(): void {
    if (this.verifiedEmailData) {
      try {
        sessionStorage.setItem(
          this.STORAGE_KEYS.VERIFIED_EMAIL,
          JSON.stringify(this.verifiedEmailData),
        );
      } catch (error) {
        console.error('Failed to save verified email to storage:', error);
      }
    }
  }


  private loadVerifiedEmailFromStorage(): void {
    try {
      const stored = sessionStorage.getItem(this.STORAGE_KEYS.VERIFIED_EMAIL);
      if (stored) {
        this.verifiedEmailData = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load verified email from storage:', error);
    }
  }

  /**
   * Save last employee info to sessionStorage
   */
  private saveLastEmployeeToStorage(): void {
    if (this.lastEmployeeInfo) {
      try {
        sessionStorage.setItem(
          this.STORAGE_KEYS.LAST_EMPLOYEE,
          JSON.stringify(this.lastEmployeeInfo),
        );
        console.log('Last employee info saved to sessionStorage');
      } catch (error) {
        console.error('Failed to save last employee to storage:', error);
      }
    }
  }

  /**
   * Load last employee info from sessionStorage
   */
  private loadLastEmployeeFromStorage(): void {
    try {
      const stored = sessionStorage.getItem(this.STORAGE_KEYS.LAST_EMPLOYEE);
      if (stored) {
        this.lastEmployeeInfo = JSON.parse(stored);
        console.log('Last employee info loaded from sessionStorage');
      }
    } catch (error) {
      console.error('Failed to load last employee from storage:', error);
    }
  }

  /**
   * Save all employees list to sessionStorage
   */
  private saveAllEmployeesToStorage(): void {
    if (this.allEmployeesList.length > 0) {
      try {
        sessionStorage.setItem(
          this.STORAGE_KEYS.ALL_EMPLOYEES,
          JSON.stringify(this.allEmployeesList),
        );
        console.log(
          `Saved ${this.allEmployeesList.length} employees to sessionStorage`,
        );
      } catch (error) {
        console.error('Failed to save employees list to storage:', error);
      }
    }
  }

  /**
   * Load all employees list from sessionStorage
   */
  private loadAllEmployeesFromStorage(): void {
    try {
      const stored = sessionStorage.getItem(this.STORAGE_KEYS.ALL_EMPLOYEES);
      if (stored) {
        this.allEmployeesList = JSON.parse(stored);
        console.log(
          `Loaded ${this.allEmployeesList.length} employees from sessionStorage`,
        );
      }
    } catch (error) {
      console.error('Failed to load employees list from storage:', error);
    }
  }

  /**
   * Initialize service by loading data from storage
   */
  initializeFromStorage(): void {
    // Load verified email data
    this.loadVerifiedEmailFromStorage();

    // Load last employee info
    this.loadLastEmployeeFromStorage();

    // Load all employees list
    this.loadAllEmployeesFromStorage();
  }

  /**
   * Add employee - with smart caching based on employee data
   */
  addEmployee(
    addEmployeeData: AddEmployeeInfo,
  ): Observable<HttpResponse<AddEmployeeResponse>> {

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

          // Save to storage
          this.saveLastEmployeeToStorage();

          // Update and save company data
          const companyData = this.getCompanyData();
          companyData.companyName = addEmployeeData.companyName;
          this.saveCompanyDataToStorage(companyData);

          console.log(
            'Employee added successfully, cached and persisted for reuse',
          );

          // Add to local employees list if we have one cached
          if (response.body && this.allEmployeesList.length > 0) {
            this.allEmployeesList.unshift(response.body);
            this.saveAllEmployeesToStorage();
            console.log('Added new employee to cached list and persisted');
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
  getAllEmployees(
    forceRefresh: boolean = false,
  ): Observable<HttpResponse<Employee[]>> {
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
      .get<Employee[]>(`${this.employeeApiUrl}/get-all-employee`, {
        withCredentials: true,
        observe: 'response',
      })
      .pipe(
        retry(2),
        tap((response) => {
          // Store employees list for local updates
          this.allEmployeesList = response.body ? [...response.body] : [];

          // Save to storage
          this.saveAllEmployeesToStorage();

          console.log(
            `Cached and persisted ${this.allEmployeesList.length} employees`,
          );
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


  getCachedEmployeesCount(): number {
    return this.allEmployeesList.length;
  }

  /**
   * Search employees in cached data
   */
  searchCachedEmployees(searchTerm: string): Employee[] {
    if (!this.allEmployeesList.length) return [];

    const term = searchTerm.toLowerCase();
    return this.allEmployeesList.filter(
      (employee) =>
        employee.fullName.toLowerCase().includes(term) ||
        employee.email.toLowerCase().includes(term) ||
        employee.department.toLowerCase().includes(term) ||
        employee.occupation.toLowerCase().includes(term),
    );
  }

  /**
   * Get cached employee data - returns null if no cache exists
   */
  getCachedEmployeeData(): Observable<HttpResponse<AddEmployeeResponse> | null> {
    if (this.lastEmployeeData$) {
      return this.lastEmployeeData$.pipe(catchError(() => of(null)));
    }
    return of(null);
  }


  hasCacheForEmployee(employeeData: AddEmployeeInfo): boolean {
    return (
      this.lastEmployeeData$ !== null && this.isSameEmployeeData(employeeData)
    );
  }

  clearEmployeeCache(): void {
    this.lastEmployeeData$ = null;
    this.lastEmployeeInfo = null;

    try {
      sessionStorage.removeItem(this.STORAGE_KEYS.LAST_EMPLOYEE);
    } catch (error) {
      console.error('Failed to clear last employee from storage:', error);
    }

    console.log('Single employee cache and storage cleared');
  }


  clearAllEmployeesCache(): void {
    this.allEmployeesData$ = null;
    this.allEmployeesList = [];

    try {
      sessionStorage.removeItem(this.STORAGE_KEYS.ALL_EMPLOYEES);
    } catch (error) {
      console.error('Failed to clear employees list from storage:', error);
    }

    console.log('All employees cache and storage cleared');
  }

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

  /*Verify employee invite token*/
  confirmEmployeeInviteEmail(token: string): Observable<ApiResponse> {
    return this.http
      .get<ApiResponse>(
        `${this.employeeApiUrl}/confirm-invite-token?${token}`,
        {},
      )
      .pipe(
        tap((response) => {
          // Cache the verified email and token on successful verification
          if (response.success && response.value) {
            this.verifiedEmailData = {
              email: response.value,
              token: token,
            };

            // Save to storage
            this.saveVerifiedEmailToStorage();

            // ser company comapny name
            this.companyName = response.code ?? null;

            // Update and save company data
            const companyData = this.getCompanyData();
            companyData.email = response.value;
            companyData.companyName = response.code;
            this.saveCompanyDataToStorage(companyData);

            console.log(
              'Email verified, cached and persisted:',
              response.value,
            );
          }
        }),
        catchError((error) => {
          console.error('Email verification failed:', error);
          this.verifiedEmailData = null;
          return throwError(() => error);
        }),
      );
  }

  getCompanyData(): CompanyData {
    const result: CompanyData = {
      companyName: null,
      email: null,
    };

    // First try to get from verified email data (from token verification)
    if (this.verifiedEmailData?.email) {
      result.email = this.verifiedEmailData.email;
    }

    if (this.lastEmployeeInfo?.companyName) {
      result.companyName = this.lastEmployeeInfo.companyName;
    }

    if (!result.companyName && this.allEmployeesList.length > 0) {
      const firstEmployee = this.allEmployeesList[0];
      if (firstEmployee.companyName) {
        result.companyName = firstEmployee.companyName;
      }
    }

    if (!result.companyName || !result.email) {
      const storedData = this.loadCompanyDataFromStorage();
      if (storedData) {
        result.companyName = result.companyName || storedData.companyName;
        result.email = result.email || storedData.email;
      }
    }

    // Save to storage if we have complete data
    if (result.companyName || result.email) {
      this.saveCompanyDataToStorage(result);
    }

    return result;
  }

  getCompanyData$(): Observable<CompanyData> {
    const cachedData = this.getCompanyData();

    // If we have both values from cache/storage, return immediately
    if (cachedData.companyName && cachedData.email) {
      return of(cachedData);
    }

    // If missing company name, try to fetch all employees to get it
    if (!cachedData.companyName) {
      return this.getAllEmployees().pipe(
        map((response) => {
          const result = { ...cachedData };
          if (response.body && response.body.length > 0) {
            result.companyName = response.body[0].companyName || null;
          }

          if (result.companyName || result.email) {
            this.saveCompanyDataToStorage(result);
          }

          return result;
        }),
        catchError(() => of(cachedData)),
      );
    }
    return of(cachedData);
  }

  getCompanyName(): string | null | undefined {
    return this.companyName;
  }
}
