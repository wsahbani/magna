import { useParams, useNavigate } from '@tanstack/react-router'
import { PageWrapper } from '../../../components/layout/PageWrapper'
import { Button } from '@repo/ui/components/ui/button'
import { Heading1, Body, BodySmall } from '@repo/ui'
import { ArrowLeft, CheckCircle, FileText } from 'lucide-react'
import { ProcedureEditor } from '../components/ProcedureEditor'
import {
  useProcedure,
  useProcedureNodes,
  useProcedureEdges,
  useProcedureLanes,
  useProcedureVersions,
  usePublishProcedure,
  useValidateProcedure,
} from '../hooks/useProcedures'
import { useProcess } from '../../processes/hooks/useProcesses'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs'
import { useState } from 'react'

export default function ProcedureDetailPage() {
  const { id } = useParams({ from: '/procedures/$id' })
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('editor')

  const { data: procedure, isLoading: isLoadingProcedure } = useProcedure(id)
  const { data: nodes = [], isLoading: isLoadingNodes } = useProcedureNodes(id)
  const { data: edges = [], isLoading: isLoadingEdges } = useProcedureEdges(id)
  const { data: lanes = [], isLoading: isLoadingLanes } = useProcedureLanes(id)

  const publishMutation = usePublishProcedure()
  const validateMutation = useValidateProcedure()

  const processId = procedure?.processId
  const { data: process } = useProcess(processId)

  const isLoading =
    isLoadingProcedure || isLoadingNodes || isLoadingEdges || isLoadingLanes

  if (isLoading) {
    return (
      <PageWrapper title="Chargement...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </PageWrapper>
    )
  }

  if (!procedure) {
    return (
      <PageWrapper title="Procédure non trouvée">
        <div className="text-center py-12">
          <Body>La procédure demandée n'existe pas</Body>
          <Button
            onClick={() => navigate({ to: '/processes' })}
            className="mt-4"
          >
            Retour aux processus
          </Button>
        </div>
      </PageWrapper>
    )
  }

  const handlePublish = async () => {
    if (
      window.confirm(
        'Êtes-vous sûr de vouloir publier cette procédure ? Elle sera visible par tous les utilisateurs.',
      )
    ) {
      await publishMutation.mutateAsync(id!)
      alert('Procédure publiée avec succès')
    }
  }

  const handleValidate = async () => {
    const result = await validateMutation.mutateAsync(id!)
    if (result.isValid) {
      alert('✓ La procédure est valide')
    } else {
      alert(
        `✗ La procédure contient ${result.errors.length} erreur(s) et ${result.warnings.length} avertissement(s)`,
      )
    }
  }

  return (
    <PageWrapper
      title={procedure.name}
      description={`Procédure ${procedure.version} - ${process?.title || ''}`}
      breadcrumbs={[
        {
          label: 'Processus',
          icon: <FileText className="w-4 h-4" />,
          onClick: () => navigate({ to: '/processes' }),
        },
        {
          label: process?.title || 'Processus',
        },
        { label: procedure.name },
      ]}
      actions={
        <div className="flex gap-2">
          <Button
            onClick={handleValidate}
            variant="outline"
            disabled={validateMutation.isPending}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Valider
          </Button>
          {procedure.status === 'VALIDATED' && (
            <Button
              onClick={handlePublish}
              className="bg-orange-600 hover:bg-orange-700"
              disabled={publishMutation.isPending}
            >
              Publier
            </Button>
          )}
        </div>
      }
    >
      <div className="h-[calc(100vh-12rem)]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList>
            <TabsTrigger value="editor">Éditeur</TabsTrigger>
            <TabsTrigger value="versions">Versions</TabsTrigger>
            <TabsTrigger value="info">Informations</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="h-[calc(100%-3rem)] mt-4">
            <ProcedureEditor
              procedureId={id!}
              initialNodes={nodes}
              initialEdges={edges}
              initialLanes={lanes}
              onSave={() => {
                // Refresh data
                window.location.reload()
              }}
            />
          </TabsContent>

          <TabsContent value="versions" className="mt-4">
            <VersionsTab procedureId={id!} />
          </TabsContent>

          <TabsContent value="info" className="mt-4">
            <InfoTab procedure={procedure} />
          </TabsContent>
        </Tabs>
      </div>
    </PageWrapper>
  )
}

function VersionsTab({ procedureId }: { procedureId: string }) {
  const { data: versions = [] } = useProcedureVersions(procedureId)

  return (
    <div className="space-y-4">
      <Heading1 className="text-lg">Versions</Heading1>
      {versions.length === 0 ? (
        <Body className="text-gray-500">Aucune version enregistrée</Body>
      ) : (
        <div className="space-y-2">
          {versions.map((version) => (
            <div
              key={version.id}
              className="p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <Body className="font-medium">Version {version.version}</Body>
                  <BodySmall className="text-gray-500">
                    {version.changeLog || 'Aucune description'}
                  </BodySmall>
                  {version.validator && (
                    <BodySmall className="text-gray-500">
                      Validé par: {version.validator.firstName}{' '}
                      {version.validator.lastName}
                    </BodySmall>
                  )}
                </div>
                <BodySmall className="text-gray-500">
                  {new Date(version.createdAt).toLocaleDateString('fr-FR')}
                </BodySmall>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function InfoTab({ procedure }: { procedure: any }) {
  return (
    <div className="space-y-4">
      <Heading1 className="text-lg">Informations</Heading1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <BodySmall className="text-gray-500">Nom</BodySmall>
          <Body className="font-medium">{procedure.name}</Body>
        </div>
        <div>
          <BodySmall className="text-gray-500">Version</BodySmall>
          <Body className="font-medium">{procedure.version}</Body>
        </div>
        <div>
          <BodySmall className="text-gray-500">Statut</BodySmall>
          <Body className="font-medium">{procedure.status}</Body>
        </div>
        {procedure.objective && (
          <div className="col-span-2">
            <BodySmall className="text-gray-500">Objectif</BodySmall>
            <Body>{procedure.objective}</Body>
          </div>
        )}
        {procedure.scope && (
          <div className="col-span-2">
            <BodySmall className="text-gray-500">Périmètre</BodySmall>
            <Body>{procedure.scope}</Body>
          </div>
        )}
        {procedure.description && (
          <div className="col-span-2">
            <BodySmall className="text-gray-500">Description</BodySmall>
            <Body>{procedure.description}</Body>
          </div>
        )}
      </div>
    </div>
  )
}

