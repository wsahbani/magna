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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select'
import type { ProcessActor } from '../types/process.types'

const actorSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  type: z.enum(['ROLE', 'DEPARTMENT', 'EXTERNAL', 'SYSTEM']),
  role: z.string().optional(),
  responsibilities: z.string().optional(),
  order: z.number().min(0).optional(),
})

type ActorFormData = z.infer<typeof actorSchema>

interface ProcessActorFormProps {
  actor?: ProcessActor
  onSubmit: (data: ActorFormData) => void | Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function ProcessActorForm({
  actor,
  onSubmit,
  onCancel,
  isLoading = false,
}: ProcessActorFormProps) {
  const form = useForm<ActorFormData>({
    resolver: zodResolver(actorSchema),
    defaultValues: actor
      ? {
          name: actor.name,
          type: actor.type,
          role: actor.role || '',
          responsibilities: actor.responsibilities || '',
          order: actor.order,
        }
      : {
          name: '',
          type: 'ROLE',
          role: '',
          responsibilities: '',
          order: 0,
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
                <Input {...field} placeholder="Nom de l'acteur" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ROLE">Rôle</SelectItem>
                  <SelectItem value="DEPARTMENT">Département</SelectItem>
                  <SelectItem value="EXTERNAL">Externe</SelectItem>
                  <SelectItem value="SYSTEM">Système</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rôle/Fonction</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Rôle ou fonction" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="responsibilities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsabilités</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Description des responsabilités"
                  rows={3}
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
            {isLoading ? 'Enregistrement...' : actor ? 'Modifier' : 'Créer'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

