/**
 * Process Form Component
 * Form for creating and editing processes with enhanced UX
 */

import { useState } from 'react'
import { Button } from '@repo/ui/components/ui/button'
import { Input } from '@repo/ui/components/ui/input'
import { Label } from '@repo/ui/components/ui/label'
import { Textarea } from '@repo/ui/components/ui/textarea'
import { Layers, Building2, Code2, FileText, Hash } from 'lucide-react'
import { useWorkspaces } from '../../workspaces/hooks/useWorkspaces'
import type { Process, CreateProcessDto, UpdateProcessDto, ProcessLevel } from '../types/process.types'

interface ProcessFormProps {
  process?: Process
  defaultWorkspaceId?: string
  onSubmit: (data: CreateProcessDto | UpdateProcessDto) => void
  onCancel: () => void
  isLoading?: boolean
}

const processLevels: { value: ProcessLevel; label: string; description: string; color: string }[] = [
  { 
    value: 1 as ProcessLevel, 
    label: 'Flow', 
    description: 'Niveau 1 - Processus de flux général',
    color: 'bg-purple-100 text-purple-800 border-purple-300'
  },
  { 
    value: 2 as ProcessLevel, 
    label: 'SIPOC', 
    description: 'Niveau 2 - Supplier Input Process Output Customer',
    color: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  { 
    value: 3 as ProcessLevel, 
    label: 'BPMN', 
    description: 'Niveau 3 - Business Process Model and Notation',
    color: 'bg-green-100 text-green-800 border-green-300'
  },
]

export function ProcessForm({ process, defaultWorkspaceId, onSubmit, onCancel, isLoading }: ProcessFormProps) {
  const { data: workspacesData, isLoading: isLoadingWorkspaces } = useWorkspaces()
  const workspaces = workspacesData?.data || []

  const [formData, setFormData] = useState({
    name: process?.name || '',
    description: process?.description || '',
    code: process?.code || '',
    level: process?.level || (1 as ProcessLevel),
    workspaceId: process?.workspaceId || defaultWorkspaceId || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères'
    } else if (formData.name.length > 200) {
      newErrors.name = 'Le nom ne peut pas dépasser 200 caractères'
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Le code est requis'
    } else if (formData.code.length < 2) {
      newErrors.code = 'Le code doit contenir au moins 2 caractères'
    } else if (formData.code.length > 50) {
      newErrors.code = 'Le code ne peut pas dépasser 50 caractères'
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'La description ne peut pas dépasser 1000 caractères'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const submitData: any = {
      name: formData.name,
      code: formData.code,
      level: formData.level,
    }

    if (formData.description) {
      submitData.description = formData.description
    }

    if (formData.workspaceId) {
      submitData.workspaceId = formData.workspaceId
    }

    onSubmit(submitData)
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setTouched((prev) => ({ ...prev, [field]: true }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const nameCharsRemaining = 200 - formData.name.length
  const codeCharsRemaining = 50 - formData.code.length
  const descCharsRemaining = 1000 - formData.description.length

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Info */}
      {process && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-orange-800">
            <FileText className="w-5 h-5" />
            <div>
              <p className="font-medium">Modification du processus</p>
              <p className="text-sm text-orange-600">
                Dernière modification: {new Date(process.updatedAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-2 text-base">
          <FileText className="w-4 h-4 text-orange-600" />
          Nom du processus <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="ex: Gestion de la qualité"
          className={`text-base ${errors.name && touched.name ? 'border-red-500 focus:ring-red-500' : 'focus:ring-orange-500'}`}
          maxLength={200}
        />
        <div className="flex justify-between items-center">
          {errors.name && touched.name ? (
            <p className="text-sm text-red-500">{errors.name}</p>
          ) : (
            <p className="text-xs text-gray-500">
              Un nom clair et descriptif pour identifier le processus
            </p>
          )}
          <p className={`text-xs ${nameCharsRemaining < 20 ? 'text-orange-600 font-medium' : 'text-gray-400'}`}>
            {nameCharsRemaining} restants
          </p>
        </div>
      </div>

      {/* Code Field */}
      <div className="space-y-2">
        <Label htmlFor="code" className="flex items-center gap-2 text-base">
          <Code2 className="w-4 h-4 text-orange-600" />
          Code unique <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
            placeholder="ex: PROC-QUAL-001"
            className={`pl-10 text-base font-mono ${errors.code && touched.code ? 'border-red-500 focus:ring-red-500' : 'focus:ring-orange-500'} ${process ? 'bg-gray-50 cursor-not-allowed' : ''}`}
            disabled={!!process}
            maxLength={50}
          />
        </div>
        <div className="flex justify-between items-center">
          {process ? (
            <p className="text-xs text-amber-600 flex items-center gap-1">
              <span>🔒</span> Le code ne peut pas être modifié après création
            </p>
          ) : errors.code && touched.code ? (
            <p className="text-sm text-red-500">{errors.code}</p>
          ) : (
            <p className="text-xs text-gray-500">
              Format recommandé: PROC-XXX-000 (lettres, chiffres, tirets)
            </p>
          )}
          {!process && (
            <p className={`text-xs ${codeCharsRemaining < 10 ? 'text-orange-600 font-medium' : 'text-gray-400'}`}>
              {codeCharsRemaining} restants
            </p>
          )}
        </div>
      </div>

      {/* Level Selector */}
      <div className="space-y-3">
        <Label htmlFor="level" className="flex items-center gap-2 text-base">
          <Layers className="w-4 h-4 text-orange-600" />
          Niveau hiérarchique <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {processLevels.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => handleChange('level', level.value)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                formData.level === level.value
                  ? `${level.color} border-current shadow-md scale-105`
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg ${
                  formData.level === level.value ? level.color : 'bg-gray-100 text-gray-600'
                }`}>
                  {level.value}
                </div>
                <span className={`font-semibold ${formData.level === level.value ? '' : 'text-gray-700'}`}>
                  {level.label}
                </span>
              </div>
              <p className={`text-xs ${formData.level === level.value ? 'opacity-90' : 'text-gray-500'}`}>
                {level.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Workspace Selector */}
      <div className="space-y-2">
        <Label htmlFor="workspaceId" className="flex items-center gap-2 text-base">
          <Building2 className="w-4 h-4 text-orange-600" />
          Espace de travail <span className="text-gray-400 text-sm font-normal">(optionnel)</span>
        </Label>
        <select
          id="workspaceId"
          value={formData.workspaceId}
          onChange={(e) => handleChange('workspaceId', e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
          disabled={isLoadingWorkspaces}
        >
          <option value="">Aucun espace de travail</option>
          {workspaces.map((workspace) => (
            <option key={workspace.id} value={workspace.id}>
              {workspace.name} • {workspace.code}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500">
          Rattacher ce processus à un espace de travail pour une meilleure organisation
        </p>
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <Label htmlFor="description" className="flex items-center gap-2 text-base">
          <FileText className="w-4 h-4 text-orange-600" />
          Description <span className="text-gray-400 text-sm font-normal">(optionnel)</span>
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Décrivez le but, le contexte et les objectifs du processus..."
          rows={5}
          className={`text-base resize-none ${errors.description && touched.description ? 'border-red-500 focus:ring-red-500' : 'focus:ring-orange-500'}`}
          maxLength={1000}
        />
        <div className="flex justify-between items-center">
          {errors.description && touched.description ? (
            <p className="text-sm text-red-500">{errors.description}</p>
          ) : (
            <p className="text-xs text-gray-500">
              Ajoutez des détails pour aider à comprendre le processus
            </p>
          )}
          <p className={`text-xs ${descCharsRemaining < 100 ? 'text-orange-600 font-medium' : 'text-gray-400'}`}>
            {descCharsRemaining} restants
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 text-base"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span> Enregistrement...
            </span>
          ) : process ? (
            '✓ Mettre à jour le processus'
          ) : (
            '+ Créer le processus'
          )}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          disabled={isLoading}
          className="px-6 py-2.5 text-base"
        >
          Annuler
        </Button>
      </div>
    </form>
  )
}
