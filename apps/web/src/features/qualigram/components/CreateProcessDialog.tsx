/**
 * CreateProcessDialog Component
 * Dialog for creating a new Process
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@repo/ui/components/ui/dialog'
import { ProcessForm } from '../../processes/components/ProcessForm'
import { useCreateProcess } from '../../processes/hooks/useProcesses'
import type { CreateProcessDto, UpdateProcessDto } from '../../processes/types/process.types'

interface CreateProcessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  macroProcessId: string
  defaultWorkspaceId?: string
  onSuccess?: () => void
}

export function CreateProcessDialog({
  open,
  onOpenChange,
  macroProcessId,
  defaultWorkspaceId,
  onSuccess,
}: CreateProcessDialogProps) {
  const createProcessMutation = useCreateProcess()

  const handleSubmit = (data: CreateProcessDto | UpdateProcessDto) => {
    const processData: CreateProcessDto = {
      ...(data as CreateProcessDto),
      macroId: macroProcessId,
    }
    createProcessMutation.mutate(processData, {
      onSuccess: () => {
        onOpenChange(false)
        onSuccess?.()
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
          <DialogTitle>Créer un processus</DialogTitle>
          <DialogDescription>
            Créez un nouveau processus dans ce macro-processus.
          </DialogDescription>
        </DialogHeader>

        <ProcessForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          defaultWorkspaceId={defaultWorkspaceId}
          isLoading={createProcessMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  )
}

