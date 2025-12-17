# Authentication Feature Documentation

## Overview

The authentication feature provides a complete user authentication system with login, logout, and session management capabilities. It follows clean architecture principles with a clear separation of concerns.

## Architecture

### Directory Structure

```
src/features/auth/
├── context/
│   └── AuthContext.tsx       # React context for global auth state
├── services/
│   └── auth.service.ts       # API communication service
├── types/
│   └── auth.types.ts         # TypeScript interfaces
├── pages/
│   └── LoginPage.tsx         # Login UI component
├── hooks/                    # Custom hooks (future)
└── index.ts                  # Barrel exports
```

### Key Components

#### 1. **AuthContext** (`context/AuthContext.tsx`)
- **Purpose**: Manages global authentication state across the application
- **Features**:
  - User session management
  - Loading states
  - Error handling
  - Token refresh
- **API**:
  - `login(credentials)` - Authenticate user
  - `logout()` - End user session
  - `refreshToken()` - Refresh access token
  - `clearError()` - Clear authentication errors

#### 2. **AuthService** (`services/auth.service.ts`)
- **Purpose**: Handles all API calls related to authentication
- **Features**:
  - Token storage (localStorage)
  - Automatic token refresh
  - Request interceptors
- **Methods**:
  - `login(credentials)` - POST /auth/login
  - `logout()` - POST /auth/logout
  - `getCurrentUser()` - GET /auth/me
  - `refreshAccessToken()` - POST /auth/refresh

#### 3. **LoginPage** (`pages/LoginPage.tsx`)
- **Purpose**: User-facing login interface
- **Features**:
  - Form validation
  - Error messages
  - Loading states
  - Orange Group branding
  - Responsive design
  - Accessibility (WCAG compliant)

### Type Definitions

```typescript
interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'INTERNE' | 'EXTERNE'
  unitId?: string
  createdAt: string
  updatedAt: string
}

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
```

## Implementation Details

### Token Management

**Storage**: Tokens are stored in localStorage for persistence across sessions.

**Refresh Strategy**: 
1. Access token used for API requests
2. On 401 response, automatically refresh using refresh token
3. Retry original request with new token
4. If refresh fails, logout user

### Security Considerations

1. **Token Storage**: Currently using localStorage (consider httpOnly cookies for production)
2. **XSS Protection**: Sanitize all user inputs
3. **CSRF**: Implement CSRF tokens for state-changing operations
4. **HTTPS**: Enforce HTTPS in production
5. **Token Expiration**: Implement short-lived access tokens

### Error Handling

**Validation Errors**:
- Email format validation
- Password length requirements
- Real-time field validation
- User-friendly error messages

**API Errors**:
- Network failures
- Invalid credentials
- Server errors
- Token expiration

## Usage

### 1. Wrap App with AuthProvider

```tsx
// main.tsx
import { AuthProvider } from './features/auth'

createRoot(document.getElementById("app")!).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
)
```

### 2. Use Authentication in Components

```tsx
import { useAuth } from '@/features/auth'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  
  return (
    <div>
      <h1>Welcome, {user?.firstName}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### 3. Protected Routes (Future Enhancement)

```tsx
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return <LoadingSpinner />
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  
  return children
}
```

## Routes

| Path | Component | Access |
|------|-----------|--------|
| `/login` | LoginPage | Public |
| `/` | HomePage | Public (will be protected) |

## API Endpoints (Expected)

The authentication service expects the following API endpoints:

### POST /auth/login
**Request**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "INTERNE",
    "unitId": "uuid",
    "createdAt": "2025-10-31T12:00:00Z",
    "updatedAt": "2025-10-31T12:00:00Z"
  },
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token"
}
```

### POST /auth/logout
**Headers**: `Authorization: Bearer <access-token>`

**Response**: `204 No Content`

### GET /auth/me
**Headers**: `Authorization: Bearer <access-token>`

**Response**:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "INTERNE",
  "unitId": "uuid",
  "createdAt": "2025-10-31T12:00:00Z",
  "updatedAt": "2025-10-31T12:00:00Z"
}
```

### POST /auth/refresh
**Request**:
```json
{
  "refreshToken": "refresh-token"
}
```

**Response**:
```json
{
  "accessToken": "new-jwt-token"
}
```

## Environment Variables

Create a `.env` file in `apps/web/`:

```env
VITE_API_URL=http://localhost:3001
```

## Testing

### Manual Testing Checklist

- [ ] Empty form submission shows validation errors
- [ ] Invalid email format shows error
- [ ] Short password shows error
- [ ] Valid credentials trigger login request
- [ ] Invalid credentials show error message
- [ ] Successful login redirects to home
- [ ] Token stored in localStorage
- [ ] Logout clears tokens
- [ ] Refresh token on 401 response
- [ ] Responsive design works on mobile

### Future: Unit Tests

```typescript
// Example test structure
describe('AuthContext', () => {
  it('should login user with valid credentials', async () => {
    // Test implementation
  })
  
  it('should handle login errors', async () => {
    // Test implementation
  })
  
  it('should logout user', async () => {
    // Test implementation
  })
})
```

## Future Enhancements

1. **Protected Routes Component**
   - Route guards for authenticated pages
   - Role-based access control

2. **Remember Me Feature**
   - Extended session duration
   - Persistent login

3. **Password Reset Flow**
   - Forgot password page
   - Reset password page
   - Email verification

4. **Two-Factor Authentication**
   - TOTP support
   - SMS verification

5. **Social Login**
   - OAuth integration
   - SSO support

6. **Session Management**
   - Active sessions list
   - Device management
   - Force logout

7. **Security Enhancements**
   - Rate limiting
   - Captcha integration
   - Brute force protection

## Best Practices

1. **Never store sensitive data in localStorage** - Consider httpOnly cookies for production
2. **Implement proper token rotation** - Refresh tokens should rotate on use
3. **Use HTTPS in production** - Never send tokens over HTTP
4. **Implement proper error logging** - Monitor authentication failures
5. **Follow OWASP guidelines** - Regular security audits
6. **Test edge cases** - Network failures, concurrent requests, etc.

## Troubleshooting

### Login button not working
- Check browser console for errors
- Verify API endpoint is correct
- Check network tab for failed requests

### Token not persisting
- Check localStorage in browser DevTools
- Verify localStorage is not disabled
- Check for storage quota errors

### CORS errors
- Configure backend CORS properly
- Check API_BASE_URL environment variable
- Verify credentials mode in fetch requests

## Contributing

When adding new authentication features:

1. Update type definitions in `auth.types.ts`
2. Add service methods in `auth.service.ts`
3. Update context if state changes needed
4. Document API endpoints required
5. Update this documentation
6. Write tests

---

**Last Updated**: October 31, 2025
**Version**: 1.0.0
**Maintainer**: Process Manager Team
