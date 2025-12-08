import { useState } from 'react'
import { Button } from '@repo/ui/components/ui/button'
import { Heading3, Body, BodySmall } from '@repo/ui'
import { Plus, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/ui/dialog'
import { LaneForm } from './LaneForm'
import type { DiagramLane } from '../types/procedure.types'
import {
  useCreateLane,
  useUpdateLane,
  useDeleteLane,
} from '../hooks/useProcedures'
import { useQueryClient } from '@tanstack/react-query'
import { procedureKeys } from '../hooks/useProcedures'

interface LanePanelProps {
  procedureId: string
  lanes: DiagramLane[]
  onLaneChange: () => void
}

export function LanePanel({
  procedureId,
  lanes,
  onLaneChange,
}: LanePanelProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedLane, setSelectedLane] = useState<DiagramLane | null>(null)
  const queryClient = useQueryClient()

  const createMutation = useCreateLane()
  const updateMutation = useUpdateLane()
  const deleteMutation = useDeleteLane()

  const handleCreate = async (data: any) => {
    await createMutation.mutateAsync({ procedureId, data })
    setIsCreateDialogOpen(false)
    onLaneChange()
  }

  const handleEdit = (lane: DiagramLane) => {
    setSelectedLane(lane)
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async (data: any) => {
    if (selectedLane) {
      await updateMutation.mutateAsync({
        procedureId,
        laneId: selectedLane.laneId,
        data,
      })
      setIsEditDialogOpen(false)
      setSelectedLane(null)
      onLaneChange()
    }
  }

  const handleDelete = async (laneId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette swimlane ?')) {
      const lane = lanes.find((l) => l.laneId === laneId)
      if (lane) {
        await deleteMutation.mutateAsync({ procedureId, laneId: lane.laneId })
        onLaneChange()
      }
    }
  }

  const sortedLanes = [...lanes].sort((a, b) => a.order - b.order)

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <Heading3 className="text-sm font-semibold">Swimlanes</Heading3>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          size="sm"
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {sortedLanes.length === 0 ? (
        <BodySmall className="text-gray-500 text-center py-4">
          Aucune swimlane
        </BodySmall>
      ) : (
        <div className="space-y-2">
          {sortedLanes.map((lane) => (
            <div
              key={lane.id}
              className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50"
              style={{
                borderLeftColor: lane.color || '#ea580c',
                borderLeftWidth: '4px',
              }}
            >
              <div className="flex-1 min-w-0">
                <Body className="text-sm font-medium">{lane.name}</Body>
                {lane.collapsed && (
                  <BodySmall className="text-xs text-gray-500">
                    Réduite
                  </BodySmall>
                )}
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(lane)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(lane.laneId)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
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
            <DialogTitle>Créer une swimlane</DialogTitle>
          </DialogHeader>
          <LaneForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreateDialogOpen(false)}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la swimlane</DialogTitle>
          </DialogHeader>
          {selectedLane && (
            <LaneForm
              lane={selectedLane}
              onSubmit={handleUpdate}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setSelectedLane(null)
              }}
              isLoading={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

