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
  profileImg?: string;
}

export interface AddEmployeeResponse {
  id: string;
  email: string;
  companyName: string;
  department: string;
  fullName: string;
  role: 'employee';
  occupation: string;
  profileImg: string;
}

// Dialog result: {
//   "email": "fam@gmail.com",
//     "companyName": "Emma Inc",
//     "department": "Marketing",
//     "fullName": "Pull",
//     "role": "Employee"
// }
