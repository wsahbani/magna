import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Dialog, DialogContent, DialogHeader, DialogTitle, BodySmall, Button } from '@repo/ui'
import { PageWrapper } from '../../../components/layout/PageWrapper'
import { FileText, Plus } from 'lucide-react'
import { ProcessPageHeader } from '../components/ProcessPageHeader'
import { ProcessFilters } from '../components/ProcessFilters'
import { ViewModeToggle } from '../components/ViewModeToggle'
import { ProcessGridView } from '../components/ProcessGridView'
import { ProcessTable } from '../components/ProcessTable'
import { ProcessEmptyState } from '../components/ProcessEmptyState'
import { ProcessForm } from '../components/ProcessForm'
import {
  useProcesses,
  useCreateProcess,
  useUpdateProcess,
  useDeleteProcess,
} from '../hooks/useProcesses'
import type { Process, ProcessLevel, ProcessStatus } from '../types/process.types'

export default function ProcessesPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState<ProcessLevel | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<ProcessStatus | 'all'>('all')
  const [macroIdFilter, setMacroIdFilter] = useState<string | undefined>()
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null)

  // Fetch processes with filters
  const { data, isLoading }  : any= useProcesses({
    search: search || undefined,
    level: levelFilter !== 'all' ? levelFilter : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    macroId: macroIdFilter,
  })

  const createMutation = useCreateProcess()
  const updateMutation = useUpdateProcess()
  const deleteMutation = useDeleteProcess()

  const handleCreate = async (formData: any) => {
    await createMutation.mutateAsync(formData)
    setIsCreateDialogOpen(false)
  }

  const handleEdit = (process: Process) => {
    setSelectedProcess(process)
    setIsEditDialogOpen(true)
  }

  const handleView = (process: Process) => {
    // Navigate based on process level (type)
    switch (process.level) {
      case 1: // FLOW
        navigate({ to: '/processes/flow/$id', params: { id: process.id } })
        break
      case 2: // SIPOC
        navigate({ to: '/processes/sipoc/$id', params: { id: process.id } })
        break
      case 3: // BPMN
        navigate({ to: '/processes/bpmn/$id', params: { id: process.id } })
        break
      default:
        console.warn('Unknown process level:', process.level)
    }
  }

  const handleUpdate = async (formData: any) => {
    if (selectedProcess) {
      await updateMutation.mutateAsync({
        id: selectedProcess.id,
        data: formData,
      })
      setIsEditDialogOpen(false)
      setSelectedProcess(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce processus ?')) {
      await deleteMutation.mutateAsync(id)
    }
  }

  return (
    <PageWrapper
      title="Processus"
      description="Gérez vos processus métier (Processus, Procédures, Instructions)"
      breadcrumbs={[
        { label: 'Processus', icon: <FileText className="w-4 h-4" /> },
      ]}
      actions={
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Processus
        </Button>
      }
    >
      {/* Filters & View Mode */}
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <ProcessFilters
            search={search}
            onSearchChange={setSearch}
            levelFilter={levelFilter}
            onLevelChange={setLevelFilter}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            macroIdFilter={macroIdFilter}
            onMacroIdChange={setMacroIdFilter}
          />
        </div>
        <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      ) : data?.data.length === 0 ? (
        <ProcessEmptyState onCreateClick={() => setIsCreateDialogOpen(true)} />
      ) : viewMode === 'grid' ? (
        <ProcessGridView
          processes={data?.data || []}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
        />
      ) : (
        <ProcessTable
          processes={data?.data || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Pagination */}
      {data && (data as any).totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            disabled={data.page === 1}
            onClick={() => {
              /* TODO: Implement pagination */
            }}
          >
            Précédent
          </Button>
          <BodySmall className="text-gray-600">
            Page {data.page} sur {data.totalPages}
          </BodySmall>
          <Button
            variant="outline"
            disabled={data.page === data.totalPages}
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
        <DialogContent className='w-full h-[800px] overflow-auto'>
          <DialogHeader>
            <DialogTitle>Créer un nouveau processus</DialogTitle>
          </DialogHeader>
          <div className="w-full">
            <ProcessForm
              onSubmit={handleCreate}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
         <DialogContent className='w-full h-[800px] overflow-auto'>
          <DialogHeader>
            <DialogTitle>Modifier le processus</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6">
            {selectedProcess && (
              <ProcessForm
                process={selectedProcess}
                onSubmit={handleUpdate}
                onCancel={() => {
                  setIsEditDialogOpen(false)
                  setSelectedProcess(null)
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  )
}
