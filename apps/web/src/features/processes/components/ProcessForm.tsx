/**
 * Process Form Component
 * Modern SaaS-style form for creating and editing processes
 */

import { useState } from 'react'
import { Button } from '@repo/ui/components/ui/button'
import { Input } from '@repo/ui/components/ui/input'
import { Label } from '@repo/ui/components/ui/label'
import { Textarea } from '@repo/ui/components/ui/textarea'
import { 
  Layers, 
  Building2, 
  Code2, 
  FileText, 
  Hash, 
  Target,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { useWorkspaces } from '../../workspaces/hooks/useWorkspaces'
import { useMacroProcesses } from '../../macro-processes/hooks/useMacroProcesses'
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
  const { data: macroProcessesData } = useMacroProcesses({ active: true })
  const workspaces = workspacesData?.data || []
  const macroProcesses = macroProcessesData?.data || []

  const [formData, setFormData] = useState({
    macroId: process?.macroId || '',
    title: process?.title || process?.name || '',
    name: process?.name || process?.title || '',
    description: process?.description || '',
    code: process?.code || '',
    objectif: process?.objectif || '',
    perimetre: process?.perimetre || '',
    finalite: process?.finalite || '',
    level: process?.level || (1 as ProcessLevel),
    workspaceId: process?.workspaceId || defaultWorkspaceId || '',
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
      title: formData.title,
      name: formData.name || formData.title, // Keep name for compatibility
      code: formData.code,
      level: formData.level,
    }

    if (formData.macroId) {
      submitData.macroId = formData.macroId
    }
    if (formData.description) {
      submitData.description = formData.description
    }
    if (formData.objectif) {
      submitData.objectif = formData.objectif
    }
    if (formData.perimetre) {
      submitData.perimetre = formData.perimetre
    }
    if (formData.finalite) {
      submitData.finalite = formData.finalite
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

  const titleCharsRemaining = 200 - formData.title.length
  const codeCharsRemaining = 50 - formData.code.length
  const descCharsRemaining = 1000 - formData.description.length

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Header Info Card */}
        {process && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/60 rounded-lg p-3 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 mb-0.5">
                  Modification du processus
                </h3>
                <p className="text-xs text-gray-600">
                  Dernière modification le {new Date(process.updatedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Main Fields */}
          <div className="lg:col-span-2 space-y-4">

            {/* MacroProcess Field Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow transition-shadow">
              <Label htmlFor="macroId" className="flex items-center gap-2 mb-2 text-xs font-semibold text-gray-900">
                <div className="w-6 h-6 bg-gradient-to-br from-orange-100 to-amber-100 rounded flex items-center justify-center">
                  <Building2 className="w-3 h-3 text-orange-600" />
                </div>
                Macro-Processus
              </Label>
              <select
                id="macroId"
                value={formData.macroId}
                onChange={(e) => handleChange('macroId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 text-xs transition-all hover:border-gray-400"
              >
                <option value="">Aucun macro-processus</option>
                {macroProcesses.map((mp: { id: string; name: string; code: string }) => (
                  <option key={mp.id} value={mp.id}>
                    {mp.name} ({mp.code})
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-gray-500">
                Sélectionnez le macro-processus auquel ce processus appartient
              </p>
            </div>

            {/* Title Field Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow transition-shadow">
              <Label htmlFor="title" className="flex items-center gap-2 mb-2 text-xs font-semibold text-gray-900">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded flex items-center justify-center">
                  <FileText className="w-3 h-3 text-blue-600" />
                </div>
                Titre du processus
                <span className="text-red-500 font-medium">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => {
                  handleChange('title', e.target.value)
                  handleChange('name', e.target.value)
                }}
                placeholder="ex: Gestion de la qualité"
                className={`h-9 text-xs ${errors.title && touched.title 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'focus:ring-orange-500 focus:border-orange-500'
                } transition-all`}
                maxLength={200}
              />
              <div className="flex justify-between items-center mt-1.5">
                {errors.title && touched.title ? (
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.title}</span>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">
                    Un titre clair et descriptif pour identifier le processus
                  </p>
                )}
                <p className={`text-xs font-medium ${titleCharsRemaining < 20 ? 'text-orange-600' : 'text-gray-400'}`}>
                  {titleCharsRemaining} restants
                </p>
              </div>
            </div>

            {/* Code Field Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow transition-shadow">
              <Label htmlFor="code" className="flex items-center gap-2 mb-2 text-xs font-semibold text-gray-900">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded flex items-center justify-center">
                  <Code2 className="w-3 h-3 text-purple-600" />
                </div>
                Code unique
                <span className="text-red-500 font-medium">*</span>
              </Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                  placeholder="ex: PROC-QUAL-001"
                  className={`pl-9 h-9 text-xs font-mono ${errors.code && touched.code 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'focus:ring-orange-500 focus:border-orange-500'
                  } ${process ? 'bg-gray-50 cursor-not-allowed' : ''} transition-all`}
                  disabled={!!process}
                  maxLength={50}
                />
              </div>
              <div className="flex justify-between items-center mt-1.5">
                {process ? (
                  <div className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded">
                    <span>🔒</span>
                    <span>Le code ne peut pas être modifié après création</span>
                  </div>
                ) : errors.code && touched.code ? (
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.code}</span>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">
                    Format recommandé: PROC-XXX-000 (lettres, chiffres, tirets)
                  </p>
                )}
                {!process && (
                  <p className={`text-xs font-medium ${codeCharsRemaining < 10 ? 'text-orange-600' : 'text-gray-400'}`}>
                    {codeCharsRemaining} restants
                  </p>
                )}
              </div>
            </div>

            {/* Level Selector Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
              <Label className="flex items-center gap-2 mb-3 text-xs font-semibold text-gray-900">
                <div className="w-6 h-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded flex items-center justify-center">
                  <Layers className="w-3 h-3 text-indigo-600" />
                </div>
                Niveau hiérarchique
                <span className="text-red-500 font-medium">*</span>
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {processLevels.map((level) => {
                  const isSelected = formData.level === level.value
                  return (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => handleChange('level', level.value)}
                      className={`group relative p-3 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-amber-50 shadow-md shadow-orange-500/10'
                          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 className="w-4 h-4 text-orange-600" />
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-all ${
                          isSelected 
                            ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-sm' 
                            : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                        }`}>
                          {level.value}
                        </div>
                        <span className={`font-semibold text-xs ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                          {level.label}
                        </span>
                      </div>
                      <p className={`text-xs ${isSelected ? 'text-gray-700' : 'text-gray-500'}`}>
                        {level.description}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Workspace Selector Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow transition-shadow">
              <Label htmlFor="workspaceId" className="flex items-center gap-2 mb-2 text-xs font-semibold text-gray-900">
                <div className="w-6 h-6 bg-gradient-to-br from-emerald-100 to-teal-100 rounded flex items-center justify-center">
                  <Building2 className="w-3 h-3 text-emerald-600" />
                </div>
                Espace de travail
                <span className="text-gray-400 text-xs font-normal">(optionnel)</span>
              </Label>
              <select
                id="workspaceId"
                value={formData.workspaceId}
                onChange={(e) => handleChange('workspaceId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 text-xs transition-all hover:border-gray-400"
                disabled={isLoadingWorkspaces}
              >
                <option value="">Aucun espace de travail</option>
                {workspaces.map((workspace) => (
                  <option key={workspace.id} value={workspace.id}>
                    {workspace.name} • {workspace.code}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-gray-500">
                Rattacher ce processus à un espace de travail pour une meilleure organisation
              </p>
            </div>

            {/* Description Field Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow transition-shadow">
              <Label htmlFor="description" className="flex items-center gap-2 mb-2 text-xs font-semibold text-gray-900">
                <div className="w-6 h-6 bg-gradient-to-br from-slate-100 to-gray-100 rounded flex items-center justify-center">
                  <FileText className="w-3 h-3 text-slate-600" />
                </div>
                Description
                <span className="text-gray-400 text-xs font-normal">(optionnel)</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Décrivez le but, le contexte et les objectifs du processus..."
                rows={4}
                className={`text-xs resize-none ${errors.description && touched.description 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'focus:ring-orange-500 focus:border-orange-500'
                } transition-all`}
                maxLength={1000}
              />
              <div className="flex justify-between items-center mt-1.5">
                {errors.description && touched.description ? (
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.description}</span>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">
                    Ajoutez des détails pour aider à comprendre le processus
                  </p>
                )}
                <p className={`text-xs font-medium ${descCharsRemaining < 100 ? 'text-orange-600' : 'text-gray-400'}`}>
                  {descCharsRemaining} restants
                </p>
              </div>
            </div>

            {/* Objectif Field Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow transition-shadow">
              <Label htmlFor="objectif" className="flex items-center gap-2 mb-2 text-xs font-semibold text-gray-900">
                <div className="w-6 h-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded flex items-center justify-center">
                  <Target className="w-3 h-3 text-green-600" />
                </div>
                Objectif
                <span className="text-gray-400 text-xs font-normal">(optionnel)</span>
              </Label>
              <Textarea
                id="objectif"
                value={formData.objectif}
                onChange={(e) => handleChange('objectif', e.target.value)}
                placeholder="Objectif principal du processus..."
                rows={2}
                className="text-xs resize-none focus:ring-orange-500 focus:border-orange-500 transition-all"
                maxLength={1000}
              />
              <p className="mt-1.5 text-xs text-gray-500">
                Définissez l'objectif principal que ce processus cherche à atteindre
              </p>
            </div>

            {/* Périmètre Field Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow transition-shadow">
              <Label htmlFor="perimetre" className="flex items-center gap-2 mb-2 text-xs font-semibold text-gray-900">
                <div className="w-6 h-6 bg-gradient-to-br from-cyan-100 to-blue-100 rounded flex items-center justify-center">
                  <MapPin className="w-3 h-3 text-cyan-600" />
                </div>
                Périmètre
                <span className="text-gray-400 text-xs font-normal">(optionnel)</span>
              </Label>
              <Textarea
                id="perimetre"
                value={formData.perimetre}
                onChange={(e) => handleChange('perimetre', e.target.value)}
                placeholder="Périmètre d'application du processus..."
                rows={2}
                className="text-xs resize-none focus:ring-orange-500 focus:border-orange-500 transition-all"
                maxLength={1000}
              />
              <p className="mt-1.5 text-xs text-gray-500">
                Définissez le périmètre d'application et les limites du processus
              </p>
            </div>

            {/* Finalité Field Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow transition-shadow">
              <Label htmlFor="finalite" className="flex items-center gap-2 mb-2 text-xs font-semibold text-gray-900">
                <div className="w-6 h-6 bg-gradient-to-br from-violet-100 to-purple-100 rounded flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-violet-600" />
                </div>
                Finalité
                <span className="text-gray-400 text-xs font-normal">(optionnel)</span>
              </Label>
              <Textarea
                id="finalite"
                value={formData.finalite}
                onChange={(e) => handleChange('finalite', e.target.value)}
                placeholder="Finalité et but ultime du processus..."
                rows={2}
                className="text-xs resize-none focus:ring-orange-500 focus:border-orange-500 transition-all"
                maxLength={500}
              />
              <p className="mt-1.5 text-xs text-gray-500">
                Définissez la finalité et le but ultime de ce processus
              </p>
            </div>
          </div>

          {/* Right Column - Summary/Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              {/* Quick Info Card */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-200/60 p-3 shadow-sm">
                <h3 className="text-xs font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-5 h-5 bg-orange-100 rounded flex items-center justify-center">
                    <FileText className="w-3 h-3 text-orange-600" />
                  </div>
                  Informations
                </h3>
                <div className="space-y-2.5 text-xs text-gray-600">
                  <div>
                    <p className="font-medium text-gray-700 mb-0.5">Champs requis</p>
                    <p>Titre, Code et Niveau sont obligatoires pour créer un processus.</p>
                  </div>
                  <div className="pt-2.5 border-t border-orange-200/60">
                    <p className="font-medium text-gray-700 mb-0.5">Conseil</p>
                    <p>Remplissez au moins le titre et la description pour un processus complet.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200 bg-white rounded-lg p-3 shadow-sm">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 h-9 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold text-xs shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-200"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Enregistrement...</span>
              </span>
            ) : process ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mettre à jour le processus</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>+</span>
                <span>Créer le processus</span>
              </span>
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel} 
            disabled={isLoading}
            className="h-9 px-4 text-xs font-medium border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  )
}
