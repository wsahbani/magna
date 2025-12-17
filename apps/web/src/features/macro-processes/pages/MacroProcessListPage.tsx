import { useState } from 'react'
// import { useNavigate } from '@tanstack/react-router' // TODO: Will be used for navigation
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button } from '@repo/ui'
import { PageWrapper } from '../../../components/layout/PageWrapper'
import { Folder, Plus, Search } from 'lucide-react'
import { MacroProcessCard } from '../components/MacroProcessCard'
import { MacroProcessForm } from '../components/MacroProcessForm'
import {
  useMacroProcesses,
  useCreateMacroProcess,
  useUpdateMacroProcess,
  useDeleteMacroProcess,
} from '../hooks/useMacroProcesses'
import type { MacroProcess } from '../types/macro-process.types'
import { Input } from '@repo/ui/components/ui/input'

export function MacroProcessListPage() {
  // const navigate = useNavigate() // TODO: Will be used for navigation to detail page
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedMacroProcess, setSelectedMacroProcess] =
    useState<MacroProcess | null>(null)

  // Fetch macro processes with filters
  const { data, isLoading } = useMacroProcesses({
    search: search || undefined,
    active: activeFilter,
  })

  const createMutation = useCreateMacroProcess()
  const updateMutation = useUpdateMacroProcess()
  const deleteMutation = useDeleteMacroProcess()

  const handleCreate = async (formData: any) => {
    await createMutation.mutateAsync(formData)
    setIsCreateDialogOpen(false)
  }

  const handleEdit = (macroProcess: MacroProcess) => {
    setSelectedMacroProcess(macroProcess)
    setIsEditDialogOpen(true)
  }

  const handleView = (macroProcess: MacroProcess) => {
    // TODO: Create detail page route
    console.log('View macro process:', macroProcess.id)
  }

  const handleUpdate = async (formData: any) => {
    if (selectedMacroProcess) {
      await updateMutation.mutateAsync({
        id: selectedMacroProcess.id,
        data: formData,
      })
      setIsEditDialogOpen(false)
      setSelectedMacroProcess(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        'Êtes-vous sûr de vouloir supprimer ce macro-processus ?',
      )
    ) {
      await deleteMutation.mutateAsync(id)
    }
  }

  const macroProcesses = data?.data || []
  const isEmpty = !isLoading && macroProcesses.length === 0

  return (
    <PageWrapper
      title="Macro-Processus"
      description="Gérez vos macro-processus (niveau stratégique)"
      breadcrumbs={[
        { label: 'Macro-Processus', icon: <Folder className="w-4 h-4" /> },
      ]}
      actions={
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Macro-Processus
        </Button>
      }
    >
      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un macro-processus..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeFilter === true ? 'default' : 'outline'}
            onClick={() => setActiveFilter(true)}
            size="sm"
          >
            Actifs
          </Button>
          <Button
            variant={activeFilter === false ? 'default' : 'outline'}
            onClick={() => setActiveFilter(false)}
            size="sm"
          >
            Inactifs
          </Button>
          <Button
            variant={activeFilter === undefined ? 'default' : 'outline'}
            onClick={() => setActiveFilter(undefined)}
            size="sm"
          >
            Tous
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-100 animate-pulse rounded-lg"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {isEmpty && (
        <div className="text-center py-12">
          <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun macro-processus
          </h3>
          <p className="text-gray-500 mb-4">
            Commencez par créer votre premier macro-processus
          </p>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Créer un macro-processus
          </Button>
        </div>
      )}

      {/* Grid */}
      {!isLoading && !isEmpty && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {macroProcesses.map((macroProcess: MacroProcess) => (
            <MacroProcessCard
              key={macroProcess.id}
              macroProcess={macroProcess}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={() => handleDelete(macroProcess.id)}
            />
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouveau Macro-Processus</DialogTitle>
          </DialogHeader>
          <MacroProcessForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreateDialogOpen(false)}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier Macro-Processus</DialogTitle>
          </DialogHeader>
          {selectedMacroProcess && (
            <MacroProcessForm
              macroProcess={selectedMacroProcess}
              onSubmit={handleUpdate}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setSelectedMacroProcess(null)
              }}
              isLoading={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </PageWrapper>
  )
}

