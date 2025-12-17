import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ExtractProcessFromImageDto {
  @ApiProperty({
    description: 'Fichier image à analyser',
    type: 'string',
    format: 'binary',
  })
  image: any;

  @ApiProperty({
    description: 'ID du Process à mettre à jour',
    example: 'clx1234567890',
  })
  @IsString()
  @IsNotEmpty()
  processId: string;

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
    example: 'Processus de recrutement avec sélection, entretien et embauche',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

