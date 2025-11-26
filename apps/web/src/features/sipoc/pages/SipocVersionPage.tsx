import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, GitBranch } from 'lucide-react';
import { Button } from '@repo/ui';
import { Heading1, Body } from '@repo/ui';
import { SipocVersionManager } from '../components/SipocVersionManager';
import { SipocEditor } from '../components/SipocEditor';
import { useSipocDiagram } from '../hooks/useSipoc';

export const SipocVersionPage = () => {
  const { sipocId } = useParams<{ sipocId: string }>();
  const navigate = useNavigate();
  const [selectedVersionId, setSelectedVersionId] = useState<string>();

  const { data: sipoc, isLoading } = useSipocDiagram(sipocId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!sipoc || !sipocId) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="text-center">
          <Heading1 className="mb-4">SIPOC non trouvé</Heading1>
          <Button onClick={() => navigate('/sipoc')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
            <Heading1>{sipoc.title}</Heading1>
          </div>
          {sipoc.description && <Body className="text-gray-600">{sipoc.description}</Body>}
        </div>
        <Button variant="outline" onClick={() => navigate(`/sipoc/${sipocId}`)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au SIPOC
        </Button>
      </div>

      {/* Gestionnaire de versions */}
      <SipocVersionManager
        sipocId={sipocId}
        onVersionChange={(versionId) => {
          setSelectedVersionId(versionId);
          console.log('Version sélectionnée:', versionId);
        }}
      />

      {/* Aperçu du SIPOC pour la version sélectionnée */}
      {selectedVersionId && (
        <div className="border-t pt-6 sm:pt-8">
          <Heading1 className="mb-4">Aperçu de la version</Heading1>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <Body className="text-gray-500 text-center py-8">
              Éditeur SIPOC pour la version {selectedVersionId}
              <br />
              <span className="text-xs sm:text-sm">
                (Intégrez ici le SipocEditor avec versionId)
              </span>
            </Body>
          </div>
        </div>
      )}
    </div>
  );
};
