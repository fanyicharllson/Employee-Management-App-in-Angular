import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isMobileSidebarOpen = signal(false);

  toggleMobileSidebar() {
    this.isMobileSidebarOpen.update(state => !state);
  }

  closeMobileSidebar() {
    this.isMobileSidebarOpen.set(false);
  }

  getMobileSidebarState() {
    return this.isMobileSidebarOpen;
  }
}
