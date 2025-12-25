import { Setting } from '../entities/setting.entity';

export class SettingResponseDto {
  id: string;
  key: string;
  value: string | null;
  type: string;
  category: string;
  description?: string;
  isEncrypted: boolean;
  isPublic: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(setting: Setting, maskSecret = true): SettingResponseDto {
    const dto = new SettingResponseDto();
    dto.id = setting.id;
    dto.key = setting.key;
    dto.type = setting.type;
    dto.category = setting.category;
    dto.description = setting.description;
    dto.isEncrypted = setting.isEncrypted;
    dto.isPublic = setting.isPublic;
    dto.metadata = setting.metadata;
    dto.createdAt = setting.createdAt;
    dto.updatedAt = setting.updatedAt;

    // Mask secret values
    if (setting.isEncrypted && maskSecret && setting.value) {
      dto.value = '••••••••';
    } else {
      dto.value = setting.value;
    }

    return dto;
  }
}
