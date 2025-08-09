import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { EmployeeService } from '../../../services/employee/employee.service';
import { AddEmployeeResponse } from '../../../../../types/user';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DeleteEmployeeDialog } from '../../../material-angular/dialog/delete-employee-dialog/delete-employee-dialog';

// Employee type is the same as AddEmployeeResponse
type Employee = AddEmployeeResponse;

interface PaginationInfo {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

@Component({
  selector: 'app-manage-employee',
  imports: [FormsModule, NgClass, CommonModule],
  templateUrl: './manage-employee.html',
  styleUrl: './manage-employee.css',
})
export class ManageEmployee implements OnInit {
  searchTerm = '';
  currentSort = 'New Employees';
  selectedDepartment = '';
  selectedOccupation = '';
  showSortDropdown = false;
  showDepartmentDropdown = false;
  showOccupationDropdown = false;

  protected readonly Number = Number;
  private employeeService = inject(EmployeeService);
  private toastr = inject(ToastrService);

  readonly dialog = inject(MatDialog);

  // Real employee data from backend
  allEmployees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  paginatedEmployees: Employee[] = [];

  // Dynamic filter options (populated from actual data)
  departments: string[] = ['All'];
  occupations: string[] = ['All'];

  // Loading states
  isLoading = false;
  hasError = false;
  errorMessage = '';

  sortOptions = [
    'New Employees',
    'Name A-Z',
    'Name Z-A',
    'Department',
    'Occupation',
  ];

  pagination: PaginationInfo = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
  };

  ngOnInit() {
    this.loadEmployees();

    // Listen for refresh triggers
    this.employeeService.refreshEmployees$.subscribe(shouldRefresh => {
      if (shouldRefresh) {
        this.loadEmployees(true);
      }
    });
  }

  /**
   * Load employees from backend
   */
  loadEmployees(forceRefresh: boolean = false) {
    this.isLoading = true;
    this.hasError = false;

    this.employeeService.getAllEmployees(forceRefresh).subscribe({
      next: (response) => {
        if (response.body) {
          this.allEmployees = response.body;
          this.populateFilterOptions();
          this.filterEmployees();

          const message = forceRefresh
            ? 'Employees list refreshed successfully!'
            : 'Employees loaded successfully!';
          // this.toastr.success(message, 'Success');

          console.log(
            `Loaded ${this.allEmployees.length} employees from backend`,
          );
        } else {
          this.handleEmptyResponse();
        }
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.handleError(error);
        this.isLoading = false;
      },
    });
  }

  /**
   * Handle different HTTP error responses
   */
  private handleError(error: HttpErrorResponse) {
    this.hasError = true;
    console.error('Error loading employees:', error);

    switch (error.status) {
      case 401:
        this.errorMessage =
          'You are not authorized to view employees. Please login again.';
        this.toastr.error(this.errorMessage, 'Unauthorized');
        break;

      case 404:
        this.errorMessage = 'No employees found for your account.';
        this.toastr.info(this.errorMessage, 'No Employees');
        this.allEmployees = [];
        this.filteredEmployees = [];
        this.paginatedEmployees = [];
        this.updatePagination();
        break;

      case 400:
        const badRequestMessage =
          error.error?.message || 'Bad request. Please check your data.';
        this.errorMessage = badRequestMessage;
        this.toastr.error(badRequestMessage, 'Bad Request');
        break;

      case 500:
        this.errorMessage = 'Server error occurred. Please try again later.';
        this.toastr.error(this.errorMessage, 'Server Error');
        break;

      case 0:
        this.errorMessage =
          'Network error. Please check your internet connection.';
        this.toastr.error(this.errorMessage, 'Network Error');
        break;

      default:
        const defaultMessage =
          error.error?.message ||
          'An unexpected error occurred. Please try again.';
        this.errorMessage = defaultMessage;
        this.toastr.error(defaultMessage, 'Error');
        break;
    }
  }

