import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/usersApi';
import { CreateUserDto, UpdateUserDto } from '../types/user.types';
import { toast } from 'sonner';

export const useUsers = (params?: { isActive?: boolean; groupId?: string }) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersApi.getUsers(params),
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => usersApi.getUserById(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateUserDto) => usersApi.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Utilisateur créé avec succès');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la création de l\'utilisateur');
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
      usersApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Utilisateur modifié avec succès');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la modification de l\'utilisateur');
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Utilisateur supprimé avec succès');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la suppression de l\'utilisateur');
    },
  });
};

export const useAssignGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, groupId }: { userId: string; groupId: string }) =>
      usersApi.assignToGroup(userId, groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Groupe assigné avec succès');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de l\'assignation du groupe');
    },
  });
};

export const useRemoveGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => usersApi.removeFromGroup(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Utilisateur retiré du groupe');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors du retrait du groupe');
    },
  });
};
