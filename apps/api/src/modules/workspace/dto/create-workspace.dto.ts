import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum WorkspaceType {
  GROUPE = 'GROUPE',
  ENTITY = 'ENTITY',
  DIRECTION = 'DIRECTION',
  DEPARTMENT = 'DEPARTMENT',
  TEAM = 'TEAM',
}

export class CreateWorkspaceDto {
  @ApiProperty({
    description: 'Workspace name',
    example: 'Orange Tunisie',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Workspace code (unique identifier)',
    example: 'OTN',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'Workspace type',
    enum: WorkspaceType,
    example: WorkspaceType.ENTITY,
  })
  @IsEnum(WorkspaceType)
  @IsNotEmpty()
  type: WorkspaceType;

  @ApiPropertyOptional({
    description: 'Workspace description',
    example: 'Orange Tunisie telecommunications services',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Parent workspace ID for hierarchy',
    example: 'clx1234567890',
  })
  @IsString()
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional({
    description: 'Whether workspace is active',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
