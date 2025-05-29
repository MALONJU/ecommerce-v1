import axios from 'axios';

// Environment configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 30000;
const WITH_CREDENTIALS = import.meta.env.VITE_WITH_CREDENTIALS === 'true' || false;

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: WITH_CREDENTIALS, // Make this configurable to avoid CORS issues
});

// Request interceptor for authentication and logging
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracking
    config.metadata = { startTime: new Date() };

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
        headers: config.headers,
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

// Response interceptor for error handling and logging
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
    const { response, config } = error;

    // Log error in development
    if (import.meta.env.DEV) {
      // Check for CORS error
      if (!response && error.message.includes('Network Error')) {
        console.error(`🚫 [CORS Error] ${config?.method?.toUpperCase()} ${config?.baseURL}${config?.url}`, {
          message: 'Possible CORS issue - check server CORS configuration',
          error: error.message,
          config: {
            baseURL: config?.baseURL,
            withCredentials: config?.withCredentials,
            headers: config?.headers,
          }
        });
      } else {
        console.error(`❌ [API Error] ${config?.method?.toUpperCase()} ${config?.url}`, {
          status: response?.status,
          message: response?.data?.message || error.message,
          data: response?.data,
        });
      }
    }

    // Handle specific error cases
    if (response?.status === 401) {
      // Unauthorized - clear auth tokens and redirect to login
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');

      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    if (response?.status === 403) {
      // Forbidden - show permission error
      console.warn('Access forbidden. Insufficient permissions.');
    }

    if (response?.status >= 500) {
      // Server error - could implement retry logic here
      console.error('Server error occurred. Please try again later.');
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
    };

    return Promise.reject(enhancedError);
  }
);

// Retry logic for failed requests
const retryRequest = async (config, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await axiosInstance(config);
    } catch (error) {
      if (i === retries - 1 || error.response?.status < 500) {
        throw error;
      }

      console.warn(`Retry attempt ${i + 1} failed. Retrying in ${delay}ms...`);
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

  // Request with retry logic
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