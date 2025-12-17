import * as React from "react"
import { Building2, Users, Folder, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { cn } from "../lib/utils"

export interface WorkspaceCardProps {
  workspace: {
    id: string
    name: string
    description?: string
    type: 'GROUPE' | 'ENTITY' | 'DIRECTION' | 'DEPARTMENT' | 'TEAM'
    processCount?: number
    memberCount?: number
    isActive?: boolean
  }
  onClick?: () => void
  isSelected?: boolean
  className?: string
}

const workspaceIcons = {
  GROUPE: Building2,
  ENTITY: Building2,
  DIRECTION: Folder,
  DEPARTMENT: Users,
  TEAM: Users,
}

const workspaceColors = {
  GROUPE: "bg-orange-500 text-white",
  ENTITY: "bg-orange-400 text-white", 
  DIRECTION: "bg-blue-500 text-white",
  DEPARTMENT: "bg-green-500 text-white",
  TEAM: "bg-purple-500 text-white",
}

export const WorkspaceCard = React.forwardRef<
  HTMLDivElement,
  WorkspaceCardProps
>(({ workspace, onClick, isSelected, className, ...props }, ref) => {
  const Icon = workspaceIcons[workspace.type]
  const iconColorClass = workspaceColors[workspace.type]

  return (
    <Card
      ref={ref}
      className={cn(
        "workspace-card cursor-pointer transition-all hover:shadow-lg",
        isSelected && "workspace-card active border-primary ring-2 ring-primary/20",
        !workspace.isActive && "opacity-60",
        className
      )}
      onClick={onClick}
      {...props}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("p-1.5 rounded-lg", iconColorClass)}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base">{workspace.name}</CardTitle>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                {workspace.type}
              </div>
            </div>
          </div>
          {!workspace.isActive && (
            <div className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
              Inactive
            </div>
          )}
        </div>
        {workspace.description && (
          <CardDescription className="mt-2 text-sm line-clamp-2">
            {workspace.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-2 pb-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            {workspace.processCount !== undefined && (
              <div className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                <span>{workspace.processCount}</span>
              </div>
            )}
            {workspace.memberCount !== undefined && (
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                <span>{workspace.memberCount}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
})
WorkspaceCard.displayName = "WorkspaceCard"

export interface WorkspaceGridProps {
  workspaces: WorkspaceCardProps['workspace'][]
  selectedWorkspaceId?: string
  onWorkspaceSelect?: (workspaceId: string) => void
  className?: string
}

export const WorkspaceGrid = React.forwardRef<
  HTMLDivElement,
  WorkspaceGridProps
>(({ workspaces, selectedWorkspaceId, onWorkspaceSelect, className }, ref) => {
  return (
    <div 
      ref={ref}
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className
      )}
    >
      {workspaces.map((workspace) => (
        <WorkspaceCard
          key={workspace.id}
          workspace={workspace}
          isSelected={selectedWorkspaceId === workspace.id}
          onClick={() => onWorkspaceSelect?.(workspace.id)}
        />
      ))}
    </div>
  )
})
WorkspaceGrid.displayName = "WorkspaceGrid"