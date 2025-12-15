import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GeneratedProcessStructure } from '../interfaces/process.interface';

export class GenerateProcessResponseDto {
  @ApiProperty({
    description: 'Structure du processus générée par l\'IA',
  })
  structure: GeneratedProcessStructure;

  @ApiProperty({
    description: 'Coût estimé de la génération IA en dollars',
    example: 0.0015,
  })
  estimatedCost: number;

  @ApiProperty({
    description: 'Indique si la réponse a été récupérée du cache',
    example: false,
  })
  cached: boolean;

  @ApiProperty({
    description: 'Nombre de tokens utilisés pour la génération',
  })
  tokensUsed: {
    prompt: number;
    completion: number;
    total: number;
  };
}

