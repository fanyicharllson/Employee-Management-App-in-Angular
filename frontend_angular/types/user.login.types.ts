export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  companyName: string;
  companySize: string;
}

export interface LoginResponse {
  message: string;
  success: boolean;
  user: User;
}
