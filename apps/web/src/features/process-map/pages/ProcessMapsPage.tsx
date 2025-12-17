import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Dialog, DialogContent, DialogHeader, DialogTitle, BodySmall, Button } from '@repo/ui'
import { PageWrapper } from '../../../components/layout/PageWrapper'
import { MapPin, Plus, Sparkles } from 'lucide-react'
import { ViewModeToggle } from '../components/ViewModeToggle'
import { ProcessMapGridView } from '../components/ProcessMapGridView'
import { ProcessMapTable } from '../components/ProcessMapTable'
import { ProcessMapEmptyState } from '../components/ProcessMapEmptyState'
import { ProcessMapForm } from '../components/ProcessMapForm'
import { AIGenerateModal } from '../components/AIGenerateModal'
import {
  useProcessMaps,
  useCreateProcessMap,
  useUpdateProcessMap,
  useDeleteProcessMap,
} from '../hooks/useProcessMaps'
import { createProcessMapFromAI } from '../../../lib/api/ai.api'
import type { ProcessMap } from '../types/process-map.types'
import type { GeneratedProcessMapStructure } from '../../../lib/api/ai.api'
import { toast } from 'sonner'

export default function ProcessMapsPage() {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isAIGenerateDialogOpen, setIsAIGenerateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedProcessMap, setSelectedProcessMap] = useState<ProcessMap | null>(null)
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('')

  // Fetch ProcessMaps
  const { data, isLoading } = useProcessMaps()

  const createMutation = useCreateProcessMap()
  const updateMutation = useUpdateProcessMap()
  const deleteMutation = useDeleteProcessMap()

  const handleCreate = async (formData: any) => {
    await createMutation.mutateAsync(formData)
    setIsCreateDialogOpen(false)
  }

  const handleAIGenerateSuccess = async (response: {
    structure: GeneratedProcessMapStructure
    estimatedCost: number
    cached: boolean
    tokensUsed: { prompt: number; completion: number; total: number }
    workspaceId?: string
  }) => {
    try {
      // Récupérer le workspaceId depuis la réponse ou le state
      const workspaceId = response.workspaceId || selectedWorkspaceId
      if (!workspaceId) {
        toast.error('Workspace ID manquant')
        return
      }

      // Créer la ProcessMap à partir de la structure IA
      const processMap = await createProcessMapFromAI(
        response.structure,
        workspaceId,
        undefined, // departmentId optionnel
        undefined, // code généré automatiquement
      )
      toast.success('Carte des processus créée avec succès avec IA')
      setIsAIGenerateDialogOpen(false)
      setSelectedWorkspaceId('')
      // Naviguer vers la page de détail
      navigate({ to: '/process-maps/$id', params: { id: processMap.id } })
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Erreur lors de la création de la carte des processus',
      )
    }
  }

  const handleEdit = (processMap: ProcessMap) => {
    setSelectedProcessMap(processMap)
    setIsEditDialogOpen(true)
  }

  const handleView = (processMap: ProcessMap) => {
    navigate({ to: '/process-maps/$id', params: { id: processMap.id } })
  }

  const handleUpdate = async (formData: any) => {
    if (selectedProcessMap) {
      await updateMutation.mutateAsync({
        id: selectedProcessMap.id,
        data: formData,
      })
      setIsEditDialogOpen(false)
      setSelectedProcessMap(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette carte des processus ?')) {
      await deleteMutation.mutateAsync(id)
    }
  }

  return (
    <PageWrapper
      title="Cartes des Processus"
      description="Gérez vos cartes des processus (Niveau 1 - ProcessMap)"
      breadcrumbs={[{ label: 'Cartes des Processus', icon: <MapPin className="w-4 h-4" /> }]}
      actions={
        <div className="flex gap-2">
          <Button
            onClick={() => setIsAIGenerateDialogOpen(true)}
            variant="outline"
            className="border-orange-600 text-orange-600 hover:bg-orange-50"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Générer avec IA
          </Button>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Carte
          </Button>
        </div>
      }
    >
      {/* View Mode Toggle */}
      <div className="flex justify-end mb-4">
        <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      ) : data?.data.length === 0 ? (
        <ProcessMapEmptyState onCreateClick={() => setIsCreateDialogOpen(true)} />
      ) : viewMode === 'grid' ? (
        <ProcessMapGridView
          processMaps={data?.data || []}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
        />
      ) : (
        <ProcessMapTable
          processMaps={data?.data || []}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
        />
      )}

      {/* Pagination */}
      {data && data.meta.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            variant="outline"
            disabled={data.meta.page === 1}
            onClick={() => {
              /* TODO: Implement pagination */
            }}
          >
            Précédent
          </Button>
          <BodySmall className="text-gray-600">
            Page {data.meta.page} sur {data.meta.totalPages}
          </BodySmall>
          <Button
            variant="outline"
            disabled={data.meta.page === data.meta.totalPages}
            onClick={() => {
              /* TODO: Implement pagination */
            }}
          >
            Suivant
          </Button>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="w-full max-w-2xl">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle carte des processus</DialogTitle>
          </DialogHeader>
          <div className="w-full">
            <ProcessMapForm
              onSubmit={(data) => {
                if (data.workspaceId) {
                  setSelectedWorkspaceId(data.workspaceId)
                }
                handleCreate(data)
              }}
              onCancel={() => setIsCreateDialogOpen(false)}
              isLoading={createMutation.isPending}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-full max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier la carte des processus</DialogTitle>
          </DialogHeader>
          <div className="w-full">
            {selectedProcessMap && (
              <ProcessMapForm
                processMap={selectedProcessMap}
                onSubmit={handleUpdate}
                onCancel={() => {
                  setIsEditDialogOpen(false)
                  setSelectedProcessMap(null)
                }}
                isLoading={updateMutation.isPending}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Generate Dialog */}
      <AIGenerateModal
        open={isAIGenerateDialogOpen}
        onOpenChange={setIsAIGenerateDialogOpen}
        workspaceId={selectedWorkspaceId ? selectedWorkspaceId : undefined}
        onSuccess={handleAIGenerateSuccess}
      />
    </PageWrapper>
  )
}

