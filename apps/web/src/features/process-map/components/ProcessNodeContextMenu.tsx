/**
 * ProcessNodeContextMenu Component
 * Context menu for Process nodes (mainProcess, supportProcess, managementProcess) in Process Map Flow
 */

import { Plus, Trash2 } from 'lucide-react'

interface ProcessNodeContextMenuProps {
  nodeId: string
  nodeType: string
  position: { x: number; y: number }
  onCreateProcess: (nodeId: string) => void
  onDelete: (nodeId: string) => void
  onClose: () => void
}

export function ProcessNodeContextMenu({
  nodeId,
  nodeType,
  position,
  onCreateProcess,
  onDelete,
  onClose,
}: ProcessNodeContextMenuProps) {
  const handleCreateProcess = () => {
    onCreateProcess(nodeId)
    onClose()
  }

  const handleDelete = () => {
    onDelete(nodeId)
    onClose()
  }

  return (
    <div
      className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px] py-1"
      style={{
        top: position.y,
        left: position.x,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={handleCreateProcess}
        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Créer Process
      </button>
      <div className="border-t border-gray-200 my-1" />
      <button
        onClick={handleDelete}
        className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
      >
        <Trash2 className="w-4 h-4" />
        Supprimer
      </button>
    </div>
  )
}
