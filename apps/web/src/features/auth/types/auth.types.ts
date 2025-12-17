/**
 * Authentication Types
 * Defines interfaces and types for authentication features
 */

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'INTERNE' | 'EXTERNE'
  unitId?: string
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  clearError: () => void
}
