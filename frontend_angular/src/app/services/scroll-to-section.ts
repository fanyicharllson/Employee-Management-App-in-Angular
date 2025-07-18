import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScrollToSection {
  scrollToSection(elementId: string) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
