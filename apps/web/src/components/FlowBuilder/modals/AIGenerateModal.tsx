/**
 * Modal pour générer des processus via AI
 * Deux modes : depuis une image ou depuis un prompt texte
 * Workflow: Upload/Prompt → Generate → Preview → Confirm
 */

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@repo/ui/components/ui/dialog'
import { Button } from '@repo/ui/components/ui/button'
import { Label } from '@repo/ui/components/ui/label'
import { Textarea } from '@repo/ui/components/ui/textarea'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Upload, MessageSquare, Sparkles, Image as ImageIcon, Check, ArrowLeft, Loader2, Clipboard } from 'lucide-react'

interface GeneratedNode {
  label: string
  type?: 'mainProcess' | 'domainGroup'
}

interface AIGenerateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (nodes: GeneratedNode[]) => void
  onGenerate?: (mode: 'image' | 'text', data: File | string) => Promise<GeneratedNode[]>
}

export function AIGenerateModal({ open, onOpenChange, onConfirm, onGenerate }: AIGenerateModalProps) {
  const [step, setStep] = useState<'input' | 'preview'>('input')
  const [activeTab, setActiveTab] = useState<'image' | 'text'>('image')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [textPrompt, setTextPrompt] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedNodes, setGeneratedNodes] = useState<GeneratedNode[]>([])
  const [isPasteReady, setIsPasteReady] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setStep('input')
      setActiveTab('image')
      setSelectedFile(null)
      setTextPrompt('')
      setPreviewUrl(null)
      setGeneratedNodes([])
      setIsGenerating(false)
      setIsPasteReady(false)
    }
  }, [open])

  // Create preview URL for selected image
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setPreviewUrl(null)
    }
  }, [selectedFile])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
    }
  }

  // Handle paste event for image from clipboard
  const handlePaste = useCallback((event: ClipboardEvent) => {
    const items = event.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.type.startsWith('image/')) {
        const blob = item.getAsFile()
        if (blob) {
          // Create a File object from the blob with a proper name
          const file = new File([blob], `pasted-image-${Date.now()}.png`, { type: blob.type })
          setSelectedFile(file)
          event.preventDefault()
          break
        }
      }
    }
  }, [])

  // Add paste event listener when image tab is active and modal is open
  useEffect(() => {
    if (open && activeTab === 'image' && step === 'input') {
      document.addEventListener('paste', handlePaste)
      setIsPasteReady(true)
      return () => {
        document.removeEventListener('paste', handlePaste)
        setIsPasteReady(false)
      }
    }
  }, [open, activeTab, step, handlePaste])

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      let nodes: GeneratedNode[] = []
      
      if (onGenerate) {
        // Call the provided generate function
        const data = activeTab === 'image' ? selectedFile! : textPrompt.trim()
        nodes = await onGenerate(activeTab, data)
      } else {
        // Mock generation for testing
        if (activeTab === 'image') {
          nodes = [
            { label: 'Processus détecté 1', type: 'mainProcess' },
            { label: 'Processus détecté 2', type: 'mainProcess' },
            { label: 'Groupe détecté', type: 'domainGroup' },
          ]
        } else {
          const lines = textPrompt.split(/[,\n]/).map(l => l.trim()).filter(l => l.length > 0)
          nodes = lines.slice(0, 5).map(label => ({ label, type: 'mainProcess' as const }))
          if (nodes.length === 0) {
            nodes = [
              { label: 'Processus généré 1', type: 'mainProcess' },
              { label: 'Processus généré 2', type: 'mainProcess' },
            ]
          }
        }
      }

      setGeneratedNodes(nodes)
      setStep('preview')
    } catch (error) {
      console.error('Error generating nodes:', error)
      // TODO: Show error toast
    } finally {
      setIsGenerating(false)
    }
  }

  const handleConfirm = () => {
    onConfirm(generatedNodes)
    onOpenChange(false)
  }

  const handleBack = () => {
    setStep('input')
    setGeneratedNodes([])
  }

  const handleEditNode = (index: number, newLabel: string) => {
    const updated = [...generatedNodes]
    updated[index] = { ...updated[index], label: newLabel }
    setGeneratedNodes(updated)
  }

  const handleRemoveNode = (index: number) => {
    setGeneratedNodes(generatedNodes.filter((_, i) => i !== index))
  }

  const isValid = activeTab === 'image' ? !!selectedFile : textPrompt.trim().length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500" />
            Générer des processus avec l'IA
            {step === 'preview' && (
              <span className="ml-auto text-sm font-normal text-gray-500">
                {generatedNodes.length} processus détectés
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {step === 'input' ? (
          <>
            <div className="space-y-4 py-4">
              {/* Tabs */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setActiveTab('image')}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    activeTab === 'image'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <ImageIcon className="w-6 h-6" />
                  <span className="font-medium">Depuis une image</span>
                  {activeTab === 'image' && (
                    <span className="text-xs text-orange-600 font-medium">✓ Sélectionné</span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('text')}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    activeTab === 'text'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <MessageSquare className="w-6 h-6" />
                  <span className="font-medium">Depuis un prompt</span>
                  {activeTab === 'text' && (
                    <span className="text-xs text-orange-600 font-medium">✓ Sélectionné</span>
                  )}
                </button>
              </div>

              {/* Image Upload Tab */}
              {activeTab === 'image' && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Télécharger une image de processus
                    </Label>
                    <p className="text-xs text-gray-500 mt-1 mb-3">
                      L'IA analysera l'image pour détecter les processus et les recréer dans le diagramme
                    </p>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    {!selectedFile ? (
                      <div className="space-y-2">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer"
                        >
                          <Upload className="w-8 h-8 text-gray-400" />
                          <span className="text-sm text-gray-600">Cliquez pour sélectionner une image</span>
                          <span className="text-xs text-gray-400">PNG, JPG, JPEG jusqu'à 10MB</span>
                        </button>
                        {isPasteReady && (
                          <div className="flex items-center justify-center gap-2 text-xs text-blue-600 bg-blue-50 rounded-lg py-2.5 px-3">
                            <Clipboard className="w-4 h-4 flex-shrink-0" />
                            <span>
                              <span className="font-medium">Astuce :</span> Vous pouvez aussi coller une image (Ctrl+V ou Cmd+V)
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="relative rounded-lg border-2 border-orange-300 overflow-hidden">
                          <img
                            src={previewUrl || ''}
                            alt="Preview"
                            className="w-full h-48 object-contain bg-gray-50"
                          />
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">
                              {selectedFile.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedFile(null)}
                          >
                            Changer
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Text Prompt Tab */}
              {activeTab === 'text' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="prompt" className="text-sm font-medium text-gray-700">
                      Décrivez les processus à créer
                    </Label>
                    <p className="text-xs text-gray-500 mt-1 mb-3">
                      Exemple : "Créer 3 processus : Gestion des commandes, Livraison, et Facturation"
                    </p>
                    <Textarea
                      id="prompt"
                      value={textPrompt}
                      onChange={(e) => setTextPrompt(e.target.value)}
                      placeholder="Décrivez les processus que vous souhaitez générer..."
                      className="min-h-[150px] resize-none"
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {textPrompt.length} caractères
                      </span>
                      <span className="text-xs text-gray-400">
                        Min. 10 caractères
                      </span>
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700">Suggestions :</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Créer 3 processus de production",
                        "Ajouter les étapes du cycle de vente",
                        "Générer un workflow de gestion RH"
                      ].map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => setTextPrompt(suggestion)}
                          className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-orange-100 rounded-full transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={!isValid || isGenerating}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Générer
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Preview Step */}
            <div className="space-y-4 py-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Aperçu des processus détectés</span>
                  <br />
                  Vous pouvez modifier les noms ou supprimer des éléments avant de les créer.
                </p>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {generatedNodes.map((node, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      value={node.label}
                      onChange={(e) => handleEditNode(index, e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                      {node.type === 'domainGroup' ? 'Groupe' : 'Processus'}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveNode(index)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      ✕
                    </Button>
                  </div>
                ))}

                {generatedNodes.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Aucun processus détecté. Veuillez réessayer.
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Annuler
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={generatedNodes.length === 0}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Créer {generatedNodes.length} processus
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
