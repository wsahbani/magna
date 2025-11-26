import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  SipocVersion,
  CreateSipocVersionDto,
  UpdateSipocVersionDto,
  PublishVersionDto,
} from '../types/sipoc.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ====================================
// Query Keys
// ====================================

export const sipocVersionKeys = {
  all: ['sipoc-versions'] as const,
  lists: () => [...sipocVersionKeys.all, 'list'] as const,
  list: (sipocId: string) => [...sipocVersionKeys.lists(), sipocId] as const,
  details: () => [...sipocVersionKeys.all, 'detail'] as const,
  detail: (versionId: string) => [...sipocVersionKeys.details(), versionId] as const,
};

// ====================================
// API Functions
// ====================================

const sipocVersionApi = {
  // Récupérer toutes les versions d'un SIPOC
  getVersions: async (sipocId: string): Promise<SipocVersion[]> => {
    const { data } = await axios.get(`${API_URL}/sipoc/${sipocId}/versions`);
    return data;
  },

  // Récupérer une version spécifique
  getVersion: async (sipocId: string, versionId: string): Promise<SipocVersion> => {
    const { data } = await axios.get(`${API_URL}/sipoc/${sipocId}/versions/${versionId}`);
    return data;
  },

  // Créer une nouvelle version
  createVersion: async (
    sipocId: string,
    dto: CreateSipocVersionDto
  ): Promise<SipocVersion> => {
    const { data } = await axios.post(`${API_URL}/sipoc/${sipocId}/versions`, dto);
    return data;
  },

  // Dupliquer une version existante
  duplicateVersion: async (
    sipocId: string,
    versionId: string,
    dto: CreateSipocVersionDto
  ): Promise<SipocVersion> => {
    const { data } = await axios.post(
      `${API_URL}/sipoc/${sipocId}/versions/${versionId}/duplicate`,
      dto
    );
    return data;
  },

  // Mettre à jour une version
  updateVersion: async (
    sipocId: string,
    versionId: string,
    dto: UpdateSipocVersionDto
  ): Promise<SipocVersion> => {
    const { data } = await axios.put(
      `${API_URL}/sipoc/${sipocId}/versions/${versionId}`,
      dto
    );
    return data;
  },

  // Publier une version
  publishVersion: async (
    sipocId: string,
    versionId: string,
    dto: PublishVersionDto
  ): Promise<SipocVersion> => {
    const { data } = await axios.post(
      `${API_URL}/sipoc/${sipocId}/versions/${versionId}/publish`,
      dto
    );
    return data;
  },

  // Archiver une version
  archiveVersion: async (sipocId: string, versionId: string): Promise<SipocVersion> => {
    const { data } = await axios.post(
      `${API_URL}/sipoc/${sipocId}/versions/${versionId}/archive`
    );
    return data;
  },

  // Supprimer une version
  deleteVersion: async (sipocId: string, versionId: string): Promise<void> => {
    await axios.delete(`${API_URL}/sipoc/${sipocId}/versions/${versionId}`);
  },
};

// ====================================
// React Query Hooks
// ====================================

/**
 * Hook pour récupérer toutes les versions d'un SIPOC
 */
export const useSipocVersions = (sipocId: string | undefined) => {
  return useQuery({
    queryKey: sipocVersionKeys.list(sipocId!),
    queryFn: () => sipocVersionApi.getVersions(sipocId!),
    enabled: !!sipocId,
  });
};

/**
 * Hook pour récupérer une version spécifique
 */
export const useSipocVersion = (sipocId: string | undefined, versionId: string | undefined) => {
  return useQuery({
    queryKey: sipocVersionKeys.detail(versionId!),
    queryFn: () => sipocVersionApi.getVersion(sipocId!, versionId!),
    enabled: !!sipocId && !!versionId,
  });
};

/**
 * Hook pour créer une nouvelle version
 */
export const useCreateSipocVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sipocId, dto }: { sipocId: string; dto: CreateSipocVersionDto }) =>
      sipocVersionApi.createVersion(sipocId, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: sipocVersionKeys.list(variables.sipocId) });
    },
  });
};

/**
 * Hook pour dupliquer une version
 */
export const useDuplicateSipocVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sipocId,
      versionId,
      dto,
    }: {
      sipocId: string;
      versionId: string;
      dto: CreateSipocVersionDto;
    }) => sipocVersionApi.duplicateVersion(sipocId, versionId, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: sipocVersionKeys.list(variables.sipocId) });
    },
  });
};

/**
 * Hook pour mettre à jour une version
 */
export const useUpdateSipocVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sipocId,
      versionId,
      dto,
    }: {
      sipocId: string;
      versionId: string;
      dto: UpdateSipocVersionDto;
    }) => sipocVersionApi.updateVersion(sipocId, versionId, dto),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: sipocVersionKeys.list(variables.sipocId) });
      queryClient.invalidateQueries({ queryKey: sipocVersionKeys.detail(variables.versionId) });
    },
  });
};

/**
 * Hook pour publier une version
 */
export const usePublishSipocVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sipocId,
      versionId,
      dto,
    }: {
      sipocId: string;
      versionId: string;
      dto: PublishVersionDto;
    }) => sipocVersionApi.publishVersion(sipocId, versionId, dto),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: sipocVersionKeys.list(variables.sipocId) });
      queryClient.invalidateQueries({ queryKey: sipocVersionKeys.detail(variables.versionId) });
      // Invalider aussi le SIPOC pour mettre à jour currentPublishedId
      queryClient.invalidateQueries({ queryKey: ['sipoc', variables.sipocId] });
    },
  });
};

/**
 * Hook pour archiver une version
 */
export const useArchiveSipocVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sipocId, versionId }: { sipocId: string; versionId: string }) =>
      sipocVersionApi.archiveVersion(sipocId, versionId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: sipocVersionKeys.list(variables.sipocId) });
      queryClient.invalidateQueries({ queryKey: sipocVersionKeys.detail(variables.versionId) });
      queryClient.invalidateQueries({ queryKey: ['sipoc', variables.sipocId] });
    },
  });
};

/**
 * Hook pour supprimer une version
 */
export const useDeleteSipocVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sipocId, versionId }: { sipocId: string; versionId: string }) =>
      sipocVersionApi.deleteVersion(sipocId, versionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: sipocVersionKeys.list(variables.sipocId) });
      queryClient.invalidateQueries({ queryKey: ['sipoc', variables.sipocId] });
    },
  });
};
