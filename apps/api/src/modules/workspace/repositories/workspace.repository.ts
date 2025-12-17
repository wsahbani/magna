import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Workspace, WorkspaceRole } from '@prisma/client';
import { BaseRepository } from '../../../common/repositories/base.repository';

@Injectable()
export class WorkspaceRepository extends BaseRepository<Workspace> {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  get model() {
    return this.prisma.workspace;
  }

  /**
   * Find workspace by code
   */
  async findByCode(code: string): Promise<Workspace | null> {
    return this.model.findUnique({
      where: { code },
    });
  }

  /**
   * Count workspaces
   */
  async count(where?: any): Promise<number> {
    return this.model.count(where);
  }

  /**
   * Find workspace with hierarchy (parent and children)
   */
  async findWithHierarchy(id: string): Promise<Workspace | null> {
    return this.model.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
        _count: {
          select: {
            departments: true,
            processes: true,
            workspaceMembers: true,
          },
        },
      },
    });
  }

  /**
   * Find all root workspaces (no parent)
   */
  async findRoots(): Promise<Workspace[]> {
    return this.model.findMany({
      where: {
        parentId: null,
        isActive: true,
      },
      include: {
        _count: {
          select: {
            children: true,
            departments: true,
            processes: true,
            workspaceMembers: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Find workspace children
   */
  async findChildren(parentId: string): Promise<Workspace[]> {
    return this.model.findMany({
      where: {
        parentId,
        isActive: true,
      },
      include: {
        _count: {
          select: {
            children: true,
            departments: true,
            processes: true,
            workspaceMembers: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Get workspace members
   */
  async getMembers(workspaceId: string) {
    return this.prisma.workspaceMember.findMany({
      where: { workspaceId, isActive: true },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            displayName: true,
            avatarUrl: true,
            position: true,
            isActive: true,
          },
        },
      },
      orderBy: {
        user: { firstName: 'asc' },
      },
    });
  }

  /**
   * Add member to workspace
   */
  async addMember(workspaceId: string, userId: string, role: string) {
    return this.prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId,
        role: role as WorkspaceRole,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            displayName: true,
            avatarUrl: true,
            position: true,
          },
        },
      },
    });
  }

  /**
   * Remove member from workspace
   */
  async removeMember(workspaceId: string, userId: string) {
    return this.prisma.workspaceMember.deleteMany({
      where: {
        workspaceId,
        userId,
      },
    });
  }

  /**
   * Update member role
   */
  async updateMemberRole(workspaceId: string, userId: string, role: string) {
    return this.prisma.workspaceMember.updateMany({
      where: {
        workspaceId,
        userId,
      },
      data: { role: role as WorkspaceRole },
    });
  }

  /**
   * Check if user is member of workspace
   */
  async isMember(workspaceId: string, userId: string): Promise<boolean> {
    const member = await this.prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId,
        isActive: true,
      },
    });
    return !!member;
  }

  /**
   * Get user's workspaces
   */
  async getUserWorkspaces(userId: string) {
    return this.prisma.workspaceMember.findMany({
      where: {
        userId,
        isActive: true,
      },
      include: {
        workspace: {
          include: {
            parent: true,
            _count: {
              select: {
                departments: true,
                processes: true,
                workspaceMembers: true,
              },
            },
          },
        },
      },
      orderBy: {
        workspace: { name: 'asc' },
      },
    });
  }

  /**
   * Get workspace statistics
   */
  async getStatistics(workspaceId: string) {
    const [
      totalProcesses,
      publishedProcesses,
      totalDepartments,
      totalMembers,
    ] = await Promise.all([
      this.prisma.process.count({
        where: { workspaceId },
      }),
      this.prisma.process.count({
        where: { workspaceId, status: 'PUBLISHED' },
      }),
      this.prisma.department.count({
        where: { workspaceId },
      }),
      this.prisma.workspaceMember.count({
        where: { workspaceId, isActive: true },
      }),
    ]);

    return {
      totalProcesses,
      publishedProcesses,
      totalDepartments,
      totalMembers,
    };
  }
}
