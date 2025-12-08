/**
 * QualigramPropertiesPanel Component
 * Right panel showing properties and metadata based on selected level
 */

import { Heading3, Body, BodySmall } from '@repo/ui'
import type { MacroProcess } from '../../macro-processes/types/macro-process.types'
import type { Process } from '../../processes/types/process.types'
import { PropertiesPanel } from '../../procedures/components/PropertiesPanel'
import { ProcessMetadataPanel } from './ProcessMetadataPanel'
import type { Node, Edge } from '@xyflow/react'

interface QualigramPropertiesPanelProps {
  level: 'macro-process' | 'process' | 'procedure'
  macroProcess?: MacroProcess
  process?: Process
  selectedNode?: Node | null
  selectedEdge?: Edge | null
  onNodeUpdate?: (nodeId: string, data: any) => void
  onEdgeUpdate?: (edgeId: string, data: any) => void
}

export function QualigramPropertiesPanel({
  level,
  macroProcess,
  process,
  selectedNode,
  selectedEdge,
  onNodeUpdate,
  onEdgeUpdate,
}: QualigramPropertiesPanelProps) {
  // Level: Procedure - Show node/edge properties
  if (level === 'procedure') {
    return (
      <div className="w-80 bg-white border-l border-gray-200 h-full overflow-y-auto">
        <PropertiesPanel
          selectedNode={selectedNode || null}
          selectedEdge={selectedEdge || null}
          onNodeUpdate={onNodeUpdate || (() => {})}
          onEdgeUpdate={onEdgeUpdate || (() => {})}
        />
      </div>
    )
  }

  // Level: MacroProcess - Show MacroProcess properties
  if (level === 'macro-process' && macroProcess) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 h-full overflow-y-auto p-4">
        <Heading3 className="mb-4">Propriétés MacroProcess</Heading3>
        <div className="space-y-4">
          <div>
            <BodySmall className="text-gray-500 mb-1">Code</BodySmall>
            <Body>{macroProcess.code}</Body>
          </div>
          <div>
            <BodySmall className="text-gray-500 mb-1">Nom</BodySmall>
            <Body>{macroProcess.name}</Body>
          </div>
          {macroProcess.description && (
            <div>
              <BodySmall className="text-gray-500 mb-1">Description</BodySmall>
              <Body>{macroProcess.description}</Body>
            </div>
          )}
          {macroProcess.color && (
            <div>
              <BodySmall className="text-gray-500 mb-1">Couleur</BodySmall>
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded border border-gray-300"
                  style={{ backgroundColor: macroProcess.color }}
                />
                <Body>{macroProcess.color}</Body>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Level: Process - Show Process metadata with tabs
  if (level === 'process' && process) {
    return (
      <ProcessMetadataPanel processId={process.id} process={process} />
    )
  }

  // Default: Empty state
  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full flex items-center justify-center">
      <Body className="text-gray-500 text-center p-4">
        Sélectionnez un élément pour voir ses propriétés
      </Body>
    </div>
  )
}

