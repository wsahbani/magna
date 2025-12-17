import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  JwtPayload,
  LoginResponse,
  UserResponse,
} from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Register a new user
   */
  async register(registerDto: RegisterDto): Promise<LoginResponse> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        hashedPassword,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        phone: registerDto.phone,
        position: registerDto.position,
        departmentId: registerDto.departmentId,
        isActive: true,
        emailVerified: false,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  /**
   * Login user
   */
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.hashedPassword || '',
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(userId: string): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.sanitizeUser(user);
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-in-production',
      });

      // Generate new access token
      const accessToken = await this.generateAccessToken(
        payload.sub,
        payload.email,
      );

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Validate user by ID
   */
  async validateUser(userId: string): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return this.sanitizeUser(user);
  }

  /**
   * Generate access and refresh tokens
   */
  private async generateTokens(
    userId: string,
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(userId, email),
      this.generateRefreshToken(userId, email),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Generate access token (short-lived)
   */
  private async generateAccessToken(
    userId: string,
    email: string,
  ): Promise<string> {
    const payload: JwtPayload = { sub: userId, email };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      expiresIn: '15m', // 15 minutes
    });
  }

  /**
   * Generate refresh token (long-lived)
   */
  private async generateRefreshToken(
    userId: string,
    email: string,
  ): Promise<string> {
    const payload: JwtPayload = { sub: userId, email };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-in-production',
      expiresIn: '7d', // 7 days
    });
  }

  /**
   * Remove sensitive data from user object
   */
  private sanitizeUser(user: any): UserResponse {
    const { hashedPassword, resetToken, resetTokenExp, ...sanitized } = user;
    return {
      ...sanitized,
      role: 'INTERNE', // TODO: Get from actual user role/workspace role
    };
  }

  /**
   * Get OIDC profile with stored tokens
   */
  async getOidcProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { group: true, department: true },
    });

    if (!user || user.provider !== 'orange-openid') {
      throw new Error('User not found or not an OIDC user');
    }

    const providerData = user.providerData as any;
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        orangeId: user.orangeId,
        group: user.group,
      },
      oidcProfile: providerData?.profile || {},
      tokens: providerData?.tokens || {},
    };
  }

  /**
   * Refresh OIDC tokens (placeholder - implement token refresh logic)
   */
  async refreshOidcTokens(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.provider !== 'orange-openid') {
      throw new Error('User not found or not an OIDC user');
    }

    const providerData = user.providerData as any;
    const refreshToken = providerData?.tokens?.refreshToken;

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // TODO: Implement actual token refresh with OIDC provider
    // This is a placeholder - you need to call the token endpoint with refresh_token
    
    return {
      message: 'Token refresh not implemented yet',
      refreshToken,
    };
  }
}
