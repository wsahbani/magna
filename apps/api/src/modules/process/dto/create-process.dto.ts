import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProcessStatus, ProcessType, ProcessPriority, ConfidentialityLevel } from '@prisma/client';

export class CreateProcessDto {
  @ApiProperty({
    description: 'Process title',
    example: 'Processus de Recrutement',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Process code (unique within ProcessMap)',
    example: 'PROC-RH-001',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({
    description: 'Process description',
    example: 'Processus complet de recrutement des candidats',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'ProcessMap ID (parent)',
    example: 'clx1234567890',
  })
  @IsString()
  @IsNotEmpty()
  processMapId: string;

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
    description: 'Process type',
    enum: ProcessType,
    example: ProcessType.FLOW,
    default: ProcessType.FLOW,
  })
  @IsEnum(ProcessType)
  @IsOptional()
  type?: ProcessType;

  @ApiPropertyOptional({
    description: 'Process status',
    enum: ProcessStatus,
    example: ProcessStatus.DRAFT,
    default: ProcessStatus.DRAFT,
  })
  @IsEnum(ProcessStatus)
  @IsOptional()
  status?: ProcessStatus;

  @ApiPropertyOptional({
    description: 'Process objective',
    example: 'Recruter les meilleurs talents',
  })
  @IsString()
  @IsOptional()
  objectif?: string;

  @ApiPropertyOptional({
    description: 'Process scope',
    example: 'Tous les départements',
  })
  @IsString()
  @IsOptional()
  perimetre?: string;

  @ApiPropertyOptional({
    description: 'Process purpose',
    example: 'Améliorer la qualité du recrutement',
  })
  @IsString()
  @IsOptional()
  finalite?: string;

  @ApiPropertyOptional({
    description: 'Process priority',
    enum: ProcessPriority,
    example: ProcessPriority.MEDIUM,
    default: ProcessPriority.MEDIUM,
  })
  @IsEnum(ProcessPriority)
  @IsOptional()
  priority?: ProcessPriority;

  @ApiPropertyOptional({
    description: 'Confidentiality level',
    enum: ConfidentialityLevel,
    example: ConfidentialityLevel.INTERNAL,
    default: ConfidentialityLevel.INTERNAL,
  })
  @IsEnum(ConfidentialityLevel)
  @IsOptional()
  confidentiality?: ConfidentialityLevel;

  @ApiPropertyOptional({
    description: 'Review frequency in months',
    example: 12,
  })
  @IsOptional()
  reviewFrequency?: number;
}
