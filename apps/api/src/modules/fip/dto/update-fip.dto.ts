import {
  IsString,
  IsOptional,
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
  indicators?: any;

  @IsOptional()
  stakeholders?: any;

  @IsOptional()
  risks?: any;

  @IsOptional()
  opportunities?: any;

  @IsOptional()
  resources?: any;

  @IsOptional()
  performanceTargets?: any;
}

