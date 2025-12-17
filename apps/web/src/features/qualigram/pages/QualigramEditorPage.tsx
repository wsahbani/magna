/**
 * QualigramEditorPage
 * Main page for Qualigram Flow Editor
 */

import { useParams } from '@tanstack/react-router'
import { PageWrapper } from '../../../components/layout/PageWrapper'
import { QualigramFlowEditor } from '../components/QualigramFlowEditor'

export default function QualigramEditorPage() {
  // Support multiple route patterns - params may be undefined
  const params = useParams({ strict: false }) as {
    macroProcessId?: string
    processId?: string
    procedureId?: string
  }
  const macroProcessId = params.macroProcessId
  const processId = params.processId
  const procedureId = params.procedureId

  return (
    <PageWrapper
      title="Éditeur Qualigram"
      description="Éditeur de processus Qualigram avec hiérarchie 3 niveaux"
    >
      <div className="h-[calc(100vh-200px)]">
        <QualigramFlowEditor
          initialMacroProcessId={macroProcessId}
          initialProcessId={processId}
          initialProcedureId={procedureId}
          onSave={() => {
            console.log('Saved')
          }}
        />
      </div>
    </PageWrapper>
  )
}

