import { IsString, IsEnum, IsInt, Min, IsOptional } from 'class-validator';
import { ElementType } from '../entities/sipoc.entity';

export class UpdateElementDto {
  @IsOptional()
  @IsEnum(ElementType)
  type?: ElementType;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  globalOrder?: number;

  @IsOptional()
  @IsString()
  flow_id?: string;

  @IsOptional()
  @IsString()
  contactInfo?: string;

  @IsOptional()
  @IsString()
  qualityCriteria?: string;

  @IsOptional()
  @IsString()
  responsibleRole?: string;

  @IsOptional()
  @IsString()
  duration?: string;
}
