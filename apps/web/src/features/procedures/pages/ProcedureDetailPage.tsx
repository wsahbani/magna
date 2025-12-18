/**
 * ProcedureDetailPage
 * Page for viewing a Procedure with its FlowDiagram in read-only mode
 */

import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { PageWrapper } from '../../../components/layout/PageWrapper'
import { ProcedureFlowDiagram } from '../components/ProcedureFlowDiagram'
import { procedureApi } from '../../../lib/api/procedure.api'
import { useQuery } from '@tanstack/react-query'
import { FileText, Edit, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button, Body, BodySmall } from '@repo/ui'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../auth/context/AuthContext'
import { ProcedureValidationDialog } from '../components/ProcedureValidationDialog'
import { ProcedureValidationStatusBadge } from '../components/ProcedureValidationStatusBadge'
import { useProcedureValidationRequests } from '../hooks/useProcedureValidation'

export default function ProcedureDetailPage() {
  const { id } = useParams({ strict: false })
  const navigate = useNavigate()
  const { user } = useAuth()
  const [validationDialogOpen, setValidationDialogOpen] = useState(false)
  const { data: procedure, isLoading } = useQuery({
    queryKey: ['procedure', id],
    queryFn: () => procedureApi.getProcedureById(id!),
    enabled: !!id,
  })
  
  // Fetch validation requests for this procedure
  const { data: validationRequests, isLoading: isLoadingValidationRequests } =
    useProcedureValidationRequests(id || '')

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
            variant="outline"
            onClick={() => setValidationDialogOpen(true)}
            className="border-orange-300 text-orange-600 hover:bg-orange-50"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Demander validation
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
            <Body className="font-semibold flex items-center gap-2">
              {procedure.status}
              {(procedure.status === 'DRAFT' || procedure.status === 'IN_REVIEW') && (
                <ProcedureValidationStatusBadge procedureId={procedure.id} compact={false} />
              )}
            </Body>
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

      {/* Validation Requests Section */}
      {(procedure.status === 'DRAFT' || procedure.status === 'IN_REVIEW') &&
        validationRequests &&
        validationRequests.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-orange-600" />
              Statut de validation
            </h3>
            <div className="space-y-4">
              {validationRequests.map((request: any) => (
                <div
                  key={request.id}
                  className="flex items-start justify-between p-4 border border-gray-200 rounded-lg shadow-sm"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <BodySmall className="font-semibold text-gray-800">
                        {request.validator.firstName} {request.validator.lastName}
                      </BodySmall>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : request.status === 'APPROVED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {request.status === 'PENDING'
                          ? 'En attente'
                          : request.status === 'APPROVED'
                            ? 'Approuvé'
                            : 'Rejeté'}
                      </span>
                    </div>
                    {request.comment && (
                      <BodySmall className="text-gray-600 italic">"{request.comment}"</BodySmall>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* FlowDiagram Viewer (ReadOnly) */}
      <div className="bg-white rounded-lg shadow" style={{ height: 'calc(100vh - 20rem)' }}>
        <ProcedureFlowDiagram procedureId={procedure.id} readOnly={true} />
      </div>

      {/* Validation Dialog */}
      {procedure && validationDialogOpen && (
        <ProcedureValidationDialog
          procedure={procedure}
          open={validationDialogOpen}
          onOpenChange={setValidationDialogOpen}
        />
      )}
    </PageWrapper>
  )
}
