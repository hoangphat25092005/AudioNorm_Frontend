import { getToken, setToken, removeToken } from './auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Types
export interface UserData {
  username: string;
  email: string;
  created_at?: string;
  profile_picture?: string;
  auth_provider?: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: UserData;
}

export interface FeedbackData {
  feedback_text: string;
  rating?: number;
}

export interface FeedbackResponse {
  id: string;
  feedback_text: string;
  rating?: number;
  user_id: string;
  user_name?: string;
  user_email?: string;
  created_at: string;
  responses: FeedbackResponseItem[];
  response_count: number;
}

export interface FeedbackResponseItem {
  id: string;
  response_text: string;
  feedback_id: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  created_at: string;
}

export interface FeedbackResponseData {
  response_text: string;
  feedback_id: string;
}

export interface AudioFile {
  id: string;
  name: string;
  artist?: string;
  genre?: string;
  duration?: string;
  db?: number;
  file_url?: string;
  original_filename?: string;
  normalized_filename?: string;
  target_lufs?: number;
  final_lufs?: number;
  original_lufs?: number;
  normalization_method?: string;
  created_at?: string;
  status?: string;
  gridfs_id?: string;
  original_upload_id?: string;
  is_stored?: boolean;
  ready_to_download?: boolean;
}

// Helper function for API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API request failed: ${response.status}`);
  }
  
  return response.json();
};

// Auth API
export const registerUser = async (userData: RegisterData): Promise<UserData> => {
  try {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const loginUser = async (credentials: LoginData): Promise<LoginResponse> => {
  try {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store token
    if (data.access_token) {
      setToken(data.access_token);
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getGoogleAuthUrl = (): string => {
  return `${API_URL}/auth/google/login`;
};

export const logoutUser = (): void => {
  removeToken();
};

// Feedback API
export const submitFeedback = async (feedbackData: FeedbackData): Promise<any> => {
  try {
    return await apiRequest('/feedback/submit', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    throw error;
  }
};

export const getAllFeedback = async (): Promise<FeedbackResponse[]> => {
  try {
    return await apiRequest('/feedback/');
  } catch (error) {
    console.error('Get feedback error:', error);
    throw error;
  }
};

export const getFeedbackWithResponses = async (feedbackId: string): Promise<FeedbackResponse> => {
  try {
    return await apiRequest(`/feedback/${feedbackId}`);
  } catch (error) {
    console.error('Get feedback with responses error:', error);
    throw error;
  }
};

export const respondToFeedback = async (responseData: FeedbackResponseData): Promise<any> => {
  try {
    return await apiRequest('/feedback/respond', {
      method: 'POST',
      body: JSON.stringify(responseData),
    });
  } catch (error) {
    console.error('Feedback response error:', error);
    throw error;
  }
};

export const getUserFeedback = async (): Promise<FeedbackResponse[]> => {
  try {
    return await apiRequest('/feedback/user/my-feedback');
  } catch (error) {
    console.error('Get user feedback error:', error);
    throw error;
  }
};

// Library/Audio API - Updated to integrate with audio normalization
export const uploadFiles = async (files: File[]): Promise<any> => {
  try {
    // Upload files one by one since the backend expects single file uploads
    const results = [];
    
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_URL}/audio/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed for ${file.name}`);
      }
      
      const result = await response.json();
      results.push(result);
    }
    
    return {
      status: 'success',
      results,
      message: `${files.length} file(s) uploaded successfully`
    };
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
};

// New function to get uploaded files (not normalized yet)
export const getUploadedFiles = async (): Promise<any[]> => {
  try {
    return await apiRequest('/audio/uploads');
  } catch (error) {
    console.error('Get uploaded files error:', error);
    throw error;
  }
};
export const getNormalizedFiles = async (): Promise<AudioFile[]> => {
    try {
        return await apiRequest('/audio/normalized-files');
    } catch (error) {
        console.error('Error fetching normalized files:', error);
        throw error;
    }
};
// New function to normalize an uploaded file by its ID
export const normalizeUploadedFile = async (fileId: string, targetLufs: number = -23.0): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/audio/normalize-uploaded/${fileId}/${targetLufs}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Normalization failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('File normalization error:', error);
    throw error;
  }
};

// New function to upload and normalize audio files
export const uploadAndNormalizeFiles = async (files: File[], targetLufs: number = -23.0): Promise<any> => {
  try {
    const results = [];
    
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_URL}/audio/normalize/${targetLufs}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Normalization failed for ${file.name}`);
      }
      
      const result = await response.json();
      results.push(result);
    }
    
    return {
      status: 'success',
      results,
      message: `${files.length} file(s) normalized successfully`
    };
  } catch (error) {
    console.error('Audio normalization error:', error);
    throw error;
  }
};

// Function to analyze audio files without normalization
export const analyzeAudioFiles = async (files: File[]): Promise<any> => {
  try {
    const results = [];
    
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_URL}/audio/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Analysis failed for ${file.name}`);
      }
      
      const result = await response.json();
      results.push(result);
    }
    
    return {
      status: 'success',
      results,
      message: `${files.length} file(s) analyzed successfully`
    };
  } catch (error) {
    console.error('Audio analysis error:', error);
    throw error;
  }
};

export const getUserFiles = async (): Promise<AudioFile[]> => {
  try {
    return await apiRequest('/audio/files');
  } catch (error) {
    console.error('Get files error:', error);
    throw error;
  }
};

export const getFileUrl = (fileId: string): string => {
  return `${API_URL}/audio/stream/${fileId}`;
};

export const exportFile = async (fileId: string): Promise<Blob> => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/audio/export/${fileId}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'File export failed');
    }
    
    return await response.blob();
  } catch (error) {
    console.error('File export error:', error);
    throw error;
  }
};

export const exportAllFiles = async (): Promise<Blob> => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/audio/export-all`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    
    if (!response.ok) {
      throw new Error('Bulk export failed');
    }
    
    return await response.blob();
  } catch (error) {
    console.error('Bulk export error:', error);
    throw error;
  }
};

// Additional API functions for audio normalization features
export const getNormalizationHistory = async (): Promise<any> => {
  try {
    return await apiRequest('/audio/history');
  } catch (error) {
    console.error('Get normalization history error:', error);
    throw error;
  }
};

export const getAudioDependencyStatus = async (): Promise<any> => {
  try {
    return await apiRequest('/audio/dependencies');
  } catch (error) {
    console.error('Get audio dependency status error:', error);
    throw error;
  }
};

export const getAudioStatus = async (): Promise<any> => {
  try {
    return await apiRequest('/audio/status');
  } catch (error) {
    console.error('Get audio status error:', error);
    throw error;
  }
};

// User API
export const getUserProfile = async (): Promise<UserData> => {
  try {
    return await apiRequest('/users/profile');
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};