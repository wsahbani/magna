import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateSipocVersionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  changesLog?: string;
}
