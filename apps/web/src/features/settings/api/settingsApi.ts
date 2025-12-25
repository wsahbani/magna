import { apiClient } from '../../../lib/base-api';
import type { Setting, UpdateSettingDto } from '../types/setting.types';

const SETTINGS_BASE_URL = '/settings';

export const settingsApi = {
  async getAll(category?: string): Promise<Setting[]> {
    const params = category ? `?category=${category}` : '';
    const response = await apiClient.get<Setting[]>(`${SETTINGS_BASE_URL}${params}`);
    return response.data;
  },

  async getByCategory(category: string): Promise<Setting[]> {
    const response = await apiClient.get<Setting[]>(`${SETTINGS_BASE_URL}/category/${category}`);
    return response.data;
  },

  async getOne(key: string): Promise<Setting> {
    const response = await apiClient.get<Setting>(`${SETTINGS_BASE_URL}/${key}`);
    return response.data;
  },

  async update(key: string, dto: UpdateSettingDto): Promise<Setting> {
    const response = await apiClient.put<Setting>(`${SETTINGS_BASE_URL}/${key}`, dto);
    return response.data;
  },

  async getCategories(): Promise<string[]> {
    const response = await apiClient.get<string[]>(`${SETTINGS_BASE_URL}/categories`);
    return response.data;
  },

  async uploadLogo(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<{ url: string }>(`${SETTINGS_BASE_URL}/logo/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.url;
  },
};
