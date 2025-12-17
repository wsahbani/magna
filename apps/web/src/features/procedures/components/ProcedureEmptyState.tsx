import { FileText, Plus } from 'lucide-react'
import { Button, Heading1, Body } from '@repo/ui'

interface ProcedureEmptyStateProps {
  onCreateClick: () => void
}

export const ProcedureEmptyState: React.FC<ProcedureEmptyStateProps> = ({
  onCreateClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-orange-100 rounded-full p-6 mb-4">
        <FileText className="h-12 w-12 text-orange-600" />
      </div>
      <Heading1 className="text-gray-900 mb-2">Aucune procédure</Heading1>
      <Body className="text-gray-600 text-center mb-6 max-w-md">
        Commencez par créer votre première procédure pour définir et documenter vos procédures opérationnelles (Niveau 3).
      </Body>
      <Button onClick={onCreateClick} className="bg-orange-600 hover:bg-orange-700">
        <Plus className="h-4 w-4 mr-2" />
        Créer une procédure
      </Button>
    </div>
  )
}

