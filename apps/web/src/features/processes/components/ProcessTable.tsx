import { Trash2 } from 'lucide-react';
import { Button, BodySmall, Caption } from '@repo/ui';
import type { Process, ProcessLevel, ProcessStatus } from '../types/process.types';

interface ProcessTableProps {
  processes: Process[];
  onEdit: (process: Process) => void;
  onDelete: (id: string) => void;
}

export const ProcessTable: React.FC<ProcessTableProps> = ({
  processes,
  onEdit,
  onDelete,
}) => {
  const getLevelLabel = (level: ProcessLevel): string => {
    switch (level) {
      case 1: return 'Flow';
      case 2: return 'SIPOC';
      case 3: return 'BPMN';
      default: return 'Inconnu';
    }
  };

  const getLevelStyle = (level: ProcessLevel): string => {
    switch (level) {
      case 1: return 'bg-purple-100 text-purple-800';
      case 2: return 'bg-blue-100 text-blue-800';
      case 3: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: ProcessStatus): string => {
    switch (status) {
      case 'DRAFT': return 'Brouillon';
      case 'REVIEW': return 'En révision';
      case 'APPROVED': return 'Approuvé';
      case 'PUBLISHED': return 'Publié';
      case 'ARCHIVED': return 'Archivé';
      default: return 'Inconnu';
    }
  };

  const getStatusStyle = (status: ProcessStatus): string => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'REVIEW': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-blue-100 text-blue-800';
      case 'PUBLISHED': return 'bg-green-100 text-green-800';
      case 'ARCHIVED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left">
              <Caption className="text-gray-500 uppercase tracking-wider">Nom</Caption>
            </th>
            <th className="px-6 py-3 text-left">
              <Caption className="text-gray-500 uppercase tracking-wider">Code</Caption>
            </th>
            <th className="px-6 py-3 text-left">
              <Caption className="text-gray-500 uppercase tracking-wider">Niveau</Caption>
            </th>
            <th className="px-6 py-3 text-left">
              <Caption className="text-gray-500 uppercase tracking-wider">Statut</Caption>
            </th>
            <th className="px-6 py-3 text-left">
              <Caption className="text-gray-500 uppercase tracking-wider">Espace de travail</Caption>
            </th>
            <th className="px-6 py-3 text-right">
              <Caption className="text-gray-500 uppercase tracking-wider">Actions</Caption>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {processes.map((process) => (
            <tr key={process.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <BodySmall className="font-medium text-gray-900">{process.name}</BodySmall>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <BodySmall className="text-gray-500">{process.code}</BodySmall>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelStyle(process.level)}`}>
                  {getLevelLabel(process.level)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(process.status)}`}>
                  {getStatusLabel(process.status)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <BodySmall className="text-gray-500">{process.workspace?.name || '-'}</BodySmall>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit(process)}>
                  Modifier
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(process.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
