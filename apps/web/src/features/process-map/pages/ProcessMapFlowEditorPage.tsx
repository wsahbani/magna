/**
 * ProcessMapFlowEditorPage
 * Full-screen editor page for ProcessMap FlowDiagram
 * No header, no sidebar - just the editor
 */

import { useParams, useNavigate } from '@tanstack/react-router';
import { ProcessMapFlowDiagram } from '../components/ProcessMapFlowDiagram';
import { useProcessMap } from '../hooks/useProcessMaps';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@repo/ui';

export default function ProcessMapFlowEditorPage() {
  const { id } = useParams({ from: '/process-maps/$id/flow' });
  const navigate = useNavigate();
  const { data: processMap, isLoading } = useProcessMap(id);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!processMap) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-gray-600 mb-4">La carte des processus demandée n'existe pas.</p>
        <Button
          onClick={() => navigate({ to: '/process-maps' })}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50 flex flex-col">
      {/* Minimal header with back button */}
      <div className="absolute top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate({ to: '/process-maps/$id', params: { id: processMap.id } })}
          className="bg-white shadow-lg"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
      </div>

      {/* Full-screen Flow Editor */}
      <div className="flex-1 w-full overflow-hidden">
        <ProcessMapFlowDiagram processMapId={processMap.id} />
      </div>
    </div>
  );
}

