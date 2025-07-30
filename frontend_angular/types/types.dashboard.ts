import { LucideIconData } from "lucide-angular";

// Types
export interface SidebarItem {
  icon: LucideIconData;
  label: string;
  route: string;
}

export interface Employee {
  id: number;
  name: string;
  role: string;
  avatar: string;
  status: string;
  tag: string;
}
export interface Employees {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  avatar: string;
}

export  interface PaginationInfo {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}


export interface Task {
  id: number;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  status: string;
}

export interface ChartData {
  month: string;
  value: number;
}

export interface StatCard {
  title: string;
  value: number | string;
  change: string;
  color: string;
  icon: LucideIconData;
}

export interface ProfileRoute {
  icon: LucideIconData;
  text: string;
  route: string;
  btn?: boolean;
}

export interface OnboardingResponse {
  jobTitle: string;
  department: string;
  roleType: string; // or enum if you have one
  teamSize: string;
  totalHires: number;
  salaryRange: number;
  experience: string;
  goals: string[];
  notifications: boolean;
  onboarding: boolean;
  createdAt: string; // ISO date string
}
