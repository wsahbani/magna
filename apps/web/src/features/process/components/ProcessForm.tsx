/**
 * Process Form Component
 * Form for creating and editing Processes (Level 2)
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
import { Building2, Code2, FileText, Hash, MapPin, Target, Shield, AlertCircle } from 'lucide-react'
import { useWorkspaces } from '../../workspaces/hooks/useWorkspaces'
import { useProcessMaps } from '../../process-map/hooks/useProcessMaps'
import type { Process, CreateProcessDto, UpdateProcessDto } from '../types/process.types'
import { ProcessStatus, ProcessType, ProcessPriority, ConfidentialityLevel } from '../types/enums'

interface ProcessFormProps {
  process?: Process
  defaultProcessMapId?: string
  defaultWorkspaceId?: string
  onSubmit: (data: CreateProcessDto | UpdateProcessDto) => void
  onCancel: () => void
  isLoading?: boolean
}

const statusOptions = [
  { value: ProcessStatus.DRAFT, label: 'Brouillon' },
  { value: ProcessStatus.IN_REVIEW, label: 'En révision' },
  { value: ProcessStatus.VALIDATED, label: 'Validé' },
  { value: ProcessStatus.PUBLISHED, label: 'Publié' },
  { value: ProcessStatus.ARCHIVED, label: 'Archivé' },
  { value: ProcessStatus.OBSOLETE, label: 'Obsolète' },
]

const typeOptions = [
  { value: ProcessType.FLOW, label: 'Flux' },
  { value: ProcessType.SIPOC, label: 'SIPOC' },
]

const priorityOptions = [
  { value: ProcessPriority.LOW, label: 'Faible' },
  { value: ProcessPriority.MEDIUM, label: 'Moyenne' },
  { value: ProcessPriority.HIGH, label: 'Élevée' },
  { value: ProcessPriority.CRITICAL, label: 'Critique' },
]

const confidentialityOptions = [
  { value: ConfidentialityLevel.PUBLIC, label: 'Public' },
  { value: ConfidentialityLevel.INTERNAL, label: 'Interne' },
  { value: ConfidentialityLevel.RESTRICTED, label: 'Restreint' },
  { value: ConfidentialityLevel.CONFIDENTIAL, label: 'Confidentiel' },
]

export function ProcessForm({
  process,
  defaultProcessMapId,
  defaultWorkspaceId,
  onSubmit,
  onCancel,
  isLoading,
}: ProcessFormProps) {
  const { data: workspacesData, isLoading: isLoadingWorkspaces } = useWorkspaces()
  const workspaces = workspacesData?.data || []

  // Fetch ProcessMaps for the selected workspace
  const selectedWorkspaceId = process?.workspaceId || defaultWorkspaceId || ''
  const { data: processMapsData, isLoading: isLoadingProcessMaps } = useProcessMaps({
    workspaceId: selectedWorkspaceId || undefined,
    limit: 100,
  })
  const processMaps = processMapsData?.data || []

  const [formData, setFormData] = useState({
    title: process?.title || '',
    code: process?.code || '',
    description: process?.description || '',
    processMapId: process?.processMapId || defaultProcessMapId || '',
    workspaceId: process?.workspaceId || defaultWorkspaceId || '',
    departmentId: process?.departmentId || '',
    type: process?.type || ProcessType.FLOW,
    status: process?.status || ProcessStatus.DRAFT,
    objectif: process?.objectif || '',
    perimetre: process?.perimetre || '',
    finalite: process?.finalite || '',
    priority: process?.priority || ProcessPriority.MEDIUM,
    confidentiality: process?.confidentiality || ConfidentialityLevel.INTERNAL,
    reviewFrequency: process?.reviewFrequency?.toString() || '',
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

    if (!formData.processMapId) {
      newErrors.processMapId = 'La carte des processus est requise'
    }

    if (!formData.workspaceId) {
      newErrors.workspaceId = 'Le workspace est requis'
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'La description ne peut pas dépasser 1000 caractères'
    }

    if (formData.reviewFrequency && isNaN(parseInt(formData.reviewFrequency))) {
      newErrors.reviewFrequency = 'La fréquence de révision doit être un nombre'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      const submitData: CreateProcessDto | UpdateProcessDto = {
        title: formData.title.trim(),
        code: formData.code.trim(),
        description: formData.description?.trim() || undefined,
        processMapId: formData.processMapId,
        workspaceId: formData.workspaceId,
        departmentId: formData.departmentId || undefined,
        type: formData.type,
        status: formData.status,
        objectif: formData.objectif?.trim() || undefined,
        perimetre: formData.perimetre?.trim() || undefined,
        finalite: formData.finalite?.trim() || undefined,
        priority: formData.priority,
        confidentiality: formData.confidentiality,
        reviewFrequency: formData.reviewFrequency ? parseInt(formData.reviewFrequency) : undefined,
      }

      onSubmit(submitData)
    }
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    validateForm()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent form submission on Enter key press in input fields
    if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
      e.preventDefault()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" onKeyDown={handleKeyDown}>
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-orange-600" />
          Titre <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          onBlur={() => handleBlur('title')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
            }
          }}
          placeholder="Ex: Processus de Recrutement"
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
          type="text"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
          onBlur={() => handleBlur('code')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
            }
          }}
          placeholder="Ex: PROC-RH-001"
          className={touched.code && errors.code ? 'border-red-500' : ''}
        />
        {touched.code && errors.code && (
          <p className="text-sm text-red-500">{errors.code}</p>
        )}
      </div>

      {/* ProcessMap */}
      <div className="space-y-2">
        <Label htmlFor="processMapId" className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-orange-600" />
          Carte des processus <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.processMapId || ''}
          onValueChange={(value) => {
            setFormData({ ...formData, processMapId: value })
            setTouched((prev) => ({ ...prev, processMapId: true }))
            validateForm()
          }}
          disabled={isLoadingProcessMaps || !!defaultProcessMapId}
        >
          <SelectTrigger
            id="processMapId"
            className={touched.processMapId && errors.processMapId ? 'border-red-500' : ''}
          >
            <SelectValue placeholder={isLoadingProcessMaps ? 'Chargement...' : 'Sélectionner une carte des processus'} />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] z-[150]" position="popper">
            {processMaps.length === 0 ? (
              <div className="px-2 py-1.5 text-sm text-gray-500">
                {isLoadingProcessMaps ? 'Chargement...' : 'Aucune carte disponible'}
              </div>
            ) : (
              processMaps.map((pm) => (
                <SelectItem key={pm.id} value={pm.id}>
                  {pm.title} ({pm.code})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {touched.processMapId && errors.processMapId && (
          <p className="text-sm text-red-500">{errors.processMapId}</p>
        )}
      </div>

      {/* Workspace */}
      <div className="space-y-2">
        <Label htmlFor="workspaceId" className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-orange-600" />
          Workspace <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.workspaceId || ''}
          onValueChange={(value) => {
            setFormData({ ...formData, workspaceId: value, processMapId: '' })
            setTouched((prev) => ({ ...prev, workspaceId: true }))
            validateForm()
          }}
          disabled={isLoadingWorkspaces}
        >
          <SelectTrigger
            id="workspaceId"
            className={touched.workspaceId && errors.workspaceId ? 'border-red-500' : ''}
          >
            <SelectValue placeholder={isLoadingWorkspaces ? 'Chargement...' : 'Sélectionner un workspace'} />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] z-[150]" position="popper">
            {workspaces.length === 0 ? (
              <div className="px-2 py-1.5 text-sm text-gray-500">
                {isLoadingWorkspaces ? 'Chargement...' : 'Aucun workspace disponible'}
              </div>
            ) : (
              workspaces.map((workspace) => (
                <SelectItem key={workspace.id} value={workspace.id}>
                  {workspace.name} ({workspace.code})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {touched.workspaceId && errors.workspaceId && (
          <p className="text-sm text-red-500">{errors.workspaceId}</p>
        )}
      </div>

      {/* Type */}
      <div className="space-y-2">
        <Label htmlFor="type" className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-orange-600" />
          Type
        </Label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value as ProcessType })}
        >
          <SelectTrigger id="type">
            <SelectValue placeholder="Sélectionner un type" />
          </SelectTrigger>
          <SelectContent className="z-[150]" position="popper">
            {typeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status" className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          Statut
        </Label>
        <Select
          value={formData.status}
          onValueChange={(value) => {
            setFormData({ ...formData, status: value as ProcessStatus })
          }}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent className="z-[150]" position="popper">
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Priority */}
      <div className="space-y-2">
        <Label htmlFor="priority" className="flex items-center gap-2">
          <Target className="h-4 w-4 text-orange-600" />
          Priorité
        </Label>
        <Select
          value={formData.priority}
          onValueChange={(value) =>
            setFormData({ ...formData, priority: value as ProcessPriority })
          }
        >
          <SelectTrigger id="priority">
            <SelectValue placeholder="Sélectionner une priorité" />
          </SelectTrigger>
          <SelectContent className="z-[150]" position="popper">
            {priorityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Confidentiality */}
      <div className="space-y-2">
        <Label htmlFor="confidentiality" className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-orange-600" />
          Confidentialité
        </Label>
        <Select
          value={formData.confidentiality}
          onValueChange={(value) =>
            setFormData({ ...formData, confidentiality: value as ConfidentialityLevel })
          }
        >
          <SelectTrigger id="confidentiality">
            <SelectValue placeholder="Sélectionner un niveau de confidentialité" />
          </SelectTrigger>
          <SelectContent className="z-[150]" position="popper">
            {confidentialityOptions.map((option) => (
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
          placeholder="Description du processus..."
          rows={4}
          className={touched.description && errors.description ? 'border-red-500' : ''}
        />
        {touched.description && errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      {/* Objectif */}
      <div className="space-y-2">
        <Label htmlFor="objectif" className="flex items-center gap-2">
          <Target className="h-4 w-4 text-orange-600" />
          Objectif
        </Label>
        <Textarea
          id="objectif"
          value={formData.objectif}
          onChange={(e) => setFormData({ ...formData, objectif: e.target.value })}
          placeholder="Objectif du processus..."
          rows={2}
        />
      </div>

      {/* Périmètre */}
      <div className="space-y-2">
        <Label htmlFor="perimetre" className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-orange-600" />
          Périmètre
        </Label>
        <Textarea
          id="perimetre"
          value={formData.perimetre}
          onChange={(e) => setFormData({ ...formData, perimetre: e.target.value })}
          placeholder="Périmètre du processus..."
          rows={2}
        />
      </div>

      {/* Finalité */}
      <div className="space-y-2">
        <Label htmlFor="finalite" className="flex items-center gap-2">
          <Target className="h-4 w-4 text-orange-600" />
          Finalité
        </Label>
        <Textarea
          id="finalite"
          value={formData.finalite}
          onChange={(e) => setFormData({ ...formData, finalite: e.target.value })}
          placeholder="Finalité du processus..."
          rows={2}
        />
      </div>

      {/* Review Frequency */}
      <div className="space-y-2">
        <Label htmlFor="reviewFrequency" className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          Fréquence de révision (mois)
        </Label>
        <Input
          id="reviewFrequency"
          type="number"
          value={formData.reviewFrequency}
          onChange={(e) => setFormData({ ...formData, reviewFrequency: e.target.value })}
          onBlur={() => handleBlur('reviewFrequency')}
          placeholder="Ex: 12"
          className={touched.reviewFrequency && errors.reviewFrequency ? 'border-red-500' : ''}
        />
        {touched.reviewFrequency && errors.reviewFrequency && (
          <p className="text-sm text-red-500">{errors.reviewFrequency}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-orange-600 hover:bg-orange-700">
          {isLoading ? 'Enregistrement...' : process ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  )
}

