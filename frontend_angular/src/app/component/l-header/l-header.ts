import { Component, inject, OnInit } from '@angular/core';
import { NavItem } from '../../utils/navItem';
import { ScrollToSection } from '../../services/scroll-to-section';
import { Router, RouterModule } from '@angular/router';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-l-header',
  imports: [RouterModule, NgOptimizedImage],
  templateUrl: './l-header.html',
  styleUrl: './l-header.css',
})
export class LHeader implements OnInit {
  ScrollService = inject(ScrollToSection);
  router = inject(Router);
  isMobileMenuOpen = false;
  isScrolled = false;

  // nav items
  navItems = NavItem;

  ngOnInit() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.onScroll.bind(this));
    }
  }
  // Scroll to section function
  ScrollTo(event: Event, sectionId: string) {
    event.preventDefault();
    this.ScrollService.scrollToSection(sectionId);
    this.closeMobileMenu();
  }

  // scroll event
  onScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  // Toggle mobile menu
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // Close mobile menu
  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  // Navigate to register page when get started button is clicked
  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
