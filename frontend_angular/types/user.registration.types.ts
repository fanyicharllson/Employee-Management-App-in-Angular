export interface RegistrationPayload {
  email: string;
  password: string;
  companyName: string;
  fullName: string;
  companySize: string;
  hasAcceptTerms: boolean;
}

export interface EmployeeRegistrationPayload {
  email: string;
  password: string;
}

// Backend reponse type
export interface ApiResponse {
  success: boolean;
  message: string;
  code?: string;
  value?: string;
  isTokenUsed?: string;
  hasAccount?: string;
  token?: string;
}

export interface TokenStatus {
  isUsed: boolean;
  hasAccount: boolean;
  isConfirmed: boolean;
  employeeEmail?: string;
  companyName?: string;
  lastChecked: number;
}
