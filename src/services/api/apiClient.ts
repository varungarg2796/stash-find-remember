
import { API_BASE_URL, getDefaultHeaders, REQUEST_TIMEOUT } from './config';

interface RequestConfig {
  headers?: Record<string, string>;
}

// Generic API client for making HTTP requests
class ApiClient {
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: () => void;
    reject: (error: Error) => void;
  }> = [];

  private processQueue(error: Error | null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
    
    this.failedQueue = [];
  }

  private async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    
    return data.accessToken;
  }

  private async handleTokenRefresh(originalRequest: () => Promise<Response>): Promise<Response> {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({
          resolve: () => {
            originalRequest().then(resolve).catch(reject);
          },
          reject,
        });
      });
    }

    this.isRefreshing = true;

    try {
      await this.refreshToken();
      this.processQueue(null);
      return await originalRequest();
    } catch (error) {
      this.processQueue(error as Error);
      // Clear tokens and redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/';
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }
  // GET request
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = this.buildUrl(endpoint, params);
    const makeRequest = () => this.fetchWithTimeout(url, {
      method: 'GET',
      headers: getDefaultHeaders(),
    });
    
    const response = await makeRequest();
    return this.handleResponse<T>(response, makeRequest);
  }

  async post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const url = this.buildUrl(endpoint);
    const makeRequest = () => {
      const headers = { ...getDefaultHeaders(), ...config?.headers };

      // When sending FormData, the browser sets the Content-Type with the boundary.
      // If we send FormData, we must remove our manual 'Content-Type' header.
      if (data instanceof FormData) {
        delete headers['Content-Type'];
      }

      return this.fetchWithTimeout(url, {
        method: 'POST',
        headers: headers,
        body: data instanceof FormData ? data : JSON.stringify(data),
      });
    };
    
    const response = await makeRequest();
    return this.handleResponse<T>(response, makeRequest);
  }

  async put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const url = this.buildUrl(endpoint);
    const makeRequest = () => this.fetchWithTimeout(url, {
      method: 'PUT',
      headers: { ...getDefaultHeaders(), ...config?.headers },
      body: JSON.stringify(data),
    });
    
    const response = await makeRequest();
    return this.handleResponse<T>(response, makeRequest);
  }

  async patch<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const url = this.buildUrl(endpoint);
    const makeRequest = () => this.fetchWithTimeout(url, {
      method: 'PATCH',
      headers: { ...getDefaultHeaders(), ...config?.headers },
      body: JSON.stringify(data),
    });
    
    const response = await makeRequest();
    return this.handleResponse<T>(response, makeRequest);
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    const url = this.buildUrl(endpoint);
    const makeRequest = () => this.fetchWithTimeout(url, {
      method: 'DELETE',
      headers: getDefaultHeaders(),
    });
    
    const response = await makeRequest();
    return this.handleResponse<T>(response, makeRequest);
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

  // Helper method to handle response with token refresh
  private async handleResponse<T>(response: Response, retryRequest?: () => Promise<Response>): Promise<T> {
    if (response.status === 401 && retryRequest) {
      const newResponse = await this.handleTokenRefresh(retryRequest);
      return await this.handleResponse<T>(newResponse);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(this.getErrorMessage(errorData, `Request failed with status ${response.status}`));
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

  private getErrorMessage(errorData: any, fallback: string): string {
    if (typeof errorData === 'string') {
      return errorData;
    }

    if (errorData.message) {
      if (typeof errorData.message === 'string') {
        return errorData.message;
      }
      if (typeof errorData.message === 'object' && errorData.message.message) {
        return errorData.message.message;
      }
    }

    if (errorData.error) {
      return errorData.error;
    }

    return fallback;
  }
}

export const apiClient = new ApiClient();
