/**
 * Unified Process Form - Creates ProcessMap (L1), Process (L2), or Procedure (L3)
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Button,
  Input,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Textarea,
  Badge,
} from '@repo/ui'
import { Map, FileText, FileCog, Workflow, Target } from 'lucide-react'
import { useWorkspaces } from '../hooks/useWorkspaces'
import { useProcessMaps } from '../../process-map/hooks/useProcessMaps'
import { useProcesses } from '../../process/hooks/useProcesses'

type ProcessLevel = 1 | 2 | 3

interface UnifiedProcessFormProps {
  workspaceId: string
  onSubmit: (data: any, level: ProcessLevel) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

interface FormData {
  level: ProcessLevel
  title: string
  code: string
  description: string
  workspaceId: string
  processMapId?: string
  processId?: string
  type?: string
  status?: string
}

const LEVEL_OPTIONS = [
  { value: 1, label: 'Carte de Processus', icon: Map, color: 'bg-orange-500' },
  { value: 2, label: 'Processus', icon: FileText, color: 'bg-blue-500' },
  { value: 3, label: 'Procédure', icon: FileCog, color: 'bg-purple-500' },
]

export function UnifiedProcessForm({
  workspaceId,
  onSubmit,
  onCancel,
  isLoading = false,
}: UnifiedProcessFormProps) {
  const [selectedLevel, setSelectedLevel] = useState<ProcessLevel>(1)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      level: 1,
      workspaceId,
      title: '',
      code: '',
      description: '',
      type: 'FLOW',
      status: 'DRAFT',
    },
  })

  const selectedWorkspaceId = watch('workspaceId')
  const selectedProcessMapId = watch('processMapId')

  // Fetch workspaces for dropdown
  const { data: workspacesData } = useWorkspaces({ page: 1, limit: 100 })
  const workspaces = workspacesData?.data || []

  // Fetch ProcessMaps for Level 2 parent selection
  const { data: processMapsData } = useProcessMaps({
    workspaceId: selectedWorkspaceId,
    page: 1,
    limit: 100,
  })
  const processMaps = processMapsData?.data || []

  // Fetch Processes for Level 3 parent selection
  const { data: processesData } = useProcesses({
    workspaceId: selectedWorkspaceId,
    processMapId: selectedProcessMapId,
  })
  const processes = processesData?.data || []

  // Handle level change
  const handleLevelChange = (level: ProcessLevel) => {
    setSelectedLevel(level)
    setValue('level', level)
    // Reset parent selections when level changes
    setValue('processMapId', undefined)
    setValue('processId', undefined)
  }

  const handleFormSubmit = async (data: FormData) => {
    await onSubmit(data, selectedLevel)
  }

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true })
  }

  const currentLevelOption = LEVEL_OPTIONS.find((opt) => opt.value === selectedLevel)!
  const LevelIcon = currentLevelOption.icon

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Level Selection */}
      <div className="space-y-2">
        <Label htmlFor="level" className="text-sm font-medium text-gray-700">
          Type de niveau <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-1 gap-3">
          {LEVEL_OPTIONS.map((option) => {
            const Icon = option.icon
            const isSelected = selectedLevel === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleLevelChange(option.value as ProcessLevel)}
                className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`p-2 rounded-lg ${option.color} text-white`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900">{option.label}</div>
                </div>
                <Badge className={`${option.color} text-white`}>
                  Level {option.value}
                </Badge>
              </button>
            )
          })}
        </div>
      </div>

      {/* Workspace Selection */}
      <div className="space-y-2">
        <Label htmlFor="workspaceId" className="text-sm font-medium text-gray-700">
          Espace de travail <span className="text-red-500">*</span>
        </Label>
        <Select
          value={selectedWorkspaceId}
          onValueChange={(value) => setValue('workspaceId', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner un espace de travail" />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={5}>
            {workspaces.map((ws) => (
              <SelectItem key={ws.id} value={ws.id}>
                {ws.name} ({ws.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.workspaceId && touched.workspaceId && (
          <p className="text-sm text-red-500">{errors.workspaceId.message}</p>
        )}
      </div>

      {/* Parent Selection - Level 2 (ProcessMap) */}
      {selectedLevel === 2 && (
        <div className="space-y-2">
          <Label htmlFor="processMapId" className="text-sm font-medium text-gray-700">
            Carte de processus parent (optionnel)
          </Label>
          <Select
            value={selectedProcessMapId || 'none'}
            onValueChange={(value) => setValue('processMapId', value === 'none' ? undefined : value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner une carte de processus (optionnel)" />
            </SelectTrigger>
            <SelectContent position="popper" sideOffset={5}>
              <SelectItem value="none">Aucun parent</SelectItem>
              {processMaps.map((pm) => (
                <SelectItem key={pm.id} value={pm.id}>
                  {pm.title} ({pm.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Parent Selection - Level 3 (Process) */}
      {selectedLevel === 3 && (
        <div className="space-y-2">
          <Label htmlFor="processId" className="text-sm font-medium text-gray-700">
            Processus parent (optionnel)
          </Label>
          <Select
            value={watch('processId') || 'none'}
            onValueChange={(value) => setValue('processId', value === 'none' ? undefined : value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner un processus (optionnel)" />
            </SelectTrigger>
            <SelectContent position="popper" sideOffset={5}>
              <SelectItem value="none">Aucun parent</SelectItem>
              {processes.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.title} ({p.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium text-gray-700">
          Titre <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          {...register('title', {
            required: 'Le titre est requis',
            minLength: { value: 2, message: 'Le titre doit contenir au moins 2 caractères' },
            maxLength: { value: 200, message: 'Le titre ne peut pas dépasser 200 caractères' },
          })}
          onBlur={() => handleBlur('title')}
          placeholder="Entrer le titre"
          className={errors.title && touched.title ? 'border-red-500' : ''}
        />
        {errors.title && touched.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Code */}
      <div className="space-y-2">
        <Label htmlFor="code" className="text-sm font-medium text-gray-700">
          Code <span className="text-red-500">*</span>
        </Label>
        <Input
          id="code"
          {...register('code', {
            required: 'Le code est requis',
            minLength: { value: 2, message: 'Le code doit contenir au moins 2 caractères' },
            maxLength: { value: 50, message: 'Le code ne peut pas dépasser 50 caractères' },
            pattern: {
              value: /^[A-Z0-9_-]+$/,
              message: 'Le code doit contenir uniquement des lettres majuscules, chiffres, tirets et underscores',
            },
          })}
          onChange={(e) => {
            const upperValue = e.target.value.toUpperCase()
            setValue('code', upperValue)
          }}
          onBlur={() => handleBlur('code')}
          placeholder="CODE_EXEMPLE"
          className={errors.code && touched.code ? 'border-red-500' : ''}
        />
        {errors.code && touched.code && (
          <p className="text-sm text-red-500">{errors.code.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
          Description
        </Label>
        <Textarea
          id="description"
          {...register('description', {
            maxLength: { value: 1000, message: 'La description ne peut pas dépasser 1000 caractères' },
          })}
          onBlur={() => handleBlur('description')}
          placeholder="Description détaillée..."
          rows={4}
          className={errors.description && touched.description ? 'border-red-500' : ''}
        />
        {errors.description && touched.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Type - Only for Level 2 */}
      {selectedLevel === 2 && (
        <div className="space-y-2">
          <Label htmlFor="type" className="text-sm font-medium text-gray-700">
            Type de processus
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setValue('type', 'FLOW')}
              className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg transition-all ${
                watch('type') === 'FLOW'
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <Workflow className="w-5 h-5" />
              <span className="font-medium">Flux (Flow)</span>
            </button>
            <button
              type="button"
              onClick={() => setValue('type', 'SIPOC')}
              className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg transition-all ${
                watch('type') === 'SIPOC'
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <Target className="w-5 h-5" />
              <span className="font-medium">SIPOC</span>
            </button>
          </div>
        </div>
      )}

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status" className="text-sm font-medium text-gray-700">
          Statut
        </Label>
        <Select
          value={watch('status')}
          onValueChange={(value) => setValue('status', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={5}>
            <SelectItem value="DRAFT">Brouillon</SelectItem>
            <SelectItem value="IN_REVIEW">En révision</SelectItem>
            <SelectItem value="PUBLISHED">Publié</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Annuler
        </Button>
        <Button type="submit" variant="orange" disabled={isLoading} className="gap-2">
          <LevelIcon className="w-4 h-4" />
          {isLoading ? 'Création...' : `Créer ${currentLevelOption.label}`}
        </Button>
      </div>
    </form>
  )
}
