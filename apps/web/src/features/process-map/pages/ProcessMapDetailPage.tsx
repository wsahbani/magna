/**
 * ProcessMapDetailPage
 * Page for viewing and editing a ProcessMap with its FlowDiagram
 */

import { useParams } from '@tanstack/react-router';
import { PageWrapper } from '../../../components/layout/PageWrapper';
import { ProcessMapFlowDiagram } from '../components/ProcessMapFlowDiagram';
import { useProcessMap } from '../hooks/useProcessMaps';
import { MapPin, Edit, ArrowLeft } from 'lucide-react';
import { Button, Body, BodySmall } from '@repo/ui';
import { useNavigate } from '@tanstack/react-router';

export default function ProcessMapDetailPage() {
  const { id } = useParams({ from: '/process-maps/$id' });
  const navigate = useNavigate();
  const { data: processMap, isLoading } = useProcessMap(id);

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
            onClick={() => navigate({ to: '/process-maps' })}
            className="mt-4 bg-orange-600 hover:bg-orange-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la liste
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
            onClick={() => navigate({ to: '/process-maps' })}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
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
   

      {/* FlowDiagram Viewer (ReadOnly) */}
      <div className="bg-white rounded-lg shadow" style={{ height: 'calc(100vh - 20rem)' }}>
        <ProcessMapFlowDiagram processMapId={processMap.id} readOnly={true} />
      </div>
    </PageWrapper>
  );
}

