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
import type { DiagramLane, CreateDiagramLaneDto } from '../types/procedure.types'

const laneSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  color: z.string().optional(),
  order: z.number().min(0).optional(),
  height: z.number().min(50).optional(),
  collapsed: z.boolean().optional(),
})

type LaneFormData = z.infer<typeof laneSchema>

interface LaneFormProps {
  lane?: DiagramLane
  onSubmit: (data: LaneFormData) => void | Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function LaneForm({
  lane,
  onSubmit,
  onCancel,
  isLoading = false,
}: LaneFormProps) {
  const form = useForm<LaneFormData>({
    resolver: zodResolver(laneSchema),
    defaultValues: lane
      ? {
          name: lane.name,
          color: lane.color || '#ea580c',
          order: lane.order,
          height: lane.height || 150,
          collapsed: lane.collapsed || false,
        }
      : {
          name: '',
          color: '#ea580c',
          order: 0,
          height: 150,
          collapsed: false,
        },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nom de la swimlane" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {isLoading ? 'Enregistrement...' : lane ? 'Modifier' : 'Créer'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

