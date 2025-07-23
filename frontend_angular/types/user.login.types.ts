export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  companyName: string;
  companySize: string;
  onboarding: boolean;
}

export interface LoginResponse {
  message: string;
  success: boolean;
  user: User;
}
