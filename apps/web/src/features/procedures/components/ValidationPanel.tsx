import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react'
import { Heading3, Body, BodySmall } from '@repo/ui'
import type { ValidationResult } from '../types/procedure.types'

interface ValidationPanelProps {
  validationResult: ValidationResult
}

export function ValidationPanel({ validationResult }: ValidationPanelProps) {
  return (
    <div className="p-4 border-t border-gray-200 overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        {validationResult.isValid ? (
          <CheckCircle className="h-5 w-5 text-green-600" />
        ) : (
          <AlertCircle className="h-5 w-5 text-red-600" />
        )}
        <Heading3 className="text-sm font-semibold">
          Validation Qualigram
        </Heading3>
      </div>

      {validationResult.isValid && validationResult.errors.length === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <Body className="text-sm text-green-800">
            ✓ La procédure est valide
          </Body>
        </div>
      ) : (
        <>
          {validationResult.errors.length > 0 && (
            <div className="mb-4">
              <Body className="text-sm font-medium text-red-600 mb-2">
                Erreurs ({validationResult.errors.length})
              </Body>
              <div className="space-y-2">
                {validationResult.errors.map((error, index) => (
                  <div
                    key={index}
                    className="bg-red-50 border border-red-200 rounded-lg p-2"
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <BodySmall className="text-sm text-red-800">
                          {error.message}
                        </BodySmall>
                        {error.nodeId && (
                          <BodySmall className="text-xs text-red-600 mt-1">
                            Nœud: {error.nodeId}
                          </BodySmall>
                        )}
                        {error.edgeId && (
                          <BodySmall className="text-xs text-red-600 mt-1">
                            Arête: {error.edgeId}
                          </BodySmall>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {validationResult.warnings.length > 0 && (
            <div>
              <Body className="text-sm font-medium text-yellow-600 mb-2">
                Avertissements ({validationResult.warnings.length})
              </Body>
              <div className="space-y-2">
                {validationResult.warnings.map((warning, index) => (
                  <div
                    key={index}
                    className="bg-yellow-50 border border-yellow-200 rounded-lg p-2"
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <BodySmall className="text-sm text-yellow-800">
                          {warning.message}
                        </BodySmall>
                        {warning.nodeId && (
                          <BodySmall className="text-xs text-yellow-600 mt-1">
                            Nœud: {warning.nodeId}
                          </BodySmall>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

