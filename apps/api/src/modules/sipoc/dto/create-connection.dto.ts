import { IsString, IsOptional } from 'class-validator';

export class CreateConnectionDto {
  @IsString()
  source_element_id: string;

  @IsString()
  target_element_id: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsString()
  sipoc_id: string;
}
