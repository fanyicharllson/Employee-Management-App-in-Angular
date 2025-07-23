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
