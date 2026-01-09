/**
 * ProcedureDetailPage
 * Page for viewing a Procedure with its FlowDiagram in read-only mode
 */

import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { PageWrapper, DetailSidebar, DetailFlowViewer } from '../../../components/layout'
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
import type { MetadataItem, DetailSection } from '../../../components/layout/DetailSidebar'

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
      title={procedure.title || 'Procédure'}
      description={procedure.description || 'Procédure opérationnelle (Niveau 3)'}
      breadcrumbs={[
        { label: 'Procédures', icon: <FileText className="w-4 h-4" /> },
        { label: procedure.title || 'Procédure' },
      ]}
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
       onClick={() => window.history.back()}
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
      {/* Split Layout: Details Left, Flow Right */}
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)]">
        {/* Left Sidebar - Details */}
        <div className="w-full lg:w-1/4 xl:w-1/3 overflow-y-auto pr-2">
          <DetailSidebar
            metadata={[
              {
                label: 'Code',
                value: procedure.code || 'N/A',
              },
              {
                label: 'Statut',
                value: (
                  <span className="flex items-center gap-2">
                    {procedure.status}
                    {(procedure.status === 'DRAFT' || procedure.status === 'IN_REVIEW') && (
                      <ProcedureValidationStatusBadge procedureId={procedure.id} compact={false} />
                    )}
                  </span>
                ),
              },
              ...(procedure.process
                ? [
                    {
                      label: 'Processus',
                      value: procedure.process.title,
                    },
                  ]
                : []),

              ...(procedure.validatedBy
                ? [
                    {
                      label: 'Validé par',
                      value: procedure.validatedBy,
                    },
                  ]
                : []),
              ...(procedure.validatedAt
                ? [
                    {
                      label: 'Date de validation',
                      value: new Date(procedure.validatedAt).toLocaleDateString('fr-FR'),
                    },
                  ]
                : []),
              ...(procedure.effectiveDate
                ? [
                    {
                      label: 'Date d\'entrée en vigueur',
                      value: new Date(procedure.effectiveDate).toLocaleDateString('fr-FR'),
                    },
                  ]
                : []),
              ...(procedure.expirationDate
                ? [
                    {
                      label: 'Date d\'expiration',
                      value: new Date(procedure.expirationDate).toLocaleDateString('fr-FR'),
                    },
                  ]
                : []),
            ]}
            sections={[
              ...(procedure.description
                ? [
                    {
                      title: 'Description',
                      content: <BodySmall className="text-gray-700">{procedure.description}</BodySmall>,
                    },
                  ]
                : []),
              ...(procedure.objective
                ? [
                    {
                      title: 'Objectif',
                      content: <BodySmall className="text-gray-700">{procedure.objective}</BodySmall>,
                    },
                  ]
                : []),
              ...(procedure.scope
                ? [
                    {
                      title: 'Périmètre',
                      content: <BodySmall className="text-gray-700">{procedure.scope}</BodySmall>,
                    },
                  ]
                : []),
              ...(procedure.status === 'DRAFT' || procedure.status === 'IN_REVIEW'
                ? validationRequests && validationRequests.length > 0
                  ? [
                      {
                        title: 'Statut de validation',
                        icon: <CheckCircle2 className="h-5 w-5" />,
                        content: (
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
                                    <BodySmall className="text-gray-600 italic">
                                      "{request.comment}"
                                    </BodySmall>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ),
                      },
                    ]
                  : []
                : []),
            ]}
          />
        </div>

        {/* Right Side - Flow */}
        <div className="w-full lg:w-3/4 xl:w-2/3 flex-1">
          <DetailFlowViewer>
            <ProcedureFlowDiagram procedureId={procedure.id} readOnly={true} />
          </DetailFlowViewer>
        </div>
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
