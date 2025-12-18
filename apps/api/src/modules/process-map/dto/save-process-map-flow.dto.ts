import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { SaveNodeDto, SaveEdgeDto } from '../../process/dto/save-flow.dto';
import { FlowDirection } from '@prisma/client';

/**
 * DTO for saving ProcessMap FlowDiagram (level 1)
 */
export class SaveProcessMapFlowDto {
  @IsString()
  @IsNotEmpty()
  processMapId: string;

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

