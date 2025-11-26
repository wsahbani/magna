/**
 * Workspaces Page
 * Main page for workspace management with list and card views
 */

import { useState } from 'react'
import { Plus, Search, Grid, List } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@repo/ui/components/ui/button'
import { Input } from '@repo/ui/components/ui/input'
import { Card, CardContent } from '@repo/ui/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@repo/ui/components/ui/dialog'
import { WorkspaceCard } from '../components/WorkspaceCard'
import { WorkspaceForm } from '../components/WorkspaceForm'
import {
  useWorkspaces,
  useCreateWorkspace,
  useUpdateWorkspace,
  useDeleteWorkspace,
} from '../hooks/useWorkspaces'
import type { Workspace, CreateWorkspaceDto, UpdateWorkspaceDto, WorkspaceType } from '../types/workspace.types'

type ViewMode = 'grid' | 'table'

export function WorkspacesPage() {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<WorkspaceType | ''>('')
  const [showForm, setShowForm] = useState(false)
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | undefined>()

  // Queries
  const { data: workspacesData, isLoading, error } = useWorkspaces({
    search: search || undefined,
    type: typeFilter || undefined,
  })

  // Mutations
  const createMutation = useCreateWorkspace()
  const updateMutation = useUpdateWorkspace()
  const deleteMutation = useDeleteWorkspace()

  const handleCreate = () => {
    setSelectedWorkspace(undefined)
    setShowForm(true)
  }

  const handleEdit = (workspace: Workspace) => {
    setSelectedWorkspace(workspace)
    setShowForm(true)
  }

  const handleDelete = async (workspace: Workspace) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${workspace.name}" ?`)) {
      try {
        await deleteMutation.mutateAsync(workspace.id)
        alert('Workspace supprimé avec succès')
      } catch (error) {
        alert('Erreur lors de la suppression du workspace')
        console.error('Delete error:', error)
      }
    }
  }

  const handleSubmit = async (data: CreateWorkspaceDto | UpdateWorkspaceDto) => {
    try {
      if (selectedWorkspace) {
        await updateMutation.mutateAsync({
          id: selectedWorkspace.id,
          data: data as UpdateWorkspaceDto,
        })
        alert('Workspace mis à jour avec succès')
      } else {
        await createMutation.mutateAsync(data as CreateWorkspaceDto)
        alert('Workspace créé avec succès')
      }
      setShowForm(false)
      setSelectedWorkspace(undefined)
    } catch (error: any) {
      alert(error.message || 'Erreur lors de l\'enregistrement')
      console.error('Submit error:', error)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setSelectedWorkspace(undefined)
  }

  const workspaces = workspacesData?.data || []

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workspaces</h1>
          <p className="text-gray-600 mt-1">
            Gérez la structure organisationnelle de votre entreprise
          </p>
        </div>
        <Button onClick={handleCreate} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Workspace
        </Button>
      </div>

      {/* Form Dialog */}
      {showForm && (
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-2xl">
            <DialogClose onClose={() => setShowForm(false)} />
            <DialogHeader>
              <DialogTitle>
                {selectedWorkspace ? 'Modifier le Workspace' : 'Nouveau Workspace'}
              </DialogTitle>
            </DialogHeader>
            <div className="p-6">
              <WorkspaceForm
                workspace={selectedWorkspace}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isLoading={createMutation.isPending || updateMutation.isPending}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Filters and View Toggle */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher des workspaces..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as WorkspaceType | '')}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Tous les types</option>
          <option value="GROUPE">Groupe</option>
          <option value="ENTITY">Entité</option>
          <option value="DIRECTION">Direction</option>
          <option value="DEPARTMENT">Département</option>
          <option value="TEAM">Équipe</option>
        </select>

        <div className="flex gap-1 border rounded-md">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'bg-orange-600 hover:bg-orange-700' : ''}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('table')}
            className={viewMode === 'table' ? 'bg-orange-600 hover:bg-orange-700' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Chargement des workspaces...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">Erreur lors du chargement des workspaces</p>
        </div>
      ) : workspaces.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun workspace trouvé</p>
          <Button onClick={handleCreate} className="mt-4 bg-orange-600 hover:bg-orange-700">
            <Plus className="h-4 w-4 mr-2" />
            Créer votre premier workspace
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {workspaces.map((workspace: Workspace) => (
            <WorkspaceCard
              key={workspace.id}
              workspace={workspace}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onClick={() => navigate({ to: `/workspaces/${workspace.id}` })}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enfants
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Processus
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Membres
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {workspaces.map((workspace: Workspace) => (
                    <tr 
                      key={workspace.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate({ to: `/workspaces/${workspace.id}` })}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{workspace.name}</div>
                        {workspace.description && (
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {workspace.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-mono text-gray-600">{workspace.code}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800">
                          {workspace.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {workspace._count?.children || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {workspace._count?.processes || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {workspace._count?.workspaceMembers || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(workspace)}
                          className="mr-2"
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(workspace)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Supprimer
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {workspacesData?.meta && workspacesData.meta.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Précédent
          </Button>
          <span className="px-4 py-2 text-sm">
            Page {workspacesData.meta.page} sur {workspacesData.meta.totalPages}
          </span>
          <Button variant="outline" size="sm" disabled>
            Suivant
          </Button>
        </div>
      )}
    </div>
  )
}
