import { useState } from 'react'
import { CheckCircle2, XCircle, MessageSquare, Clock } from 'lucide-react'
import { Button, BodySmall, Caption, Heading1 } from '@repo/ui'
import {
  usePendingValidations,
  useApproveValidation,
  useRejectValidation,
} from '../hooks/useProcessValidation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Textarea,
} from '@repo/ui'

export function ValidationRequestsList() {
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)
  const [rejectComment, setRejectComment] = useState('')
  const { data: pendingValidations = [], isLoading } = usePendingValidations()
  const approveValidation = useApproveValidation()
  const rejectValidation = useRejectValidation()

  const handleApprove = async (requestId: string) => {
    await approveValidation.mutateAsync({ requestId })
  }

  const handleRejectClick = (requestId: string) => {
    setSelectedRequestId(requestId)
    setRejectComment('')
    setRejectDialogOpen(true)
  }

  const handleRejectSubmit = async () => {
    if (!selectedRequestId || !rejectComment.trim()) {
      return
    }

    await rejectValidation.mutateAsync({
      requestId: selectedRequestId,
      comment: rejectComment,
    })

    setRejectDialogOpen(false)
    setSelectedRequestId(null)
    setRejectComment('')
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <BodySmall className="text-gray-500">Chargement...</BodySmall>
      </div>
    )
  }

  if (pendingValidations.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <Heading1 className="text-gray-900 mb-2">
          Aucune validation en attente
        </Heading1>
        <BodySmall className="text-gray-500">
          Vous n'avez aucune demande de validation en attente
        </BodySmall>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <Heading1 className="text-gray-900">
          Validations en attente ({pendingValidations.length})
        </Heading1>

        <div className="space-y-3">
          {pendingValidations.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <MessageSquare className="w-5 h-5 text-orange-600" />
                    <div>
                      <BodySmall className="font-semibold text-gray-900">
                        {request.process.title}
                      </BodySmall>
                      <Caption className="text-gray-500">
                        {request.process.code}
                      </Caption>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1">
                    <BodySmall className="text-gray-600">
                      Demandé par :{' '}
                      <span className="font-medium text-gray-900">
                        {request.requestedBy.firstName} {request.requestedBy.lastName}
                      </span>
                    </BodySmall>
                    <Caption className="text-gray-500">
                      {new Date(request.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Caption>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRejectClick(request.id)}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rejeter
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(request.id)}
                    disabled={approveValidation.isPending}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Approuver
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dialog de rejet */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rejeter la validation</DialogTitle>
            <DialogDescription>
              Veuillez expliquer pourquoi vous rejetez cette validation
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <BodySmall className="font-medium text-gray-900">
                Commentaire <span className="text-red-500">*</span>
              </BodySmall>
              <Textarea
                value={rejectComment}
                onChange={(e) => setRejectComment(e.target.value)}
                placeholder="Expliquez pourquoi vous rejetez cette validation..."
                rows={4}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false)
                setRejectComment('')
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleRejectSubmit}
              disabled={!rejectComment.trim() || rejectValidation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {rejectValidation.isPending ? 'Rejet...' : 'Rejeter'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

