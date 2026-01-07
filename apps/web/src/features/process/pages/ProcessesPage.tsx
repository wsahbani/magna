import { useState, useMemo } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Dialog, DialogContent, DialogHeader, DialogTitle, BodySmall, Button } from '@repo/ui'
import { PageWrapper } from '../../../components/layout/PageWrapper'
import { Workflow, Plus, Sparkles, Filter, Search } from 'lucide-react'
import { ViewModeToggle } from '../../process-map/components/ViewModeToggle'
import { ProcessGridView } from '../components/ProcessGridView'
import { ProcessTable } from '../components/ProcessTable'
import { ProcessEmptyState } from '../components/ProcessEmptyState'
import { ProcessForm } from '../components/ProcessForm'
import { AIGenerateProcessModal } from '../components/AIGenerateProcessModal'
import { CreateSIPOCDialog } from '../components/CreateSIPOCDialog'
import {
  useProcesses,
  useCreateProcess,
  useUpdateProcess,
  useDeleteProcess,
} from '../hooks/useProcesses'
import { createProcessFromAI } from '../../../lib/api/ai.api'
import type { Process } from '../types/process.types'
import type { GeneratedProcessStructure } from '../../../lib/api/ai.api'
import { ProcessType } from '../types/enums'
import { toast } from 'sonner'