  /**
   * Handle empty response
   */
  private handleEmptyResponse() {
    this.allEmployees = [];
    this.filteredEmployees = [];
    this.paginatedEmployees = [];
    this.updatePagination();
    this.toastr.info('No employees found.', 'Empty Response');
  }

  /**
   * Populate filter options from actual employee data
   */
  private populateFilterOptions() {
    // Get unique departments
    const uniqueDepartments = [
      ...new Set(this.allEmployees.map((emp) => emp.department)),
    ];
    this.departments = ['All', ...uniqueDepartments.sort()];

    // Get unique occupations
    const uniqueOccupations = [
      ...new Set(this.allEmployees.map((emp) => emp.occupation)),
    ];
    this.occupations = ['All', ...uniqueOccupations.sort()];
  }

  /**
   * Refresh employees from server
   */
  refreshEmployees() {
    this.toastr.info('Refreshing employees list...', 'Loading');
    this.loadEmployees(true);
  }

  /**
   * Search employees using cached data
   */
  searchEmployees() {
    if (this.searchTerm.trim()) {
      const results = this.employeeService.searchCachedEmployees(
        this.searchTerm,
      );
      this.filteredEmployees = results;
      this.toastr.info(
        `Found ${results.length} employees matching "${this.searchTerm}"`,
        'Search Results',
      );
    } else {
      this.filteredEmployees = [...this.allEmployees];
    }
    this.pagination.currentPage = 1;
    this.updatePagination();
  }

  /**
   * Filter employees based on search, department, and occupation
   */
  filterEmployees() {
    let filtered = [...this.allEmployees];

    // Apply search filter
    if (this.searchTerm) {
      filtered = filtered.filter(
        (emp) =>
          emp.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          emp.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          emp.department
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          emp.occupation.toLowerCase().includes(this.searchTerm.toLowerCase()),
      );
    }

    // Apply department filter
    if (this.selectedDepartment && this.selectedDepartment !== 'All') {
      filtered = filtered.filter(
        (emp) => emp.department === this.selectedDepartment,
      );
    }

    // Apply occupation filter
    if (this.selectedOccupation && this.selectedOccupation !== 'All') {
      filtered = filtered.filter(
        (emp) => emp.occupation === this.selectedOccupation,
      );
    }

    // Apply sorting
    switch (this.currentSort) {
      case 'Name A-Z':
        filtered.sort((a, b) => a.fullName.localeCompare(b.fullName));
        break;
      case 'Name Z-A':
        filtered.sort((a, b) => b.fullName.localeCompare(a.fullName));
        break;
      case 'Department':
        filtered.sort((a, b) => a.department.localeCompare(b.department));
        break;
      case 'Occupation':
        filtered.sort((a, b) => a.occupation.localeCompare(b.occupation));
        break;
      case 'New Employees':
      default:
        // Keep original order (newest first, assuming backend returns in creation order)
        break;
    }

    this.filteredEmployees = filtered;
    this.updatePagination();
  }

  updatePagination() {
    this.pagination.totalItems = this.filteredEmployees.length;
    this.pagination.totalPages = Math.ceil(
      this.pagination.totalItems / this.pagination.itemsPerPage,
    );

    // Ensure current page is valid
    if (this.pagination.currentPage > this.pagination.totalPages) {
      this.pagination.currentPage = Math.max(1, this.pagination.totalPages);
    }

    this.updatePaginatedEmployees();
  }

  updatePaginatedEmployees() {
    const startIndex =
      (this.pagination.currentPage - 1) * this.pagination.itemsPerPage;
    const endIndex = startIndex + this.pagination.itemsPerPage;
    this.paginatedEmployees = this.filteredEmployees.slice(
      startIndex,
      endIndex,
    );
  }

  // Dropdown toggle methods
  toggleSortDropdown() {
    this.showSortDropdown = !this.showSortDropdown;
    this.showDepartmentDropdown = false;
    this.showOccupationDropdown = false;
  }

