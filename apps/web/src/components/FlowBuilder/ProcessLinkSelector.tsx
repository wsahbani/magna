/**
 * ProcessLinkSelector Component
 * Allows linking a process node to an existing ProcessMap, Process, or Procedure
 */

import { useState, useMemo } from 'react'
import { Search, Link2, X } from 'lucide-react'
import { Input, BodySmall, Button } from '@repo/ui'
import { useProcessMaps } from '../../features/process-map/hooks/useProcessMaps'
import { useProcesses } from '../../features/process/hooks/useProcesses'
import { useProcedures } from '../../features/procedures/hooks/useProcedures'
import { ProcessType } from '../../features/process/types/enums'
import type { ProcessMap } from '../../features/process-map/types/process-map.types'
import type { Process } from '../../features/process/types/process.types'
import type { Procedure } from '../../features/procedures/types/procedure.types'

interface ProcessLinkSelectorProps {
  selectedProcessId?: string
  selectedProcessType?: 'processMap' | 'process' | 'procedure'
  onSelect: (item: {
    id: string
    type: 'processMap' | 'process' | 'procedure'
    title: string
    code: string
    flowType?: 'FLOW' | 'SIPOC'
  }) => void
  onClear: () => void
}

export function ProcessLinkSelector({
  selectedProcessId,
  selectedProcessType,
  onSelect,
  onClear,
}: ProcessLinkSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'processMap' | 'process' | 'procedure'>('process')

  // Fetch data
  const { data: processMapsData } = useProcessMaps()
  const { data: processesData } = useProcesses({})
  const { data: proceduresData } = useProcedures()

  const processMaps = processMapsData?.data || []
  const processes = processesData?.data || []
  const procedures = proceduresData || []

  // Filter and search
  const filteredProcessMaps = useMemo(() => {
    if (!searchQuery) return processMaps
    const query = searchQuery.toLowerCase()
    return processMaps.filter(
      (pm) =>
        pm.title.toLowerCase().includes(query) ||
        pm.code.toLowerCase().includes(query),
    )
  }, [processMaps, searchQuery])

  const filteredProcesses = useMemo(() => {
    if (!searchQuery) return processes
    const query = searchQuery.toLowerCase()
    return processes.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.code.toLowerCase().includes(query),
    )
  }, [processes, searchQuery])

  const filteredProcedures = useMemo(() => {
    if (!searchQuery) return procedures
    const query = searchQuery.toLowerCase()
    return procedures.filter(
      (proc) =>
        proc.title.toLowerCase().includes(query) ||
        proc.code.toLowerCase().includes(query),
    )
  }, [procedures, searchQuery])

  const handleSelect = (
    item: ProcessMap | Process | Procedure,
    type: 'processMap' | 'process' | 'procedure',
  ) => {
    if (type === 'process') {
      const process = item as Process
      onSelect({
        id: process.id,
        type: 'process',
        title: process.title,
        code: process.code,
        flowType: process.type as 'FLOW' | 'SIPOC',
      })
    } else if (type === 'processMap') {
      const processMap = item as ProcessMap
      onSelect({
        id: processMap.id,
        type: 'processMap',
        title: processMap.title,
        code: processMap.code,
      })
    } else {
      const procedure = item as Procedure
      onSelect({
        id: procedure.id,
        type: 'procedure',
        title: procedure.title,
        code: procedure.code,
      })
    }
  }

  const renderItem = (
    item: ProcessMap | Process | Procedure,
    type: 'processMap' | 'process' | 'procedure',
  ) => {
    const isSelected =
      selectedProcessId === item.id && selectedProcessType === type
    const isProcess = type === 'process'
    const process = isProcess ? (item as Process) : null

    return (
      <button
        key={item.id}
        onClick={() => handleSelect(item, type)}
        className={`w-full text-left p-2 rounded border transition-all hover:bg-gray-50 ${
          isSelected
            ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-200'
            : 'border-gray-200'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <BodySmall className="font-medium text-gray-900 truncate">
              {item.title}
            </BodySmall>
            <BodySmall className="text-xs text-gray-500 mt-0.5">
              {item.code}
            </BodySmall>
            {isProcess && process && (
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    process.type === ProcessType.SIPOC
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {process.type === ProcessType.SIPOC ? 'SIPOC' : 'FLOW'}
                </span>
                <span className="text-[10px] text-gray-500">
                  {process.status}
                </span>
              </div>
            )}
          </div>
          {isSelected && (
            <Link2 className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
          )}
        </div>
      </button>
    )
  }

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher par titre ou code..."
          className="pl-8 text-sm py-1.5"
        />
      </div>

      {/* Selected item display */}
      {selectedProcessId && (
        <div className="p-2 bg-orange-50 border border-orange-200 rounded">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <BodySmall className="font-medium text-orange-900 truncate">
                {selectedProcessType === 'processMap' &&
                  processMaps.find((pm) => pm.id === selectedProcessId)?.title}
                {selectedProcessType === 'process' &&
                  processes.find((p) => p.id === selectedProcessId)?.title}
                {selectedProcessType === 'procedure' &&
                  procedures.find((proc) => proc.id === selectedProcessId)?.title}
              </BodySmall>
              <BodySmall className="text-xs text-orange-700 mt-0.5">
                {selectedProcessType === 'processMap' &&
                  processMaps.find((pm) => pm.id === selectedProcessId)?.code}
                {selectedProcessType === 'process' &&
                  processes.find((p) => p.id === selectedProcessId)?.code}
                {selectedProcessType === 'procedure' &&
                  procedures.find((proc) => proc.id === selectedProcessId)?.code}
                {selectedProcessType === 'process' &&
                  processes.find((p) => p.id === selectedProcessId)?.type && (
                    <span className="ml-2">
                      ({processes.find((p) => p.id === selectedProcessId)?.type})
                    </span>
                  )}
              </BodySmall>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="text-orange-600 hover:text-orange-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('process')}
          className={`px-3 py-1.5 text-xs font-medium transition-colors ${
            activeTab === 'process'
              ? 'text-orange-600 border-b-2 border-orange-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Processus ({filteredProcesses.length})
        </button>
        <button
          onClick={() => setActiveTab('processMap')}
          className={`px-3 py-1.5 text-xs font-medium transition-colors ${
            activeTab === 'processMap'
              ? 'text-orange-600 border-b-2 border-orange-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Cartes ({filteredProcessMaps.length})
        </button>
        <button
          onClick={() => setActiveTab('procedure')}
          className={`px-3 py-1.5 text-xs font-medium transition-colors ${
            activeTab === 'procedure'
              ? 'text-orange-600 border-b-2 border-orange-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Procédures ({filteredProcedures.length})
        </button>
      </div>

      {/* List */}
      <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
        {activeTab === 'process' &&
          (filteredProcesses.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              Aucun processus trouvé
            </div>
          ) : (
            filteredProcesses.map((process) => renderItem(process, 'process'))
          ))}
        {activeTab === 'processMap' &&
          (filteredProcessMaps.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              Aucune carte trouvée
            </div>
          ) : (
            filteredProcessMaps.map((pm) => renderItem(pm, 'processMap'))
          ))}
        {activeTab === 'procedure' &&
          (filteredProcedures.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              Aucune procédure trouvée
            </div>
          ) : (
            filteredProcedures.map((proc) => renderItem(proc, 'procedure'))
          ))}
      </div>
    </div>
  )
}

