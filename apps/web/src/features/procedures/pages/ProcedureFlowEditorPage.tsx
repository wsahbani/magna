/**
 * ProcedureFlowEditorPage
 * Full-screen editor page for Procedure FlowDiagram (Level 3)
 * No header, no sidebar - just the editor
 */

import { useParams, useNavigate } from '@tanstack/react-router'
import { ProcedureFlowDiagram } from '../components/ProcedureFlowDiagram'
import { procedureApi } from '../../../lib/api/procedure.api'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@repo/ui'

export default function ProcedureFlowEditorPage() {
  const { id } = useParams({ strict: false })
  const navigate = useNavigate()
  const { data: procedure, isLoading } = useQuery({
    queryKey: ['procedure', id],
    queryFn: () => procedureApi.getProcedureById(id!),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    )
  }

  if (!procedure) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-gray-600 mb-4">La procédure demandée n'existe pas.</p>
        <Button
          onClick={() => navigate({ to: '/procedures-level3' })}
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
          onClick={() => navigate({ to: '/procedures-level3/$id', params: { id: procedure.id } })}
          className="bg-white shadow-lg"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
      </div>

      {/* Full-screen Flow Editor */}
      <div className="flex-1 w-full overflow-hidden">
        <ProcedureFlowDiagram procedureId={procedure.id} />
      </div>
    </div>
  )
}

