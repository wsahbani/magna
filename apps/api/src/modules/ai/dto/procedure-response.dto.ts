import { ApiProperty } from '@nestjs/swagger';
import { GeneratedProcedureStructure } from '../interfaces/procedure.interface';

export class GenerateProcedureResponseDto {
  @ApiProperty({
    description: 'Structure de la procédure générée par l\'IA',
  })
  structure: GeneratedProcedureStructure;

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

