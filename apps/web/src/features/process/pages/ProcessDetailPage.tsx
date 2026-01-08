/**
 * ProcessDetailPage
 * Page for viewing a Process with its FlowDiagram in read-only mode
 */

import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { PageWrapper, DetailSidebar, DetailFlowViewer } from '../../../components/layout'
import { ProcessFlowDiagram } from '../components/ProcessFlowDiagram'
import { useProcess } from '../hooks/useProcesses'
import { Workflow, Edit, ArrowLeft, CheckCircle2, Clock, Users, XCircle, FileText, Info } from 'lucide-react'
import { Button, Body, BodySmall, Caption, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@repo/ui'
import { useNavigate } from '@tanstack/react-router'
import { ProcessType, ProcessStatus } from '../types/enums'
import { useAuth } from '../../auth/context/AuthContext'
import { ProcessValidationDialog } from '../components/ProcessValidationDialog'
import { useProcessValidationRequests } from '../hooks/useProcessValidation'
import { ValidationStatusBadge } from '../components/ValidationStatusBadge'
import type { MetadataItem, DetailSection } from '../../../components/layout/DetailSidebar'

export default function ProcessDetailPage() {
  const { id } = useParams({ from: '/processes-level2/$id' })
  const navigate = useNavigate()
  const { data: process, isLoading } = useProcess(id)
  const { user } = useAuth()
  const [validationDialogOpen, setValidationDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const { data: validationRequests = [] } = useProcessValidationRequests(
    process?.id,
  )

  if (isLoading) {
    return (
      <PageWrapper
        title="Chargement..."
        description="Chargement du processus"
      >
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </PageWrapper>
    )
  }

  if (!process) {
    return (
      <PageWrapper title="Processus introuvable" description="">
        <div className="text-center py-12">
          <Body>Le processus demandé n'existe pas.</Body>
          <Button
            onClick={() => navigate({ to: '/processes-level2' })}
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
      title={process.title}
      description={process.description || 'Processus métier (Niveau 2)'}
      breadcrumbs={[
        { label: 'Processus', icon: <Workflow className="w-4 h-4" /> },
        { label: process.title },
      ]}
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/processes-level2' })}
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
            variant="outline"
            onClick={() => navigate({ to: '/processes/$processId/fip', params: { processId: process.id } })}
            className="border-blue-300 text-blue-600 hover:bg-blue-50"
          >
            <FileText className="h-4 w-4 mr-2" />
            Voir FIP
          </Button>
          <Button
            onClick={() => {
              // Navigate to SIPOC flow if type is SIPOC, otherwise to FlowDiagram editor
              if (process.type === ProcessType.SIPOC) {
                window.location.href = `/processes/sipoc/${process.id}?sipoc=true`
              } else {
                navigate({ to: '/processes-level2/$id/flow', params: { id: process.id } })
              }
            }}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        </div>
      }
    >
      {/* Split Layout: Details Left, Flow Right */}
      {process.type === ProcessType.SIPOC ? (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center py-12">
            <Body className="text-gray-600 mb-4">
              Ce processus est de type SIPOC. Utilisez le bouton "Modifier" pour accéder à l'éditeur SIPOC.
            </Body>
            <Button
              onClick={() => {
                window.location.href = `/processes/sipoc/${process.id}?sipoc=true`
              }}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              Ouvrir l'éditeur SIPOC
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative h-[calc(100vh-12rem)]">
          {/* Floating Info Button */}
          <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white border-orange-300"
              >
                <Info className="h-5 w-5 text-orange-600" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[600px] max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Détails du processus</DialogTitle>
                <DialogDescription>
                  Informations et statut de validation
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <DetailSidebar
                  metadata={[
                {
                  label: 'Code',
                  value: process.code,
                },
                {
                  label: 'Type',
                  value: process.type,
                },
                {
                  label: 'Statut',
                  value: process.status,
                },
                ...(process.processMap
                  ? [
                      {
                        label: 'Carte des processus',
                        value: process.processMap.title,
                      },
                    ]
                  : []),
                ...(process.workspace
                  ? [
                      {
                        label: 'Espace de travail',
                        value: process.workspace.name,
                      },
                    ]
                  : []),
                ...(process.department
                  ? [
                      {
                        label: 'Département',
                        value: process.department.name,
                      },
                    ]
                  : []),
                ...(process.priority
                  ? [
                      {
                        label: 'Priorité',
                        value: process.priority,
                      },
                    ]
                  : []),
                ...(process.confidentiality
                  ? [
                      {
                        label: 'Confidentialité',
                        value: process.confidentiality,
                      },
                    ]
                  : []),
                {
                  label: 'Procédures',
                  value: process._count?.procedures || 0,
                },
              ]}
              sections={[
                ...(process.description
                  ? [
                      {
                        title: 'Description',
                        content: <BodySmall className="text-gray-700">{process.description}</BodySmall>,
                      },
                    ]
                  : []),
                ...(process.objectif
                  ? [
                      {
                        title: 'Objectif',
                        content: <BodySmall className="text-gray-700">{process.objectif}</BodySmall>,
                      },
                    ]
                  : []),
                ...(process.perimetre
                  ? [
                      {
                        title: 'Périmètre',
                        content: <BodySmall className="text-gray-700">{process.perimetre}</BodySmall>,
                      },
                    ]
                  : []),
                ...(process.finalite
                  ? [
                      {
                        title: 'Finalité',
                        content: <BodySmall className="text-gray-700">{process.finalite}</BodySmall>,
                      },
                    ]
                  : []),
                ...(process.status === ProcessStatus.DRAFT || process.status === ProcessStatus.IN_REVIEW
                  ? validationRequests.length > 0
                    ? [
                        {
                          title: 'Statut de validation',
                          icon: <CheckCircle2 className="h-5 w-5" />,
                          content: (
                            <div className="space-y-4">
                              <div className="flex items-center gap-3 mb-4">
                                <ValidationStatusBadge processId={process.id} compact={false} />
                                {validationRequests.length > 0 && (
                                  <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1.5">
                                      <Users className="w-4 h-4 text-gray-400" />
                                      <Caption className="text-gray-600">
                                        {validationRequests.length} validateur
                                        {validationRequests.length > 1 ? 's' : ''}
                                      </Caption>
                                    </div>
                                    {validationRequests.filter((req) => req.status === 'APPROVED').length > 0 && (
                                      <div className="flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                        <Caption className="text-green-700">
                                          {validationRequests.filter((req) => req.status === 'APPROVED').length}{' '}
                                          approuvé
                                          {validationRequests.filter((req) => req.status === 'APPROVED').length > 1
                                            ? 's'
                                            : ''}
                                        </Caption>
                                      </div>
                                    )}
                                    {validationRequests.filter((req) => req.status === 'PENDING').length > 0 && (
                                      <div className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4 text-orange-600" />
                                        <Caption className="text-orange-700">
                                          {validationRequests.filter((req) => req.status === 'PENDING').length} en
                                          attente
                                        </Caption>
                                      </div>
                                    )}
                                    {validationRequests.filter((req) => req.status === 'REJECTED').length > 0 && (
                                      <div className="flex items-center gap-1.5">
                                        <XCircle className="w-4 h-4 text-red-600" />
                                        <Caption className="text-red-700">
                                          {validationRequests.filter((req) => req.status === 'REJECTED').length} rejeté
                                          {validationRequests.filter((req) => req.status === 'REJECTED').length > 1
                                            ? 's'
                                            : ''}
                                        </Caption>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          ),
                        },
                      ]
                    : []
                  : []),
              ]}
                />
              </div>
            </DialogContent>
          </Dialog>

          {/* Full Width Flow */}
          {process.type === ProcessType.FLOW && (
            <div className="w-full h-full">
              <DetailFlowViewer>
                <ProcessFlowDiagram processId={process.id} readOnly={true} />
              </DetailFlowViewer>
            </div>
          )}
        </div>
      )}

      {/* Validation Dialog */}
      {process && validationDialogOpen && (
        <ProcessValidationDialog
          process={process}
          open={validationDialogOpen}
          onOpenChange={setValidationDialogOpen}
        />
      )}
    </PageWrapper>
  )
}

