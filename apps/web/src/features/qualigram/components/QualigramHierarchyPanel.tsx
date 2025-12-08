/**
 * QualigramHierarchyPanel Component
 * Left panel showing the hierarchical navigation: MacroProcess → Process → Procedure
 */

import { useState } from 'react'
import { Heading3, Body, BodySmall } from '@repo/ui'
import { ChevronRight, ChevronDown, Plus, Folder, FileText, Workflow } from 'lucide-react'
import { Button } from '@repo/ui/components/ui/button'
import type { MacroProcess } from '../../macro-processes/types/macro-process.types'
import type { Process } from '../../processes/types/process.types'
import type { Procedure } from '../../procedures/types/procedure.types'

interface QualigramHierarchyPanelProps {
  macroProcesses?: MacroProcess[]
  processes?: Process[]
  procedures?: Procedure[]
  selectedMacroProcessId?: string
  selectedProcessId?: string
  selectedProcedureId?: string
  onSelectMacroProcess?: (id: string) => void
  onSelectProcess?: (id: string) => void
  onSelectProcedure?: (id: string) => void
  onCreateMacroProcess?: () => void
  onCreateProcess?: (macroProcessId: string) => void
  onCreateProcedure?: (processId: string) => void
}

export function QualigramHierarchyPanel({
  macroProcesses = [],
  processes = [],
  procedures = [],
  selectedMacroProcessId,
  selectedProcessId,
  selectedProcedureId,
  onSelectMacroProcess,
  onSelectProcess,
  onSelectProcedure,
  onCreateMacroProcess,
  onCreateProcess,
  onCreateProcedure,
}: QualigramHierarchyPanelProps) {
  const [expandedMacroProcesses, setExpandedMacroProcesses] = useState<Set<string>>(
    new Set(selectedMacroProcessId ? [selectedMacroProcessId] : [])
  )
  const [expandedProcesses, setExpandedProcesses] = useState<Set<string>>(
    new Set(selectedProcessId ? [selectedProcessId] : [])
  )

  const toggleMacroProcess = (id: string) => {
    const newExpanded = new Set(expandedMacroProcesses)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedMacroProcesses(newExpanded)
  }

  const toggleProcess = (id: string) => {
    const newExpanded = new Set(expandedProcesses)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedProcesses(newExpanded)
  }

  const getMacroProcessProcesses = (macroProcessId: string) => {
    return processes.filter((p) => p.macroId === macroProcessId)
  }

  const getProcessProcedures = (processId: string) => {
    return procedures.filter((p) => p.processId === processId)
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <Heading3>Qualigram</Heading3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCreateMacroProcess}
            className="h-8 w-8 p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <BodySmall className="text-gray-500">
          Navigation hiérarchique
        </BodySmall>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2">
        {/* MacroProcesses */}
        <div className="space-y-1">
          {macroProcesses.length === 0 ? (
            <div className="p-4 text-center">
              <BodySmall className="text-gray-500 mb-2">
                Aucun macro-processus
              </BodySmall>
              <Button variant="outline" size="sm" onClick={onCreateMacroProcess}>
                <Plus className="w-4 h-4 mr-2" />
                Créer un macro-processus
              </Button>
            </div>
          ) : (
            macroProcesses.map((macroProcess) => {
              const isExpanded = expandedMacroProcesses.has(macroProcess.id)
              const isSelected = selectedMacroProcessId === macroProcess.id
              const macroProcessProcesses = getMacroProcessProcesses(macroProcess.id)
              const hasProcesses = macroProcessProcesses.length > 0

              return (
                <div key={macroProcess.id} className="select-none">
                  {/* MacroProcess Item */}
                  <div
                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-50 ${
                      isSelected ? 'bg-orange-50 border border-orange-200' : ''
                    }`}
                    onClick={() => onSelectMacroProcess?.(macroProcess.id)}
                  >
                    {hasProcesses ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleMacroProcess(macroProcess.id)
                        }}
                        className="p-0.5 hover:bg-gray-200 rounded"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    ) : (
                      <div className="w-5" />
                    )}
                    <Folder className="w-4 h-4 text-orange-600" />
                    <Body className="flex-1 truncate">{macroProcess.name}</Body>
                    {hasProcesses && (
                      <BodySmall className="text-gray-500">
                        {macroProcessProcesses.length}
                      </BodySmall>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onCreateProcess?.(macroProcess.id)
                      }}
                      className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Processes under MacroProcess */}
                  {isExpanded && hasProcesses && (
                    <div className="ml-6 mt-1 space-y-1">
                      {macroProcessProcesses.map((process: Process) => {
                        const isProcessExpanded = expandedProcesses.has(process.id)
                        const isProcessSelected = selectedProcessId === process.id
                        const processProceduresList = getProcessProcedures(process.id)
                        const hasProcedures = processProceduresList.length > 0

                        return (
                          <div key={process.id} className="select-none">
                            {/* Process Item */}
                            <div
                              className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-50 ${
                                isProcessSelected ? 'bg-blue-50 border border-blue-200' : ''
                              }`}
                              onClick={() => onSelectProcess?.(process.id)}
                            >
                              {hasProcedures ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleProcess(process.id)
                                  }}
                                  className="p-0.5 hover:bg-gray-200 rounded"
                                >
                                  {isProcessExpanded ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                </button>
                              ) : (
                                <div className="w-5" />
                              )}
                              <FileText className="w-4 h-4 text-blue-600" />
                              <Body className="flex-1 truncate text-sm">{process.title || process.name}</Body>
                              {hasProcedures && (
                                <BodySmall className="text-gray-500 text-xs">
                                  {processProceduresList.length}
                                </BodySmall>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onCreateProcedure?.(process.id)
                                }}
                                className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Procedures under Process */}
                            {isProcessExpanded && hasProcedures && (
                              <div className="ml-6 mt-1 space-y-1">
                                {processProceduresList.map((procedure) => {
                                  const isProcedureSelected =
                                    selectedProcedureId === procedure.id

                                  return (
                                    <div
                                      key={procedure.id}
                                      className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-50 ${
                                        isProcedureSelected
                                          ? 'bg-green-50 border border-green-200'
                                          : ''
                                      }`}
                                      onClick={() => onSelectProcedure?.(procedure.id)}
                                    >
                                      <div className="w-5" />
                                      <Workflow className="w-4 h-4 text-green-600" />
                                      <Body className="flex-1 truncate text-sm">
                                        {procedure.name} v{procedure.version}
                                      </Body>
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

