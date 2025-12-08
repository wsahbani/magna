import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@repo/ui/components/ui/button'
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
import type {
  CreateMacroProcessDto,
  UpdateMacroProcessDto,
  MacroProcess,
} from '../types/macro-process.types'

// Helper to clean up form data before submission
function cleanFormData(data: MacroProcessFormData): CreateMacroProcessDto | UpdateMacroProcessDto {
  const cleaned: any = {
    code: data.code,
    name: data.name,
  }
  
  if (data.description) cleaned.description = data.description
  if (data.color) cleaned.color = data.color
  if (data.icon) cleaned.icon = data.icon
  if (data.order !== undefined) cleaned.order = data.order
  // Only include active if explicitly set (not default true)
  // Prisma will use default(true) if not provided
  if (data.active !== undefined && data.active !== true) {
    cleaned.active = data.active
  }
  
  return cleaned
}

const macroProcessSchema = z.object({
  code: z.string().min(2, 'Le code doit contenir au moins 2 caractères').max(50),
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(200),
  description: z.string().max(1000).optional(),
  color: z.string().max(7).optional(),
  icon: z.string().max(100).optional(),
  order: z.number().min(0).optional(),
  active: z.boolean().optional(),
})

type MacroProcessFormData = z.infer<typeof macroProcessSchema>

interface MacroProcessFormProps {
  macroProcess?: MacroProcess
  onSubmit: (data: CreateMacroProcessDto | UpdateMacroProcessDto) => void
  onCancel: () => void
  isLoading?: boolean
}

export function MacroProcessForm({
  macroProcess,
  onSubmit,
  onCancel,
  isLoading = false,
}: MacroProcessFormProps) {
  const form = useForm<MacroProcessFormData>({
    resolver: zodResolver(macroProcessSchema),
    defaultValues: macroProcess
      ? {
          code: macroProcess.code,
          name: macroProcess.name,
          description: macroProcess.description || '',
          color: macroProcess.color || '',
          icon: macroProcess.icon || '',
          order: macroProcess.order,
          active: macroProcess.active,
        }
      : {
          code: '',
          name: '',
          description: '',
          color: '#ea580c',
          icon: '',
          order: 0,
          active: true,
        },
  })

  const handleSubmit = (data: MacroProcessFormData) => {
    const cleanedData = cleanFormData(data)
    onSubmit(cleanedData)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="MP-001"
                  disabled={!!macroProcess}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nom du macro-processus" />
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
                  {...field}
                  placeholder="Description du macro-processus"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Couleur</FormLabel>
                <FormControl>
                  <Input {...field} type="color" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ordre</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading} className="bg-orange-600 hover:bg-orange-700">
            {isLoading ? 'Enregistrement...' : macroProcess ? 'Modifier' : 'Créer'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

