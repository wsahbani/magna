import { ProcessCard } from './ProcessCard'
import type { Process } from '../types/process.types'

interface ProcessGridViewProps {
  processes: Process[]
  onView?: (process: Process) => void
  onEdit?: (process: Process) => void
  onDelete?: (process: Process) => void
}

export const ProcessGridView: React.FC<ProcessGridViewProps> = ({
  processes,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {processes.map((process) => (
        <ProcessCard
          key={process.id}
          process={process}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

