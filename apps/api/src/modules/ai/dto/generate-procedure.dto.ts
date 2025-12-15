import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateProcedureDto {
  @ApiProperty({
    description: 'Description textuelle de la procédure à générer.',
    example: 'Générer une procédure de validation de commande avec vérification stock, paiement et livraison.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

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
}

