import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { PrismaService } from '../../../database/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { group: true, department: true },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.hashedPassword) {
      throw new UnauthorizedException('Please use Orange SSO to login');
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { hashedPassword, ...result } = user;
    return result;
  }
}
