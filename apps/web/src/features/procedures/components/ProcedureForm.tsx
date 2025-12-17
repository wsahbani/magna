/**
 * Procedure Form Component
 * Form for creating and editing Procedures (Level 3)
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
import { FileText, Code2, Target, Hash, Building2, Workflow, AlertCircle } from 'lucide-react'
import { useProcesses } from '../../process/hooks/useProcesses'
import { useWorkspaces } from '../../workspaces/hooks/useWorkspaces'
import type { CreateProcedureDto, UpdateProcedureDto } from '../types/procedure.types'

interface ProcedureFormProps {
  procedure?: any // Procedure type
  defaultProcessId?: string
  defaultWorkspaceId?: string
  onSubmit: (data: CreateProcedureDto | UpdateProcedureDto & { workspaceId: string }) => void
  onCancel: () => void
  isLoading?: boolean
}

export function ProcedureForm({
  procedure,
  defaultProcessId,
  defaultWorkspaceId,
  onSubmit,
  onCancel,
  isLoading,
}: ProcedureFormProps) {
  const { data: workspacesData, isLoading: isLoadingWorkspaces } = useWorkspaces()
  const workspaces = workspacesData?.data || []

  // Fetch Processes for the selected workspace
  const selectedWorkspaceId = procedure?.workspaceId || defaultWorkspaceId || ''
  const { data: processesData, isLoading: isLoadingProcesses } = useProcesses({
    workspaceId: selectedWorkspaceId || undefined,
    limit: 100,
  })
  const processes = processesData?.data || []

  const [formData, setFormData] = useState({
    title: procedure?.title || procedure?.name || '',
    code: procedure?.code || '',
    description: procedure?.description || '',
    processId: procedure?.processId || defaultProcessId || '',
    workspaceId: procedure?.workspaceId || defaultWorkspaceId || '',
    objective: procedure?.objective || '',
    scope: procedure?.scope || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis'
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Le code est requis'
    }

    if (!formData.processId) {
      newErrors.processId = 'Le processus parent est requis'
    }

    if (!formData.workspaceId) {
      newErrors.workspaceId = 'Le workspace est requis'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({
        processId: formData.processId,
        title: formData.title, // API expects 'title'
        code: formData.code,
        description: formData.description || undefined,
        objective: formData.objective || undefined,
        scope: formData.scope || undefined,
        workspaceId: formData.workspaceId,
      } as any)
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
          placeholder="Ex: Procédure de gestion des commandes"
          className={touched.title && errors.title ? 'border-red-500' : ''}
        />
        {touched.title && errors.title && (
          <p className="text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      {/* Code */}
      <div className="space-y-2">
        <Label htmlFor="code" className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-orange-600" />
          Code <span className="text-red-500">*</span>
        </Label>
        <Input
          id="code"
          type="text"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          onBlur={() => handleBlur('code')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
            }
          }}
          placeholder="Ex: PROC-001"
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
          value={formData.workspaceId || ''}
          onValueChange={(value) => {
            setFormData({ ...formData, workspaceId: value, processId: '' })
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

      {/* Process */}
      <div className="space-y-2">
        <Label htmlFor="processId" className="flex items-center gap-2">
          <Workflow className="h-4 w-4 text-orange-600" />
          Processus parent <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.processId || ''}
          onValueChange={(value) => {
            setFormData({ ...formData, processId: value })
            setTouched((prev) => ({ ...prev, processId: true }))
            validateForm()
          }}
          disabled={isLoadingProcesses || !formData.workspaceId || !!defaultProcessId}
        >
          <SelectTrigger
            id="processId"
            className={touched.processId && errors.processId ? 'border-red-500' : ''}
          >
            <SelectValue placeholder={isLoadingProcesses ? 'Chargement...' : 'Sélectionner un processus'} />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] z-[150]" position="popper">
            {processes.length === 0 ? (
              <div className="px-2 py-1.5 text-sm text-gray-500">
                {isLoadingProcesses ? 'Chargement...' : formData.workspaceId ? 'Aucun processus disponible' : 'Sélectionnez d\'abord un workspace'}
              </div>
            ) : (
              processes.map((process) => (
                <SelectItem key={process.id} value={process.id}>
                  {process.title} ({process.code})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {touched.processId && errors.processId && (
          <p className="text-sm text-red-500">{errors.processId}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-orange-600" />
          Description
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description de la procédure..."
          rows={4}
        />
      </div>

      {/* Objective */}
      <div className="space-y-2">
        <Label htmlFor="objective" className="flex items-center gap-2">
          <Target className="h-4 w-4 text-orange-600" />
          Objectif
        </Label>
        <Textarea
          id="objective"
          value={formData.objective}
          onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
          placeholder="Objectif de la procédure..."
          rows={3}
        />
      </div>

      {/* Scope */}
      <div className="space-y-2">
        <Label htmlFor="scope" className="flex items-center gap-2">
          <Hash className="h-4 w-4 text-orange-600" />
          Périmètre
        </Label>
        <Textarea
          id="scope"
          value={formData.scope}
          onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
          placeholder="Périmètre d'application de la procédure..."
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Annuler
        </Button>
        <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
          {isLoading ? 'Enregistrement...' : procedure ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  )
}

