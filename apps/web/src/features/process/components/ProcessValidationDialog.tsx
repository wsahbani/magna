import { useState } from 'react'
import { CheckCircle2, Users, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@repo/ui'
import { Button, BodySmall, Caption } from '@repo/ui'
import { useUsers } from '../../users/hooks/useUsers'
import {
  useRequestValidation,
  useProcessValidationRequests,
} from '../hooks/useProcessValidation'
import type { Process } from '../types/process.types'

interface ProcessValidationDialogProps {
  process: Process
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProcessValidationDialog({
  process,
  open,
  onOpenChange,
}: ProcessValidationDialogProps) {
  const [selectedValidatorIds, setSelectedValidatorIds] = useState<string[]>([])
  const { data: users = [], isLoading: isLoadingUsers } = useUsers({
    isActive: true,
  })
  const { data: validationRequests = [] } = useProcessValidationRequests(
    process.id,
  )
  const requestValidation = useRequestValidation()

  const handleToggleValidator = (userId: string) => {
    setSelectedValidatorIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    )
  }

  const handleSubmit = async () => {
    if (selectedValidatorIds.length === 0) {
      return
    }

    await requestValidation.mutateAsync({
      processId: process.id,
      validatorIds: selectedValidatorIds,
    })

    setSelectedValidatorIds([])
    onOpenChange(false)
  }

  const handleCancel = () => {
    setSelectedValidatorIds([])
    onOpenChange(false)
  }

  // Exclure l'utilisateur créateur de la liste des validateurs possibles
  const availableValidators = users.filter(
    (user) => user.id !== process.createdById,
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-orange-600" />
            Demander la validation
          </DialogTitle>
          <DialogDescription>
            Sélectionnez les utilisateurs qui doivent valider le processus{' '}
            <span className="font-medium">{process.title}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Liste des demandes existantes */}
          {validationRequests.length > 0 && (
            <div className="space-y-2">
              <BodySmall className="font-medium text-gray-900">
                Demandes de validation en cours
              </BodySmall>
              <div className="space-y-2">
                {validationRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-gray-500" />
                      <div>
                        <BodySmall className="font-medium text-gray-900">
                          {request.validator.firstName} {request.validator.lastName}
                        </BodySmall>
                        <Caption className="text-gray-500">
                          {request.validator.email}
                        </Caption>
                      </div>
                    </div>
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
                ))}
              </div>
            </div>
          )}

          {/* Sélection des validateurs */}
          <div className="space-y-2">
            <BodySmall className="font-medium text-gray-900">
              Sélectionner les validateurs{' '}
              <span className="text-gray-500">
                ({selectedValidatorIds.length} sélectionné
                {selectedValidatorIds.length > 1 ? 's' : ''})
              </span>
            </BodySmall>

            {isLoadingUsers ? (
              <div className="text-center py-8">
                <BodySmall className="text-gray-500">
                  Chargement des utilisateurs...
                </BodySmall>
              </div>
            ) : availableValidators.length === 0 ? (
              <div className="text-center py-8">
                <BodySmall className="text-gray-500">
                  Aucun utilisateur disponible pour la validation
                </BodySmall>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-2">
                {availableValidators.map((user) => {
                  const isSelected = selectedValidatorIds.includes(user.id)
                  const hasExistingRequest = validationRequests.some(
                    (req) => req.validatorId === user.id,
                  )

                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleToggleValidator(user.id)}
                      disabled={hasExistingRequest}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        isSelected
                          ? 'bg-orange-50 border-orange-300'
                          : hasExistingRequest
                            ? 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          isSelected
                            ? 'bg-orange-600 border-orange-600'
                            : 'border-gray-300'
                        }`}
                      >
                        {isSelected && (
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <BodySmall className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </BodySmall>
                        <Caption className="text-gray-500">{user.email}</Caption>
                      </div>
                      {hasExistingRequest && (
                        <Caption className="text-gray-400">
                          Déjà demandé
                        </Caption>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              selectedValidatorIds.length === 0 ||
              requestValidation.isPending
            }
          >
            {requestValidation.isPending
              ? 'Envoi...'
              : `Envoyer à ${selectedValidatorIds.length} validateur${selectedValidatorIds.length > 1 ? 's' : ''}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

