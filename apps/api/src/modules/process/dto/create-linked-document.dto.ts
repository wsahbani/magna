import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  MaxLength,
  MinLength,
} from 'class-validator';
import { DocumentType } from '@prisma/client';

export class CreateLinkedDocumentDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  reference?: string; // Document reference code

  @IsNotEmpty()
  @IsEnum(DocumentType)
  type: DocumentType;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  filePath?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  version?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}

