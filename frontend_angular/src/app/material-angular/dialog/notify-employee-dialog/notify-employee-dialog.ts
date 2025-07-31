import { Component, inject, OnInit } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { UserloginService } from '../../../services/user.service/user.login.service';

@Component({
  selector: 'app-notify-employee-dialog',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
  ],
  templateUrl: './notify-employee-dialog.html',
})
export class NotifyEmployeeDialog implements OnInit{
  private userloginService = inject(UserloginService);
  currentUser$ = this.userloginService.currentUser$;

  username: string = '';

  ngOnInit() {
    this.currentUser$.subscribe((user) => {
      if (user) {
        this.username = user.name;
      } else {
        console.log('No user is currently logged in.', user);
      }
    });
  }

}
