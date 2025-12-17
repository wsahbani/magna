import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  MaxLength,
  MinLength,
  ValidateIf,
  IsUUID,
} from 'class-validator';

export class CreateDiagramLaneDto {
  // Support multi-niveaux - un seul doit être défini
  @ValidateIf((o) => !o.processId && !o.procedureId)
  @IsNotEmpty()
  @IsUUID()
  macroProcessId?: string; // Niveau 1

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
  laneId: string; // Frontend identifier

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name: string; // Actor name, role, or department

  @IsOptional()
  @IsString()
  @MaxLength(7) // Hex color code
  color?: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsBoolean()
  collapsed?: boolean;

  @IsOptional()
  data?: any; // Custom properties
}

