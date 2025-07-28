import { Component, signal, inject } from '@angular/core';
import {
  ArrowLeftFromLine,
  BarChart3,
  Calendar,
  DollarSign,
  File,
  HelpCircleIcon,
  LucideAngularModule,
  Plus,
  User,
  UserIcon,
  MessageSquare,
  X,
  Clock,
  UserPlus,
} from 'lucide-angular';
import { SidebarItem } from '../../../../types/types.dashboard';
import { SidebarService } from '../../services/sidebar.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [LucideAngularModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  // Signals for state management
  activeTab = signal('Dashboard');

  private sidebarService = inject(SidebarService);
  isMobileSidebarOpen = this.sidebarService.getMobileSidebarState();

  readonly Users = User;
  readonly Dollarsign = DollarSign;
  readonly Clock = Clock;
  readonly FileText = File;
  readonly Barchart = BarChart3;
  readonly Calender = Calendar;
  readonly UserPlus = UserPlus;
  readonly MessageSquare = MessageSquare;
  readonly Plus = Plus;
  readonly X = X;
  readonly Help = HelpCircleIcon;
  readonly Profile = UserIcon;

  sidebarItems = signal<SidebarItem[]>([
    { icon: this.Barchart, label: 'Dashboard', route: 'dashboard' },
    {
      icon: this.Users,
      label: 'Employees',
      route: 'hr/employees',
    },
    {
      icon: this.UserPlus,
      label: 'Recruitment',
      route: 'hr/recruitment',
    },
    {
      icon: this.Calender,
      label: 'Schedule',
      route: 'hr/schedule',
    },
    {
      icon: this.Dollarsign,
      label: 'Payroll',
      route: 'hr/recruitment',
    },
    {
      icon: this.Clock,
      label: 'Timesheet',
      route: 'hr/recruitment',
    },
    // { icon: this.MessageSquare, label: 'Report', active: false },
    // { icon: this.FileText, label: 'Files', active: false },
  ]);

  // setActiveTab(tab: string): void {
  //   this.activeTab.set(tab);
  //   this.sidebarItems.update((items) =>
  //     items.map((item) => ({ ...item, active: item.label === tab })),
  //   );
  // }

  // getSidebarItemClass(label: string): string {
  //   const isActive = this.activeTab() === label;
  //   return `w-full flex items-center px-6 py-3 text-left transition-colors ${
  //     isActive
  //       ? 'bg-purple-500 text-blue-600 border-r-2 border-pink-600'
  //       : 'text-gray-600 hover:bg-gray-50'
  //   }`;
  // }

  closeMobileSidebar() {
    this.sidebarService.closeMobileSidebar();
  }
}
