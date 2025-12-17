import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProcessStatus } from '@prisma/client';

export class CreateProcessMapDto {
  @ApiProperty({
    description: 'ProcessMap title',
    example: 'Carte des Processus RH',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'ProcessMap code (unique identifier)',
    example: 'MAP-RH-001',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({
    description: 'ProcessMap description',
    example: 'Carte des processus des ressources humaines',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Workspace ID',
    example: 'clx1234567890',
  })
  @IsString()
  @IsNotEmpty()
  workspaceId: string;

  @ApiPropertyOptional({
    description: 'Department ID',
    example: 'clx1234567890',
  })
  @IsString()
  @IsOptional()
  departmentId?: string;

  @ApiPropertyOptional({
    description: 'ProcessMap status',
    enum: ProcessStatus,
    example: ProcessStatus.DRAFT,
    default: ProcessStatus.DRAFT,
  })
  @IsEnum(ProcessStatus)
  @IsOptional()
  status?: ProcessStatus;
}

