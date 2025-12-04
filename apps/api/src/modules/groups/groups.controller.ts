import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('Groups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Create new group (Admin only)' })
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all groups' })
  @ApiQuery({ name: 'isActive', required: false })
  findAll(@Query('isActive') isActive?: string) {
    const filters: any = {};
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    
    return this.groupsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get group by ID with users' })
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update group (Admin only)' })
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(id, updateGroupDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete group (Admin only)' })
  remove(@Param('id') id: string) {
    return this.groupsService.remove(id);
  }

  @Get(':id/users')
  @ApiOperation({ summary: 'Get all users in a group' })
  getUsersByGroup(@Param('id') id: string) {
    return this.groupsService.getUsersByGroup(id);
  }

  @Post(':id/permissions')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Add permission to group (Admin only)' })
  addPermission(
    @Param('id') id: string,
    @Body() permission: { resource: string; action: string; conditions?: any },
  ) {
    return this.groupsService.addPermission(id, permission);
  }

  @Delete('permissions/:permissionId')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Remove permission from group (Admin only)' })
  removePermission(@Param('permissionId') permissionId: string) {
    return this.groupsService.removePermission(permissionId);
  }
}
