import {
  IsString,
  IsOptional,
  IsObject,
  IsUUID,
} from 'class-validator';

export class CreateFipDto {
  @IsUUID()
  processId: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  objectives?: string;

  @IsOptional()
  @IsString()
  scope?: string;

  @IsOptional()
  @IsObject()
  indicators?: any;

  @IsOptional()
  @IsObject()
  stakeholders?: any;

  @IsOptional()
  @IsObject()
  risks?: any;

  @IsOptional()
  @IsObject()
  opportunities?: any;

  @IsOptional()
  @IsObject()
  resources?: any;

  @IsOptional()
  @IsObject()
  performanceTargets?: any;
}

