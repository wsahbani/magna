import { MapPin, Plus } from 'lucide-react'
import { Button, Heading1, Body } from '@repo/ui'

interface ProcessMapEmptyStateProps {
  onCreateClick: () => void
}

export const ProcessMapEmptyState: React.FC<ProcessMapEmptyStateProps> = ({
  onCreateClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-orange-100 rounded-full p-6 mb-4">
        <MapPin className="h-12 w-12 text-orange-600" />
      </div>
      <Heading1 className="text-gray-900 mb-2">Aucune carte des processus</Heading1>
      <Body className="text-gray-600 text-center mb-6 max-w-md">
        Commencez par créer votre première carte des processus pour organiser et visualiser vos
        processus métier.
      </Body>
      <Button onClick={onCreateClick} className="bg-orange-600 hover:bg-orange-700">
        <Plus className="h-4 w-4 mr-2" />
        Créer une carte des processus
      </Button>
    </div>
  )
}

