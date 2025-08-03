import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { BarChart2, LucideAngularModule, Plus, UserPlus } from 'lucide-angular';
import { RouterLink, RouterLinkActive, Router, RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogContent } from '../../material-angular/dialog/add-employee-dialog/add-employee-dialog';

@Component({
  selector: 'app-employee',
  imports: [FormsModule, LucideAngularModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './employee.html',
  styleUrl: './employee.css',
})
export class Employee {

  public router =  inject(Router)
  protected readonly UserPlus = UserPlus;
  protected readonly Bars = BarChart2;
  protected readonly Plus = Plus;
  private dialog = inject(MatDialog);
  protected readonly Number = Number;
  private fb = inject(FormBuilder);


  openDialog() {
    const dialogRef = this.dialog.open(DialogContent);
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result loaded ');
    });
  }
}
