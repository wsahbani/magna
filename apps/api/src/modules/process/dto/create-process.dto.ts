import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  MinLength,
  MaxLength,
  IsUUID,
  Min,
  Max,
} from 'class-validator';
import { ProcessType, ProcessPriority, ConfidentialityLevel } from '@prisma/client';

export class CreateProcessDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  processMapId: string; // Relation vers ProcessMap (niveau 1)

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  code: string; // Code unique Qualigram

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsEnum(ProcessType)
  type?: ProcessType; // FLOW ou SIPOC

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  workspaceId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  departmentId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  objectif?: string; // Objectif du processus

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  perimetre?: string; // Périmètre d'application

  @IsOptional()
  @IsString()
  @MaxLength(500)
  finalite?: string; // Purpose/Goal

  @IsOptional()
  @IsEnum(ProcessPriority)
  priority?: ProcessPriority;

  @IsOptional()
  @IsEnum(ConfidentialityLevel)
  confidentiality?: ConfidentialityLevel;

  @IsOptional()
  @IsNumber()
  @Min(1)
  reviewFrequency?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  authorName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  validatorName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  approverName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  applicationScope?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  objectives?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  resources?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  indicators?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  risks?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  improvements?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  documentationLinks?: string;

  @IsOptional()
  @IsUUID()
  createdById?: string;
}