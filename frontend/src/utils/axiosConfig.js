import axios from 'axios';

// Environment configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 30000;
const WITH_CREDENTIALS = import.meta.env.VITE_WITH_CREDENTIALS === 'true' || false;

// Token storage keys - standardized across the application
const TOKEN_KEYS = {
  ACCESS_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData'
};

// Token refresh state management to prevent multiple concurrent refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Token management utilities
export const tokenManager = {
  getAccessToken: () => {
    return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN) ||
           sessionStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
  },

  getRefreshToken: () => {
    return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN) ||
           sessionStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
  },

  setTokens: (accessToken, refreshToken, rememberMe = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;

    if (accessToken) {
      storage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
      // Clear from the other storage to avoid conflicts
      const otherStorage = rememberMe ? sessionStorage : localStorage;
      otherStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
    }

    if (refreshToken) {
      storage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
      const otherStorage = rememberMe ? sessionStorage : localStorage;
      otherStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
    }
  },

  setUserData: (userData, rememberMe = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEYS.USER_DATA, JSON.stringify(userData));

    // Clear from the other storage
    const otherStorage = rememberMe ? sessionStorage : localStorage;
    otherStorage.removeItem(TOKEN_KEYS.USER_DATA);
  },

  getUserData: () => {
    const userData = localStorage.getItem(TOKEN_KEYS.USER_DATA) ||
                    sessionStorage.getItem(TOKEN_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  },

  clearTokens: () => {
    // Clear from both storages
    [localStorage, sessionStorage].forEach(storage => {
      Object.values(TOKEN_KEYS).forEach(key => {
        storage.removeItem(key);
      });
    });
  },

  isTokenExpired: (token) => {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.warn('Error parsing token:', error);
      return true;
    }
  }
};

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: WITH_CREDENTIALS,
});

// Request interceptor for authentication and logging
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = tokenManager.getAccessToken();
    if (token && !tokenManager.isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracking
    config.metadata = { startTime: new Date() };

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
        headers: { ...config.headers, Authorization: config.headers.Authorization ? '[REDACTED]' : undefined },
        data: config.data,
        withCredentials: config.withCredentials,
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ [API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor with automatic token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      const duration = new Date() - response.config.metadata.startTime;
      console.log(`✅ [API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        duration: `${duration}ms`,
        data: response.data,
      });
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const { response } = error;

    // Log error in development
    if (import.meta.env.DEV) {
      if (!response && error.message.includes('Network Error')) {
        console.error(`🚫 [CORS Error] ${originalRequest?.method?.toUpperCase()} ${originalRequest?.baseURL}${originalRequest?.url}`, {
          message: 'Possible CORS issue - check server CORS configuration',
          error: error.message,
          config: {
            baseURL: originalRequest?.baseURL,
            withCredentials: originalRequest?.withCredentials,
            headers: originalRequest?.headers,
          }
        });
      } else {
        console.error(`❌ [API Error] ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, {
          status: response?.status,
          message: response?.data?.message || error.message,
          data: response?.data,
        });
      }
    }

    // Handle 401 Unauthorized with automatic token refresh
    if (response?.status === 401 && !originalRequest._retry) {
      const refreshToken = tokenManager.getRefreshToken();

      // If no refresh token available, redirect to login
      if (!refreshToken || tokenManager.isTokenExpired(refreshToken)) {
        tokenManager.clearTokens();
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      // Mark request as retried to prevent infinite loops
      originalRequest._retry = true;

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      isRefreshing = true;

      try {
        console.log('🔄 [Token Refresh] Attempting to refresh access token...');

        // Attempt to refresh the token
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken: refreshToken
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 second timeout for refresh requests
        });

        const { token: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data;

        // Determine storage preference based on where tokens were originally stored
        const rememberMe = !!localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);

        // Update tokens in storage
        tokenManager.setTokens(newAccessToken, newRefreshToken || refreshToken, rememberMe);

        // Update the default Authorization header
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

        console.log('✅ [Token Refresh] Successfully refreshed access token');

        // Process the queue with the new token
        processQueue(null, newAccessToken);

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        console.error('❌ [Token Refresh] Failed to refresh token:', refreshError);

        // Process the queue with error
        processQueue(refreshError, null);

        // Clear tokens and redirect to login
        tokenManager.clearTokens();

        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other error cases
    if (response?.status === 403) {
      console.warn('🚫 [Access Forbidden] Insufficient permissions for this resource');
    }

    if (response?.status >= 500) {
      console.error('🔥 [Server Error] Internal server error occurred');
    }

    // Enhance error object with custom properties
    const enhancedError = {
      ...error,
      isAxiosError: true,
      status: response?.status,
      data: response?.data,
      message: response?.data?.message || error.message,
      timestamp: new Date().toISOString(),
      isCorsError: !response && error.message.includes('Network Error'),
      isAuthError: response?.status === 401,
      isForbiddenError: response?.status === 403,
      isServerError: response?.status >= 500,
    };

    return Promise.reject(enhancedError);
  }
);

// Retry logic for failed requests (excluding auth errors)
const retryRequest = async (config, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await axiosInstance(config);
    } catch (error) {
      // Don't retry auth errors or if this is the last attempt
      if (i === retries - 1 || error.isAuthError || error.response?.status < 500) {
        throw error;
      }

      console.warn(`⏳ [Retry] Attempt ${i + 1} failed. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i))); // Exponential backoff
    }
  }
};

// Helper functions for common HTTP methods with enhanced error handling
export const apiClient = {
  // GET request
  get: async (url, config = {}) => {
    const response = await axiosInstance.get(url, config);
    return response.data;
  },

  // POST request
  post: async (url, data = {}, config = {}) => {
    const response = await axiosInstance.post(url, data, config);
    return response.data;
  },

  // PUT request
  put: async (url, data = {}, config = {}) => {
    const response = await axiosInstance.put(url, data, config);
    return response.data;
  },

  // PATCH request
  patch: async (url, data = {}, config = {}) => {
    const response = await axiosInstance.patch(url, data, config);
    return response.data;
  },

  // DELETE request
  delete: async (url, config = {}) => {
    const response = await axiosInstance.delete(url, config);
    return response.data;
  },

  // Upload file with progress tracking
  upload: async (url, file, onProgress = null, config = {}) => {
    const formData = new FormData();
    formData.append('file', file);

    const uploadConfig = {
      ...config,
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    };

    const response = await axiosInstance.post(url, formData, uploadConfig);
    return response.data;
  },

  // Download file
  download: async (url, filename, config = {}) => {
    const response = await axiosInstance.get(url, {
      ...config,
      responseType: 'blob',
    });

    // Create download link
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);

    return response.data;
  },

  // Request with retry logic (excludes auth errors)
  withRetry: (config, retries = 3, delay = 1000) => {
    return retryRequest(config, retries, delay);
  },
};

// Cancel token utilities
export const cancelToken = {
  create: () => axios.CancelToken.source(),
  isCancel: (error) => axios.isCancel(error),
};

// Request queue for managing concurrent requests
class RequestQueue {
  constructor(maxConcurrent = 10) {
    this.maxConcurrent = maxConcurrent;
    this.queue = [];
    this.running = 0;
  }

  async add(requestFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ requestFn, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    this.running++;
    const { requestFn, resolve, reject } = this.queue.shift();

    try {
      const result = await requestFn();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.running--;
      this.process();
    }
  }
}

export const requestQueue = new RequestQueue();

// Export configured axios instance for direct use if needed
export { axiosInstance };

// Default export
export default apiClient;