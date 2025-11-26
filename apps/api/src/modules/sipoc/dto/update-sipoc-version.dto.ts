import { IsString, IsOptional } from 'class-validator';

export class UpdateSipocVersionDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  changesLog?: string;
}
