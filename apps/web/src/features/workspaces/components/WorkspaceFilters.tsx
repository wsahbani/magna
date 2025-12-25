import { Search } from 'lucide-react';
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui';
import { WorkspaceType } from '../types/workspace.types';

interface WorkspaceFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
}

export const WorkspaceFilters = ({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
}: WorkspaceFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Rechercher par nom ou code..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={typeFilter} onValueChange={onTypeFilterChange}>
        <SelectTrigger className="w-full sm:w-64">
          <SelectValue placeholder="Filtrer par type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les types</SelectItem>
          <SelectItem value={WorkspaceType.GROUPE}>Groupe</SelectItem>
          <SelectItem value={WorkspaceType.ENTITY}>Entité</SelectItem>
          <SelectItem value={WorkspaceType.DIRECTION}>Direction</SelectItem>
          <SelectItem value={WorkspaceType.DEPARTMENT}>Département</SelectItem>
          <SelectItem value={WorkspaceType.TEAM}>Équipe</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
