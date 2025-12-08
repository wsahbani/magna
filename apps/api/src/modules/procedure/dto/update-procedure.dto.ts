import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateProcedureDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  objective?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  scope?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  version?: string;
}

