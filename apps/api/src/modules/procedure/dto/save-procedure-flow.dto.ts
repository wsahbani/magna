import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { SaveNodeDto, SaveEdgeDto } from '../../process/dto/save-flow.dto';
import { FlowDirection } from '@prisma/client';

/**
 * DTO for saving Procedure FlowDiagram (level 3)
 */
export class SaveProcedureFlowDto {
  @IsString()
  @IsNotEmpty()
  procedureId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaveNodeDto)
  nodes: SaveNodeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaveEdgeDto)
  edges: SaveEdgeDto[];

  @IsOptional()
  @IsString()
  changesLog?: string; // Description of changes made

  @IsOptional()
  @IsEnum(FlowDirection)
  flowDirection?: FlowDirection;
}

