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
}
