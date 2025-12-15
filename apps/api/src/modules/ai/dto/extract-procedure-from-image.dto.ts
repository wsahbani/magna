import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ExtractProcedureFromImageDto {
  @ApiProperty({
    description: 'Fichier image à analyser',
    type: 'string',
    format: 'binary',
  })
  image: any;

  @ApiProperty({
    description: 'ID de la Procedure à mettre à jour',
    example: 'clx1234567890',
  })
  @IsString()
  @IsNotEmpty()
  procedureId: string;

  @ApiPropertyOptional({
    description: 'Remplacer les nodes existants au lieu de les ajouter',
    default: false,
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  replaceExisting?: boolean;

  @ApiPropertyOptional({
    description: 'Description textuelle optionnelle pour aider l\'IA à mieux comprendre l\'image',
    example: 'Procédure de validation de commande avec vérification stock et paiement',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

