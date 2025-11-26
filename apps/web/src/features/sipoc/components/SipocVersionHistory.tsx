import { History, User, Calendar, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@repo/ui';
import { Heading3, Body, BodySmall, Caption } from '@repo/ui';
import { SipocHistory } from '../types/sipoc.types';

interface SipocVersionHistoryProps {
  history: SipocHistory[];
  className?: string;
}

const getChangeTypeIcon = (changeType?: string) => {
  switch (changeType) {
    case 'CREATE':
    case 'MIGRATION':
      return <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />;
    case 'UPDATE':
      return <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />;
    case 'PUBLISH':
      return <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />;
    case 'ARCHIVE':
      return <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />;
    default:
      return <History className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />;
  }
};

const getChangeTypeLabel = (changeType?: string): string => {
  switch (changeType) {
    case 'CREATE':
      return 'Création';
    case 'UPDATE':
      return 'Modification';
    case 'PUBLISH':
      return 'Publication';
    case 'ARCHIVE':
      return 'Archivage';
    case 'MIGRATION':
      return 'Migration';
    default:
      return changeType || 'Modification';
  }
};

const getChangeTypeColor = (changeType?: string): string => {
  switch (changeType) {
    case 'CREATE':
    case 'MIGRATION':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'UPDATE':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'PUBLISH':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'ARCHIVE':
      return 'bg-gray-50 text-gray-600 border-gray-200';
    default:
      return 'bg-gray-50 text-gray-600 border-gray-200';
  }
};

export const SipocVersionHistory = ({ history, className }: SipocVersionHistoryProps) => {
  if (!history || history.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            <Heading3>Historique</Heading3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 sm:py-8">
            <BodySmall className="text-gray-500">Aucun historique disponible</BodySmall>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Trier par date décroissante
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime()
  );

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          <Heading3>Historique ({history.length})</Heading3>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          {sortedHistory.map((item) => (
            <div
              key={item.history_id}
              className="flex gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* Icône du type de changement */}
              <div className="flex-shrink-0 mt-0.5 sm:mt-1">
                {getChangeTypeIcon(item.change_type)}
              </div>

              {/* Contenu */}
              <div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
                {/* Type et date */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full border text-[10px] sm:text-xs font-medium ${getChangeTypeColor(item.change_type)}`}
                  >
                    {getChangeTypeLabel(item.change_type)}
                  </span>
                  <Caption className="text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.changed_at).toLocaleString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Caption>
                </div>

                {/* Description */}
                {item.change_description && (
                  <Body className="text-gray-700">{item.change_description}</Body>
                )}

                {/* Utilisateur */}
                <Caption className="text-gray-500 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  Par {item.changed_by}
                </Caption>

                {/* États précédent et nouveau (si disponibles) */}
                {(item.previous_state || item.new_state) && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs sm:text-sm text-orange-600 hover:text-orange-700">
                      Voir les détails
                    </summary>
                    <div className="mt-2 space-y-2 text-xs sm:text-sm">
                      {item.previous_state && (
                        <div className="bg-red-50 p-2 rounded border border-red-200">
                          <BodySmall className="font-medium text-red-700 mb-1">
                            État précédent :
                          </BodySmall>
                          <pre className="text-[10px] sm:text-xs text-red-600 overflow-x-auto">
                            {JSON.stringify(item.previous_state, null, 2)}
                          </pre>
                        </div>
                      )}
                      {item.new_state && (
                        <div className="bg-green-50 p-2 rounded border border-green-200">
                          <BodySmall className="font-medium text-green-700 mb-1">
                            Nouvel état :
                          </BodySmall>
                          <pre className="text-[10px] sm:text-xs text-green-600 overflow-x-auto">
                            {JSON.stringify(item.new_state, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
