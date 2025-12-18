import { Clock, CheckCircle2, XCircle } from 'lucide-react'
import { BodySmall, Caption } from '@repo/ui'
import { useProcessMapValidationRequests } from '../hooks/useProcessMapValidation'

interface ProcessMapValidationStatusBadgeProps {
  processMapId: string
  compact?: boolean
}

export function ProcessMapValidationStatusBadge({
  processMapId,
  compact = false,
}: ProcessMapValidationStatusBadgeProps) {
  const { data: validationRequests = [], isLoading } = useProcessMapValidationRequests(processMapId)

  if (isLoading) {
    return null
  }

  if (validationRequests.length === 0) {
    return null
  }

  const pendingCount = validationRequests.filter((req) => req.status === 'PENDING').length
  const approvedCount = validationRequests.filter((req) => req.status === 'APPROVED').length
  const rejectedCount = validationRequests.filter((req) => req.status === 'REJECTED').length
  const totalCount = validationRequests.length

  // Si toutes les validations sont approuvées
  if (approvedCount === totalCount && totalCount > 0) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 border border-green-200 rounded-md">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
          <BodySmall className="text-green-700 font-medium">
            {compact ? `${approvedCount}/${totalCount}` : `${approvedCount}/${totalCount} approuvé${approvedCount > 1 ? 's' : ''}`}
          </BodySmall>
        </div>
      </div>
    )
  }

  // Si au moins une validation est rejetée
  if (rejectedCount > 0) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-red-50 border border-red-200 rounded-md">
          <XCircle className="w-3.5 h-3.5 text-red-600" />
          <BodySmall className="text-red-700 font-medium">
            {compact
              ? `${rejectedCount} rejeté${rejectedCount > 1 ? 's' : ''}`
              : `${rejectedCount} rejeté${rejectedCount > 1 ? 's' : ''} sur ${totalCount}`}
          </BodySmall>
        </div>
      </div>
    )
  }

  // Si des validations sont en attente
  if (pendingCount > 0) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-50 border border-orange-200 rounded-md">
          <Clock className="w-3.5 h-3.5 text-orange-600" />
          <BodySmall className="text-orange-700 font-medium">
            {compact
              ? `${pendingCount} en attente`
              : `En attente de ${pendingCount} validateur${pendingCount > 1 ? 's' : ''}`}
          </BodySmall>
        </div>
        {approvedCount > 0 && !compact && (
          <Caption className="text-gray-500">
            ({approvedCount}/{totalCount} approuvé{approvedCount > 1 ? 's' : ''})
          </Caption>
        )}
      </div>
    )
  }

  return null
}

