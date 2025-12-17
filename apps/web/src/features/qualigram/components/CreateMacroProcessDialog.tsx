/**
 * CreateMacroProcessDialog Component
 * Dialog for creating a new MacroProcess
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@repo/ui/components/ui/dialog'
import { MacroProcessForm } from '../../macro-processes/components/MacroProcessForm'
import { useCreateMacroProcess } from '../../macro-processes/hooks/useMacroProcesses'
import type { CreateMacroProcessDto, UpdateMacroProcessDto } from '../../macro-processes/types/macro-process.types'

interface CreateMacroProcessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateMacroProcessDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateMacroProcessDialogProps) {
  const createMacroProcessMutation = useCreateMacroProcess()

  const handleSubmit = (data: CreateMacroProcessDto | UpdateMacroProcessDto) => {
    createMacroProcessMutation.mutate(data as CreateMacroProcessDto, {
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Créer un macro-processus</DialogTitle>
          <DialogDescription>
            Créez un nouveau macro-processus pour organiser vos processus.
          </DialogDescription>
        </DialogHeader>

        <MacroProcessForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={createMacroProcessMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  )
}

