import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '../api/settingsApi';

export const settingsKeys = {
  all: ['settings'] as const,
  lists: () => [...settingsKeys.all, 'list'] as const,
  list: (category?: string) => [...settingsKeys.lists(), { category }] as const,
  details: () => [...settingsKeys.all, 'detail'] as const,
  detail: (key: string) => [...settingsKeys.details(), key] as const,
  categories: () => [...settingsKeys.all, 'categories'] as const,
};

export function useSettings(category?: string) {
  return useQuery({
    queryKey: settingsKeys.list(category),
    queryFn: () => settingsApi.getAll(category),
  });
}

export function useSetting(key: string) {
  return useQuery({
    queryKey: settingsKeys.detail(key),
    queryFn: () => settingsApi.getOne(key),
    enabled: !!key,
  });
}

export function useSettingsByCategory(category: string) {
  return useQuery({
    queryKey: settingsKeys.list(category),
    queryFn: () => settingsApi.getByCategory(category),
    enabled: !!category,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: settingsKeys.categories(),
    queryFn: () => settingsApi.getCategories(),
  });
}
