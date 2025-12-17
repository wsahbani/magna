/**
 * JWT Payload Interface
 * Defines the structure of the JWT token payload
 */
export interface JwtPayload {
  sub: string; // User ID
  email: string;
  firstName?: string;
  lastName?: string;
  departmentId?: string;
  iat?: number; // Issued at
  exp?: number; // Expiration
}

/**
 * User Response Interface
 * Defines the user data returned to the client (without password)
 */
export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  unitId?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Login Response Interface
 * Defines the structure of the login response
 */
export interface LoginResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
}

/**
 * Request with User Interface
 * Extends Express Request with user property
 */
export interface RequestWithUser extends Request {
  user: JwtPayload;
}
