// Update your aiApi.ts file:

import { apiClient } from './apiClient';

export interface FoundItem {
  id: string;
  name: string;
  location?: string;
  image?: string;
  tags?: string[];
  quantity?: number;
  description?: string;
}

export interface QueryStatus {
  remaining: number;
  total: number;
  resetTime?: string; // ISO string from backend
}

export interface AiResponse {
  answer: string;
  foundItems?: FoundItem[];
  queryStatus: QueryStatus;
  responseTime?: number; // in milliseconds
}

export interface AnalysisStatus {
  remaining: number;
  total: number;
  resetTime?: string; // ISO string from backend
}

export interface AnalysisRequest {
  imageData: string; // base64 encoded image (without data:image/jpeg;base64, prefix)
  mimeType: string; // image/jpeg, image/png, image/webp, etc.
}

export interface AnalysisResponse {
  name: string;
  tags: string[];
}

export interface AnalysisError {
  message: string;
  analysisStatus?: AnalysisStatus;
}

// Helper function to convert File to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const aiApi = {
  askQuestion: (question: string): Promise<AiResponse> => {
    return apiClient.post('/ai/ask', { question });
  },

  getQueryStatus: (): Promise<QueryStatus> => {
    return apiClient.get('/ai/query-status');
  },

  getAnalysisStatus: (): Promise<AnalysisStatus> => {
    return apiClient.get('/ai/analysis-status');
  },

  analyzeImage: async (file: File): Promise<AnalysisResponse> => {
    // Convert file to base64
    const base64String = await fileToBase64(file);
    
    // Remove the data:image/...;base64, prefix
    const imageData = base64String.split(',')[1];
    
    const requestBody: AnalysisRequest = {
      imageData,
      mimeType: file.type
    };

    try {
      const response = await apiClient.post('/ai/analyze-image', requestBody);
      return response;
    } catch (error: any) {
      if (error?.response?.status === 403) {
        const analysisError: AnalysisError = error.response.data;
        throw new Error(analysisError.message);
      }
      throw error;
    }
  },
};