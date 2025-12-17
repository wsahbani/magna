import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  Min,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateIndicatorDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  formula?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  target?: string; // Target value

  @IsOptional()
  @IsString()
  @MaxLength(100)
  frequency?: string; // Measurement frequency

  @IsOptional()
  @IsString()
  @MaxLength(50)
  unit?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}

