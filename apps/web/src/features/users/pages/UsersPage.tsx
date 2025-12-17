import { useState } from 'react';
import { Button, BodySmall, Input } from '@repo/ui';
import { Plus, Users, Grid3x3, Table2, Search } from 'lucide-react';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser, useAssignGroup } from '../hooks/useUsers';
import { UserCard } from '../components/UserCard';
import { UserTable } from '../components/UserTable';
import { UserForm } from '../components/UserForm';
import { User, CreateUserDto, UpdateUserDto } from '../types/user.types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@repo/ui';
import { useGroups } from '../../groups/hooks/useGroups';
import { PageWrapper } from '../../../components/layout/PageWrapper';

type ViewMode = 'grid' | 'table';

export function UsersPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [assigningGroupUser, setAssigningGroupUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGroup, setFilterGroup] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const { data: users, isLoading } = useUsers();
  const { data: groups } = useGroups();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const assignGroup = useAssignGroup();

  // Filtrage
  const filteredUsers = users?.filter((user) => {
    const matchSearch =
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchGroup = !filterGroup || user.groupId === filterGroup;
    const matchStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && user.isActive) ||
      (filterStatus === 'inactive' && !user.isActive);

    return matchSearch && matchGroup && matchStatus;
  });

  const handleCreate = (data: CreateUserDto) => {
    createUser.mutate(data, {
      onSuccess: () => setShowCreateDialog(false),
    });
  };

  const handleUpdate = (data: UpdateUserDto) => {
    if (!editingUser) return;
    updateUser.mutate(
      { id: editingUser.id, data },
      {
        onSuccess: () => setEditingUser(null),
      }
    );
  };

  const handleDelete = (user: User) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${user.firstName} ${user.lastName} ?`)) {
      deleteUser.mutate(user.id);
    }
  };

  const handleAssignGroup = (groupId: string) => {
    if (!assigningGroupUser) return;
    assignGroup.mutate(
      { userId: assigningGroupUser.id, groupId },
      {
        onSuccess: () => setAssigningGroupUser(null),
      }
    );
  };

  return (
    <PageWrapper
      title="Gestion des utilisateurs"
      description={`${users?.length || 0} utilisateur${users && users.length > 1 ? 's' : ''}`}
      breadcrumbs={[
        { label: 'Administration', href: '/' },
        { label: 'Utilisateurs', icon: <Users className="w-4 h-4" /> },
      ]}
      actions={
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvel utilisateur
        </Button>
      }
    >

      {/* Filtres et recherche */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtre groupe */}
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Tous les groupes</option>
              {groups?.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>

            {/* Filtre statut */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
            </select>

            {/* Toggle vue */}
            <div className="flex gap-1 border border-gray-200 rounded-md p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid'
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded ${
                  viewMode === 'table'
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Table2 className="w-4 h-4" />
              </button>
            </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <BodySmall className="text-gray-600">Total</BodySmall>
            <div className="text-2xl font-bold text-gray-900">{users?.length || 0}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <BodySmall className="text-gray-600">Actifs</BodySmall>
            <div className="text-2xl font-bold text-green-600">
              {users?.filter((u) => u.isActive).length || 0}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <BodySmall className="text-gray-600">Administrateurs</BodySmall>
            <div className="text-2xl font-bold text-orange-600">
              {users?.filter((u) => u.isAdmin).length || 0}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <BodySmall className="text-gray-600">Sans groupe</BodySmall>
            <div className="text-2xl font-bold text-gray-400">
              {users?.filter((u) => !u.groupId).length || 0}
          </div>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      {isLoading ? (
        <div className="text-center py-12">
          <BodySmall className="text-gray-600">Chargement...</BodySmall>
        </div>
      ) : filteredUsers && filteredUsers.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onEdit={setEditingUser}
                  onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <UserTable
            users={filteredUsers}
            onEdit={setEditingUser}
            onDelete={handleDelete}
            onAssignGroup={setAssigningGroupUser}
          />
        )
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <BodySmall className="text-gray-600">Aucun utilisateur trouvé</BodySmall>
        </div>
      )}

      {/* Dialog création */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un utilisateur</DialogTitle>
            </DialogHeader>
            <UserForm
              onSubmit={handleCreate}
              onCancel={() => setShowCreateDialog(false)}
            isLoading={createUser.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog édition */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier l'utilisateur</DialogTitle>
            </DialogHeader>
            {editingUser && (
              <UserForm
                user={editingUser}
                onSubmit={handleUpdate}
                onCancel={() => setEditingUser(null)}
              isLoading={updateUser.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog assignation groupe */}
      <Dialog open={!!assigningGroupUser} onOpenChange={() => setAssigningGroupUser(null)}>
          <DialogContent>
          <DialogHeader>
            <DialogTitle>Assigner un groupe</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <BodySmall>
              Sélectionnez un groupe pour{' '}
              <strong>
                {assigningGroupUser?.firstName} {assigningGroupUser?.lastName}
              </strong>
            </BodySmall>
            <div className="space-y-2">
              {groups?.map((group) => (
                <button
                  key={group.id}
                  onClick={() => handleAssignGroup(group.id)}
                  className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{group.name}</div>
                      <BodySmall className="text-gray-600">{group.code}</BodySmall>
                    </div>
                    {group.color && (
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: group.color }}
                      />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}
