import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateProcessDto {
  @ApiProperty({
    description: 'Description textuelle du processus à générer.',
    example: 'Générer un processus de recrutement avec les étapes de sélection, entretien et embauche.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

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
}

