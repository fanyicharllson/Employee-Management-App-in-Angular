import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  /*loading variable for ui*/
  loading = signal(false);

  loginForm = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ],
    ],

    password: ['', Validators.required],
  });

  onLogin() {
    if (this.loginForm.invalid) return;

    this.loading.set(true);

    this.http
      .post(
        'https://projectapi.gerasim.in/api/EmployeeManagement/login',
        this.loginForm.value,
      )
      .subscribe({
        next: (res: any) => {
          this.loading.set(false);
          if (res.result) {
            this.router.navigateByUrl('dashboard').then(() => {
              console.log('Navigation success');
            });
          } else {
            alert(res.message);
          }
        },
        error: () => {
          this.loading.set(false);
          alert('Something went wrong! Please try again later.');
        },
      });
  }
}
