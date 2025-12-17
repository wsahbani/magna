/**
 * ProcedureDetailPage
 * Page for viewing a Procedure with its FlowDiagram in read-only mode
 */

import { useParams } from '@tanstack/react-router'
import { PageWrapper } from '../../../components/layout/PageWrapper'
import { ProcedureFlowDiagram } from '../components/ProcedureFlowDiagram'
import { procedureApi } from '../../../lib/api/procedure.api'
import { useQuery } from '@tanstack/react-query'
import { FileText, Edit, ArrowLeft } from 'lucide-react'
import { Button, Body, BodySmall } from '@repo/ui'
import { useNavigate } from '@tanstack/react-router'

export default function ProcedureDetailPage() {
  const { id } = useParams({ strict: false })
  const navigate = useNavigate()
  const { data: procedure, isLoading } = useQuery({
    queryKey: ['procedure', id],
    queryFn: () => procedureApi.getProcedureById(id!),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <PageWrapper
        title="Chargement..."
        description="Chargement de la procédure"
      >
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </PageWrapper>
    )
  }

  if (!procedure) {
    return (
      <PageWrapper title="Procédure introuvable" description="">
        <div className="text-center py-12">
          <Body>La procédure demandée n'existe pas.</Body>
          <Button
            onClick={() => navigate({ to: '/procedures-level3' })}
            className="mt-4 bg-orange-600 hover:bg-orange-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la liste
          </Button>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper
      title={procedure.name || 'Procédure'}
      description={procedure.description || 'Procédure opérationnelle (Niveau 3)'}
      breadcrumbs={[
        { label: 'Procédures', icon: <FileText className="w-4 h-4" /> },
        { label: procedure.name || 'Procédure' },
      ]}
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/procedures-level3' })}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <Button
            onClick={() => navigate({ to: '/procedures-level3/$id/flow', params: { id: procedure.id } })}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        </div>
      }
    >
      {/* Procedure Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <BodySmall className="text-gray-500 mb-1">Code</BodySmall>
            <Body className="font-semibold">{procedure.code || 'N/A'}</Body>
          </div>
          <div>
            <BodySmall className="text-gray-500 mb-1">Statut</BodySmall>
            <Body className="font-semibold">{procedure.status}</Body>
          </div>
          {procedure.process && (
            <div>
              <BodySmall className="text-gray-500 mb-1">Processus</BodySmall>
              <Body className="font-semibold">{procedure.process.title}</Body>
            </div>
          )}
          {procedure.version && (
            <div>
              <BodySmall className="text-gray-500 mb-1">Version</BodySmall>
              <Body className="font-semibold">{procedure.version}</Body>
            </div>
          )}
          {procedure.validatedBy && (
            <div>
              <BodySmall className="text-gray-500 mb-1">Validé par</BodySmall>
              <Body className="font-semibold">{procedure.validatedBy}</Body>
            </div>
          )}
          {procedure.validatedAt && (
            <div>
              <BodySmall className="text-gray-500 mb-1">Date de validation</BodySmall>
              <Body className="font-semibold">
                {new Date(procedure.validatedAt).toLocaleDateString('fr-FR')}
              </Body>
            </div>
          )}
          {procedure.effectiveDate && (
            <div>
              <BodySmall className="text-gray-500 mb-1">Date d'entrée en vigueur</BodySmall>
              <Body className="font-semibold">
                {new Date(procedure.effectiveDate).toLocaleDateString('fr-FR')}
              </Body>
            </div>
          )}
          {procedure.expirationDate && (
            <div>
              <BodySmall className="text-gray-500 mb-1">Date d'expiration</BodySmall>
              <Body className="font-semibold">
                {new Date(procedure.expirationDate).toLocaleDateString('fr-FR')}
              </Body>
            </div>
          )}
        </div>
        {procedure.description && (
          <div className="mt-4">
            <BodySmall className="text-gray-500 mb-1">Description</BodySmall>
            <Body>{procedure.description}</Body>
          </div>
        )}
        {procedure.objective && (
          <div className="mt-4">
            <BodySmall className="text-gray-500 mb-1">Objectif</BodySmall>
            <Body>{procedure.objective}</Body>
          </div>
        )}
        {procedure.scope && (
          <div className="mt-4">
            <BodySmall className="text-gray-500 mb-1">Périmètre</BodySmall>
            <Body>{procedure.scope}</Body>
          </div>
        )}
      </div>

      {/* FlowDiagram Viewer (ReadOnly) */}
      <div className="bg-white rounded-lg shadow" style={{ height: 'calc(100vh - 20rem)' }}>
        <ProcedureFlowDiagram procedureId={procedure.id} readOnly={true} />
      </div>
    </PageWrapper>
  )
}
