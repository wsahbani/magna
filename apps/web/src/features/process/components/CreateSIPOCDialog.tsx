/**
 * CreateSIPOCDialog Component
 * Dialog simplifié pour créer rapidement un processus de type SIPOC
 */

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button, Input, Label } from '@repo/ui'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select'
import { Building2, FileText, Hash, MapPin } from 'lucide-react'
import { useWorkspaces } from '../../workspaces/hooks/useWorkspaces'
import { useProcessMaps } from '../../process-map/hooks/useProcessMaps'
import type { CreateProcessDto } from '../types/process.types'
import { ProcessType, ProcessStatus } from '../types/enums'

interface CreateSIPOCDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateProcessDto) => Promise<void>
  defaultProcessMapId?: string
  defaultWorkspaceId?: string
  isLoading?: boolean
}

export function CreateSIPOCDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultProcessMapId,
  defaultWorkspaceId,
  isLoading = false,
}: CreateSIPOCDialogProps) {
  const { data: workspacesData, isLoading: isLoadingWorkspaces } = useWorkspaces()
  const workspaces = workspacesData?.data || []

  // Fetch ProcessMaps for the selected workspace
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(defaultWorkspaceId || '')
  const { data: processMapsData, isLoading: isLoadingProcessMaps } = useProcessMaps({
    workspaceId: selectedWorkspaceId || undefined,
    limit: 100,
  })
  const processMaps = processMapsData?.data || []

  const [formData, setFormData] = useState({
    title: '',
    code: '',
    processMapId: defaultProcessMapId || '',
    workspaceId: defaultWorkspaceId || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis'
    } else if (formData.title.length < 2) {
      newErrors.title = 'Le titre doit contenir au moins 2 caractères'
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Le code est requis'
    } else if (formData.code.length < 2) {
      newErrors.code = 'Le code doit contenir au moins 2 caractères'
    }

    if (!formData.processMapId) {
      newErrors.processMapId = 'La carte des processus est requise'
    }

    if (!formData.workspaceId) {
      newErrors.workspaceId = 'Le workspace est requis'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const submitData: CreateProcessDto = {
      title: formData.title.trim(),
      code: formData.code.trim().toUpperCase(),
      processMapId: formData.processMapId,
      workspaceId: formData.workspaceId,
      type: ProcessType.SIPOC,
      status: ProcessStatus.DRAFT,
    }

    await onSubmit(submitData)
    
    // Reset form after successful submission
    setFormData({
      title: '',
      code: '',
      processMapId: defaultProcessMapId || '',
      workspaceId: defaultWorkspaceId || '',
    })
    setErrors({})
    setSelectedWorkspaceId(defaultWorkspaceId || '')
  }

  const handleCancel = () => {
    setFormData({
      title: '',
      code: '',
      processMapId: defaultProcessMapId || '',
      workspaceId: defaultWorkspaceId || '',
    })
    setErrors({})
    setSelectedWorkspaceId(defaultWorkspaceId || '')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle>Créer un nouveau SIPOC</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="sipoc-title" className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-orange-600" />
              Titre <span className="text-red-500">*</span>
            </Label>
            <Input
              id="sipoc-title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                }
              }}
              placeholder="Ex: Analyse SIPOC Recrutement"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          {/* Code */}
          <div className="space-y-2">
            <Label htmlFor="sipoc-code" className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-orange-600" />
              Code <span className="text-red-500">*</span>
            </Label>
            <Input
              id="sipoc-code"
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                }
              }}
              placeholder="Ex: SIPOC-RH-001"
              className={errors.code ? 'border-red-500' : ''}
            />
            {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
          </div>

          {/* Workspace */}
          <div className="space-y-2">
            <Label htmlFor="sipoc-workspaceId" className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-orange-600" />
              Workspace <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.workspaceId || ''}
              onValueChange={(value) => {
                setFormData({ ...formData, workspaceId: value, processMapId: '' })
                setSelectedWorkspaceId(value)
              }}
              disabled={isLoadingWorkspaces || !!defaultWorkspaceId}
              onOpenChange={() => {}}
            >
              <SelectTrigger
                id="sipoc-workspaceId"
                className={errors.workspaceId ? 'border-red-500' : ''}
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
            {errors.workspaceId && <p className="text-sm text-red-500">{errors.workspaceId}</p>}
          </div>

          {/* ProcessMap */}
          <div className="space-y-2">
            <Label htmlFor="sipoc-processMapId" className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-orange-600" />
              Carte des processus <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.processMapId || ''}
              onValueChange={(value) => {
                setFormData({ ...formData, processMapId: value })
              }}
              disabled={isLoadingProcessMaps || !!defaultProcessMapId || !formData.workspaceId}
              onOpenChange={() => {}}
            >
              <SelectTrigger
                id="sipoc-processMapId"
                className={errors.processMapId ? 'border-red-500' : ''}
              >
                <SelectValue 
                  placeholder={
                    !formData.workspaceId
                      ? 'Sélectionnez d\'abord un workspace'
                      : isLoadingProcessMaps
                        ? 'Chargement...'
                        : 'Sélectionner une carte des processus'
                  } 
                />
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
            {errors.processMapId && <p className="text-sm text-red-500">{errors.processMapId}</p>}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-orange-600 hover:bg-orange-700">
              {isLoading ? 'Création...' : 'Créer SIPOC'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

