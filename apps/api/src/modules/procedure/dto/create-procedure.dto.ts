import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProcedureDto {
  @IsNotEmpty()
  @IsUUID()
  processId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  code: string;

  @IsNotEmpty()
  @IsUUID()
  workspaceId: string;

  @IsOptional()
  @IsUUID()
  departmentId?: string;

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
}

