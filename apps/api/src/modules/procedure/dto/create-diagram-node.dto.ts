import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  MaxLength,
  MinLength,
  ValidateIf,
  IsUUID,
} from 'class-validator';
export class CreateDiagramNodeDto {
  // Support multi-niveaux - un seul doit être défini
  @ValidateIf((o) => !o.processId && !o.procedureId)
  @IsNotEmpty()
  @IsUUID()
  macroProcessId?: string; // Niveau 1 : nœud représente un Process (ProcessMap)

  @ValidateIf((o) => !o.macroProcessId && !o.procedureId)
  @IsNotEmpty()
  @IsUUID()
  processId?: string; // Niveau 2 : nœud représente une Procedure

  @ValidateIf((o) => !o.macroProcessId && !o.processId)
  @IsNotEmpty()
  @IsUUID()
  procedureId?: string; // Niveau 3 : nœud du logigramme

  // Référence vers l'entité créée (si nœud représente Process ou Procedure)
  @IsOptional()
  @IsUUID()
  referencedEntityId?: string; // ID du Process ou Procedure créé

  @IsOptional()
  @IsString()
  @MaxLength(50)
  referencedEntityType?: string; // 'PROCESS' ou 'PROCEDURE'

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  nodeId: string; // Frontend identifier (used as rfId)

  @IsNotEmpty()
  @IsString()
  type: string; // Node type: PROCESS_NODE, PROCEDURE_NODE, START, END, ACTION, DECISION, etc.

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  label: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  positionX: number;

  @IsNotEmpty()
  @IsNumber()
  positionY: number;

  @IsOptional()
  @IsNumber()
  width?: number;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsString()
  laneId?: string;

  @IsOptional()
  @IsNumber()
  duration?: number; // Duration in minutes

  @IsOptional()
  @IsString()
  @MaxLength(200)
  responsible?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  accountable?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  consulted?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  informed?: string;

  @IsOptional()
  data?: any; // Custom properties

  @IsOptional()
  style?: any; // Visual styling
}

