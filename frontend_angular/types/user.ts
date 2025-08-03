export interface OnboardingData {
  jobTitle: string;
  department: string;
  roleType: 'HR' | 'employee';
  teamSize?: string;
  totalHires: number;
  salaryRange?: string;
  experience: string;
  goals: string[];
  notifications: boolean;
  onboarding: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  companyName: string;
  companySize: string;
  profile?: OnboardingData;
}

export interface AddEmployeeInfo {
  email: string;
  companyName: string;
  department: string;
  fullName: string;
  role: 'employee';
  occupation: string;
}

export interface AddEmployeeResponse {
  id: string; // employee id
  HrId: string; // HR Id which will be return to fetch the employees that belong to the HR
  email: string;
  companyName: string;
  department: string;
  fullName: string;
  role: 'employee';
  occupation: string;
}

export type Employee = AddEmployeeResponse;
