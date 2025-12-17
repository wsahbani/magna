/**
 * Authentication Service
 * Handles API calls for authentication operations using axios
 */

import { post, get, handleApiError } from '../../../lib/base-api'
import type { LoginCredentials, LoginResponse, User } from '../types/auth.types'

class AuthService {
  /**
   * Login user with credentials
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const data = await post<LoginResponse>('/auth/login', credentials)
      
      // Store tokens
      this.setTokens(data.accessToken, data.refreshToken)
      
      return data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      this.clearTokens()
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refreshToken')
    
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const data = await post<{ accessToken: string }>('/auth/refresh', { refreshToken })
      localStorage.setItem('accessToken', data.accessToken)
      return data.accessToken
    } catch (error) {
      this.clearTokens()
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    try {
      return await get<User>('/auth/me')
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  /**
   * Set authentication tokens
   */
  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  }

  /**
   * Clear authentication tokens
   */
  private clearTokens(): void {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken')
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken()
  }
}

// Export singleton instance
export const authService = new AuthService()
