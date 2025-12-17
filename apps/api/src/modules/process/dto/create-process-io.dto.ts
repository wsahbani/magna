import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProcessIODto {
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
  @MaxLength(100)
  type?: string; // Document, Data, Material, etc.

  @IsNotEmpty()
  @IsBoolean()
  isInput: boolean; // true = input, false = output

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}

