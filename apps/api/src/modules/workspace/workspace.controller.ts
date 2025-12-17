import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceEntity } from './entities/workspace.entity';

@ApiTags('workspaces')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new workspace' })
  @ApiResponse({
    status: 201,
    description: 'Workspace created successfully',
    type: WorkspaceEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 409, description: 'Workspace code already exists' })
  create(@Body() createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspaceService.create(createWorkspaceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all workspaces with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of workspaces',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    try {
      const all = await this.workspaceService.findAll(paginationDto);
      return all;
    } catch (error) {
      throw new Error('Error fetching workspaces');
    }
  }

  @Get('roots')
  @ApiOperation({ summary: 'Get all root workspaces (hierarchy view)' })
  @ApiResponse({
    status: 200,
    description: 'List of root workspaces',
    type: [WorkspaceEntity],
  })
  findRoots() {
    return this.workspaceService.findRoots();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workspace by ID' })
  @ApiParam({ name: 'id', description: 'Workspace ID' })
  @ApiResponse({
    status: 200,
    description: 'Workspace details',
    type: WorkspaceEntity,
  })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  findOne(@Param('id') id: string) {
    return this.workspaceService.findOne(id);
  }

  @Get(':id/children')
  @ApiOperation({ summary: 'Get workspace children' })
  @ApiParam({ name: 'id', description: 'Workspace ID' })
  @ApiResponse({
    status: 200,
    description: 'List of child workspaces',
    type: [WorkspaceEntity],
  })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  findChildren(@Param('id') id: string) {
    return this.workspaceService.findChildren(id);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Get workspace members' })
  @ApiParam({ name: 'id', description: 'Workspace ID' })
  @ApiResponse({
    status: 200,
    description: 'List of workspace members',
  })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  getMembers(@Param('id') id: string) {
    return this.workspaceService.getMembers(id);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Add member to workspace' })
  @ApiParam({ name: 'id', description: 'Workspace ID' })
  @ApiResponse({
    status: 201,
    description: 'Member added successfully',
  })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  @ApiResponse({ status: 409, description: 'User is already a member' })
  addMember(@Param('id') id: string, @Body() addMemberDto: AddMemberDto) {
    return this.workspaceService.addMember(id, addMemberDto);
  }

  @Delete(':id/members/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove member from workspace' })
  @ApiParam({ name: 'id', description: 'Workspace ID' })
  @ApiParam({ name: 'userId', description: 'User ID to remove' })
  @ApiResponse({
    status: 200,
    description: 'Member removed successfully',
  })
  @ApiResponse({ status: 404, description: 'Workspace or user not found' })
  removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.workspaceService.removeMember(id, userId);
  }

  @Patch(':id/members/:userId/role')
  @ApiOperation({ summary: 'Update member role' })
  @ApiParam({ name: 'id', description: 'Workspace ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Member role updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Workspace or user not found' })
  updateMemberRole(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body('role') role: string,
  ) {
    return this.workspaceService.updateMemberRole(id, userId, role);
  }

  @Get(':id/statistics')
  @ApiOperation({ summary: 'Get workspace statistics' })
  @ApiParam({ name: 'id', description: 'Workspace ID' })
  @ApiResponse({
    status: 200,
    description: 'Workspace statistics',
  })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  getStatistics(@Param('id') id: string) {
    return this.workspaceService.getStatistics(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update workspace' })
  @ApiParam({ name: 'id', description: 'Workspace ID' })
  @ApiResponse({
    status: 200,
    description: 'Workspace updated successfully',
    type: WorkspaceEntity,
  })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  @ApiResponse({ status: 409, description: 'Workspace code already exists' })
  update(
    @Param('id') id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspaceService.update(id, updateWorkspaceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete workspace (soft delete)' })
  @ApiParam({ name: 'id', description: 'Workspace ID' })
  @ApiResponse({
    status: 200,
    description: 'Workspace deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete workspace with active children',
  })
  remove(@Param('id') id: string) {
    return this.workspaceService.remove(id);
  }
}
