import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password if provided
    let hashedPassword: string | undefined;
    if (createUserDto.password) {
      hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    }

    delete createUserDto.password;
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        hashedPassword,
        provider: 'local',
      },
      include: {
        group: true,
        department: true,
      },
    });

    // Remove sensitive data
    const { hashedPassword: _, ...result } = user;
    return result;
  }

  async findAll(filters?: { groupId?: string; isActive?: boolean }) {
    return this.prisma.user.findMany({
      where: filters,
      include: {
        group: true,
        department: true,
      },
      orderBy: {
        lastName: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        group: true,
        department: true,
        workspaceMembers: {
          include: {
            workspace: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { hashedPassword: _, ...result } = user;
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // Check if user exists
    await this.findOne(id);

    // If password is being updated, hash it
    let hashedPassword: string | undefined;
    if (updateUserDto.password) {
      hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        hashedPassword,
      },
      include: {
        group: true,
        department: true,
      },
    });

    const { hashedPassword: _, ...result } = user;
    return result;
  }

  async remove(id: string) {
    await this.findOne(id);
    
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async assignToGroup(userId: string, groupId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { groupId },
      include: { group: true },
    });
  }

  async removeFromGroup(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { groupId: null },
      include: { group: true },
    });
  }
}
