import { ProcedureCard } from './ProcedureCard'
import type { Procedure } from '../types/procedure.types'

interface ProcedureGridViewProps {
  procedures: Procedure[]
  onView?: (procedure: Procedure) => void
  onEdit?: (procedure: Procedure) => void
  onDelete?: (procedure: Procedure) => void
}

export const ProcedureGridView: React.FC<ProcedureGridViewProps> = ({
  procedures,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {procedures.map((procedure) => (
        <ProcedureCard
          key={procedure.id}
          procedure={procedure}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

