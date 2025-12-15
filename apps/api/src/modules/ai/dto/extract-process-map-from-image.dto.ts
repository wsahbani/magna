import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ExtractProcessMapFromImageDto {
  @ApiProperty({
    description: 'Fichier image à analyser',
    type: 'string',
    format: 'binary',
  })
  image: Express.Multer.File;

  @ApiProperty({
    description: 'ID de la ProcessMap à mettre à jour',
    example: 'clx1234567890',
  })
  @IsString()
  @IsNotEmpty()
  processMapId: string;

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
    example: 'Carte des processus RH avec recrutement, formation et paie',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

