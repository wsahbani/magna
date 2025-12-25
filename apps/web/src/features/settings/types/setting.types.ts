export type SettingType = 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON' | 'FILE' | 'SECRET';

export interface Setting {
  id: string;
  key: string;
  value: string | null;
  type: SettingType;
  category: string;
  description?: string;
  isEncrypted: boolean;
  isPublic: boolean;
  metadata?: {
    options?: string[];
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
    format?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSettingDto {
  value: string | null;
}

export interface SettingsGroup {
  category: string;
  label: string;
  icon: any;
  settings: Setting[];
}
