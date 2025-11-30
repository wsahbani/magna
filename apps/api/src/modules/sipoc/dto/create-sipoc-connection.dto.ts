import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSipocConnectionDto {
  @IsString()
  @IsNotEmpty()
  sourceElementId: string;

  @IsString()
  @IsNotEmpty()
  targetElementId: string;

  @IsString()
  @IsNotEmpty()
  sipoc_id: string;

  @IsString()
  @IsOptional()
  description?: string;
}
