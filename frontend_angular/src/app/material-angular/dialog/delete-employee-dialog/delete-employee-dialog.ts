import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Employee } from '../../../../../types/user';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../../../services/employee/employee.service';

@Component({
  selector: 'dialog-elements-example',
  templateUrl: 'delete-employee-dialog..html',
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatIcon,
    MatProgressSpinner,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteEmployeeDialog implements OnInit {
  employeeName: string = '';
  isLoading: boolean = false;
  companyName: string | null = null;
  email: string | null = null;
  private toast = inject(ToastrService);
  private employeeService = inject(EmployeeService)

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Employee,
    private dialogRef: MatDialogRef<DeleteEmployeeDialog>,
  ) {}

  ngOnInit() {
    this.companyName = this.data.companyName;
    this.employeeName = this.data.fullName;

  }

  onDelete() {
    this.isLoading = true;
    const  email = this.data.email;
    const companyName = this.data.companyName;


    this.employeeService.deleteEmployee(email, companyName).subscribe({
      next: () => {
        this.employeeService.removeEmployeeFromCache(this.data.id);
        this.employeeService.triggerRefresh();
        this.toast.success(`${this.data.fullName} deleted successfully`, 'Employee Deleted');
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.toast.error(`An Error occurred while trying to delete ${this.data.fullName}! Please try again later.`, 'Error')
        this.isLoading = false;
        console.error('Error deleting employee:', error);
        this.dialogRef.close(false);

      }
    })
  }

}

