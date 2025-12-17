import { useState } from 'react'
import { Button } from '@repo/ui/components/ui/button'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Heading3, Body, BodySmall } from '@repo/ui'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@repo/ui'
import { ProcessActorForm } from './ProcessActorForm'
import type { ProcessActor } from '../types/process.types'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { processApi } from '../../../lib/api/process.api'

interface ProcessActorsTabProps {
  processId: string
}

export function ProcessActorsTab({ processId }: ProcessActorsTabProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedActor, setSelectedActor] = useState<ProcessActor | null>(null)
  const queryClient = useQueryClient()

  const { data: actors = [], isLoading } = useQuery({
    queryKey: ['processes', processId, 'actors'],
    queryFn: () => processApi.getProcessActors(processId),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => processApi.createProcessActor(processId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes', processId, 'actors'] })
      setIsCreateDialogOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      processApi.updateProcessActor(processId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes', processId, 'actors'] })
      setIsEditDialogOpen(false)
      setSelectedActor(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => processApi.deleteProcessActor(processId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes', processId, 'actors'] })
    },
  })

  const handleEdit = (actor: ProcessActor) => {
    setSelectedActor(actor)
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet acteur ?')) {
      await deleteMutation.mutateAsync(id)
    }
  }

  if (isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Heading3>Acteurs du processus</Heading3>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un acteur
        </Button>
      </div>

      {actors.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <BodySmall>Aucun acteur défini</BodySmall>
        </div>
      ) : (
        <div className="space-y-2">
          {actors.map((actor) => (
            <div
              key={actor.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <Body className="font-medium">{actor.name}</Body>
                <BodySmall className="text-gray-500">
                  Type: {actor.type} {actor.role && `• ${actor.role}`}
                </BodySmall>
                {actor.responsibilities && (
                  <BodySmall className="text-gray-600 mt-1">
                    {actor.responsibilities}
                  </BodySmall>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(actor)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(actor.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un acteur</DialogTitle>
          </DialogHeader>
          <ProcessActorForm
            onSubmit={(data) => createMutation.mutateAsync(data)}
            onCancel={() => setIsCreateDialogOpen(false)}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'acteur</DialogTitle>
          </DialogHeader>
          {selectedActor && (
            <ProcessActorForm
              actor={selectedActor}
              onSubmit={(data) =>
                updateMutation.mutateAsync({ id: selectedActor.id, data })
              }
              onCancel={() => {
                setIsEditDialogOpen(false)
                setSelectedActor(null)
              }}
              isLoading={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

