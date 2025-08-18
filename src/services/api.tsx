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
  console.log('DEBUG: Making API request to:', endpoint, 'with token:', token ? 'present' : 'missing');
  
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
  
  console.log('DEBUG: Response status:', response.status);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('DEBUG: API request failed:', errorData);
    throw new Error(errorData.detail || `API request failed: ${response.status}`);
  }
  
  const data = await response.json();
  console.log('DEBUG: API response data:', data);
  return data;
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
    console.log('DEBUG: Fetching uploaded files...');
    const response = await apiRequest('/audio/files/original');
    console.log('DEBUG: Original files response:', response);
    
    const originalFiles = response.original_files || [];
    console.log('DEBUG: Found original files:', originalFiles.length);
    
    // Transform backend format to frontend format
    return originalFiles.map((file: any) => ({
      id: file.id,
      name: file.filename, // Use the clean filename from backend
      filename: file.filename,
      original_filename: file.original_filename,
      user_id: file.user_id,
      user_name: file.user_name,
      uploaded_at: file.uploaded_at,
      file_size: file.file_size,
      duration: file.duration,
      can_normalize: file.can_normalize,
      status: 'uploaded',
      created_at: file.uploaded_at
    }));
  } catch (error) {
    console.error('Get uploaded files error:', error);
    throw error;
  }
};

export const getNormalizedFiles = async (): Promise<AudioFile[]> => {
    try {
        const response = await apiRequest('/audio/files/normalized');
        const normalizedFiles = response.normalized_files || [];
        
        // Transform backend format to frontend format
        return normalizedFiles.map((file: any) => ({
            id: file.id,
            name: file.filename, // Use the clean filename from backend
            filename: file.filename,
            original_filename: file.original_filename,
            normalized_filename: file.normalized_filename,
            user_id: file.user_id,
            user_name: file.user_name,
            uploaded_at: file.uploaded_at,
            normalized_at: file.normalized_at,
            file_size: file.file_size,
            duration: file.duration,
            download_count: file.download_count,
            last_downloaded: file.last_downloaded,
            original_lufs: file.original_lufs,
            target_lufs: file.target_lufs,
            final_lufs: file.final_lufs,
            normalization_method: file.normalization_method,
            ready_to_download: file.ready_to_download,
            status: 'normalized',
            created_at: file.normalized_at
        }));
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

// Delete original audio file

export const deleteOriginalFile = async (fileId: string): Promise<void> => {
  const token = getToken();
  const response = await fetch(`${API_URL}/audio/files/original/${fileId}`, {
    method: 'DELETE',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to delete original file');
  }
};

// Delete normalized audio file
export const deleteNormalizedFile = async (fileId: string): Promise<void> => {
  const token = getToken();
  const response = await fetch(`${API_URL}/audio/files/normalized/${fileId}`, {
    method: 'DELETE',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to delete normalized file');
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