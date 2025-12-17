/**
 * QualigramFlowCanvas Component
 * Central area showing FlowEditor ReactFlow for Procedure level, or info views for MacroProcess/Process
 */

import { ProcedureEditor } from '../../procedures/components/ProcedureEditor'
import type { DiagramNode, DiagramEdge, DiagramLane } from '../../procedures/types/procedure.types'
import type { MacroProcess } from '../../macro-processes/types/macro-process.types'
import type { Process } from '../../processes/types/process.types'
import type { Procedure } from '../../procedures/types/procedure.types'
import { Heading3, Body, BodySmall } from '@repo/ui'
import { Folder, FileText, Workflow } from 'lucide-react'

interface QualigramFlowCanvasProps {
  level: 'macro-process' | 'process' | 'procedure'
  macroProcess?: MacroProcess
  process?: Process
  procedure?: Procedure
  macroProcessId?: string
  processId?: string
  procedureId?: string
  nodes?: DiagramNode[]
  edges?: DiagramEdge[]
  lanes?: DiagramLane[]
  onSave?: () => void
  onNodeSelect?: (node: any) => void
  onEdgeSelect?: (edge: any) => void
}

export function QualigramFlowCanvas({
  level,
  macroProcess,
  process,
  procedure,
  macroProcessId,
  processId,
  procedureId,
  nodes = [],
  edges = [],
  lanes = [],
  onSave,
  onNodeSelect,
  onEdgeSelect,
}: QualigramFlowCanvasProps) {
  // All levels now use ProcedureEditor (which will be adapted to support all levels)
  const levelId = procedureId || processId || macroProcessId
  
  if (levelId) {
    return (
      <div className="flex-1 h-full">
        <ProcedureEditor
          level={level}
          levelId={levelId}
          procedureId={procedureId}
          initialNodes={nodes}
          initialEdges={edges}
          initialLanes={lanes}
          onSave={onSave}
          onNodeSelect={onNodeSelect}
          onEdgeSelect={onEdgeSelect}
        />
      </div>
    )
  }

  // Level: MacroProcess - Show info view
  if (level === 'macro-process') {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <Folder className="w-16 h-16 text-orange-600 mx-auto mb-4" />
          <Heading3 className="mb-2">
            {macroProcess ? macroProcess.name : 'Sélectionnez un macro-processus'}
          </Heading3>
          {macroProcess ? (
            <>
              <Body className="text-gray-600 mb-4">{macroProcess.description}</Body>
              <BodySmall className="text-gray-500">
                Code: {macroProcess.code}
              </BodySmall>
              <BodySmall className="text-gray-500">
                Le niveau MacroProcess est stratégique. Sélectionnez un Process pour voir
                les métadonnées ou une Procedure pour éditer le logigramme.
              </BodySmall>
            </>
          ) : (
            <Body className="text-gray-600">
              Sélectionnez un macro-processus dans le panneau de gauche pour commencer.
            </Body>
          )}
        </div>
      </div>
    )
  }

  // Level: Process - Show info view with metadata
  if (level === 'process') {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <Heading3 className="mb-2">
            {process ? process.title || process.name : 'Sélectionnez un processus'}
          </Heading3>
          {process ? (
            <>
              <Body className="text-gray-600 mb-4">{process.description}</Body>
              <BodySmall className="text-gray-500">
                Code: {process.code}
              </BodySmall>
              <BodySmall className="text-gray-500">
                Le niveau Process est management. Les métadonnées sont dans le panneau de
                droite. Sélectionnez une Procedure pour éditer le logigramme.
              </BodySmall>
            </>
          ) : (
            <Body className="text-gray-600">
              Sélectionnez un processus dans le panneau de gauche pour voir les métadonnées.
            </Body>
          )}
        </div>
      </div>
    )
  }

  // Default: Empty state
  return (
    <div className="flex-1 h-full flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Workflow className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <Body className="text-gray-600">
          Sélectionnez un élément dans le panneau de gauche pour commencer.
        </Body>
      </div>
    </div>
  )
}

