import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { WorkspaceRepository } from './repositories/workspace.repository';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class WorkspaceService {
  constructor(private readonly workspaceRepository: WorkspaceRepository) {}

  /**
   * Create a new workspace
   */
  async create(createWorkspaceDto: CreateWorkspaceDto) {
    // Check if code already exists
    const existing = await this.workspaceRepository.findByCode(
      createWorkspaceDto.code,
    );
    if (existing) {
      throw new ConflictException(
        `Workspace with code "${createWorkspaceDto.code}" already exists`,
      );
    }

    // Validate parent exists if provided
    if (createWorkspaceDto.parentId) {
      const parent = await this.workspaceRepository.findById(
        createWorkspaceDto.parentId,
      );
      if (!parent) {
        throw new NotFoundException(
          `Parent workspace with ID "${createWorkspaceDto.parentId}" not found`,
        );
      }
    }

    return this.workspaceRepository.create({
      name: createWorkspaceDto.name,
      code: createWorkspaceDto.code,
      type: createWorkspaceDto.type,
      description: createWorkspaceDto.description,
      isActive: createWorkspaceDto.isActive ?? true,
      ...(createWorkspaceDto.parentId && {
        parent: { connect: { id: createWorkspaceDto.parentId } },
      }),
    });
  }

  /**
   * Find all workspaces with pagination
   */
  async findAll(paginationDto?: PaginationDto) {
    const { page = 1, limit = 20 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.workspaceRepository.findMany({
        skip,
        take: limit,
        where: { isActive: true },
        include: {
          parent: true,
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
      }),
      this.workspaceRepository.count({ where: { isActive: true } }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find all root workspaces (hierarchy view)
   */
  async findRoots() {
    return this.workspaceRepository.findRoots();
  }

  /**
   * Find workspace by ID with full details
   */
  async findOne(id: string) {
    const workspace = await this.workspaceRepository.findWithHierarchy(id);
    
    if (!workspace) {
      throw new NotFoundException(`Workspace with ID "${id}" not found`);
    }

    return workspace;
  }

  /**
   * Find workspace children
   */
  async findChildren(id: string) {
    const workspace = await this.workspaceRepository.findById(id);
    
    if (!workspace) {
      throw new NotFoundException(`Workspace with ID "${id}" not found`);
    }

    return this.workspaceRepository.findChildren(id);
  }

  /**
   * Update workspace
   */
  async update(id: string, updateWorkspaceDto: UpdateWorkspaceDto) {
    const workspace = await this.workspaceRepository.findById(id);
    
    if (!workspace) {
      throw new NotFoundException(`Workspace with ID "${id}" not found`);
    }

    // Check code uniqueness if being updated
    if (updateWorkspaceDto.code && updateWorkspaceDto.code !== workspace.code) {
      const existing = await this.workspaceRepository.findByCode(
        updateWorkspaceDto.code,
      );
      if (existing) {
        throw new ConflictException(
          `Workspace with code "${updateWorkspaceDto.code}" already exists`,
        );
      }
    }

    // Validate parent exists if being updated
    if (updateWorkspaceDto.parentId) {
      if (updateWorkspaceDto.parentId === id) {
        throw new BadRequestException('Workspace cannot be its own parent');
      }

      const parent = await this.workspaceRepository.findById(
        updateWorkspaceDto.parentId,
      );
      if (!parent) {
        throw new NotFoundException(
          `Parent workspace with ID "${updateWorkspaceDto.parentId}" not found`,
        );
      }
    }

    return this.workspaceRepository.update(id, {
      name: updateWorkspaceDto.name,
      code: updateWorkspaceDto.code,
      type: updateWorkspaceDto.type,
      description: updateWorkspaceDto.description,
      isActive: updateWorkspaceDto.isActive,
      ...(updateWorkspaceDto.parentId && {
        parent: { connect: { id: updateWorkspaceDto.parentId } },
      }),
    });
  }

  /**
   * Delete workspace (soft delete by setting isActive to false)
   */
  async remove(id: string) {
    const workspace = await this.workspaceRepository.findById(id);
    
    if (!workspace) {
      throw new NotFoundException(`Workspace with ID "${id}" not found`);
    }

    // Check if workspace has children
    const children = await this.workspaceRepository.findChildren(id);
    if (children.length > 0) {
      throw new BadRequestException(
        'Cannot delete workspace with active children. Please delete or reassign children first.',
      );
    }

    return this.workspaceRepository.update(id, { isActive: false });
  }

  /**
   * Get workspace members
   */
  async getMembers(id: string) {
    const workspace = await this.workspaceRepository.findById(id);
    
    if (!workspace) {
      throw new NotFoundException(`Workspace with ID "${id}" not found`);
    }

    return this.workspaceRepository.getMembers(id);
  }

  /**
   * Add member to workspace
   */
  async addMember(id: string, addMemberDto: AddMemberDto) {
    const workspace = await this.workspaceRepository.findById(id);
    
    if (!workspace) {
      throw new NotFoundException(`Workspace with ID "${id}" not found`);
    }

    // Check if user is already a member
    const isMember = await this.workspaceRepository.isMember(
      id,
      addMemberDto.userId,
    );
    
    if (isMember) {
      throw new ConflictException('User is already a member of this workspace');
    }

    return this.workspaceRepository.addMember(
      id,
      addMemberDto.userId,
      addMemberDto.role,
    );
  }

  /**
   * Remove member from workspace
   */
  async removeMember(id: string, userId: string) {
    const workspace = await this.workspaceRepository.findById(id);
    
    if (!workspace) {
      throw new NotFoundException(`Workspace with ID "${id}" not found`);
    }

    const isMember = await this.workspaceRepository.isMember(id, userId);
    
    if (!isMember) {
      throw new NotFoundException('User is not a member of this workspace');
    }

    await this.workspaceRepository.removeMember(id, userId);
    
    return { message: 'Member removed successfully' };
  }

  /**
   * Update member role
   */
  async updateMemberRole(
    id: string,
    userId: string,
    role: string,
  ) {
    const workspace = await this.workspaceRepository.findById(id);
    
    if (!workspace) {
      throw new NotFoundException(`Workspace with ID "${id}" not found`);
    }

    const isMember = await this.workspaceRepository.isMember(id, userId);
    
    if (!isMember) {
      throw new NotFoundException('User is not a member of this workspace');
    }

    await this.workspaceRepository.updateMemberRole(id, userId, role);
    
    return { message: 'Member role updated successfully' };
  }

  /**
   * Get workspace statistics
   */
  async getStatistics(id: string) {
    const workspace = await this.workspaceRepository.findById(id);
    
    if (!workspace) {
      throw new NotFoundException(`Workspace with ID "${id}" not found`);
    }

    return this.workspaceRepository.getStatistics(id);
  }

  /**
   * Get user's workspaces
   */
  async getUserWorkspaces(userId: string) {
    return this.workspaceRepository.getUserWorkspaces(userId);
  }
}
