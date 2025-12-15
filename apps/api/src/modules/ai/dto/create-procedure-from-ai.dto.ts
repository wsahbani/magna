import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GeneratedProcedureStructure } from '../interfaces/procedure.interface';

export class CreateProcedureFromAIDto {
  @ApiProperty({
    description: 'Structure de la procédure générée par l\'IA',
  })
  @IsNotEmpty()
  structure: GeneratedProcedureStructure;

  @ApiProperty({
    description: 'ID du Process auquel la procédure sera associée.',
    example: 'clx1234567890',
  })
  @IsString()
  @IsNotEmpty()
  processId: string;

  @ApiPropertyOptional({
    description: 'ID du workspace auquel la procédure sera associée.',
    example: 'clx1234567890',
  })
  @IsString()
  @IsOptional()
  workspaceId?: string;

  @ApiPropertyOptional({
    description: 'ID du département auquel la procédure sera associée.',
    example: 'clx1234567890',
  })
  @IsString()
  @IsOptional()
  departmentId?: string;

  @ApiPropertyOptional({
    description: 'Code de la procédure (sera généré si non fourni).',
    example: 'PROC-RH-001',
  })
  @IsString()
  @IsOptional()
  code?: string;
}

