import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async create(createGroupDto: CreateGroupDto) {
    // Check if group with same name or code exists
    const existing = await this.prisma.group.findFirst({
      where: {
        OR: [
          { name: createGroupDto.name },
          { code: createGroupDto.code },
        ],
      },
    });

    if (existing) {
      throw new ConflictException('Group with this name or code already exists');
    }

    return this.prisma.group.create({
      data: createGroupDto,
      include: {
        _count: {
          select: { users: true },
        },
      },
    });
  }

  async findAll(filters?: { isActive?: boolean }) {
    return this.prisma.group.findMany({
      where: filters,
      include: {
        _count: {
          select: { users: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            position: true,
            isActive: true,
          },
        },
        permissions: true,
        _count: {
          select: { users: true },
        },
      },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    return group;
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    await this.findOne(id);

    return this.prisma.group.update({
      where: { id },
      data: updateGroupDto,
      include: {
        _count: {
          select: { users: true },
        },
      },
    });
  }

  async remove(id: string) {
    const group = await this.findOne(id);

    // Check if group has users
    if (group._count.users > 0) {
      throw new ConflictException(
        `Cannot delete group with ${group._count.users} active users. Reassign users first.`,
      );
    }

    return this.prisma.group.delete({
      where: { id },
    });
  }

  async getUsersByGroup(groupId: string) {
    await this.findOne(groupId);

    return this.prisma.user.findMany({
      where: { groupId },
      include: {
        department: true,
      },
      orderBy: {
        lastName: 'asc',
      },
    });
  }

  async addPermission(
    groupId: string,
    permission: { resource: string; action: string; conditions?: any },
  ) {
    await this.findOne(groupId);

    return this.prisma.groupPermission.create({
      data: {
        groupId,
        ...permission,
      },
    });
  }

  async removePermission(permissionId: string) {
    return this.prisma.groupPermission.delete({
      where: { id: permissionId },
    });
  }
}
