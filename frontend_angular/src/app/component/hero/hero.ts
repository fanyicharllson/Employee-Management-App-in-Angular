import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class Hero {
  router = inject(Router);
  toast = inject(ToastrService);

  navigateToRegiter() {
    this.router.navigate(['/register']);
  }

  showSuccessToast() {
    this.toast.info("Temporarily Unavailable, Please try again later!", "Info")
  }

}
