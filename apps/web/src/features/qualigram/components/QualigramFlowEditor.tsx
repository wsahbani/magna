/**
 * QualigramFlowEditor Component
 * Unified FlowEditor for all Qualigram levels (MacroProcess → Process → Procedure)
 */

import { useState, useEffect } from 'react'
import { QualigramHierarchyPanel } from './QualigramHierarchyPanel'
import { QualigramFlowCanvas } from './QualigramFlowCanvas'
import { QualigramPropertiesPanel } from './QualigramPropertiesPanel'
import { CreateMacroProcessDialog } from './CreateMacroProcessDialog'
import { CreateProcessDialog } from './CreateProcessDialog'
import { CreateProcedureDialog } from './CreateProcedureDialog'
import { useMacroProcesses } from '../../macro-processes/hooks/useMacroProcesses'
import { useProcesses } from '../../processes/hooks/useProcesses'
import { useProcedures } from '../../procedures/hooks/useProcedures'
import {
  useProcedureNodes,
  useProcedureEdges,
  useProcedureLanes,
} from '../../procedures/hooks/useProcedures'
import {
  useDiagramNodes,
  useDiagramEdges,
  useDiagramLanes,
} from '../hooks/useDiagramElements'
import type { QualigramLevel } from '../types/qualigram-editor.types'
import type { Node, Edge } from '@xyflow/react'

interface QualigramFlowEditorProps {
  initialMacroProcessId?: string
  initialProcessId?: string
  initialProcedureId?: string
  onSave?: () => void
}

