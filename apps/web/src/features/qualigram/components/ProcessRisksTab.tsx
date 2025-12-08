/**
 * ProcessRisksTab Component
 * Tab for managing Process Risks
 */

import { useState } from 'react'
import { Button } from '@repo/ui/components/ui/button'
import { Plus, Edit, Trash2, AlertTriangle } from 'lucide-react'
import { Heading3, Body, BodySmall } from '@repo/ui'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@repo/ui/components/ui/dialog'
import { Input } from '@repo/ui/components/ui/input'
import { Textarea } from '@repo/ui/components/ui/textarea'
import { Label } from '@repo/ui/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { processApi } from '../../../lib/api/process.api'
import type { Risk } from '../../processes/types/process.types'

interface ProcessRisksTabProps {
  processId: string
}

const riskLevelColors = {
  LOW: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
  CRITICAL: 'bg-red-100 text-red-800',
}

export function ProcessRisksTab({ processId }: ProcessRisksTabProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null)
  const queryClient = useQueryClient()

  const { data: risks = [], isLoading } = useQuery({
    queryKey: ['processes', processId, 'risks'],
    queryFn: () => processApi.getProcessRisks(processId),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => processApi.createProcessRisk(processId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes', processId, 'risks'] })
      setIsCreateDialogOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      processApi.updateProcessRisk(processId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes', processId, 'risks'] })
      setIsEditDialogOpen(false)
      setSelectedRisk(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => processApi.deleteProcessRisk(processId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes', processId, 'risks'] })
    },
  })

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      description: formData.get('description') as string,
      level: formData.get('level') as Risk['level'],
      probability: formData.get('probability') ? parseInt(formData.get('probability') as string) : undefined,
      impact: formData.get('impact') ? parseInt(formData.get('impact') as string) : undefined,
      mitigation: formData.get('mitigation') as string || undefined,
      owner: formData.get('owner') as string || undefined,
      order: 0,
    }
    createMutation.mutate(data)
  }

  const handleEdit = (risk: Risk) => {
    setSelectedRisk(risk)
    setIsEditDialogOpen(true)
  }

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedRisk) return
    const formData = new FormData(e.currentTarget)
    const data = {
      description: formData.get('description') as string,
      level: formData.get('level') as Risk['level'],
      probability: formData.get('probability') ? parseInt(formData.get('probability') as string) : undefined,
      impact: formData.get('impact') ? parseInt(formData.get('impact') as string) : undefined,
      mitigation: formData.get('mitigation') as string || undefined,
      owner: formData.get('owner') as string || undefined,
    }
    updateMutation.mutate({ id: selectedRisk.id, data })
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce risque ?')) {
      await deleteMutation.mutateAsync(id)
    }
  }

  if (isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Heading3>Risques</Heading3>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-orange-600 hover:bg-orange-700"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </div>

      {risks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <BodySmall>Aucun risque défini</BodySmall>
        </div>
      ) : (
        <div className="space-y-2">
          {risks.map((risk) => (
            <div
              key={risk.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-2 flex-1">
                <AlertTriangle className={`w-4 h-4 ${
                  risk.level === 'CRITICAL' ? 'text-red-600' :
                  risk.level === 'HIGH' ? 'text-orange-600' :
                  risk.level === 'MEDIUM' ? 'text-yellow-600' : 'text-green-600'
                }`} />
                <div className="flex-1">
                  <Body className="font-medium text-sm">{risk.description}</Body>
                  <div className="flex gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      riskLevelColors[risk.level as keyof typeof riskLevelColors] || riskLevelColors.LOW
                    }`}>
                      {risk.level}
                    </span>
                    {risk.probability && (
                      <BodySmall className="text-gray-400 text-xs">
                        Probabilité: {risk.probability}/5
                      </BodySmall>
                    )}
                    {risk.impact && (
                      <BodySmall className="text-gray-400 text-xs">
                        Impact: {risk.impact}/5
                      </BodySmall>
                    )}
                  </div>
                  {risk.mitigation && (
                    <BodySmall className="text-gray-600 text-xs mt-1">
                      Mitigation: {risk.mitigation}
                    </BodySmall>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(risk)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(risk.id)}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter un risque</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="space-y-4">
              <div>
                <Label>Description *</Label>
                <Textarea name="description" required rows={3} placeholder="Description du risque" />
              </div>
              <div>
                <Label>Niveau *</Label>
                <Select name="level" defaultValue="LOW" required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Faible</SelectItem>
                    <SelectItem value="MEDIUM">Moyen</SelectItem>
                    <SelectItem value="HIGH">Élevé</SelectItem>
                    <SelectItem value="CRITICAL">Critique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Probabilité (1-5)</Label>
                  <Input name="probability" type="number" min="1" max="5" />
                </div>
                <div>
                  <Label>Impact (1-5)</Label>
                  <Input name="impact" type="number" min="1" max="5" />
                </div>
              </div>
              <div>
                <Label>Mitigation</Label>
                <Textarea name="mitigation" rows={2} placeholder="Actions de mitigation..." />
              </div>
              <div>
                <Label>Propriétaire</Label>
                <Input name="owner" placeholder="Responsable du risque" />
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier le risque</DialogTitle>
          </DialogHeader>
          {selectedRisk && (
            <form onSubmit={handleUpdate}>
              <div className="space-y-4">
                <div>
                  <Label>Description *</Label>
                  <Textarea name="description" defaultValue={selectedRisk.description} required rows={3} />
                </div>
                <div>
                  <Label>Niveau *</Label>
                  <Select name="level" defaultValue={selectedRisk.level} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Faible</SelectItem>
                      <SelectItem value="MEDIUM">Moyen</SelectItem>
                      <SelectItem value="HIGH">Élevé</SelectItem>
                      <SelectItem value="CRITICAL">Critique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Probabilité (1-5)</Label>
                    <Input name="probability" type="number" min="1" max="5" defaultValue={selectedRisk.probability || ''} />
                  </div>
                  <div>
                    <Label>Impact (1-5)</Label>
                    <Input name="impact" type="number" min="1" max="5" defaultValue={selectedRisk.impact || ''} />
                  </div>
                </div>
                <div>
                  <Label>Mitigation</Label>
                  <Textarea name="mitigation" rows={2} defaultValue={selectedRisk.mitigation || ''} />
                </div>
                <div>
                  <Label>Propriétaire</Label>
                  <Input name="owner" defaultValue={selectedRisk.owner || ''} />
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

