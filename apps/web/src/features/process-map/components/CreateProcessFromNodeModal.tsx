/**
 * CreateProcessFromNodeModal Component
 * Modal for creating a Process from a Process node in Process Map Flow
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@repo/ui/components/ui/dialog'
import { ProcessForm } from '../../process/components/ProcessForm'
import { useCreateProcess } from '../../process/hooks/useProcesses'
import type { CreateProcessDto, UpdateProcessDto } from '../../process/types/process.types'

interface CreateProcessFromNodeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  processMapId: string
  workspaceId: string
  nodeId: string
  onSuccess: (processId: string, nodeId: string, processType: string) => void
}

export function CreateProcessFromNodeModal({
  open,
  onOpenChange,
  processMapId,
  workspaceId,
  nodeId,
  onSuccess,
}: CreateProcessFromNodeModalProps) {
  const createProcessMutation = useCreateProcess()

  const handleSubmit = (data: CreateProcessDto | UpdateProcessDto) => {
    const processData: CreateProcessDto = {
      ...(data as CreateProcessDto),
      processMapId,
      workspaceId,
    }
    createProcessMutation.mutate(processData, {
      onSuccess: (createdProcess) => {
        onOpenChange(false)
        // Pass the process type (FLOW or SIPOC) to onSuccess
        onSuccess(createdProcess.id, nodeId, processData.type || 'FLOW')
      },
    })
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un Process</DialogTitle>
          <DialogDescription>
            Créez un nouveau Process et liez-le à ce nœud dans le Process Map.
          </DialogDescription>
        </DialogHeader>

        <ProcessForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          defaultProcessMapId={processMapId}
          defaultWorkspaceId={workspaceId}
          isLoading={createProcessMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  )
}
