import {
  IsString,
  IsOptional,
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

