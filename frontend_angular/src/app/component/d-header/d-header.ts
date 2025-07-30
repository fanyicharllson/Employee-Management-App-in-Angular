import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ArrowLeftFromLine,
  HelpCircleIcon,
  LucideAngularModule,
  Settings,
  User,
  Search,
  Bell,
  Menu,
} from 'lucide-angular';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ProfileRoute } from '../../../../types/types.dashboard';
import { UserloginService } from '../../services/user.service/user.login.service';
import { SidebarService } from '../../services/sidebar.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-d-header',
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    ReactiveFormsModule,
    NgOptimizedImage,
  ],
  templateUrl: './d-header.html',
  styleUrl: './d-header.css',
})
export class DHeader implements OnInit {
  private userloginService = inject(UserloginService);
  private sidebarService = inject(SidebarService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  currentUser$ = this.userloginService.currentUser$;

  readonly Profile = User;
  readonly Setting = Settings;
  readonly Help = HelpCircleIcon;
  readonly ArrowLeft = ArrowLeftFromLine;
  readonly Search = Search;
  readonly Bell = Bell;
  readonly Menu = Menu;

  isProfileMenuOpen = signal(false);
  searchControl = new FormControl('');

  username = '';
  role = '';

  ngOnInit() {
    this.currentUser$.subscribe((user) => {
      if (user) {
        this.username = user.name;
        this.role = user.role;
      } else {
        console.log('No user is currently logged in.', user);
      }
    });
  }

  getCurrentPageTitle() {
    const currentUrl = this.router.url;
    const lastSegment = currentUrl.split('/').pop() || '';

    if (!lastSegment) {
      return 'Dashboard';
    }
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  }

  profileRoutes = signal<ProfileRoute[]>([
    { text: 'Profile', route: 'profile', icon: this.Profile },
    { text: 'Settings', route: 'setting', icon: this.Setting },
    { text: 'Help', route: 'help', icon: this.Help },
    { text: 'Sign Out', route: 'login', btn: true, icon: this.ArrowLeft },
  ]);

  toggleMobileSideBar() {
    this.sidebarService.toggleMobileSidebar();
  }

  isMobileSidebarOpen() {
    return this.sidebarService.getMobileSidebarState()();
  }

  closeMobileSidebar() {
    this.sidebarService.closeMobileSidebar();
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen.set(!this.isProfileMenuOpen());
  }

  closeProfileMenu(): void {
    this.isProfileMenuOpen.set(false);
  }

  handleSignOut(): void {
    // Handle sign out logic
    console.log('Signing out...');
    this.userloginService.logout();
    this.closeProfileMenu();
  }

  handleProfileClick(profileItem: ProfileRoute): void {
    // Handle regular profile menu clicks
    console.log('Navigating to:', profileItem.route);
    // this.router.navigate([profileItem.route]);
    this.closeProfileMenu();
  }
}
