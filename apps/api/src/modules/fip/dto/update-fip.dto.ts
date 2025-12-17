import {
  IsString,
  IsOptional,
  IsObject,
} from 'class-validator';

export class UpdateFipDto {
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

