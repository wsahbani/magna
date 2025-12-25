/**
 * Base API Configuration
 * Axios instance with interceptors for authentication and error handling
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 90000, // 90 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request Interceptor
 * Adds authentication token to requests
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get access token from localStorage
    const accessToken = localStorage.getItem('accessToken')
    
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 * Handles token refresh and error responses
 */
apiClient.interceptors.response.use(
  (response) => {
    // Return successful responses as-is
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Get refresh token
        const refreshToken = localStorage.getItem('refreshToken')
        
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        // Request new access token
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        )

        const { accessToken } = response.data

        // Store new access token
        localStorage.setItem('accessToken', accessToken)

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
        }
        
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        
        // Redirect to login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
        
        return Promise.reject(refreshError)
      }
    }

    // Handle other errors
    return Promise.reject(error)
  }
)

/**
 * API Error Handler
 * Extracts error messages from API responses
 */
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message: string; error?: string }>
    
    // Server responded with error
    if (axiosError.response) {
      const message = axiosError.response.data?.message || 
                     axiosError.response.data?.error ||
                     'An error occurred'
      return Array.isArray(message) ? message[0] : message
    }
    
    // Request made but no response
    if (axiosError.request) {
      return 'No response from server. Please check your connection.'
    }
    
    // Request setup error
    return axiosError.message || 'Failed to make request'
  }
  
  // Unknown error
  return error instanceof Error ? error.message : 'An unexpected error occurred'
}

/**
 * Generic GET request
 */
export const get = async <T = any>(url: string, config: any = {}): Promise<T> => {
  // Clean up undefined params
  if (config.params) {
    config.params = Object.fromEntries(
      Object.entries(config.params).filter(([_, value]) => value !== undefined && value !== null && value !== '')
    )
  }
  const response = await apiClient.get<T>(url, config)
  return response.data
}

/**
 * Generic POST request
 */
export const post = async <T = any>(url: string, data?: any, config = {}): Promise<T> => {
  const response = await apiClient.post<T>(url, data, config)
  return response.data
}

/**
 * Generic PUT request
 */
export const put = async <T = any>(url: string, data?: any, config = {}): Promise<T> => {
  const response = await apiClient.put<T>(url, data, config)
  return response.data
}

/**
 * Generic PATCH request
 */
export const patch = async <T = any>(url: string, data?: any, config = {}): Promise<T> => {
  const response = await apiClient.patch<T>(url, data, config)
  return response.data
}

/**
 * Generic DELETE request
 */
export const del = async <T = any>(url: string, config = {}): Promise<T> => {
  const response = await apiClient.delete<T>(url, config)
  return response.data
}

/**
 * Upload file with multipart/form-data
 */
export const uploadFile = async <T = any>(
  url: string,
  file: File,
  onUploadProgress?: (progressEvent: any) => void
): Promise<T> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await apiClient.post<T>(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  })

  return response.data
}

// Export axios instance for custom usage
export { apiClient }

// Export default instance
export default apiClient
