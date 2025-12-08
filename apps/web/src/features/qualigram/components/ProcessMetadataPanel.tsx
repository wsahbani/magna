/**
 * ProcessMetadataPanel Component
 * Panel showing Process metadata with tabs for Actors, IO, Indicators, Risks, Documents
 */

import { Heading3, Body, BodySmall } from '@repo/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs'
import { ProcessActorsTab } from '../../processes/components/ProcessActorsTab'
import { ProcessIOTab } from './ProcessIOTab'
import { ProcessIndicatorsTab } from './ProcessIndicatorsTab'
import { ProcessRisksTab } from './ProcessRisksTab'
import type { Process } from '../../processes/types/process.types'

interface ProcessMetadataPanelProps {
  processId: string
  process: Process
}

export function ProcessMetadataPanel({
  processId,
  process,
}: ProcessMetadataPanelProps) {
  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <Heading3 className="mb-2">Métadonnées Process</Heading3>
        <div className="space-y-2">
          <div>
            <BodySmall className="text-gray-500 text-xs">Code</BodySmall>
            <Body className="text-sm">{process.code}</Body>
          </div>
          <div>
            <BodySmall className="text-gray-500 text-xs">Titre</BodySmall>
            <Body className="text-sm">{process.title || process.name}</Body>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <Tabs defaultValue="general" className="flex-1 flex flex-col h-full">
          <TabsList className="grid grid-cols-6 mx-4 mt-2">
            <TabsTrigger value="general" className="text-xs">Général</TabsTrigger>
            <TabsTrigger value="actors" className="text-xs">Acteurs</TabsTrigger>
            <TabsTrigger value="io" className="text-xs">IO</TabsTrigger>
            <TabsTrigger value="indicators" className="text-xs">Indicateurs</TabsTrigger>
            <TabsTrigger value="risks" className="text-xs">Risques</TabsTrigger>
            <TabsTrigger value="documents" className="text-xs">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="flex-1 overflow-y-auto p-4 space-y-4">
            {process.description && (
              <div>
                <BodySmall className="text-gray-500 mb-1">Description</BodySmall>
                <Body className="text-sm">{process.description}</Body>
              </div>
            )}
            {process.objectif && (
              <div>
                <BodySmall className="text-gray-500 mb-1">Objectif</BodySmall>
                <Body className="text-sm">{process.objectif}</Body>
              </div>
            )}
            {process.perimetre && (
              <div>
                <BodySmall className="text-gray-500 mb-1">Périmètre</BodySmall>
                <Body className="text-sm">{process.perimetre}</Body>
              </div>
            )}
            {process.finalite && (
              <div>
                <BodySmall className="text-gray-500 mb-1">Finalité</BodySmall>
                <Body className="text-sm">{process.finalite}</Body>
              </div>
            )}
            {!process.description && !process.objectif && !process.perimetre && !process.finalite && (
              <div className="text-center py-8 text-gray-500">
                <BodySmall>Aucune information générale</BodySmall>
              </div>
            )}
          </TabsContent>

          <TabsContent value="actors" className="flex-1 overflow-y-auto p-4">
            <ProcessActorsTab processId={processId} />
          </TabsContent>

          <TabsContent value="io" className="flex-1 overflow-y-auto p-4">
            <ProcessIOTab processId={processId} />
          </TabsContent>

          <TabsContent value="indicators" className="flex-1 overflow-y-auto p-4">
            <ProcessIndicatorsTab processId={processId} />
          </TabsContent>

          <TabsContent value="risks" className="flex-1 overflow-y-auto p-4">
            <ProcessRisksTab processId={processId} />
          </TabsContent>

          <TabsContent value="documents" className="flex-1 overflow-y-auto p-4">
            <div className="text-center py-8 text-gray-500">
              <BodySmall>Gestion des documents à venir</BodySmall>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

