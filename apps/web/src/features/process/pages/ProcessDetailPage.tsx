/**
 * ProcessDetailPage
 * Page for viewing a Process with its FlowDiagram in read-only mode
 */

import { useParams } from '@tanstack/react-router'
import { PageWrapper } from '../../../components/layout/PageWrapper'
import { ProcessFlowDiagram } from '../components/ProcessFlowDiagram'
import { useProcess } from '../hooks/useProcesses'
import { Workflow, Edit, ArrowLeft } from 'lucide-react'
import { Button, Body, BodySmall } from '@repo/ui'
import { useNavigate } from '@tanstack/react-router'
import { ProcessType } from '../types/enums'

export default function ProcessDetailPage() {
  const { id } = useParams({ from: '/processes-level2/$id' })
  const navigate = useNavigate()
  const { data: process, isLoading } = useProcess(id)

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
      {/* Process Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <BodySmall className="text-gray-500 mb-1">Code</BodySmall>
            <Body className="font-semibold">{process.code}</Body>
          </div>
          <div>
            <BodySmall className="text-gray-500 mb-1">Type</BodySmall>
            <Body className="font-semibold">{process.type}</Body>
          </div>
          <div>
            <BodySmall className="text-gray-500 mb-1">Statut</BodySmall>
            <Body className="font-semibold">{process.status}</Body>
          </div>
          {process.processMap && (
            <div>
              <BodySmall className="text-gray-500 mb-1">Carte des processus</BodySmall>
              <Body className="font-semibold">{process.processMap.title}</Body>
            </div>
          )}
          {process.workspace && (
            <div>
              <BodySmall className="text-gray-500 mb-1">Espace de travail</BodySmall>
              <Body className="font-semibold">{process.workspace.name}</Body>
            </div>
          )}
          {process.department && (
            <div>
              <BodySmall className="text-gray-500 mb-1">Département</BodySmall>
              <Body className="font-semibold">{process.department.name}</Body>
            </div>
          )}
          {process.priority && (
            <div>
              <BodySmall className="text-gray-500 mb-1">Priorité</BodySmall>
              <Body className="font-semibold">{process.priority}</Body>
            </div>
          )}
          {process.confidentiality && (
            <div>
              <BodySmall className="text-gray-500 mb-1">Confidentialité</BodySmall>
              <Body className="font-semibold">{process.confidentiality}</Body>
            </div>
          )}
          <div>
            <BodySmall className="text-gray-500 mb-1">Procédures</BodySmall>
            <Body className="font-semibold">{process._count?.procedures || 0}</Body>
          </div>
        </div>
        {process.description && (
          <div className="mt-4">
            <BodySmall className="text-gray-500 mb-1">Description</BodySmall>
            <Body>{process.description}</Body>
          </div>
        )}
        {process.objectif && (
          <div className="mt-4">
            <BodySmall className="text-gray-500 mb-1">Objectif</BodySmall>
            <Body>{process.objectif}</Body>
          </div>
        )}
        {process.perimetre && (
          <div className="mt-4">
            <BodySmall className="text-gray-500 mb-1">Périmètre</BodySmall>
            <Body>{process.perimetre}</Body>
          </div>
        )}
        {process.finalite && (
          <div className="mt-4">
            <BodySmall className="text-gray-500 mb-1">Finalité</BodySmall>
            <Body>{process.finalite}</Body>
          </div>
        )}
      </div>

      {/* FlowDiagram Viewer (ReadOnly) - Only show for FLOW type */}
      {process.type === ProcessType.FLOW ? (
        <div className="bg-white rounded-lg shadow" style={{ height: 'calc(100vh - 20rem)' }}>
          <ProcessFlowDiagram processId={process.id} readOnly={true} />
        </div>
      ) : process.type === ProcessType.SIPOC ? (
        <div className="bg-white rounded-lg shadow p-6">
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
      ) : null}
    </PageWrapper>
  )
}

