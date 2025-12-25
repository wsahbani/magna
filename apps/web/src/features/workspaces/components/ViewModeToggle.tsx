import { Grid, List } from 'lucide-react';
import { Button } from '@repo/ui';

interface ViewModeToggleProps {
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
}

export const ViewModeToggle = ({ viewMode, onViewModeChange }: ViewModeToggleProps) => {
  return (
    <div className="flex items-center gap-2 mb-6">
      <Button
        variant={viewMode === 'grid' ? 'orange' : 'outline'}
        size="sm"
        onClick={() => onViewModeChange('grid')}
        className="gap-2"
      >
        <Grid className="w-4 h-4" />
        Grille
      </Button>
      <Button
        variant={viewMode === 'table' ? 'orange' : 'outline'}
        size="sm"
        onClick={() => onViewModeChange('table')}
        className="gap-2"
      >
        <List className="w-4 h-4" />
        Tableau
      </Button>
    </div>
  );
};
