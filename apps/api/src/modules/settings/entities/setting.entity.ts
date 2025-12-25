export enum SettingType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  JSON = 'JSON',
  FILE = 'FILE',
  SECRET = 'SECRET',
}

export interface Setting {
  id: string;
  key: string;
  value: string | null;
  type: SettingType;
  category: string;
  description?: string;
  isEncrypted: boolean;
  isPublic: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
