import { Grid3x3, List } from 'lucide-react'
import { Button } from '@repo/ui'

interface ViewModeToggleProps {
  viewMode: 'grid' | 'table'
  onViewModeChange: (mode: 'grid' | 'table') => void
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="flex gap-2">
      <Button
        variant={viewMode === 'grid' ? 'default' : 'outline'}
        onClick={() => onViewModeChange('grid')}
        size="icon"
        className={viewMode === 'grid' ? 'bg-orange-600 hover:bg-orange-700' : ''}
      >
        <Grid3x3 className="w-4 h-4" />
      </Button>
      <Button
        variant={viewMode === 'table' ? 'default' : 'outline'}
        onClick={() => onViewModeChange('table')}
        size="icon"
        className={viewMode === 'table' ? 'bg-orange-600 hover:bg-orange-700' : ''}
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  )
}

