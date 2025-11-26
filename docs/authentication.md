# Authentication Setup

## Overview

The Process Manager application uses JWT-based authentication with access and refresh tokens.

## Test Credentials

The database seed file creates three test users:

| Email | Password | Role | Department |
|-------|----------|------|------------|
| alice.johnson@orange.com | Orange123! | Process Manager | IT |
| bob.smith@orange.com | Orange123! | IT Director | IT |
| charlie.brown@orange.com | Orange123! | HR Manager | HR |

## Authentication Flow

### Login
1. User enters email and password on `/login` page
2. Credentials are sent to `POST /auth/login`
3. API validates credentials and returns:
   - `accessToken` (short-lived, 1 hour)
   - `refreshToken` (long-lived, 7 days)
   - User profile data
4. Tokens are stored in `localStorage`
5. User is redirected to dashboard (`/`)

### Token Refresh
- Access token expires after 1 hour
- When API returns 401, the app automatically:
  1. Uses refresh token to get new access token
  2. Retries the original request
  3. If refresh fails, redirects to login

### Logout
- Clears tokens from localStorage
- Redirects to login page

## Protected Routes

All routes except `/login` require authentication:
- If not authenticated → redirect to `/login`
- If authenticated and accessing `/login` → redirect to `/`

## API Endpoints

### POST /auth/login
Login with email and password

**Request:**
```json
{
  "email": "alice.johnson@orange.com",
  "password": "Orange123!"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clx1234567890",
    "email": "alice.johnson@orange.com",
    "firstName": "Alice",
    "lastName": "Johnson",
    "displayName": "Alice J.",
    "position": "Process Manager",
    "isActive": true
  }
}
```

### GET /auth/me
Get current user profile (requires authentication)

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "id": "clx1234567890",
  "email": "alice.johnson@orange.com",
  "firstName": "Alice",
  "lastName": "Johnson",
  "displayName": "Alice J.",
  "position": "Process Manager",
  "isActive": true
}
```

### POST /auth/refresh
Refresh access token

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /auth/logout
Logout user (requires authentication)

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:** 204 No Content

## Environment Variables

### Frontend (`apps/web/.env`)
```env
VITE_API_URL=http://localhost:3001
```

### Backend (`apps/api/.env`)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/process_manager"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="1h"
JWT_REFRESH_SECRET="your-refresh-secret-key"
JWT_REFRESH_EXPIRES_IN="7d"
```

## Security Features

1. **Password Hashing**: Passwords are hashed with bcrypt (10 rounds)
2. **JWT Tokens**: Signed with secret keys
3. **Token Expiration**: Access tokens expire after 1 hour
4. **Refresh Tokens**: Allows seamless re-authentication
5. **CORS Protection**: API only accepts requests from frontend origin
6. **Request Validation**: All inputs validated with class-validator

## Development Mode

In development mode, the login page displays test credentials with a "Click to fill" button for quick testing.

## Testing Authentication

### Using Swagger UI
1. Open http://localhost:3001/api/docs
2. Click "Authorize" button (lock icon)
3. Use one of the test credentials to login
4. Copy the `accessToken` from response
5. Paste into the authorization modal
6. Test protected endpoints

### Using the Frontend
1. Start both servers:
   ```bash
   # Terminal 1 - API
   cd apps/api && pnpm run dev
   
   # Terminal 2 - Frontend
   cd apps/web && pnpm run dev
   ```
2. Open http://localhost:5174
3. Use test credentials from the blue box
4. You should be redirected to dashboard after login

## Troubleshooting

### "Invalid credentials" error
- Check that the database is seeded: `cd apps/api && pnpm run db:seed`
- Verify email and password are correct

### "No response from server" error
- Ensure API server is running on port 3001
- Check `VITE_API_URL` in `.env` file

### Redirecting to login after successful login
- Check browser console for errors
- Verify tokens are being stored in localStorage
- Check that API is returning valid JWT tokens

### Token expired immediately
- Check system clock is correct
- Verify JWT_EXPIRES_IN is set correctly in API `.env`
