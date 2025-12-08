/**
 * ProcessMap Form Component
 * Form for creating and editing ProcessMaps
 */

import { useState } from 'react'
import { Button } from '@repo/ui/components/ui/button'
import { Input } from '@repo/ui/components/ui/input'
import { Label } from '@repo/ui/components/ui/label'
import { Textarea } from '@repo/ui/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select'
import { Building2, Code2, FileText, Hash, MapPin } from 'lucide-react'
import { useWorkspaces } from '../../workspaces/hooks/useWorkspaces'
import type { ProcessMap, CreateProcessMapDto, UpdateProcessMapDto } from '../types/process-map.types'
import { ProcessStatus } from '../types/enums'

interface ProcessMapFormProps {
  processMap?: ProcessMap
  defaultWorkspaceId?: string
  onSubmit: (data: CreateProcessMapDto | UpdateProcessMapDto) => void
  onCancel: () => void
  isLoading?: boolean
}

const statusOptions = [
  { value: ProcessStatus.DRAFT, label: 'Brouillon' },
  { value: ProcessStatus.PUBLISHED, label: 'Publié' },
  { value: ProcessStatus.ARCHIVED, label: 'Archivé' },
]

export function ProcessMapForm({
  processMap,
  defaultWorkspaceId,
  onSubmit,
  onCancel,
  isLoading,
}: ProcessMapFormProps) {
  const { data: workspacesData, isLoading: isLoadingWorkspaces } = useWorkspaces()
  const workspaces = workspacesData?.data || []

  const [formData, setFormData] = useState({
    title: processMap?.title || '',
    code: processMap?.code || '',
    description: processMap?.description || '',
    workspaceId: processMap?.workspaceId || defaultWorkspaceId || '',
    departmentId: processMap?.departmentId || '',
    status: processMap?.status || ProcessStatus.DRAFT,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis'
    } else if (formData.title.length < 2) {
      newErrors.title = 'Le titre doit contenir au moins 2 caractères'
    } else if (formData.title.length > 200) {
      newErrors.title = 'Le titre ne peut pas dépasser 200 caractères'
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Le code est requis'
    } else if (formData.code.length < 2) {
      newErrors.code = 'Le code doit contenir au moins 2 caractères'
    } else if (formData.code.length > 50) {
      newErrors.code = 'Le code ne peut pas dépasser 50 caractères'
    }

    if (!formData.workspaceId) {
      newErrors.workspaceId = 'Le workspace est requis'
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'La description ne peut pas dépasser 1000 caractères'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      const submitData: CreateProcessMapDto | UpdateProcessMapDto = {
        title: formData.title.trim(),
        code: formData.code.trim(),
        description: formData.description?.trim() || undefined,
        workspaceId: formData.workspaceId,
        departmentId: formData.departmentId || undefined,
        status: formData.status,
      }

      onSubmit(submitData)
    }
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    validateForm()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-orange-600" />
          Titre <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          onBlur={() => handleBlur('title')}
          placeholder="Ex: Carte des Processus RH"
          className={touched.title && errors.title ? 'border-red-500' : ''}
        />
        {touched.title && errors.title && (
          <p className="text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      {/* Code */}
      <div className="space-y-2">
        <Label htmlFor="code" className="flex items-center gap-2">
          <Hash className="h-4 w-4 text-orange-600" />
          Code <span className="text-red-500">*</span>
        </Label>
        <Input
          id="code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
          onBlur={() => handleBlur('code')}
          placeholder="Ex: MAP-RH-001"
          className={touched.code && errors.code ? 'border-red-500' : ''}
        />
        {touched.code && errors.code && (
          <p className="text-sm text-red-500">{errors.code}</p>
        )}
      </div>

      {/* Workspace */}
      <div className="space-y-2">
        <Label htmlFor="workspaceId" className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-orange-600" />
          Workspace <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.workspaceId}
          onValueChange={(value) => setFormData({ ...formData, workspaceId: value })}
          disabled={isLoadingWorkspaces}
        >
          <SelectTrigger
            className={touched.workspaceId && errors.workspaceId ? 'border-red-500' : ''}
          >
            <SelectValue placeholder="Sélectionner un workspace" />
          </SelectTrigger>
          <SelectContent>
            {workspaces.map((workspace) => (
              <SelectItem key={workspace.id} value={workspace.id}>
                {workspace.name} ({workspace.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {touched.workspaceId && errors.workspaceId && (
          <p className="text-sm text-red-500">{errors.workspaceId}</p>
        )}
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status" className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-orange-600" />
          Statut
        </Label>
        <Select
          value={formData.status}
          onValueChange={(value) => setFormData({ ...formData, status: value as ProcessStatus })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-orange-600" />
          Description
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          onBlur={() => handleBlur('description')}
          placeholder="Description de la carte des processus..."
          rows={4}
          className={touched.description && errors.description ? 'border-red-500' : ''}
        />
        {touched.description && errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-orange-600 hover:bg-orange-700">
          {isLoading ? 'Enregistrement...' : processMap ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  )
}

