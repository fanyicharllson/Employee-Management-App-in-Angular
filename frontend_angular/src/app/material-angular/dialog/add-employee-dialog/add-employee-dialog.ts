import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  notOnlyNumbersValidator,
  properCompanyNameValidator,
} from '../../../helper/UserNameCompanyNameValidator';
import { LucideAngularModule, Plus } from 'lucide-angular';
import { UserloginService } from '../../../services/user.service/user.login.service';
import { EmployeeService } from '../../../services/employee/employee.service';
import { ToastrService } from 'ngx-toastr';
import { NotifyEmployeeDialog } from '../notify-employee-dialog/notify-employee-dialog';


@Component({
  selector: 'dialog-content',
  templateUrl: './add-employee-dialog.html',
  imports: [
    MatDialogModule,
    MatButtonModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    LucideAngularModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogContent implements OnInit {
  private fb = inject(FormBuilder);
  addEmployeeForm!: FormGroup;
  protected readonly Plus = Plus;
  private userloginService = inject(UserloginService);
  private employeeService = inject(EmployeeService);
  dialogRef = inject(MatDialogRef<DialogContent>);
  private toastr = inject(ToastrService);
  readonly dialog = inject(MatDialog);


  currentUser$ = this.userloginService.currentUser$;
  isSubmitting$ = this.employeeService.loading$;

  companyName: string = '';

  ngOnInit() {
    this.currentUser$.subscribe((user) => {
      if (user) {
        this.companyName = user.companyName;
        this.initialiseForm();
      } else {
        console.log(
          'No user is currently logged in add employee chart page: ',
          user,
        );
      }
    });
  }

  private initialiseForm() {
    this.addEmployeeForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          ),
        ],
      ],
      companyName: [
        this.companyName,
        [Validators.required, properCompanyNameValidator()],
      ],
      department: ['', [Validators.required, properCompanyNameValidator()]],
      fullName: ['', [Validators.required, notOnlyNumbersValidator()]],
      role: ['Employee', Validators.required],
      occupation: ['', [Validators.required, properCompanyNameValidator()]],
    });
  }

  submit() {
    if (this.addEmployeeForm.valid) {
      const employeeData = this.addEmployeeForm.value;

      //Check if we already have cache for this employee
      if (this.employeeService.hasCacheForEmployee(employeeData)) {
        console.log('Employee already exists in cache');
        this.getCachedEmployee();
        return;
      }

      this.employeeService.addEmployee(employeeData).subscribe({
        next: (res) => {
          const status = res.status;
          const responseBody = res.body;

          if (status === 201) {
            this.toastr.success('Employee added successfully!', 'Success');
            this.dialogRef.close(responseBody);
            this.openNotifyHRDialog()

          } else if (status === 409) {
            console.warn('⚠️ Conflict: ', responseBody);
            this.toastr.error("Employee already Added!", "Conflict")
          }
        },
        error: (err) => {
          console.error('Failed to add employee', err);
          this.toastr.error('Failed to add employee! Please try again later', 'Error');
        },
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  private openNotifyHRDialog() {
    this.dialog.open(NotifyEmployeeDialog);
  }

  private getCachedEmployee() {
    this.employeeService.getCachedEmployeeData().subscribe((data) => {
      if (data?.body) {
        console.log('Using cached employee data:', data.body);
        // Use cached data
      } else {
        console.log('No cached employee data found');
        // Handle no cache scenario
      }
    });
  }
}
