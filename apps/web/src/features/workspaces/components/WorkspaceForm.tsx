/**
 * Workspace Form Component
 * Form for creating and editing workspaces
 */

import { useState } from 'react'
import { Button } from '@repo/ui/components/ui/button'
import { Input } from '@repo/ui/components/ui/input'
import { Label } from '@repo/ui/components/ui/label'
import { Textarea } from '@repo/ui/components/ui/textarea'
import type { Workspace, CreateWorkspaceDto, UpdateWorkspaceDto, WorkspaceType } from '../types/workspace.types'

interface WorkspaceFormProps {
  workspace?: Workspace
  onSubmit: (data: CreateWorkspaceDto | UpdateWorkspaceDto) => void
  onCancel: () => void
  isLoading?: boolean
}

const workspaceTypes: { value: WorkspaceType; label: string }[] = [
  { value: 'GROUPE' as WorkspaceType, label: 'Groupe' },
  { value: 'ENTITY' as WorkspaceType, label: 'Entité' },
  { value: 'DIRECTION' as WorkspaceType, label: 'Direction' },
  { value: 'DEPARTMENT' as WorkspaceType, label: 'Département' },
  { value: 'TEAM' as WorkspaceType, label: 'Équipe' },
]

export function WorkspaceForm({ workspace, onSubmit, onCancel, isLoading }: WorkspaceFormProps) {
  const [formData, setFormData] = useState({
    name: workspace?.name || '',
    description: workspace?.description || '',
    code: workspace?.code || '',
    type: workspace?.type || ('DEPARTMENT' as WorkspaceType),
    isActive: workspace?.isActive ?? true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères'
    } else if (formData.name.length > 100) {
      newErrors.name = 'Le nom ne peut pas dépasser 100 caractères'
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Le code est requis'
    } else if (formData.code.length < 2) {
      newErrors.code = 'Le code doit contenir au moins 2 caractères'
    } else if (formData.code.length > 20) {
      newErrors.code = 'Le code ne peut pas dépasser 20 caractères'
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'La description ne peut pas dépasser 500 caractères'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onSubmit(formData)
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">
          Nom <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Nom du workspace"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div>
        <Label htmlFor="code">
          Code <span className="text-red-500">*</span>
        </Label>
        <Input
          id="code"
          value={formData.code}
          onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
          placeholder="CODE-WS"
          className={errors.code ? 'border-red-500' : ''}
          disabled={!!workspace} // Don't allow changing code on edit
        />
        {errors.code && <p className="text-sm text-red-500 mt-1">{errors.code}</p>}
        {workspace && (
          <p className="text-xs text-gray-500 mt-1">Le code ne peut pas être modifié</p>
        )}
      </div>

      <div>
        <Label htmlFor="type">
          Type <span className="text-red-500">*</span>
        </Label>
        <select
          id="type"
          value={formData.type}
          onChange={(e) => handleChange('type', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {workspaceTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Description du workspace"
          rows={4}
          className={errors.description ? 'border-red-500' : ''}
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">{errors.description}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          {formData.description.length}/500 caractères
        </p>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => handleChange('isActive', e.target.checked)}
          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
        />
        <Label htmlFor="isActive" className="cursor-pointer">
          Actif
        </Label>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1 bg-orange-600 hover:bg-orange-700">
          {isLoading ? 'Enregistrement...' : workspace ? 'Mettre à jour' : 'Créer'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Annuler
        </Button>
      </div>
    </form>
  )
}
