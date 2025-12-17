import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GeneratedProcessStructure } from '../interfaces/process.interface';

export class CreateProcessFromAIDto {
  @ApiProperty({
    description: 'Structure du processus générée par l\'IA',
  })
  @IsNotEmpty()
  structure: GeneratedProcessStructure;

  @ApiProperty({
    description: 'ID du ProcessMap auquel le processus sera associé.',
    example: 'clx1234567890',
  })
  @IsString()
  @IsNotEmpty()
  processMapId: string;

  @ApiPropertyOptional({
    description: 'ID du workspace auquel le processus sera associé.',
    example: 'clx1234567890',
  })
  @IsString()
  @IsOptional()
  workspaceId?: string;

  @ApiPropertyOptional({
    description: 'ID du département auquel le processus sera associé.',
    example: 'clx1234567890',
  })
  @IsString()
  @IsOptional()
  departmentId?: string;

  @ApiPropertyOptional({
    description: 'Code du processus (sera généré si non fourni).',
    example: 'PROC-RH-001',
  })
  @IsString()
  @IsOptional()
  code?: string;
}