export default function ProcessesPage() {
  const navigate = useNavigate()
  // Note: useSearch might not work if route search params are not defined in router
  // Using optional chaining and type assertion for now
  const searchParams = useSearch({ strict: false }) as any
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [typeFilter, setTypeFilter] = useState<ProcessType | 'ALL'>('ALL')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreateSIPOCDialogOpen, setIsCreateSIPOCDialogOpen] = useState(false)
  const [isAIGenerateDialogOpen, setIsAIGenerateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null)

  // Fetch Processes with optional filters
  const processParams: any = {
    processMapId: searchParams?.processMapId as string | undefined,
    workspaceId: searchParams?.workspaceId as string | undefined,
    page: currentPage,
    limit: searchParams?.limit as number | undefined,
  }
  
  // Only add type filter if not 'ALL'
  if (typeFilter !== 'ALL') {
    processParams.type = typeFilter
  }
  
  const { data, isLoading } = useProcesses(processParams)

  // Filter Processes by search term
  const filteredProcesses = useMemo(() => {
    if (!data?.data) return []
    if (!searchTerm.trim()) return data.data

    const term = searchTerm.toLowerCase()
    return data.data.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.code.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term),
    )
  }, [data?.data, searchTerm])

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
    // Navigate to SIPOC flow if type is SIPOC, otherwise to FlowDiagram
    if (process.type === ProcessType.SIPOC) {
      // Navigate to SIPOC detail page with process ID
      window.location.href = `/processes/sipoc/${process.id}`
    } else {
      navigate({ to: '/processes-level2/$id', params: { id: process.id } })
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

  const handleDelete = async (process: Process) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce processus ?')) {
      await deleteMutation.mutateAsync(process.id)
    }
  }

  const handleCreateSIPOC = async (formData: any) => {
    try {
      const process = await createMutation.mutateAsync(formData)
      toast.success('SIPOC créé avec succès')
      setIsCreateSIPOCDialogOpen(false)
      // Rediriger vers la page SIPOC
      window.location.href = `/processes/sipoc/${process.id}`
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Erreur lors de la création du SIPOC',
      )
    }
  }

  const handleAIGenerateSuccess = async (response: {
    structure: GeneratedProcessStructure
    estimatedCost: number
    cached: boolean
    tokensUsed: { prompt: number; completion: number; total: number }
    processMapId?: string
    workspaceId?: string
    flowDirection?: 'horizontal' | 'vertical'
  }) => {
    try {
      // Récupérer le processMapId depuis la réponse
      const finalProcessMapId = response.processMapId || searchParams?.processMapId
      if (!finalProcessMapId) {
        toast.error('ProcessMap ID manquant')
        return
      }

      // Créer le Process à partir de la structure IA
      const process = await createProcessFromAI({
        structure: response.structure,
        processMapId: finalProcessMapId,
        workspaceId: response.workspaceId || searchParams?.workspaceId,
        departmentId: searchParams?.departmentId,
        code: undefined, // code généré automatiquement
        flowDirection: response.flowDirection || 'horizontal',
      })
      toast.success('Processus créé avec succès avec IA')
      setIsAIGenerateDialogOpen(false)
      // Naviguer vers la page de détail
      navigate({ to: '/processes-level2/$id', params: { id: process.id } })
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Erreur lors de la création du processus',
      )
    }
  }

  return (
    <PageWrapper
      title="Processus"
      description="Gérez vos processus métier (Niveau 2 - Process)"
      breadcrumbs={[{ label: 'Processus', icon: <Workflow className="w-4 h-4" /> }]}
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
            onClick={() => setIsCreateSIPOCDialogOpen(true)}
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Créer SIPOC
          </Button>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Processus
          </Button>
        </div>
      }
    >
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Rechercher par titre, code ou description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Filters and View Mode Toggle */}
      <div className="flex justify-between items-center mb-4">
        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <div className="flex gap-2">
            <Button
              variant={typeFilter === 'ALL' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter('ALL')}
              className={
                typeFilter === 'ALL'
                  ? 'bg-orange-600 hover:bg-orange-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            >
              Tous
            </Button>
            <Button
              variant={typeFilter === ProcessType.FLOW ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter(ProcessType.FLOW)}
              className={
                typeFilter === ProcessType.FLOW
                  ? 'bg-orange-600 hover:bg-orange-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            >
              Flow
            </Button>
            <Button
              variant={typeFilter === ProcessType.SIPOC ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter(ProcessType.SIPOC)}
              className={
                typeFilter === ProcessType.SIPOC
                  ? 'bg-orange-600 hover:bg-orange-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            >
              SIPOC
            </Button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      ) : filteredProcesses.length === 0 ? (
        searchTerm ? (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun résultat</h3>
            <p className="mt-2 text-sm text-gray-500">
              Aucun processus ne correspond à votre recherche "{searchTerm}".
            </p>
            <Button
              variant="outline"
              onClick={() => setSearchTerm('')}
              className="mt-4"
            >
              Effacer la recherche
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Workflow className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {typeFilter === 'ALL' 
                ? 'Aucun processus trouvé'
                : typeFilter === ProcessType.FLOW
                ? 'Aucun processus Flow trouvé'
                : 'Aucun processus SIPOC trouvé'
              }
            </h3>
            <p className="text-gray-500 mb-4">
              {typeFilter === 'ALL'
                ? 'Commencez par créer votre premier processus'
                : 'Essayez de changer le filtre ou créez un nouveau processus'
              }
            </p>
            {typeFilter === 'ALL' && (
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer un processus
              </Button>
            )}
          </div>
        )
      ) : viewMode === 'grid' ? (
        <ProcessGridView
          processes={filteredProcesses}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
        />
      ) : (
        <ProcessTable
          processes={filteredProcesses}
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
              setCurrentPage(data.meta.page - 1)
              window.scrollTo({ top: 0, behavior: 'smooth' })
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
              setCurrentPage(data.meta.page + 1)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            Suivant
          </Button>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer un nouveau processus</DialogTitle>
          </DialogHeader>
          <div className="w-full">
            <ProcessForm
              onSubmit={handleCreate}
              onCancel={() => setIsCreateDialogOpen(false)}
              isLoading={createMutation.isPending}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le processus</DialogTitle>
          </DialogHeader>
          <div className="w-full">
            {selectedProcess && (
              <ProcessForm
                process={selectedProcess}
                onSubmit={handleUpdate}
                onCancel={() => {
                  setIsEditDialogOpen(false)
                  setSelectedProcess(null)
                }}
                isLoading={updateMutation.isPending}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Create SIPOC Dialog */}
      <CreateSIPOCDialog
        open={isCreateSIPOCDialogOpen}
        onOpenChange={setIsCreateSIPOCDialogOpen}
        onSubmit={handleCreateSIPOC}
        defaultProcessMapId={searchParams?.processMapId}
        defaultWorkspaceId={searchParams?.workspaceId}
        isLoading={createMutation.isPending}
      />

      {/* AI Generate Dialog */}
      <AIGenerateProcessModal
        open={isAIGenerateDialogOpen}
        onOpenChange={setIsAIGenerateDialogOpen}
        processMapId={searchParams?.processMapId}
        workspaceId={searchParams?.workspaceId}
        departmentId={searchParams?.departmentId}
        onSuccess={handleAIGenerateSuccess}
      />
    </PageWrapper>
  )
}

