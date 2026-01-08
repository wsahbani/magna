import { useState, useMemo } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Dialog, DialogContent, DialogHeader, DialogTitle, BodySmall, Button, Input, Heading3, Body } from '@repo/ui'
import { PageWrapper } from '../../../components/layout/PageWrapper'
import { Workflow, Plus, Sparkles, Filter, Search, X } from 'lucide-react'
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
      {/* Search Bar - Accessible with ARIA labels and semantic structure */}
      <div className="mb-6">
        <div className="relative w-full sm:w-full md:w-2/3 lg:w-96">
          <label htmlFor="process-search" className="sr-only">
            Rechercher un processus
          </label>
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" 
            aria-hidden="true"
          />
          <Input
            id="process-search"
            type="search"
            placeholder="Rechercher par titre, code ou description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 transition-all duration-200"
            aria-label="Rechercher un processus par titre, code ou description"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 rounded p-1"
              aria-label="Effacer la recherche"
              type="button"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Filters and View Mode Toggle - Responsive layout with proper spacing */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* Type Filter */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" aria-hidden="true" />
          <div className="flex gap-2 flex-wrap" role="group" aria-label="Filtrer par type de processus">
            <Button
              variant={typeFilter === 'ALL' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter('ALL')}
              className={
                typeFilter === 'ALL'
                  ? 'bg-orange-600 hover:bg-orange-700 transition-colors duration-200'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200'
              }
              aria-pressed={typeFilter === 'ALL'}
              aria-label="Afficher tous les processus"
            >
              Tous
            </Button>
            <Button
              variant={typeFilter === ProcessType.FLOW ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter(ProcessType.FLOW)}
              className={
                typeFilter === ProcessType.FLOW
                  ? 'bg-orange-600 hover:bg-orange-700 transition-colors duration-200'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200'
              }
              aria-pressed={typeFilter === ProcessType.FLOW}
              aria-label="Filtrer par processus Flow"
            >
              Flow
            </Button>
            <Button
              variant={typeFilter === ProcessType.SIPOC ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter(ProcessType.SIPOC)}
              className={
                typeFilter === ProcessType.SIPOC
                  ? 'bg-orange-600 hover:bg-orange-700 transition-colors duration-200'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200'
              }
              aria-pressed={typeFilter === ProcessType.SIPOC}
              aria-label="Filtrer par processus SIPOC"
            >
              SIPOC
            </Button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      {/* Content - Enhanced loading state with accessibility */}
      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-64 gap-4" role="status" aria-live="polite">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" aria-hidden="true"></div>
          <Body className="text-gray-500">Chargement des processus...</Body>
          <span className="sr-only">Chargement des processus en cours</span>
        </div>
      ) : filteredProcesses.length === 0 ? (
        searchTerm ? (
          <div className="text-center py-12 px-4" role="status" aria-live="polite">
            <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" aria-hidden="true" />
            <Heading3 className="text-gray-900 mb-3">Aucun résultat</Heading3>
            <Body className="text-gray-500 mb-6 max-w-md mx-auto">
              Aucun processus ne correspond à votre recherche <strong className="font-semibold">"{searchTerm}"</strong>.
            </Body>
            <Button
              variant="outline"
              onClick={() => setSearchTerm('')}
              className="transition-all duration-200 hover:border-orange-600 hover:text-orange-600"
              aria-label="Effacer la recherche et voir tous les processus"
            >
              Effacer la recherche
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center px-4" role="status" aria-live="polite">
            <Workflow className="w-16 h-16 text-gray-300 mb-6" aria-hidden="true" />
            <Heading3 className="text-gray-700 mb-3">
              {typeFilter === 'ALL' 
                ? 'Aucun processus trouvé'
                : typeFilter === ProcessType.FLOW
                ? 'Aucun processus Flow trouvé'
                : 'Aucun processus SIPOC trouvé'
              }
            </Heading3>
            <Body className="text-gray-500 mb-6 max-w-md">
              {typeFilter === 'ALL'
                ? 'Commencez par créer votre premier processus'
                : 'Essayez de changer le filtre ou créez un nouveau processus'
              }
            </Body>
            {typeFilter === 'ALL' && (
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-orange-600 hover:bg-orange-700 transition-all duration-200 shadow-sm hover:shadow-md"
                aria-label="Créer votre premier processus"
              >
                <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
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

      {/* Pagination - Accessible navigation with proper ARIA labels */}
      {data && data.meta.totalPages > 1 && (
        <nav 
          className="flex justify-center items-center gap-3 mt-8" 
          role="navigation" 
          aria-label="Navigation de pagination"
        >
          <Button
            variant="outline"
            disabled={data.meta.page === 1}
            onClick={() => {
              setCurrentPage(data.meta.page - 1)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="transition-all duration-200 disabled:opacity-50"
            aria-label={`Aller à la page précédente (page ${data.meta.page - 1})`}
            aria-disabled={data.meta.page === 1}
          >
            Précédent
          </Button>
          <BodySmall 
            className="text-gray-600 px-2 min-w-[120px] text-center" 
            aria-current="page" 
            aria-label={`Page actuelle ${data.meta.page} sur ${data.meta.totalPages}`}
          >
            Page <strong className="font-semibold text-orange-600">{data.meta.page}</strong> sur {data.meta.totalPages}
          </BodySmall>
          <Button
            variant="outline"
            disabled={data.meta.page === data.meta.totalPages}
            onClick={() => {
              setCurrentPage(data.meta.page + 1)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="transition-all duration-200 disabled:opacity-50"
            aria-label={`Aller à la page suivante (page ${data.meta.page + 1})`}
            aria-disabled={data.meta.page === data.meta.totalPages}
          >
            Suivant
          </Button>
        </nav>
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

