import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GeneratedProcessMapStructure } from '../interfaces/ai.interface';

export class CreateProcessMapFromAIDto {
  @ApiProperty({
    description: 'Structure générée par IA',
  })
  @IsNotEmpty()
  structure: GeneratedProcessMapStructure;

  @ApiProperty({
    description: 'ID du workspace',
    example: 'clx1234567890',
  })
  @IsString()
  @IsNotEmpty()
  workspaceId: string;

  @ApiPropertyOptional({
    description: 'ID du département (optionnel)',
    example: 'clx1234567890',
  })
  @IsString()
  @IsOptional()
  departmentId?: string;

  @ApiPropertyOptional({
    description: 'Code de la carte (optionnel, sinon généré automatiquement)',
    example: 'MAP-RH-001',
  })
  @IsString()
  @IsOptional()
  code?: string;
}

