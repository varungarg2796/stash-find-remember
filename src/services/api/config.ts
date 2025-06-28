// The new API_BASE_URL reads from the Vite environment variable.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// This function will be updated in the next step to include the real auth token.
export const getDefaultHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // We will add the real token logic here in the next step.
  const token = localStorage.getItem('accessToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Request timeout remains the same.
export const REQUEST_TIMEOUT = 30000;