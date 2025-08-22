
// const BACKEND_BASE_URL = 'http://localhost:8080'; // dev mode
const BACKEND_PROD_API = 'https://api.teamnest.me'
export const environment = {
  production: false,
  apiBaseUrl: `${BACKEND_PROD_API}/api/v1/user-registration`,
  endapiBaseUrl: `${BACKEND_PROD_API}/api/auth`,
  onBoardingApiUrl: `${BACKEND_PROD_API}/api/user`,
  employeeApiUrl: `${BACKEND_PROD_API}/api/employee`,
  employeeRegisterApiUrl: `${BACKEND_PROD_API}/api/auth/employee`,
};
