/**
 * Login Page
 * User authentication page with Orange Group branding
 */

import { useState, type FormEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../context/AuthContext'
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from '@repo/ui'
import { AlertCircle, Loader2, Mail, Lock } from 'lucide-react'
import { LogoOrange } from '@repo/ui/components/logo-orange'
export function LoginPage() {
  const navigate = useNavigate()
  const { login, error, isLoading, clearError } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
  })

  /**
   * Fill in test credentials
   */
  const useTestCredentials = () => {
    setFormData({
      email: 'alice.johnson@orange.com',
      password: 'Orange123!',
    })
  }
  /**
   * Validate form fields
   */
  const validateForm = (): boolean => {
    const errors = {
      email: '',
      password: '',
    }
    
    let isValid = true

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required'
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format'
      isValid = false
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required'
      isValid = false
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
      isValid = false
    }

    setValidationErrors(errors)
    return isValid
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    clearError()
    
    if (!validateForm()) {
      return
    }

    try {
      await login(formData)
      // Redirect to home page after successful login
      navigate({ to: '/' })
    } catch (err) {
      // Error is handled by the AuthContext
      console.error('Login failed:', err)
    }
  }

  /**
   * Handle input changes
   */
  const handleChange = (field: 'email' | 'password') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }))
    }
    // Clear auth error
    if (error) {
      clearError()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5EB] via-white to-[#FFE6CC] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 ">
          <LogoOrange />
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">
           MAGNA
          </h1>
          <p className="text-gray-600">Orange Group</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Development Test Credentials */}
            {import.meta.env.DEV && (
              <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-900 mb-2">Test Credentials:</p>
                <div className="space-y-1 text-xs text-blue-800">
                  <p>Email: <code className="bg-blue-100 px-1 rounded">alice.johnson@orange.com</code></p>
                  <p>Password: <code className="bg-blue-100 px-1 rounded">Orange123!</code></p>
                </div>
                <button
                  type="button"
                  onClick={useTestCredentials}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                  disabled={isLoading}
                >
                  Click to fill credentials
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Global Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-red-800 font-medium">Login Failed</p>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange('email')}
                    className={`pl-10 ${
                      validationErrors.email ? 'border-red-500 focus-visible:ring-red-500' : ''
                    }`}
                    disabled={isLoading}
                    autoComplete="email"
                    autoFocus
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-sm text-red-600">{validationErrors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange('password')}
                    className={`pl-10 ${
                      validationErrors.password ? 'border-red-500 focus-visible:ring-red-500' : ''
                    }`}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                </div>
                {validationErrors.password && (
                  <p className="text-sm text-red-600">{validationErrors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#FF7900] border-gray-300 rounded focus:ring-[#FF7900]"
                  />
                  <span className="text-sm text-gray-700">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-[#FF7900] hover:text-[#E66D00] font-medium"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-[#FF7900] hover:bg-[#E66D00] active:bg-[#CC6100] text-white shadow-sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">New to Process Manager?</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-gray-600 hover:text-gray-900"
                  disabled={isLoading}
                >
                  Request access from your administrator
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-8">
          © 2025 Orange Group. All rights reserved.
        </p>
      </div>
    </div>
  )
}