  toggleDepartmentDropdown() {
    this.showDepartmentDropdown = !this.showDepartmentDropdown;
    this.showSortDropdown = false;
    this.showOccupationDropdown = false;
  }

  toggleOccupationDropdown() {
    this.showOccupationDropdown = !this.showOccupationDropdown;
    this.showSortDropdown = false;
    this.showDepartmentDropdown = false;
  }

  // Selection methods
  selectSort(option: string) {
    this.currentSort = option;
    this.showSortDropdown = false;
    this.pagination.currentPage = 1;
    this.filterEmployees();
    this.toastr.info(`Sorted by: ${option}`, 'Filter Applied');
  }

  selectDepartment(dept: string) {
    this.selectedDepartment = dept;
    this.showDepartmentDropdown = false;
    this.pagination.currentPage = 1;
    this.filterEmployees();
    this.toastr.info(`Filtered by department: ${dept}`, 'Filter Applied');
  }

  selectOccupation(occupation: string) {
    this.selectedOccupation = occupation;
    this.showOccupationDropdown = false;
    this.pagination.currentPage = 1;
    this.filterEmployees();
    this.toastr.info(`Filtered by occupation: ${occupation}`, 'Filter Applied');
  }

  clearSort(event: Event) {
    event.stopPropagation();
    this.currentSort = 'New Employees';
    this.pagination.currentPage = 1;
    this.filterEmployees();
    this.toastr.info('Sort cleared', 'Filter Cleared');
  }

  onSearchChange() {
    this.pagination.currentPage = 1;
    this.filterEmployees();
  }

  // Pagination methods
  goToPage(page: number) {
    if (page >= 1 && page <= this.pagination.totalPages) {
      this.pagination.currentPage = page;
      this.updatePaginatedEmployees();
    }
  }

  onItemsPerPageChange() {
    this.pagination.currentPage = 1;
    this.updatePagination();
  }

  getStartIndex(): number {
    if (this.pagination.totalItems === 0) return 0;
    return (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + 1;
  }

  getEndIndex(): number {
    const endIndex = this.pagination.currentPage * this.pagination.itemsPerPage;
    return Math.min(endIndex, this.pagination.totalItems);
  }

  getVisiblePages(): (number | string)[] {
    const totalPages = this.pagination.totalPages;
    const currentPage = this.pagination.currentPage;
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage <= 4) {
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
      } else if (currentPage >= totalPages - 3) {
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages - 1; i++) {
          pages.push(i);
        }
      } else {
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  }

  getPageButtonClass(page: number | string): string {
    const baseClass =
      'px-3 py-2 text-sm font-medium border border-gray-300 transition-colors';

    if (typeof page === 'number' && page === this.pagination.currentPage) {
      return `${baseClass} bg-purple-600 text-white border-purple-600`;
    }

    return `${baseClass} text-gray-700 bg-white hover:bg-gray-50`;
  }

  getDepartmentClass(department: string): string {
    // Generate consistent colors based on department name
    const colors = [
      'bg-purple-100 text-purple-800',
      'bg-green-100 text-green-800',
      'bg-orange-100 text-orange-800',
      'bg-blue-100 text-blue-800',
      'bg-red-100 text-red-800',
      'bg-yellow-100 text-yellow-800',
      'bg-indigo-100 text-indigo-800',
      'bg-pink-100 text-pink-800',
    ];

    const index = department.length % colors.length;
    return colors[index];
  }

  /**
   * Get cached employees count
   */
  getCachedCount(): number {
    return this.employeeService.getCachedEmployeesCount();
  }

  /**
   * Clear all filters
   */
  clearAllFilters() {
    this.searchTerm = '';
    this.currentSort = 'New Employees';
    this.selectedDepartment = '';
    this.selectedOccupation = '';
    this.pagination.currentPage = 1;
    this.filterEmployees();
    this.toastr.info('All filters cleared', 'Filters Reset');
  }

  deleteEmployee(employee: Employee) {
    this.dialog.open(DeleteEmployeeDialog, {
      data: employee,
    });
  }
}
