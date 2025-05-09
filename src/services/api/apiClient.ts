
import { API_BASE_URL, getDefaultHeaders, REQUEST_TIMEOUT } from './config';

// Generic API client for making HTTP requests
class ApiClient {
  // GET request
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = this.buildUrl(endpoint, params);
    const response = await this.fetchWithTimeout(url, {
      method: 'GET',
      headers: getDefaultHeaders(),
    });
    
    return this.handleResponse<T>(response);
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    const url = this.buildUrl(endpoint);
    const response = await this.fetchWithTimeout(url, {
      method: 'POST',
      headers: getDefaultHeaders(),
      body: JSON.stringify(data),
    });
    
    return this.handleResponse<T>(response);
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    const url = this.buildUrl(endpoint);
    const response = await this.fetchWithTimeout(url, {
      method: 'PUT',
      headers: getDefaultHeaders(),
      body: JSON.stringify(data),
    });
    
    return this.handleResponse<T>(response);
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    const url = this.buildUrl(endpoint);
    const response = await this.fetchWithTimeout(url, {
      method: 'PATCH',
      headers: getDefaultHeaders(),
      body: JSON.stringify(data),
    });
    
    return this.handleResponse<T>(response);
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    const url = this.buildUrl(endpoint);
    const response = await this.fetchWithTimeout(url, {
      method: 'DELETE',
      headers: getDefaultHeaders(),
    });
    
    return this.handleResponse<T>(response);
  }

  // Helper method to build URL with query parameters
  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    
    return url.toString();
  }

  // Helper method to handle response
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    
    // Check if response is empty
    const text = await response.text();
    if (!text) {
      return {} as T;
    }
    
    // Parse JSON response
    try {
      return JSON.parse(text);
    } catch (error) {
      console.error('Failed to parse JSON response', error);
      throw new Error('Invalid JSON response from server');
    }
  }

  // Helper method to add timeout to fetch requests
  private fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
    return new Promise((resolve, reject) => {
      const controller = new AbortController();
      const { signal } = controller;
      
      const timeout = setTimeout(() => {
        controller.abort();
        reject(new Error(`Request timeout after ${REQUEST_TIMEOUT}ms`));
      }, REQUEST_TIMEOUT);
      
      fetch(url, { ...options, signal })
        .then(resolve)
        .catch(reject)
        .finally(() => clearTimeout(timeout));
    });
  }
}

export const apiClient = new ApiClient();
