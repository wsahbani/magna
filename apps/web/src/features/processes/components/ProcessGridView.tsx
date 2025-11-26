import { ProcessCard } from './ProcessCard';
import type { Process } from '../types/process.types';

interface ProcessGridViewProps {
  processes: Process[];
  onEdit: (process: Process) => void;
  onView: (process: Process) => void;
  onDelete: (id: string) => void;
}

export const ProcessGridView: React.FC<ProcessGridViewProps> = ({
  processes,
  onEdit,
  onView,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {processes.map((process) => (
        <ProcessCard
          key={process.id}
          process={process}
          onEdit={onEdit}
          onView={() => onView(process)}
          onDelete={() => onDelete(process.id)}
        />
      ))}
    </div>
  );
};
