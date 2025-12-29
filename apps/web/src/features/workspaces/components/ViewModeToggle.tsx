import { Grid, List } from 'lucide-react';
import { Button } from '@repo/ui';

interface ViewModeToggleProps {
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
}

export const ViewModeToggle = ({ viewMode, onViewModeChange }: ViewModeToggleProps) => {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Button
        variant={viewMode === 'grid' ? 'orange' : 'outline'}
        size="sm"
        onClick={() => onViewModeChange('grid')}
        className="gap-1.5"
      >
        <Grid className="w-3.5 h-3.5" />
        Grille
      </Button>
      <Button
        variant={viewMode === 'table' ? 'orange' : 'outline'}
        size="sm"
        onClick={() => onViewModeChange('table')}
        className="gap-1.5"
      >
        <List className="w-3.5 h-3.5" />
        Tableau
      </Button>
    </div>
  );
};
