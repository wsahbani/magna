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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { Groups } from '../auth/decorators/group.decorator';
import { GroupsGuard } from '../auth/guards/groups.guard';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Create new user (Admin only)' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ name: 'groupId', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  findAll(
    @Query('groupId') groupId?: string,
    @Query('isActive') isActive?: string,
  ) {
    const filters: any = {};
    if (groupId) filters.groupId = groupId;
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    
    return this.usersService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update user (Admin only)' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post(':id/assign-group/:groupId')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Assign user to group (Admin only)' })
  assignToGroup(@Param('id') id: string, @Param('groupId') groupId: string) {
    return this.usersService.assignToGroup(id, groupId);
  }

  @Post(':id/remove-group')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Remove user from group (Admin only)' })
  removeFromGroup(@Param('id') id: string) {
    return this.usersService.removeFromGroup(id);
  }
}
