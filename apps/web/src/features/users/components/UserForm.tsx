import { useForm } from 'react-hook-form';
import { CreateUserDto, UpdateUserDto, User } from '../types/user.types';
import { Button, Input, Label, Switch } from '@repo/ui';
import { BodySmall } from '@repo/ui';
import { useGroups } from '../../groups/hooks/useGroups';

interface UserFormProps {
  user?: User;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function UserForm({ user, onSubmit, onCancel, isLoading }: UserFormProps) {
  const { data: groups } = useGroups();
  const isEditing = !!user;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserDto | UpdateUserDto>({
    defaultValues: user || {
      isActive: true,
      isAdmin: false,
      emailVerified: false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Informations personnelles */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Informations personnelles</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom *</Label>
            <Input
              id="firstName"
              {...register('firstName', { required: 'Prénom requis' })}
              placeholder="Jean"
            />
            {errors.firstName && (
              <BodySmall className="text-red-600">{errors.firstName.message}</BodySmall>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Nom *</Label>
            <Input
              id="lastName"
              {...register('lastName', { required: 'Nom requis' })}
              placeholder="Dupont"
            />
            {errors.lastName && (
              <BodySmall className="text-red-600">{errors.lastName.message}</BodySmall>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register('email', {
              required: !isEditing ? 'Email requis' : false,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email invalide',
              },
            })}
            placeholder="jean.dupont@orange.com"
            disabled={isEditing}
          />
          {(errors as any).email && (
            <BodySmall className="text-red-600">{(errors as any).email.message}</BodySmall>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="displayName">Nom d'affichage</Label>
          <Input
            id="displayName"
            {...register('displayName')}
            placeholder="J. Dupont"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">Poste</Label>
          <Input
            id="position"
            {...register('position')}
            placeholder="Chef de projet"
          />
        </div>
      </div>

      {/* Mot de passe (création uniquement) */}
      {!isEditing && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Sécurité</h3>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe *</Label>
            <Input
              id="password"
              type="password"
              {...register('password', {
                required: !isEditing ? 'Mot de passe requis' : false,
                minLength: {
                  value: 8,
                  message: 'Minimum 8 caractères',
                },
              })}
              placeholder="••••••••"
            />
            {(errors as any).password && (
              <BodySmall className="text-red-600">{(errors as any).password.message}</BodySmall>
            )}
            <BodySmall className="text-gray-500">
              Minimum 8 caractères avec au moins une majuscule, une minuscule et un chiffre
            </BodySmall>
          </div>
        </div>
      )}

      {/* Groupe */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Affectation</h3>

        <div className="space-y-2">
          <Label htmlFor="groupId">Groupe</Label>
          <select
            id="groupId"
            {...register('groupId')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Aucun groupe</option>
            {groups?.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name} ({group.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Options</h3>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
          <div>
            <Label htmlFor="isActive">Compte actif</Label>
            <BodySmall className="text-gray-600">
              L'utilisateur peut se connecter
            </BodySmall>
          </div>
          <Switch id="isActive" {...register('isActive')} />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
          <div>
            <Label htmlFor="isAdmin">Administrateur</Label>
            <BodySmall className="text-gray-600">
              Peut gérer les utilisateurs et les groupes
            </BodySmall>
          </div>
          <Switch id="isAdmin" {...register('isAdmin')} />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
          <div>
            <Label htmlFor="emailVerified">Email vérifié</Label>
            <BodySmall className="text-gray-600">
              L'adresse email a été vérifiée
            </BodySmall>
          </div>
          <Switch id="emailVerified" {...register('emailVerified')} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Enregistrement...' : isEditing ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  );
}
