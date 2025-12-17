import { IsString, IsOptional, IsBoolean, IsInt, Min } from 'class-validator';

export class UpdateSipocDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  process_owner?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  version?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsBoolean()
  is_template?: boolean;

  @IsOptional()
  @IsString()
  processId?: string;
}
