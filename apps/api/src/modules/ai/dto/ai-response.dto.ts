import { ApiProperty } from '@nestjs/swagger';
import { GeneratedProcessMapStructure } from '../interfaces/ai.interface';

export class GenerateProcessMapResponseDto {
  @ApiProperty({
    description: 'Structure de la carte de processus générée',
  })
  structure: GeneratedProcessMapStructure;

  @ApiProperty({
    description: 'Coût estimé de la génération en dollars',
    example: 0.1,
  })
  estimatedCost: number;

  @ApiProperty({
    description: 'Indique si la réponse provient du cache',
    example: false,
  })
  cached: boolean;

  @ApiProperty({
    description: 'Nombre de tokens utilisés',
  })
  tokensUsed: {
    prompt: number;
    completion: number;
    total: number;
  };
}

