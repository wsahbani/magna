import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { SaveNodeDto, SaveEdgeDto } from '../../process/dto/save-flow.dto';

/**
 * DTO for saving Process FlowDiagram (level 2)
 */
export class SaveProcessFlowDto {
  @IsString()
  @IsNotEmpty()
  processId: string;

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
}

