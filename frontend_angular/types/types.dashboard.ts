import { LucideIconData } from "lucide-angular";

// Types
export interface SidebarItem {
  icon: LucideIconData;
  label: string;
  active: boolean;
}

export interface Employee {
  id: number;
  name: string;
  role: string;
  avatar: string;
  status: string;
  tag: string;
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
  value: string;
  change: string;
  color: string;
  icon: string;
}

export interface ProfileRoute {
  icon: LucideIconData;
  text: string;
  route: string;
  btn?: boolean;
}