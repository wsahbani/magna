/**
 * CreateProcedureDialog Component
 * Dialog for creating a new Procedure
 */

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@repo/ui/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form'
import { Input } from '@repo/ui/components/ui/input'
import { Textarea } from '@repo/ui/components/ui/textarea'
import { Button } from '@repo/ui/components/ui/button'
import { useCreateProcedure } from '../../procedures/hooks/useProcedures'
import type { CreateProcedureDto } from '../../procedures/types/procedure.types'

const procedureSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(200),
  description: z.string().max(1000).optional(),
  objective: z.string().max(500).optional(),
  scope: z.string().max(500).optional(),
})

type ProcedureFormData = z.infer<typeof procedureSchema>

interface CreateProcedureDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  processId: string
  onSuccess?: () => void
}

export function CreateProcedureDialog({
  open,
  onOpenChange,
  processId,
  onSuccess,
}: CreateProcedureDialogProps) {
  const createProcedureMutation = useCreateProcedure()
  const form = useForm<ProcedureFormData>({
    resolver: zodResolver(procedureSchema),
    defaultValues: {
      name: '',
      description: '',
      objective: '',
      scope: '',
    },
  })

  const handleSubmit = (data: ProcedureFormData) => {
    const procedureData: CreateProcedureDto = {
      processId,
      name: data.name,
      description: data.description,
      objective: data.objective,
      scope: data.scope,
      version: '1.0',
    }
    createProcedureMutation.mutate(procedureData, {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
        onSuccess?.()
      },
    })
  }

  const handleCancel = () => {
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Créer une procédure</DialogTitle>
          <DialogDescription>
            Créez une nouvelle procédure (logigramme) pour ce processus.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de la procédure" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description de la procédure"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="objective"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objectif</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Objectif de la procédure"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scope"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Périmètre</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Périmètre de la procédure"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={createProcedureMutation.isPending}
              >
                {createProcedureMutation.isPending ? 'Création...' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

