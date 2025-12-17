/**
 * ProcessIOTab Component
 * Tab for managing Process Inputs and Outputs
 */

import { useState } from 'react'
import { Button } from '@repo/ui/components/ui/button'
import { Plus, Edit, Trash2, ArrowDown, ArrowUp } from 'lucide-react'
import { Heading3, Body, BodySmall } from '@repo/ui'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@repo/ui/components/ui/dialog'
import { Input } from '@repo/ui/components/ui/input'
import { Textarea } from '@repo/ui/components/ui/textarea'
import { Label } from '@repo/ui/components/ui/label'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { processApi } from '../../../lib/api/process.api'
import type { ProcessIO } from '../../processes/types/process.types'

interface ProcessIOTabProps {
  processId: string
}

export function ProcessIOTab({ processId }: ProcessIOTabProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedIO, setSelectedIO] = useState<ProcessIO | null>(null)
  const [ioType, setIoType] = useState<'input' | 'output'>('input')
  const queryClient = useQueryClient()

  const { data: inputs = [], isLoading: isLoadingInputs } = useQuery({
    queryKey: ['processes', processId, 'inputs'],
    queryFn: () => processApi.getProcessInputs(processId),
  })

  const { data: outputs = [], isLoading: isLoadingOutputs } = useQuery({
    queryKey: ['processes', processId, 'outputs'],
    queryFn: () => processApi.getProcessOutputs(processId),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => processApi.createProcessIO(processId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes', processId, 'inputs'] })
      queryClient.invalidateQueries({ queryKey: ['processes', processId, 'outputs'] })
      setIsCreateDialogOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      processApi.updateProcessIO(processId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes', processId, 'inputs'] })
      queryClient.invalidateQueries({ queryKey: ['processes', processId, 'outputs'] })
      setIsEditDialogOpen(false)
      setSelectedIO(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => processApi.deleteProcessIO(processId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes', processId, 'inputs'] })
      queryClient.invalidateQueries({ queryKey: ['processes', processId, 'outputs'] })
    },
  })

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string || undefined,
      type: formData.get('type') as string || undefined,
      isInput: ioType === 'input',
      order: 0,
    }
    createMutation.mutate(data)
  }

  const handleEdit = (io: ProcessIO) => {
    setSelectedIO(io)
    setIoType(io.isInput ? 'input' : 'output')
    setIsEditDialogOpen(true)
  }

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedIO) return
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string || undefined,
      type: formData.get('type') as string || undefined,
      isInput: ioType === 'input',
    }
    updateMutation.mutate({ id: selectedIO.id, data })
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      await deleteMutation.mutateAsync(id)
    }
  }

  if (isLoadingInputs || isLoadingOutputs) {
    return <div>Chargement...</div>
  }

  const allIO = [...inputs, ...outputs].sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Heading3>Entrées et Sorties</Heading3>
        <Button
          onClick={() => {
            setIoType('input')
            setIsCreateDialogOpen(true)
          }}
          className="bg-orange-600 hover:bg-orange-700"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </div>

      {allIO.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <BodySmall>Aucune entrée/sortie définie</BodySmall>
        </div>
      ) : (
        <div className="space-y-2">
          {allIO.map((io) => (
            <div
              key={io.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-2 flex-1">
                {io.isInput ? (
                  <ArrowDown className="w-4 h-4 text-blue-600" />
                ) : (
                  <ArrowUp className="w-4 h-4 text-green-600" />
                )}
                <div className="flex-1">
                  <Body className="font-medium text-sm">{io.name}</Body>
                  {io.description && (
                    <BodySmall className="text-gray-500 text-xs">{io.description}</BodySmall>
                  )}
                  {io.type && (
                    <BodySmall className="text-gray-400 text-xs">Type: {io.type}</BodySmall>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(io)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(io.id)}
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
            <DialogTitle>Ajouter une {ioType === 'input' ? 'entrée' : 'sortie'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="space-y-4">
              <div>
                <Label>Nom *</Label>
                <Input name="name" required placeholder="Nom de l'entrée/sortie" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea name="description" rows={3} placeholder="Description..." />
              </div>
              <div>
                <Label>Type</Label>
                <Input name="type" placeholder="Document, Data, Material, etc." />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Création...' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'entrée/sortie</DialogTitle>
          </DialogHeader>
          {selectedIO && (
            <form onSubmit={handleUpdate}>
              <div className="space-y-4">
                <div>
                  <Label>Nom *</Label>
                  <Input name="name" defaultValue={selectedIO.name} required />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    name="description"
                    rows={3}
                    defaultValue={selectedIO.description || ''}
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <Input name="type" defaultValue={selectedIO.type || ''} />
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Modification...' : 'Modifier'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

