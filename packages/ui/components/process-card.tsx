import * as React from "react"
import { FileText, Clock, User, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { cn } from "../lib/utils"

export interface ProcessCardProps {
  process: {
    id: string
    name: string
    description?: string
    type: 'FLOW' | 'SIPOC' | 'BPMN'
    level: 1 | 2 | 3
    status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED'
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    authorName?: string
    updatedAt?: string
    estimatedDuration?: number
    tags?: string[]
  }
  onClick?: () => void
  onEdit?: () => void
  onView?: () => void
  isSelected?: boolean
  className?: string
}

const processTypeColors = {
  FLOW: "bg-orange-500 text-white",
  SIPOC: "bg-blue-500 text-white",
  BPMN: "bg-green-500 text-white",
}

const statusColors = {
  DRAFT: "bg-gray-100 text-gray-700 border-gray-300",
  REVIEW: "bg-yellow-100 text-yellow-700 border-yellow-300",
  APPROVED: "bg-blue-100 text-blue-700 border-blue-300",
  PUBLISHED: "bg-green-100 text-green-700 border-green-300",
  ARCHIVED: "bg-red-100 text-red-700 border-red-300",
}

const statusIcons = {
  DRAFT: FileText,
  REVIEW: Clock,
  APPROVED: CheckCircle,
  PUBLISHED: CheckCircle,
  ARCHIVED: XCircle,
}

const priorityColors = {
  LOW: "bg-green-50 text-green-700 border-green-200",
  MEDIUM: "bg-yellow-50 text-yellow-700 border-yellow-200", 
  HIGH: "bg-orange-50 text-orange-700 border-orange-200",
  CRITICAL: "bg-red-50 text-red-700 border-red-200",
}

export const ProcessCard = React.forwardRef<
  HTMLDivElement,
  ProcessCardProps
>(({ process, onClick, onEdit, onView, isSelected, className, ...props }, ref) => {
  const typeColorClass = processTypeColors[process.type]
  const statusColorClass = statusColors[process.status]
  const StatusIcon = statusIcons[process.status]
  const priorityColorClass = process.priority ? priorityColors[process.priority] : ""

  return (
    <Card
      ref={ref}
      className={cn(
        "process-node cursor-pointer transition-all hover:shadow-lg",
        isSelected && "process-node selected",
        className
      )}
      onClick={onClick}
      {...props}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <div className={cn("px-1.5 py-0.5 rounded text-xs font-medium", typeColorClass)}>
              L{process.level}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm leading-tight mb-0.5 truncate">
                {process.name}
              </CardTitle>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                {process.type}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {process.priority && (
              <div className={cn(
                "px-1.5 py-0.5 rounded-full text-xs font-medium border",
                priorityColorClass
              )}>
                {process.priority}
              </div>
            )}
            <div className={cn(
              "flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium border",
              statusColorClass
            )}>
              <StatusIcon className="h-3 w-3" />
              <span className="hidden sm:inline">{process.status}</span>
            </div>
          </div>
        </div>
        {process.description && (
          <CardDescription className="mt-1.5 line-clamp-2 text-xs">
            {process.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {process.tags && process.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {process.tags.slice(0, 2).map((tag, index) => (
                <div
                  key={index}
                  className="px-1.5 py-0.5 bg-muted text-muted-foreground rounded text-xs"
                >
                  {tag}
                </div>
              ))}
              {process.tags.length > 2 && (
                <div className="px-1.5 py-0.5 bg-muted text-muted-foreground rounded text-xs">
                  +{process.tags.length - 2}
                </div>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2 min-w-0">
              {process.authorName && (
                <div className="flex items-center gap-1 min-w-0">
                  <User className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{process.authorName}</span>
                </div>
              )}
              {process.estimatedDuration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{process.estimatedDuration}min</span>
                </div>
              )}
            </div>
            {process.updatedAt && (
              <div className="text-xs flex-shrink-0">
                {new Date(process.updatedAt).toLocaleDateString()}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                onView?.()
              }}
              className="flex-1 h-7 text-xs"
            >
              View
            </Button>
            <Button
              size="sm"
              variant="orange"
              onClick={(e) => {
                e.stopPropagation()
                onEdit?.()
              }}
              className="flex-1 h-7 text-xs"
            >
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})
ProcessCard.displayName = "ProcessCard"

export interface ProcessGridProps {
  processes: ProcessCardProps['process'][]
  selectedProcessId?: string
  onProcessSelect?: (processId: string) => void
  onProcessEdit?: (processId: string) => void
  onProcessView?: (processId: string) => void
  className?: string
}

export const ProcessGrid = React.forwardRef<
  HTMLDivElement,
  ProcessGridProps
>(({ 
  processes, 
  selectedProcessId, 
  onProcessSelect, 
  onProcessEdit, 
  onProcessView, 
  className 
}, ref) => {
  return (
    <div 
      ref={ref}
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className
      )}
    >
      {processes.map((process) => (
        <ProcessCard
          key={process.id}
          process={process}
          isSelected={selectedProcessId === process.id}
          onClick={() => onProcessSelect?.(process.id)}
          onEdit={() => onProcessEdit?.(process.id)}
          onView={() => onProcessView?.(process.id)}
        />
      ))}
    </div>
  )
})
ProcessGrid.displayName = "ProcessGrid"