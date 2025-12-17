import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { OidcController } from './oidc.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { OpenIDStrategy } from './strategies/openid.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { PrismaAuthProvider } from './providers/prisma-auth.provider';
import { OIDCDiscoveryService } from './services/oidc-discovery.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      signOptions: {
        expiresIn: '15m', // Access token expires in 15 minutes
      },
    }),
  ],
  controllers: [AuthController, OidcController],
  providers: [
    AuthService,
    JwtStrategy,
    OpenIDStrategy,
    JwtAuthGuard,
    AdminGuard,
    PrismaService,
    PrismaAuthProvider,
    OIDCDiscoveryService,
  ],
  exports: [AuthService, JwtAuthGuard, AdminGuard],
})
export class AuthModule {}
