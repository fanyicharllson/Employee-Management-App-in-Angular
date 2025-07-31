import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { employees } from '../../../utils/employees';
import { Employees, PaginationInfo } from '../../../../../types/types.dashboard';
import { NgClass } from '@angular/common';
import { EmployeeService } from '../../../services/employee/employee.service';

@Component({
  selector: 'app-manage-employee',
  imports: [FormsModule, NgClass],
  templateUrl: './manage-employee.html',
  styleUrl: './manage-employee.css'
})
export class ManageEmployee implements OnInit {
  searchTerm = '';
  currentSort = 'New Employees';
  selectedDepartment = '';
  selectedDesignation = '';
  showSortDropdown = false;
  showDepartmentDropdown = false;
  showDesignationDropdown = false;

  protected readonly Number = Number;
  private employeeService = inject(EmployeeService);

  ngOnInit() {
    // Create more employees for pagination demo
    this.employeesList = [
      ...employees,
      ...this.generateMoreEmployees()
    ];
    this.filterEmployees();

    this.getCacheEmployee();
  }


  filteredEmployees: Employees[] = [];
  paginatedEmployees: Employees[] = [];
  employeesList: Employees[] = [];


  sortOptions = [
    'New Employees',
    'Name A-Z',
    'Name Z-A',
    'Department',
    'Designation'
  ];
  departments = ['All', 'Art & Design', 'Development', 'UI/UX Design'];
  designations = [
    'All',
    'Product Designer',
    'UI Designer',
    'UX Designer',
    'Developer',
    'Motion Designer',
    'Product Manager'
  ];
  pagination: PaginationInfo = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0
  };



  generateMoreEmployees(): Employees[] {
    const additionalEmployees: Employees[] = [];
    const names = ['Sarah Johnson', 'Mike Chen', 'Lisa Rodriguez', 'James Wilson', 'Emily Davis', 'Alex Thompson', 'Maria Garcia', 'David Lee', 'Rachel Brown', 'Kevin Martinez', 'Amanda White', 'Chris Taylor', 'Jessica Clark', 'Ryan Anderson', 'Nicole Jackson'];
    const departments = ['Art & Design', 'Development', 'UI/UX Design'];
    const designations = ['Product Designer', 'UI Designer', 'UX Designer', 'Developer', 'Motion Designer', 'Product Manager'];

    for (let i = 0; i < 15; i++) {
      additionalEmployees.push({
        id: `${Date.now()}-${i}`,
        name: names[i],
        email: `${names[i].toLowerCase().replace(' ', '.')}@company.com`,
        department: departments[i % departments.length],
        designation: designations[i % designations.length],
        avatar: `https://images.unsplash.com/photo-${1500000000000 + i * 1000000}?w=150&h=150&fit=crop&crop=face`
      });
    }

    return additionalEmployees;
  }

  private getCacheEmployee() {
    this.employeeService.getCachedEmployeeData().subscribe((data) => {
      if (data) {
        console.log('Reusing cached employee data: ', data);
        // Display on the UI or bind to component property
      } else {
        console.log('No cached employee data found', data);
      }
    });
  }
  filterEmployees() {
    let filtered = [...employees];

    // Apply search filter
    if (this.searchTerm) {
      filtered = filtered.filter(emp =>
        emp.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        emp.designation.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Apply department filter
    if (this.selectedDepartment && this.selectedDepartment !== 'All') {
      filtered = filtered.filter(emp => emp.department === this.selectedDepartment);
    }

    // Apply designation filter
    if (this.selectedDesignation && this.selectedDesignation !== 'All') {
      filtered = filtered.filter(emp => emp.designation === this.selectedDesignation);
    }

    // Apply sorting
    switch (this.currentSort) {
      case 'Name A-Z':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Name Z-A':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'Department':
        filtered.sort((a, b) => a.department.localeCompare(b.department));
        break;
      case 'Designation':
        filtered.sort((a, b) => a.designation.localeCompare(b.designation));
        break;
    }

    this.filteredEmployees = filtered;
    this.updatePagination();
  }

  updatePagination() {
    this.pagination.totalItems = this.filteredEmployees.length;
    this.pagination.totalPages = Math.ceil(this.pagination.totalItems / this.pagination.itemsPerPage);

    // Ensure current page is valid
    if (this.pagination.currentPage > this.pagination.totalPages) {
      this.pagination.currentPage = Math.max(1, this.pagination.totalPages);
    }

    this.updatePaginatedEmployees();
  }

  updatePaginatedEmployees() {
    const startIndex = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage;
    const endIndex = startIndex + this.pagination.itemsPerPage;
    this.paginatedEmployees = this.filteredEmployees.slice(startIndex, endIndex);
  }

  toggleSortDropdown() {
    this.showSortDropdown = !this.showSortDropdown;
    this.showDepartmentDropdown = false;
    this.showDesignationDropdown = false;
  }

  toggleDepartmentDropdown() {
    this.showDepartmentDropdown = !this.showDepartmentDropdown;
    this.showSortDropdown = false;
    this.showDesignationDropdown = false;
  }

  toggleDesignationDropdown() {
    this.showDesignationDropdown = !this.showDesignationDropdown;
    this.showSortDropdown = false;
    this.showDepartmentDropdown = false;
  }

  selectSort(option: string) {
    this.currentSort = option;
    this.showSortDropdown = false;
    this.pagination.currentPage = 1;
    this.filterEmployees();
  }

  selectDepartment(dept: string) {
    this.selectedDepartment = dept;
    this.showDepartmentDropdown = false;
    this.pagination.currentPage = 1;
    this.filterEmployees();
  }

  selectDesignation(designation: string) {
    this.selectedDesignation = designation;
    this.showDesignationDropdown = false;
    this.pagination.currentPage = 1;
    this.filterEmployees();
  }

  clearSort(event: Event) {
    event.stopPropagation();
    this.currentSort = 'All';
    this.pagination.currentPage = 1;
    this.filterEmployees();
  }

  onSearchChange() {
    this.pagination.currentPage = 1;
    this.filterEmployees();
  }

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
      // Show all pages if total pages is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 4) {
        // Show pages 2, 3, 4, 5 and ellipsis
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
      } else if (currentPage >= totalPages - 3) {
        // Show ellipsis and last 4 pages
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages - 1; i++) {
          pages.push(i);
        }
      } else {
        // Show ellipsis, current page area, ellipsis
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
      }

      // Always show last page (if not already shown)
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  }

  getPageButtonClass(page: number | string): string {
    const baseClass = 'px-3 py-2 text-sm font-medium border border-gray-300 transition-colors';

    if (typeof page === 'number' && page === this.pagination.currentPage) {
      return `${baseClass} bg-purple-600 text-white border-purple-600`;
    }

    return `${baseClass} text-gray-700 bg-white hover:bg-gray-50`;
  }

  getDepartmentClass(department: string): string {
    switch (department) {
      case 'Art & Design':
        return 'bg-purple-100 text-purple-800';
      case 'Development':
        return 'bg-green-100 text-green-800';
      case 'UI/UX Design':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
