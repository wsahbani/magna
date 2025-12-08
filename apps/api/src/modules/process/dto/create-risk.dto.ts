import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { RiskLevel } from '@prisma/client';

export class CreateRiskDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  description: string;

  @IsNotEmpty()
  @IsEnum(RiskLevel)
  level: RiskLevel;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  probability?: number; // 1-5 scale

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  impact?: number; // 1-5 scale

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  mitigation?: string; // Mitigation actions

  @IsOptional()
  @IsString()
  @MaxLength(200)
  owner?: string; // Risk owner

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}

