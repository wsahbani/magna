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
import { ProcessType } from '@prisma/client';

export class CreateProcessDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  code: string;

  @IsNumber()
  @Min(1)
  @Max(3)
  level: number;

  @IsOptional()
  @IsString()
  workspaceId?: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;

  @IsOptional()
  @IsNumber()
  version?: number;

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