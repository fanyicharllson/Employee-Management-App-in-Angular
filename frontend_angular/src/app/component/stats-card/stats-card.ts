import { Component, inject, OnInit, signal } from '@angular/core';
import { StatCard } from '../../../../types/types.dashboard';
import {
  UserPlus,
  DollarSign,
  User,
  LucideAngularModule,
} from 'lucide-angular';
import { OnBoardingService } from '../../services/onboarding.service/on-boarding.service';
import { CommonModule } from '@angular/common';
import { getRelativeTime } from '../../helper/relativeTime';

@Component({
  selector: 'app-stats-card',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './stats-card.html',
  styleUrl: './stats-card.css',
})
export class StatsCard implements OnInit {
  private onboardingService = inject(OnBoardingService);
  onboardingData$ = this.onboardingService.getOnboarding();
  loading$ = this.onboardingService.loading$;

  readonly UserPlus = UserPlus;
  readonly Dollarsign = DollarSign;
  readonly Users = User;

  totalEmployees = 'N/A';
  newHires = 0;
  totalSalary = 0;
  createdAt = '';

  ngOnInit(): void {
    this.onboardingData$.subscribe({
      next: (data) => {
        this.totalEmployees = data.teamSize;
        this.newHires = data.totalHires;
        this.totalSalary = data.salaryRange;
        this.createdAt = data.createdAt;
        this.updateStatsCards();
      },
      error: (error) => {
        console.error('Error fetching onboarding data:', error);
      },
    });
  }

  //Call to refresh onboarding data(manual refresh)
  refreshData() {
    this.onboardingData$ = this.onboardingService.getOnboarding(true);
  }

  private updateStatsCards() {
    this.statsCards.set([
      {
        title: 'Total Employees',
        value: this.totalEmployees,
        change: getRelativeTime(this.createdAt),
        color: 'from-blue-500 to-blue-600',
        icon: this.Users,
      },
      {
        title: 'New Hires',
        value: this.newHires,
        change: getRelativeTime(this.createdAt),
        color: 'from-purple-500 to-purple-600',
        icon: this.UserPlus,
      },
      {
        title: 'Total Salary',
        value: this.totalSalary,
        // change: '+15% from last month',
        change: getRelativeTime(this.createdAt),
        color: 'from-emerald-500 to-emerald-600',
        icon: this.Dollarsign,
      },
    ]);
  }

  statsCards = signal<StatCard[]>([
    {
      title: 'Total Employees',
      value: this.totalEmployees,
      change: getRelativeTime(this.createdAt),
      color: 'from-blue-500 to-blue-600',
      icon: this.Users,
    },
    {
      title: 'New Hires',
      value: this.newHires,
      change: getRelativeTime(this.createdAt),
      color: 'from-purple-500 to-purple-600',
      icon: this.UserPlus,
    },
    {
      title: 'Total Salary',
      value: this.totalSalary,
      change: getRelativeTime(this.createdAt),
      color: 'from-emerald-500 to-emerald-600',
      icon: this.Dollarsign,
    },
  ]);
}
