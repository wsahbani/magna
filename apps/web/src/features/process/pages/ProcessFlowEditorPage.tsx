/**
 * ProcessFlowEditorPage
 * Full-screen editor page for Process FlowDiagram (Level 2)
 * No header, no sidebar - just the editor
 */

import { useParams, useNavigate } from '@tanstack/react-router'
import { ProcessFlowDiagram } from '../components/ProcessFlowDiagram'
import { useProcess } from '../hooks/useProcesses'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@repo/ui'

export default function ProcessFlowEditorPage() {
  const { id } = useParams({ from: '/processes-level2/$id/flow' })
  const navigate = useNavigate()
  const { data: process, isLoading } = useProcess(id)

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    )
  }

  if (!process) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-gray-600 mb-4">Le processus demandé n'existe pas.</p>
        <Button
          onClick={() => navigate({ to: '/processes-level2' })}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50 flex flex-col">
      {/* Minimal header with back button */}
      <div className="absolute top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate({ to: '/processes-level2/$id', params: { id: process.id } })}
          className="bg-white shadow-lg"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
      </div>

      {/* Full-screen Flow Editor */}
      <div className="flex-1 w-full overflow-hidden">
        <ProcessFlowDiagram processId={process.id} />
      </div>
    </div>
  )
}

