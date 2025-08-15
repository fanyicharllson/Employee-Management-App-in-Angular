import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {Router} from '@angular/router';


@Component({
  selector: 'app-under-development',
  imports: [CommonModule],
  templateUrl: 'app-under-development.html',
})

export class AppUnderDevelopment {
  @Input() pageTitle?: string;
  @Input() description?: string;
  @Input() progress?: number;
  @Input() timeline?: string;
  @Input() showContactInfo: boolean = true;
  @Input() showAdditionalInfo: boolean = true;
  @Input() dashboardRoute: string = '/dashboard';

  constructor(private router: Router) {}

  goBack(): void {
    window.history.back();
  }

  goToDashboard(): void {
    this.router.navigate([this.dashboardRoute]);
  }

}
