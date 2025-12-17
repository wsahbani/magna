import { useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Dialog, DialogContent, DialogHeader, DialogTitle, BodySmall, Button } from '@repo/ui'
import { PageWrapper } from '../../../components/layout/PageWrapper'
import { FileText, Plus } from 'lucide-react'
import { ViewModeToggle } from '../../process-map/components/ViewModeToggle'
import { ProcedureGridView } from '../components/ProcedureGridView'
import { ProcedureTable } from '../components/ProcedureTable'
import { ProcedureEmptyState } from '../components/ProcedureEmptyState'
import { ProcedureForm } from '../components/ProcedureForm'
import {
  useProcedures,
  useCreateProcedure,
  useUpdateProcedure,
  useDeleteProcedure,
} from '../hooks/useProcedures'
import type { Procedure } from '../types/procedure.types'
import { toast } from 'sonner'

export default function ProceduresPage() {
  const navigate = useNavigate()
  const searchParams = useSearch({ strict: false }) as any
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null)

  // Fetch Procedures with optional filter by processId
  const { data: procedures, isLoading } = useProcedures(
    searchParams?.processId as string | undefined,
  )

  const createMutation = useCreateProcedure()
  const updateMutation = useUpdateProcedure()
  const deleteMutation = useDeleteProcedure()

  const handleCreate = async (formData: any) => {
    try {
      await createMutation.mutateAsync(formData)
      setIsCreateDialogOpen(false)
      toast.success('Procédure créée avec succès')
    } catch (error: any) {
      toast.error(error?.message || 'Erreur lors de la création de la procédure')
    }
  }

  const handleEdit = (procedure: Procedure) => {
    setSelectedProcedure(procedure)
    setIsEditDialogOpen(true)
  }

  const handleView = (procedure: Procedure) => {
    navigate({ to: '/procedures-level3/$id', params: { id: procedure.id } })
  }

  const handleUpdate = async (formData: any) => {
    if (selectedProcedure) {
      try {
        await updateMutation.mutateAsync({
          id: selectedProcedure.id,
          data: formData,
        })
        setIsEditDialogOpen(false)
        setSelectedProcedure(null)
        toast.success('Procédure modifiée avec succès')
      } catch (error: any) {
        toast.error(error?.message || 'Erreur lors de la modification de la procédure')
      }
    }
  }

  const handleDelete = async (procedure: Procedure) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette procédure ?')) {
      try {
        await deleteMutation.mutateAsync(procedure.id)
        toast.success('Procédure supprimée avec succès')
      } catch (error: any) {
        toast.error(error?.message || 'Erreur lors de la suppression de la procédure')
      }
    }
  }

  return (
    <PageWrapper
      title="Procédures"
      description="Gérez vos procédures opérationnelles (Niveau 3 - Procedure)"
      breadcrumbs={[{ label: 'Procédures', icon: <FileText className="w-4 h-4" /> }]}
      actions={
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Procédure
        </Button>
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
      ) : !procedures || procedures.length === 0 ? (
        <ProcedureEmptyState onCreateClick={() => setIsCreateDialogOpen(true)} />
      ) : viewMode === 'grid' ? (
        <ProcedureGridView
          procedures={procedures}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
        />
      ) : (
        <ProcedureTable
          procedures={procedures}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
        />
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle procédure</DialogTitle>
          </DialogHeader>
          <div className="w-full">
            <ProcedureForm
              onSubmit={handleCreate}
              onCancel={() => setIsCreateDialogOpen(false)}
              isLoading={createMutation.isPending}
              defaultProcessId={searchParams?.processId as string | undefined}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier la procédure</DialogTitle>
          </DialogHeader>
          <div className="w-full">
            {selectedProcedure && (
              <ProcedureForm
                procedure={selectedProcedure}
                onSubmit={handleUpdate}
                onCancel={() => {
                  setIsEditDialogOpen(false)
                  setSelectedProcedure(null)
                }}
                isLoading={updateMutation.isPending}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  )
}

