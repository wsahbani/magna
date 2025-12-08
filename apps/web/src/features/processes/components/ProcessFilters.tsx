import { Search } from 'lucide-react';
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui';
import type { ProcessLevel, ProcessStatus } from '../types/process.types';
import { useMacroProcesses } from '../../macro-processes/hooks/useMacroProcesses';

interface ProcessFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  levelFilter: ProcessLevel | 'all';
  onLevelChange: (value: ProcessLevel | 'all') => void;
  statusFilter: ProcessStatus | 'all';
  onStatusChange: (value: ProcessStatus | 'all') => void;
  macroIdFilter?: string;
  onMacroIdChange?: (value: string | undefined) => void;
}

export const ProcessFilters: React.FC<ProcessFiltersProps> = ({
  search,
  onSearchChange,
  levelFilter,
  onLevelChange,
  statusFilter,
  onStatusChange,
  macroIdFilter,
  onMacroIdChange,
}) => {
  const { data: macroProcessesData } = useMacroProcesses({ active: true });
  const macroProcesses = macroProcessesData?.data || [];
  const getLevelLabel = (level: ProcessLevel | 'all'): string => {
    if (level === 'all') return 'Tous les niveaux';
    switch (level) {
      case 1: return 'Flow';
      case 2: return 'SIPOC';
      case 3: return 'BPMN';
      default: return 'Tous';
    }
  };

  const getStatusLabel = (status: ProcessStatus | 'all'): string => {
    if (status === 'all') return 'Tous les statuts';
    switch (status) {
      case 'DRAFT': return 'Brouillon';
      case 'REVIEW': return 'En révision';
      case 'APPROVED': return 'Approuvé';
      case 'PUBLISHED': return 'Publié';
      case 'ARCHIVED': return 'Archivé';
      default: return 'Tous';
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Rechercher un processus..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Level Filter */}
      <Select value={String(levelFilter)} onValueChange={(value) => onLevelChange(value as ProcessLevel | 'all')}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue>{getLevelLabel(levelFilter)}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les niveaux</SelectItem>
          <SelectItem value="1">Flow</SelectItem>
          <SelectItem value="2">SIPOC</SelectItem>
          <SelectItem value="3">BPMN</SelectItem>
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select value={statusFilter} onValueChange={(value) => onStatusChange(value as ProcessStatus | 'all')}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue>{getStatusLabel(statusFilter)}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          <SelectItem value="DRAFT">Brouillon</SelectItem>
          <SelectItem value="REVIEW">En révision</SelectItem>
          <SelectItem value="APPROVED">Approuvé</SelectItem>
          <SelectItem value="PUBLISHED">Publié</SelectItem>
          <SelectItem value="ARCHIVED">Archivé</SelectItem>
        </SelectContent>
      </Select>

      {/* MacroProcess Filter */}
      {onMacroIdChange && (
        <Select 
          value={macroIdFilter || 'all'} 
          onValueChange={(value) => onMacroIdChange(value === 'all' ? undefined : value)}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue>
              {macroIdFilter 
                ? macroProcesses.find((mp: { id: string; name: string }) => mp.id === macroIdFilter)?.name || 'Macro-Processus'
                : 'Tous les macro-processus'
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les macro-processus</SelectItem>
            {macroProcesses.map((mp: { id: string; name: string }) => (
              <SelectItem key={mp.id} value={mp.id}>
                {mp.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
