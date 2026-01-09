/**
 * ProcessMapDetailPage
 * Page for viewing and editing a ProcessMap with its FlowDiagram
 */

import { useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { PageWrapper, DetailSidebar, DetailFlowViewer } from '../../../components/layout';
import { ProcessMapFlowDiagram } from '../components/ProcessMapFlowDiagram';
import { useProcessMap } from '../hooks/useProcessMaps';
import { MapPin, Edit, ArrowLeft, CheckCircle2, Info } from 'lucide-react';
import { Button, Body, BodySmall, Caption, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@repo/ui';
import { useNavigate } from '@tanstack/react-router';
import { ProcessStatus } from '../types/enums';
import { useAuth } from '../../auth/context/AuthContext';
import { ProcessMapValidationDialog } from '../components/ProcessMapValidationDialog';
import { ProcessMapValidationStatusBadge } from '../components/ProcessMapValidationStatusBadge';
import { useProcessMapValidationRequests } from '../hooks/useProcessMapValidation';
import type { MetadataItem, DetailSection } from '../../../components/layout/DetailSidebar';

export default function ProcessMapDetailPage() {
  const { id } = useParams({ from: '/process-maps/$id' });
  const navigate = useNavigate();
  const { data: processMap, isLoading } = useProcessMap(id);
  const { user } = useAuth();
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [detailsSheetOpen, setDetailsSheetOpen] = useState(false);
  
  // Fetch validation requests for this processMap
  const { data: validationRequests, isLoading: isLoadingValidationRequests } =
    useProcessMapValidationRequests(id);

  if (isLoading) {
    return (
      <PageWrapper
        title="Chargement..."
        description="Chargement de la carte des processus"
      >
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </PageWrapper>
    );
  }

  if (!processMap) {
    return (
      <PageWrapper title="Carte des Processus introuvable" description="">
        <div className="text-center py-12">
          <Body>La carte des processus demandée n'existe pas.</Body>
          <Button
            onClick={() => window.history.back()}
            className="mt-4 bg-orange-600 hover:bg-orange-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={processMap.title}
      description={processMap.description || 'Carte des processus (Niveau 1)'}
      breadcrumbs={[
        { label: 'Cartes des Processus', icon: <MapPin className="w-4 h-4" /> },
        { label: processMap.title },
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
            onClick={() => navigate({ to: '/process-maps/$id/flow', params: { id: processMap.id } })}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        </div>
      }
    >
      {/* Full Width Flow with Floating Info Button */}
      <div className="relative h-[calc(100vh-12rem)]">
        {/* Floating Info Button */}
        <Dialog open={detailsSheetOpen} onOpenChange={setDetailsSheetOpen}>
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
              <DialogTitle>Détails de la carte</DialogTitle>
              <DialogDescription>
                Informations et statut de validation
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <DetailSidebar
                metadata={[
                  {
                    label: 'Code',
                    value: processMap.code,
                  },
                  {
                    label: 'Statut',
                    value: (
                      <span className="flex items-center gap-2">
                        {processMap.status}
                        {(processMap.status === ProcessStatus.DRAFT || processMap.status === ProcessStatus.IN_REVIEW) && (
                          <ProcessMapValidationStatusBadge processMapId={processMap.id} compact={false} />
                        )}
                      </span>
                    ),
                  },
                ]}
                sections={[
                  ...(processMap.description
                    ? [
                        {
                          title: 'Description',
                          content: <BodySmall className="text-gray-700">{processMap.description}</BodySmall>,
                        },
                      ]
                    : []),
                  ...(processMap.status === ProcessStatus.DRAFT ||
                  processMap.status === ProcessStatus.IN_REVIEW
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
          </DialogContent>
        </Dialog>

        {/* Full Width Flow */}
        <div className="w-full h-full">
          <DetailFlowViewer>
            <ProcessMapFlowDiagram processMapId={processMap.id} readOnly={true} />
          </DetailFlowViewer>
        </div>
      </div>

      {/* Validation Dialog */}
      {processMap && validationDialogOpen && (
        <ProcessMapValidationDialog
          processMap={processMap}
          open={validationDialogOpen}
          onOpenChange={setValidationDialogOpen}
        />
      )}
    </PageWrapper>
  );
}

