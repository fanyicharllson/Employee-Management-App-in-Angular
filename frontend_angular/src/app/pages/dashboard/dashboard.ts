import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  SidebarItem,
  Employee,
  Task,
  ChartData,
  StatCard,
  ProfileRoute,
} from '../../../../types/types.dashboard';
import { CommonModule } from '@angular/common';
import {
  ArrowLeftFromLine,
  BarChart3,
  Bell,
  Calendar,
  Clock,
  DollarSign,
  File,
  HelpCircleIcon,
  LucideAngularModule,
  MenuSquare,
  MessageSquare,
  Plus,
  Search,
  Settings,
  User,
  UserIcon,
  UserPlus,
  X,
} from 'lucide-angular';
import { UserloginService } from '../../services/user.service/user.login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  searchControl = new FormControl('');

  // Signals for state management
  activeTab = signal('Dashboard');
  isMobileSidebarOpen = signal(false);
  isProfileMenuOpen = signal(false);

  private userloginService = inject(UserloginService);
  private router = inject(Router);
  currentUser$ = this.userloginService.currentUser$;

  username: string = '';
  role: string = '';
  companyName: string = '';
  companySize: string = ''

  // Dashboard icons
  readonly Users = User;
  readonly Dollarsign = DollarSign;
  readonly Clock = Clock;
  readonly FileText = File;
  readonly Barchart = BarChart3;
  readonly Calender = Calendar;
  readonly UserPlus = UserPlus;
  readonly MessageSquare = MessageSquare;
  readonly Plus = Plus;
  readonly Menu = MenuSquare;
  readonly Bell = Bell;
  readonly Search = Search;
  readonly X = X;
  readonly Setting = Settings;
  readonly Help = HelpCircleIcon;
  readonly ArrowLeft = ArrowLeftFromLine;
  readonly Profile = UserIcon;

  ngOnInit() {
    // Subscribe to user changes
    this.currentUser$.subscribe((user) => {
      if (user) {
        this.username = user.name;
        this.role = user.role;
        this.companyName = user.companyName;
        this.companySize = user.companySize;
      } else {
        console.log('No user is currently logged in.', user);
      }
    });

    const user = this.userloginService.getCurrentUser();
    // if (user) {
    //   console.log('User ID:', user.id);
    // } else {
    //   console.log('No user is currently logged in.', user);
    // }
  }

  sidebarItems = signal<SidebarItem[]>([
    { icon: this.Barchart, label: 'Dashboard', active: true },
    { icon: this.Users, label: 'Employees', active: false },
    { icon: this.UserPlus, label: 'Recruitment', active: false },
    { icon: this.Calender, label: 'Schedule', active: false },
    { icon: this.Dollarsign, label: 'Payroll', active: false },
    { icon: this.Clock, label: 'Timesheet', active: false },
    { icon: this.MessageSquare, label: 'Report', active: false },
    { icon: this.FileText, label: 'Files', active: false },
  ]);

  employees = signal<Employee[]>([
    {
      id: 1,
      name: 'Dummy Name',
      role: 'UI/UX Designer',
      avatar: '👤',
      status: 'Active',
      tag: 'Design',
    },
    {
      id: 2,
      name: 'Dummy Name',
      role: 'UI/UX Designer',
      avatar: '👤',
      status: 'Active',
      tag: 'Design',
    },
    {
      id: 3,
      name: 'Dummy Name',
      role: 'UI/UX Designer',
      avatar: '👤',
      status: 'Active',
      tag: 'Design',
    },
    {
      id: 4,
      name: 'Dummy Name',
      role: 'UI/UX Designer',
      avatar: '👤',
      status: 'Active',
      tag: 'Design',
    },
    {
      id: 5,
      name: 'Dummy Name',
      role: 'UI/UX Designer',
      avatar: '👤',
      status: 'Active',
      tag: 'Design',
    },
  ]);

  tasks = signal<Task[]>([
    {
      id: 1,
      title: 'Finish task design',
      priority: 'High',
      status: 'On Progress',
    },
    {
      id: 2,
      title: 'New employee monitoring',
      priority: 'Medium',
      status: 'Completed',
    },
    {
      id: 3,
      title: 'Create new project',
      priority: 'Low',
      status: 'Not Started',
    },
    { id: 4, title: 'Update website', priority: 'High', status: 'In Review' },
  ]);

  chartData = signal<ChartData[]>([
    { month: 'Jan', value: 20 },
    { month: 'Feb', value: 35 },
    { month: 'Mar', value: 40 },
    { month: 'Apr', value: 30 },
    { month: 'May', value: 45 },
    { month: 'Jun', value: 35 },
    { month: 'Jul', value: 50 },
  ]);

  statsCards = signal<StatCard[]>([
    {
      title: 'Total Employees',
      value: '104',
      change: '+12% from last month',
      color: 'from-blue-500 to-blue-600',
      icon: 'users',
    },
    {
      title: 'New Hires',
      value: '1,839',
      change: '+8% from last month',
      color: 'from-purple-500 to-purple-600',
      icon: 'user-plus',
    },
    {
      title: 'Total Salary',
      value: '$324,890.89',
      change: '+15% from last month',
      color: 'from-emerald-500 to-emerald-600',
      icon: 'dollar-sign',
    },
  ]);

  profileRoutes = signal<ProfileRoute[]>([
    { text: 'Profile', route: 'profile', icon: this.Profile },
    { text: 'Settings', route: 'setting', icon: this.Setting },
    { text: 'Help', route: 'help', icon: this.Help },
    { text: 'Sign Out', route: 'signout', btn: true, icon: this.ArrowLeft },
  ]);

  // Computed values
  maxChartValue = computed(() => {
    return Math.max(...this.chartData().map((d) => d.value));
  });

  setActiveTab(tab: string): void {
    this.activeTab.set(tab);
    this.sidebarItems.update((items) =>
      items.map((item) => ({ ...item, active: item.label === tab })),
    );
  }

  getSidebarItemClass(label: string): string {
    const isActive = this.activeTab() === label;
    return `w-full flex items-center px-6 py-3 text-left transition-colors ${
      isActive
        ? 'bg-purple-500 text-blue-600 border-r-2 border-pink-600'
        : 'text-gray-600 hover:bg-gray-50'
    }`;
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen.set(!this.isProfileMenuOpen());
  }

  closeProfileMenu(): void {
    this.isProfileMenuOpen.set(false);
  }

  toggleMobileSideBar() {
    this.isMobileSidebarOpen.update((value) => !value);
  }

  closeMobileSidebar() {
    this.isMobileSidebarOpen.set(false);
  }

  getChartHeight(value: number): number {
    return (value / this.maxChartValue()) * 200;
  }

  getPriorityClass(priority: string): string {
    const baseClass = 'px-2 py-1 rounded-full text-xs ';
    switch (priority) {
      case 'High':
        return baseClass + 'bg-red-100 text-red-700';
      case 'Medium':
        return baseClass + 'bg-yellow-100 text-yellow-700';
      case 'Low':
        return baseClass + 'bg-green-100 text-green-700';
      default:
        return baseClass + 'bg-gray-100 text-gray-700';
    }
  }

  getStatusClass(status: string): string {
    const baseClass = 'px-2 py-1 rounded-full text-xs ';
    switch (status) {
      case 'Completed':
        return baseClass + 'bg-green-100 text-green-700';
      case 'On Progress':
        return baseClass + 'bg-blue-100 text-blue-700';
      case 'In Review':
        return baseClass + 'bg-purple-100 text-purple-700';
      default:
        return baseClass + 'bg-gray-100 text-gray-700';
    }
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
