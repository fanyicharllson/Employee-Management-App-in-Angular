import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-loading-screen',
  imports: [CommonModule],
  templateUrl: './loading-screen.html',
  styleUrl: './loading-screen.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('300ms ease-in', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-out',
          style({ opacity: 0, transform: 'scale(0.9)' }),
        ),
      ]),
    ]),
  ],
})
export class LoadingScreen implements OnInit, OnDestroy {
  @Input() isLoading: boolean = true;
  @Input() hasError: boolean = false;
  @Input() loadingMessage: string = 'Getting things ready...';
  @Input() loadingSubtext: string = 'This will just take a moment';
  @Input() successMessage: string = 'All set!';
  @Input() successSubtext: string = 'Everything is ready to go';
  @Input() errorMessage: string = 'Something went wrong';
  @Input() errorSubtext: string = 'Please try again';
  @Input() showRetryButton: boolean = false;
  @Input() autoComplete: boolean = false;
  @Input() autoCompleteDelay: number = 5000;


   @Output() retry = new EventEmitter<void>();

  private autoCompleteTimeout?: number;

  ngOnInit(): void {
    if (this.autoComplete && this.isLoading) {
      this.autoCompleteTimeout = window.setTimeout(() => {
        this.isLoading = false;
      }, this.autoCompleteDelay);
    }
  }

  ngOnDestroy(): void {
    if (this.autoCompleteTimeout) {
      clearTimeout(this.autoCompleteTimeout);
    }
  }

  onRetry(): void {
    this.retry.emit();
  }
}
