import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateProcessMapDto {
  @ApiProperty({
    description: 'Description textuelle de la carte de processus à générer',
    example: 'Carte des processus RH avec recrutement, formation, paie et relations sociales',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

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
    description: 'Titre de la carte (optionnel, sinon généré par IA)',
    example: 'Carte des Processus RH',
  })
  @IsString()
  @IsOptional()
  title?: string;
}

