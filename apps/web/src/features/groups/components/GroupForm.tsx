/**
 * GroupForm Component
 * Form for creating and editing groups
 */

import { useForm } from 'react-hook-form'
import { CreateGroupDto, Group } from '../types/group.types'
import { Button, Input, Label, Textarea, Switch } from '@repo/ui'
import { Body, BodySmall } from '@repo/ui'

interface GroupFormProps {
  group?: Group
  onSubmit: (data: any) => void
  onCancel: () => void
  isLoading?: boolean
}

const PRESET_COLORS = [
  '#EA580C', // Orange
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#6366F1', // Indigo
]

export function GroupForm({ group, onSubmit, onCancel, isLoading }: GroupFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateGroupDto>({
    defaultValues: group
      ? {
          name: group.name,
          code: group.code,
          description: group.description,
          color: group.color || '#EA580C',
          isActive: group.isActive,
        }
      : {
          name: '',
          code: '',
          description: '',
          color: '#EA580C',
          isActive: true,
        },
  })

  const selectedColor = watch('color')
  const isActive = watch('isActive')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Informations de base */}
      <div className="space-y-4">
        <Body className="font-semibold">Informations de base</Body>

        <div className="space-y-2">
          <Label htmlFor="name">
            Nom du groupe <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            {...register('name', { required: 'Le nom est requis' })}
            placeholder="ex: Groupe RH"
          />
          {errors.name && (
            <BodySmall className="text-red-500">{errors.name.message}</BodySmall>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">
            Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="code"
            {...register('code', { required: 'Le code est requis' })}
            placeholder="ex: RH"
            className="uppercase"
          />
          {errors.code && (
            <BodySmall className="text-red-500">{errors.code.message}</BodySmall>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Description du groupe..."
            rows={3}
          />
        </div>
      </div>

      {/* Couleur */}
      <div className="space-y-4">
        <Body className="font-semibold">Couleur</Body>
        <div className="flex flex-wrap gap-3">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setValue('color', color)}
              className={`w-10 h-10 rounded-lg border-2 transition-all ${
                selectedColor === color
                  ? 'border-gray-900 scale-110'
                  : 'border-gray-200 hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="customColor">Couleur personnalisée:</Label>
          <input
            id="customColor"
            type="color"
            {...register('color')}
            className="w-12 h-8 rounded cursor-pointer"
          />
          <BodySmall className="text-gray-600">{selectedColor}</BodySmall>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-4">
        <Body className="font-semibold">Options</Body>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <Label>Groupe actif</Label>
            <BodySmall className="text-gray-600">
              Les groupes inactifs ne peuvent pas être assignés
            </BodySmall>
          </div>
          <Switch checked={isActive} onCheckedChange={(checked) => setValue('isActive', checked)} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Enregistrement...' : group ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  )
}
