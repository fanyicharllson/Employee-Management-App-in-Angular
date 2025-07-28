import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  Employee,
  Task,
  ChartData,
} from '../../../../types/types.dashboard';
import { CommonModule } from '@angular/common';
import { UserloginService } from '../../services/user.service/user.login.service';
import { ToastrService } from 'ngx-toastr';
// import { OnBoardingService } from '../../services/onboarding.service/on-boarding.service';
import { StatsCard } from '../../component/stats-card/stats-card';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule, StatsCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  private userloginService = inject(UserloginService);
  // private onboardingService = inject(OnBoardingService);
  private toastr = inject(ToastrService);

  currentUser$ = this.userloginService.currentUser$;

  // onboardingData$ = this.onboardingService.getOnboarding();

  username: string = '';
  role: string = '';
  companyName: string = '';
  companySize: string = '';
  totalHires: number = 0;
  salaryRange: string = '';

  ngOnInit() {
    // Subscribe to user changes
    this.currentUser$.subscribe((user) => {
      if (user) {
        this.username = user.name;
        this.role = user.role;
        this.companyName = user.companyName;
        this.companySize = user.companySize;

        this.toastr.success(
          `Welcome back, ${user.name}!`,
          'We are glad to have you on board!😘',
        );
      } else {
        console.log('No user is currently logged in.', user);
      }
    });
  }

  //Call to refresh onboarding data
  // refreshData() {
  //   this.onboardingData$ = this.onboardingService.getOnboarding(true);
  // }


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

  // Computed values
  maxChartValue = computed(() => {
    return Math.max(...this.chartData().map((d) => d.value));
  });

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

}
