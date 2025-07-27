import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

//TODO: Code to be implemented soon................................

@Component({
  selector: 'app-no-internet',
  templateUrl: './no-internet.component.html',
  imports: [CommonModule],
  styleUrls: ['./no-internet.component.css'],
})
export class NoInternetComponent implements OnInit, OnDestroy {
  isVisible = false;
  isRetrying = false;

  ngOnInit() {
    // Trigger entrance animation
    setTimeout(() => {
      this.isVisible = true;
    }, 100);
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  onRetry() {
    this.isRetrying = true;

    // Simulate network check
    setTimeout(() => {
      this.isRetrying = false;
      // Here you would typically check actual network connectivity
      // and either hide this component or show success/failure feedback
      console.log('Checking network connectivity...');
    }, 2000);
  }
}
