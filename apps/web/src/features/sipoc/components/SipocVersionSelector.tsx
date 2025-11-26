import { Clock, GitBranch, Archive, FileText, Check } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui';
import { Body, BodySmall, Caption } from '@repo/ui';
import { SipocStatus, SipocVersion } from '../types/sipoc.types';
import { useSipocVersions } from '../hooks/useSipocVersion';

interface SipocVersionSelectorProps {
  sipocId: string;
  selectedVersionId?: string;
  onVersionChange: (versionId: string) => void;
  className?: string;
}

const getStatusIcon = (status: SipocStatus) => {
  switch (status) {
    case SipocStatus.DRAFT:
      return <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />;
    case SipocStatus.REVIEW:
      return <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />;
    case SipocStatus.APPROVED:
      return <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />;
    case SipocStatus.PUBLISHED:
      return <GitBranch className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />;
    case SipocStatus.ARCHIVED:
      return <Archive className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />;
    default:
      return null;
  }
};

const getStatusLabel = (status: SipocStatus): string => {
  switch (status) {
    case SipocStatus.DRAFT:
      return 'Brouillon';
    case SipocStatus.REVIEW:
      return 'En révision';
    case SipocStatus.APPROVED:
      return 'Approuvé';
    case SipocStatus.PUBLISHED:
      return 'Publié';
    case SipocStatus.ARCHIVED:
      return 'Archivé';
    default:
      return status;
  }
};

const getStatusColor = (status: SipocStatus): string => {
  switch (status) {
    case SipocStatus.DRAFT:
      return 'bg-gray-100 text-gray-700 border-gray-200';
    case SipocStatus.REVIEW:
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case SipocStatus.APPROVED:
      return 'bg-green-50 text-green-700 border-green-200';
    case SipocStatus.PUBLISHED:
      return 'bg-green-100 text-green-800 border-green-300';
    case SipocStatus.ARCHIVED:
      return 'bg-gray-50 text-gray-500 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export const SipocVersionSelector = ({
  sipocId,
  selectedVersionId,
  onVersionChange,
  className,
}: SipocVersionSelectorProps) => {
  const { data: versions, isLoading } = useSipocVersions(sipocId);

  if (isLoading || !versions) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-9 sm:h-10 bg-gray-200 rounded-md"></div>
      </div>
    );
  }

  const sortedVersions = [...versions].sort((a, b) => b.version - a.version);

  return (
    <div className={className}>
      <Select value={selectedVersionId} onValueChange={onVersionChange}>
        <SelectTrigger className="w-full sm:w-64">
          <SelectValue placeholder="Sélectionner une version" />
        </SelectTrigger>
        <SelectContent>
          {sortedVersions.map((version) => (
            <SelectItem key={version.id} value={version.id}>
              <div className="flex items-center gap-2 sm:gap-3 py-1">
                {getStatusIcon(version.status)}
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Body className="font-medium">Version {version.version}</Body>
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full border text-[10px] sm:text-xs font-medium ${getStatusColor(version.status)}`}
                    >
                      {getStatusLabel(version.status)}
                    </span>
                  </div>
                  {version.title && (
                    <BodySmall className="text-gray-600 truncate">{version.title}</BodySmall>
                  )}
                  {version.releasedAt && (
                    <Caption className="text-gray-500">
                      Publié le {new Date(version.releasedAt).toLocaleDateString('fr-FR')}
                    </Caption>
                  )}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {versions.length === 0 && (
        <div className="text-center py-4 sm:py-6">
          <BodySmall className="text-gray-500">Aucune version disponible</BodySmall>
        </div>
      )}
    </div>
  );
};
