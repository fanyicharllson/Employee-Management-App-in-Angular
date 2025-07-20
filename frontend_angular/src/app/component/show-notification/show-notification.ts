import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-show-notification',
  imports: [CommonModule],
  templateUrl: './show-notification.html',
  styleUrl: './show-notification.css',
})
export class ShowNotification {
  @Input() showSuccess = false;
  @Input() showError = false;
  @Input() successMessage = '';
  @Input() errorMessage = '';
}
