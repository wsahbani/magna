/**
 * ProcessIndicatorsTab Component
 * Tab for managing Process Indicators (KPIs)
 */

import { useState } from 'react'
import { Button } from '@repo/ui/components/ui/button'
import { Plus, Edit, Trash2, TrendingUp } from 'lucide-react'
import { Heading3, Body, BodySmall } from '@repo/ui'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@repo/ui/components/ui/dialog'
import { Input } from '@repo/ui/components/ui/input'
import { Textarea } from '@repo/ui/components/ui/textarea'
import { Label } from '@repo/ui/components/ui/label'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { processApi } from '../../../lib/api/process.api'
import type { Indicator } from '../../processes/types/process.types'

interface ProcessIndicatorsTabProps {
  processId: string
}

export function ProcessIndicatorsTab({ processId }: ProcessIndicatorsTabProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null)
  const queryClient = useQueryClient()

  const { data: indicators = [], isLoading } = useQuery({
    queryKey: ['processes', processId, 'indicators'],
    queryFn: () => processApi.getProcessIndicators(processId),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => processApi.createProcessIndicator(processId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes', processId, 'indicators'] })
      setIsCreateDialogOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      processApi.updateProcessIndicator(processId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes', processId, 'indicators'] })
      setIsEditDialogOpen(false)
      setSelectedIndicator(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => processApi.deleteProcessIndicator(processId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes', processId, 'indicators'] })
    },
  })

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string || undefined,
      formula: formData.get('formula') as string || undefined,
      target: formData.get('target') as string || undefined,
      frequency: formData.get('frequency') as string || undefined,
      unit: formData.get('unit') as string || undefined,
      order: 0,
    }
    createMutation.mutate(data)
  }

  const handleEdit = (indicator: Indicator) => {
    setSelectedIndicator(indicator)
    setIsEditDialogOpen(true)
  }

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedIndicator) return
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string || undefined,
      formula: formData.get('formula') as string || undefined,
      target: formData.get('target') as string || undefined,
      frequency: formData.get('frequency') as string || undefined,
      unit: formData.get('unit') as string || undefined,
    }
    updateMutation.mutate({ id: selectedIndicator.id, data })
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet indicateur ?')) {
      await deleteMutation.mutateAsync(id)
    }
  }

  if (isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Heading3>Indicateurs (KPIs)</Heading3>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-orange-600 hover:bg-orange-700"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </div>

      {indicators.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <BodySmall>Aucun indicateur défini</BodySmall>
        </div>
      ) : (
        <div className="space-y-2">
          {indicators.map((indicator) => (
            <div
              key={indicator.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-2 flex-1">
                <TrendingUp className="w-4 h-4 text-orange-600" />
                <div className="flex-1">
                  <Body className="font-medium text-sm">{indicator.name}</Body>
                  {indicator.description && (
                    <BodySmall className="text-gray-500 text-xs">{indicator.description}</BodySmall>
                  )}
                  <div className="flex gap-4 mt-1">
                    {indicator.target && (
                      <BodySmall className="text-gray-400 text-xs">
                        Cible: {indicator.target} {indicator.unit || ''}
                      </BodySmall>
                    )}
                    {indicator.frequency && (
                      <BodySmall className="text-gray-400 text-xs">
                        Fréquence: {indicator.frequency}
                      </BodySmall>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(indicator)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(indicator.id)}
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
            <DialogTitle>Ajouter un indicateur</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="space-y-4">
              <div>
                <Label>Nom *</Label>
                <Input name="name" required placeholder="Nom de l'indicateur" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea name="description" rows={2} placeholder="Description..." />
              </div>
              <div>
                <Label>Formule</Label>
                <Input name="formula" placeholder="Formule de calcul" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cible</Label>
                  <Input name="target" placeholder="Valeur cible" />
                </div>
                <div>
                  <Label>Unité</Label>
                  <Input name="unit" placeholder="%, €, jours, etc." />
                </div>
              </div>
              <div>
                <Label>Fréquence</Label>
                <Input name="frequency" placeholder="Quotidien, Mensuel, etc." />
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
            <DialogTitle>Modifier l'indicateur</DialogTitle>
          </DialogHeader>
          {selectedIndicator && (
            <form onSubmit={handleUpdate}>
              <div className="space-y-4">
                <div>
                  <Label>Nom *</Label>
                  <Input name="name" defaultValue={selectedIndicator.name} required />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    name="description"
                    rows={2}
                    defaultValue={selectedIndicator.description || ''}
                  />
                </div>
                <div>
                  <Label>Formule</Label>
                  <Input name="formula" defaultValue={selectedIndicator.formula || ''} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Cible</Label>
                    <Input name="target" defaultValue={selectedIndicator.target || ''} />
                  </div>
                  <div>
                    <Label>Unité</Label>
                    <Input name="unit" defaultValue={selectedIndicator.unit || ''} />
                  </div>
                </div>
                <div>
                  <Label>Fréquence</Label>
                  <Input name="frequency" defaultValue={selectedIndicator.frequency || ''} />
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