export function QualigramFlowEditor({
  initialMacroProcessId,
  initialProcessId,
  initialProcedureId,
  onSave,
}: QualigramFlowEditorProps) {
  const [selectedMacroProcessId, setSelectedMacroProcessId] = useState<
    string | undefined
  >(initialMacroProcessId)
  const [selectedProcessId, setSelectedProcessId] = useState<string | undefined>(
    initialProcessId
  )
  const [selectedProcedureId, setSelectedProcedureId] = useState<
    string | undefined
  >(initialProcedureId)
  const [currentLevel, setCurrentLevel] = useState<QualigramLevel>('macro-process')
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null)
  const [createMacroProcessOpen, setCreateMacroProcessOpen] = useState(false)
  const [createProcessOpen, setCreateProcessOpen] = useState(false)
  const [createProcedureOpen, setCreateProcedureOpen] = useState(false)
  const [pendingMacroProcessId, setPendingMacroProcessId] = useState<string | undefined>()
  const [pendingProcessId, setPendingProcessId] = useState<string | undefined>()

  // Fetch data
  const { data: macroProcessesResponse } = useMacroProcesses({})
  const macroProcesses = macroProcessesResponse?.data || []
  
  const { data: processesData } = useProcesses({
    macroId: selectedMacroProcessId,
  })
  const processes = processesData?.data || []
  
  const { data: proceduresData } = useProcedures(selectedProcessId)
  const procedures = Array.isArray(proceduresData) ? proceduresData : []

  // Fetch diagram elements based on current level
  const { data: macroProcessNodes = [] } = useDiagramNodes(
    'macro-process',
    selectedMacroProcessId,
  )
  const { data: macroProcessEdges = [] } = useDiagramEdges(
    'macro-process',
    selectedMacroProcessId,
  )
  const { data: macroProcessLanes = [] } = useDiagramLanes(
    'macro-process',
    selectedMacroProcessId,
  )

  const { data: processNodes = [] } = useDiagramNodes(
    'process',
    selectedProcessId,
  )
  const { data: processEdges = [] } = useDiagramEdges(
    'process',
    selectedProcessId,
  )
  const { data: processLanes = [] } = useDiagramLanes(
    'process',
    selectedProcessId,
  )

  const { data: procedureNodes = [] } = useProcedureNodes(
    selectedProcedureId || ''
  )
  const { data: procedureEdges = [] } = useProcedureEdges(
    selectedProcedureId || ''
  )
  const { data: procedureLanes = [] } = useProcedureLanes(
    selectedProcedureId || ''
  )

  // Get nodes/edges/lanes for current level
  const currentNodes =
    currentLevel === 'macro-process'
      ? macroProcessNodes
      : currentLevel === 'process'
        ? processNodes
        : procedureNodes
  const currentEdges =
    currentLevel === 'macro-process'
      ? macroProcessEdges
      : currentLevel === 'process'
        ? processEdges
        : procedureEdges
  const currentLanes =
    currentLevel === 'macro-process'
      ? macroProcessLanes
      : currentLevel === 'process'
        ? processLanes
        : procedureLanes

  // Determine current level based on selection
  useEffect(() => {
    if (selectedProcedureId) {
      setCurrentLevel('procedure')
    } else if (selectedProcessId) {
      setCurrentLevel('process')
    } else if (selectedMacroProcessId) {
      setCurrentLevel('macro-process')
    }
  }, [selectedMacroProcessId, selectedProcessId, selectedProcedureId])

  // Get selected items
  const selectedMacroProcess = macroProcesses.find(
    (mp) => mp.id === selectedMacroProcessId
  )
  const selectedProcess = processes.find((p) => p.id === selectedProcessId)
  const selectedProcedure = procedures.find((p) => p.id === selectedProcedureId)

  const handleSelectMacroProcess = (id: string) => {
    setSelectedMacroProcessId(id)
    setSelectedProcessId(undefined)
    setSelectedProcedureId(undefined)
  }

  const handleSelectProcess = (id: string) => {
    setSelectedProcessId(id)
    setSelectedProcedureId(undefined)
  }

  const handleSelectProcedure = (id: string) => {
    setSelectedProcedureId(id)
  }

  const handleNodeUpdate = (nodeId: string, data: any) => {
    // Will be handled by ProcedureEditor
    console.log('Node update:', nodeId, data)
  }

  const handleEdgeUpdate = (edgeId: string, data: any) => {
    // Will be handled by ProcedureEditor
    console.log('Edge update:', edgeId, data)
  }

  return (
    <div className="flex h-full w-full">
      {/* Left Panel - Hierarchy */}
      <QualigramHierarchyPanel
        macroProcesses={macroProcesses}
        processes={processes}
        procedures={procedures}
        selectedMacroProcessId={selectedMacroProcessId}
        selectedProcessId={selectedProcessId}
        selectedProcedureId={selectedProcedureId}
        onSelectMacroProcess={handleSelectMacroProcess}
        onSelectProcess={handleSelectProcess}
        onSelectProcedure={handleSelectProcedure}
        onCreateMacroProcess={() => {
          // TODO: Open create dialog
          console.log('Create MacroProcess')
        }}
        onCreateProcess={(macroProcessId) => {
          // TODO: Open create dialog
          console.log('Create Process for MacroProcess:', macroProcessId)
        }}
        onCreateProcedure={(processId) => {
          // TODO: Open create dialog
          console.log('Create Procedure for Process:', processId)
        }}
      />

      {/* Center - Flow Canvas */}
      <QualigramFlowCanvas
        level={currentLevel}
        macroProcess={selectedMacroProcess}
        process={selectedProcess}
        procedure={selectedProcedure}
        procedureNodes={procedureNodes}
        procedureEdges={procedureEdges}
        procedureLanes={procedureLanes}
        onSave={onSave}
        onNodeSelect={setSelectedNode}
        onEdgeSelect={setSelectedEdge}
      />

      {/* Right Panel - Properties */}
      <QualigramPropertiesPanel
        level={currentLevel}
        macroProcess={selectedMacroProcess}
        process={selectedProcess}
        selectedNode={selectedNode}
        selectedEdge={selectedEdge}
        onNodeUpdate={handleNodeUpdate}
        onEdgeUpdate={handleEdgeUpdate}
      />

      {/* Create Dialogs */}
      <CreateMacroProcessDialog
        open={createMacroProcessOpen}
        onOpenChange={setCreateMacroProcessOpen}
        onSuccess={() => {
          // Refresh macro processes list
        }}
      />

      {pendingMacroProcessId && (
        <CreateProcessDialog
          open={createProcessOpen}
          onOpenChange={(open) => {
            setCreateProcessOpen(open)
            if (!open) {
              setPendingMacroProcessId(undefined)
            }
          }}
          macroProcessId={pendingMacroProcessId}
          onSuccess={() => {
            // Refresh processes list
            if (pendingMacroProcessId) {
              setSelectedMacroProcessId(pendingMacroProcessId)
            }
          }}
        />
      )}

      {pendingProcessId && (
        <CreateProcedureDialog
          open={createProcedureOpen}
          onOpenChange={(open) => {
            setCreateProcedureOpen(open)
            if (!open) {
              setPendingProcessId(undefined)
            }
          }}
          processId={pendingProcessId}
          onSuccess={() => {
            // Refresh procedures list
            if (pendingProcessId) {
              setSelectedProcessId(pendingProcessId)
            }
          }}
        />
      )}
    </div>
  )
}

