/**
 * GroupsPage
 * Main page for group management
 */

import { useState } from 'react'
import { PageWrapper } from '../../../components/layout/PageWrapper'
import { useGroups, useCreateGroup, useUpdateGroup, useDeleteGroup } from '../hooks/useGroups'
import { GroupCard } from '../components/GroupCard'
import { GroupTable } from '../components/GroupTable'
import { GroupForm } from '../components/GroupForm'
import { Group, CreateGroupDto, UpdateGroupDto } from '../types/group.types'
import { Card, CardContent, Dialog, DialogContent, DialogHeader, DialogTitle, Input } from '@repo/ui'
import { Heading1, Body, BodySmall } from '@repo/ui'
import { Shield, Plus, Search, Grid3x3, List, Users, CheckCircle, XCircle } from 'lucide-react'

type ViewMode = 'grid' | 'table'

export function GroupsPage() {
  // État local
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Hooks de données
  const { data: groups = [], isLoading } = useGroups()
  const createGroupMutation = useCreateGroup()
  const updateGroupMutation = useUpdateGroup()
  const deleteGroupMutation = useDeleteGroup()

  // Mock user - TODO: remplacer par le vrai utilisateur connecté
  const isAdmin = true

  // Filtrer les groupes
  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && group.isActive) ||
      (statusFilter === 'inactive' && !group.isActive)

    return matchesSearch && matchesStatus
  })

  // Statistiques
  const stats = {
    total: groups.length,
    active: groups.filter((g) => g.isActive).length,
    inactive: groups.filter((g) => !g.isActive).length,
    totalUsers: groups.reduce((sum, g) => sum + (g._count?.users || 0), 0),
  }

  // Handlers
  const handleCreateGroup = async (data: CreateGroupDto) => {
    try {
      await createGroupMutation.mutateAsync(data)
      setIsCreateDialogOpen(false)
    } catch (error) {
      // Error already handled by the hook
    }
  }

  const handleEditGroup = async (data: UpdateGroupDto) => {
    if (!selectedGroup) return
    try {
      await updateGroupMutation.mutateAsync({ id: selectedGroup.id, data })
      setIsEditDialogOpen(false)
      setSelectedGroup(null)
    } catch (error) {
      // Error already handled by the hook
    }
  }

  const handleDeleteGroup = async () => {
    if (!selectedGroup) return
    try {
      await deleteGroupMutation.mutateAsync(selectedGroup.id)
      setIsDeleteDialogOpen(false)
      setSelectedGroup(null)
    } catch (error) {
      // Error already handled by the hook
    }
  }

  const openEditDialog = (group: Group) => {
    setSelectedGroup(group)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (group: Group) => {
    setSelectedGroup(group)
    setIsDeleteDialogOpen(true)
  }

  return (
    <PageWrapper
      title="Groupes"
      description="Gérez les groupes et leurs permissions"
      breadcrumbs={[
        { label: 'Administration', icon: <Shield className="w-4 h-4" /> },
        { label: 'Groupes' },
      ]}
      actions={
        isAdmin ? (
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nouveau groupe
          </button>
        ) : undefined
      }
    >
      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <BodySmall className="text-gray-600">Total groupes</BodySmall>
                <Heading1 className="text-2xl font-bold mt-1">{stats.total}</Heading1>
              </div>
              <Shield className="w-10 h-10 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <BodySmall className="text-gray-600">Actifs</BodySmall>
                <Heading1 className="text-2xl font-bold mt-1 text-green-600">{stats.active}</Heading1>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <BodySmall className="text-gray-600">Inactifs</BodySmall>
                <Heading1 className="text-2xl font-bold mt-1 text-gray-600">{stats.inactive}</Heading1>
              </div>
              <XCircle className="w-10 h-10 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <BodySmall className="text-gray-600">Total utilisateurs</BodySmall>
                <Heading1 className="text-2xl font-bold mt-1">{stats.totalUsers}</Heading1>
              </div>
              <Users className="w-10 h-10 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Rechercher un groupe..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtres */}
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tous ({stats.total})
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'active'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Actifs ({stats.active})
              </button>
              <button
                onClick={() => setStatusFilter('inactive')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'inactive'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Inactifs ({stats.inactive})
              </button>
            </div>

            {/* Mode d'affichage */}
            <div className="flex gap-2 border-l pl-4">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title="Vue grille"
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'table'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title="Vue tableau"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des groupes */}
      {isLoading ? (
        <div className="text-center py-12">
          <BodySmall className="text-gray-600">Chargement...</BodySmall>
        </div>
      ) : filteredGroups.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <Body className="text-gray-600">Aucun groupe trouvé</Body>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      ) : (
        <GroupTable
          groups={filteredGroups}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
          isAdmin={isAdmin}
        />
      )}

      {/* Dialog Création */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouveau groupe</DialogTitle>
          </DialogHeader>
          <GroupForm
            onSubmit={handleCreateGroup}
            onCancel={() => setIsCreateDialogOpen(false)}
            isLoading={createGroupMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog Édition */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier le groupe</DialogTitle>
          </DialogHeader>
          {selectedGroup && (
            <GroupForm
              group={selectedGroup}
              onSubmit={handleEditGroup}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setSelectedGroup(null)
              }}
              isLoading={updateGroupMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le groupe</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Body>
              Êtes-vous sûr de vouloir supprimer le groupe <strong>{selectedGroup?.name}</strong> ?
            </Body>
            <BodySmall className="text-gray-600">
              Cette action est irréversible. Les utilisateurs de ce groupe perdront leurs
              permissions associées.
            </BodySmall>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setIsDeleteDialogOpen(false)
                  setSelectedGroup(null)
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={deleteGroupMutation.isPending}
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteGroup}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                disabled={deleteGroupMutation.isPending}
              >
                {deleteGroupMutation.isPending ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  )
}
