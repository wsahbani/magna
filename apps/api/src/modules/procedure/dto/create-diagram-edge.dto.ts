import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  MaxLength,
  MinLength,
  ValidateIf,
  IsUUID,
} from 'class-validator';
export class CreateDiagramEdgeDto {
  // Support multi-niveaux - un seul doit être défini
  @ValidateIf((o) => !o.processId && !o.procedureId)
  @IsNotEmpty()
  @IsUUID()
  macroProcessId?: string; // Niveau 1 (ProcessMap)

  @ValidateIf((o) => !o.macroProcessId && !o.procedureId)
  @IsNotEmpty()
  @IsUUID()
  processId?: string; // Niveau 2

  @ValidateIf((o) => !o.macroProcessId && !o.processId)
  @IsNotEmpty()
  @IsUUID()
  procedureId?: string; // Niveau 3

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  edgeId: string; // Frontend identifier (used as rfId)

  @IsNotEmpty()
  @IsString()
  sourceId: string; // rfId of source node

  @IsNotEmpty()
  @IsString()
  targetId: string; // rfId of target node

  @IsOptional()
  @IsString()
  type?: string; // Edge type: SEQUENCE, CONDITIONAL, etc.

  @IsOptional()
  @IsString()
  @MaxLength(200)
  label?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  condition?: string; // For conditional edges

  @IsOptional()
  @IsBoolean()
  animated?: boolean;

  @IsOptional()
  style?: any; // Line style, color, etc.

  @IsOptional()
  data?: any; // Custom properties
}

