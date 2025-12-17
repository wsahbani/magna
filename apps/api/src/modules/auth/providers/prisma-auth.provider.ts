import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class PrismaAuthProvider {
  constructor(private prisma: PrismaService) {}

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        group: true,
        department: true,
      },
    });
  }

  async createOidcUser(data: {
    email: string;
    firstName?: string;
    lastName?: string;
    orangeId: string;
    profile: any;
  }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        orangeId: data.orangeId,
        provider: 'orange-openid',
        providerData: data.profile,
        emailVerified: true,
        isActive: true,
      },
      include: {
        group: true,
        department: true,
      },
    });
  }

  async updateOidcUser(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      orangeId: string;
      profile: any;
    },
  ) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        orangeId: data.orangeId,
        providerData: data.profile,
        lastLoginAt: new Date(),
      },
      include: {
        group: true,
        department: true,
      },
    });
  }

  async storeOidcTokens(
    userId: string,
    tokens: {
      idToken: string;
      accessToken: string;
      refreshToken?: string;
      expiresAt?: number;
      jti?: string;
      scope?: string;
    },
  ) {
    // Store tokens in providerData for now
    // You can create a separate OidcTokens table if needed
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const currentProviderData = (user?.providerData as any) || {};

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        providerData: {
          ...currentProviderData,
          tokens: {
            idToken: tokens.idToken,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresAt: tokens.expiresAt,
            jti: tokens.jti,
            scope: tokens.scope,
            updatedAt: new Date().toISOString(),
          },
        },
      },
    });
  }
}
