import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsObject,
} from 'class-validator';
import { SettingType } from '../entities/setting.entity';

export class CreateSettingDto {
  @IsString()
  key: string;

  @IsOptional()
  @IsString()
  value?: string | null;

  @IsEnum(SettingType)
  type: SettingType;

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isEncrypted?: boolean;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
