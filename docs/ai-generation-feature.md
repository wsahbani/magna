# AI Process Generation Feature

## Vue d'ensemble

Fonctionnalité permettant de générer automatiquement des processus dans un groupe de domaine (domainGroup) à partir d'une image ou d'un prompt texte utilisant l'IA.

## Workflow utilisateur

```
1. Cliquer sur bouton Sparkles (violet) dans la toolbar du domainGroup
   ↓
2. Modal s'ouvre avec 2 tabs : Image Upload ou Text Prompt
   ↓
3. Utilisateur sélectionne l'image ou écrit un prompt
   ↓
4. Cliquer "Générer" → Appel API AI (backend traite la requête)
   ↓
5. Écran de prévisualisation avec liste des nœuds détectés
   - L'utilisateur peut modifier les noms
   - Supprimer des nœuds
   - Voir le type de chaque nœud (Processus/Groupe)
   ↓
6. Cliquer "Créer N processus" → Les nœuds sont ajoutés au diagramme
```

## Architecture technique

### 1. Modal AIGenerateModal

**Fichier**: `apps/web/src/components/FlowBuilder/modals/AIGenerateModal.tsx`

**États**:
- `step`: 'input' | 'preview' - Contrôle l'étape actuelle
- `activeTab`: 'image' | 'text' - Mode de génération
- `generatedNodes`: Liste des nœuds générés par l'IA
- `isGenerating`: État de chargement pendant l'appel API

**Props**:
```typescript
interface AIGenerateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (nodes: GeneratedNode[]) => void
  onGenerate?: (mode: 'image' | 'text', data: File | string) => Promise<GeneratedNode[]>
}

interface GeneratedNode {
  label: string
  type?: 'mainProcess' | 'domainGroup'
}
```

**Fonctionnalités**:
- Upload d'image avec preview
- Zone de texte pour prompts avec suggestions
- Écran de prévisualisation éditable
- Validation avant création
- Loader pendant la génération

### 2. Handlers dans ProcessMapFlowDiagram

**Fichier**: `apps/web/src/features/process-map/components/ProcessMapFlowDiagram.tsx`

#### `handleOpenAIGenerateModal`
Ouvre le modal pour un groupe spécifique.

#### `handleAIGenerate`
```typescript
async (groupId: string, mode: 'image' | 'text', data: File | string) 
  => Promise<GeneratedNode[]>
```

**Responsabilités**:
- Appeler l'API AI appropriée (image ou texte)
- Traiter la réponse JSON
- Retourner la liste des nœuds au modal

**Workflow**:
1. Validation du groupe cible
2. Appel API selon le mode :
   - **Image**: POST FormData vers `/api/process-map-ai/analyze`
   - **Text**: POST JSON vers `/api/process-map-ai/generate-from-text`
3. Extraction des nœuds de la réponse
4. Retour au modal pour preview

#### `handleConfirmAINodes`
```typescript
(groupId: string, generatedNodes: GeneratedNode[]) => void
```

**Responsabilités**:
- Créer les nœuds ReactFlow dans le diagramme
- Positionner automatiquement avec layout center distribution
- Auto-expansion du groupe si nécessaire
- Support des types mixtes (mainProcess et domainGroup)

**Logique de positionnement**:
```javascript
// Chaque nœud est positionné à gauche du centre
positionIndex = -(children.length + idx + 1)
posX = centerX + positionIndex * (NODE_WIDTH + SPACING) - NODE_WIDTH / 2
posY = centerY - NODE_HEIGHT / 2
```

### 3. Bouton dans la toolbar domainGroup

**Fichier**: `apps/web/src/components/FlowBuilder/nodes/QualigramNodes.tsx`

**Ligne**: ~1048-1058

```tsx
{showAIGenerateButton && (
  <button
    onClick={(e) => {
      e.stopPropagation()
      onAIGenerate?.(id)
    }}
    className="bg-purple-500 hover:bg-purple-600 text-white rounded p-1.5"
    title="Générer avec l'IA"
  >
    <Sparkles className="w-4 h-4" />
  </button>
)}
```

**Conditions d'affichage**:
- `!readOnly`: Mode édition actif
- `onAIGenerate`: Callback fourni
- Affiché uniquement sur les nœuds domainGroup sélectionnés

## API Backend (À implémenter)

### Endpoint 1: Analyse d'image

**URL**: `POST /api/process-map-ai/analyze`

**Input**:
```typescript
FormData {
  image: File
  processMapId?: string // Contexte optionnel
  contextType: 'domainGroup' // Indique que c'est pour un groupe
}
```

**Output**:
```typescript
{
  success: boolean
  processes: Array<{
    label: string  // Nom réel extrait (ex: "Gestion des commandes")
    type: 'mainProcess'  // Toujours mainProcess pour groupe
    confidence?: number // Score de confiance de l'IA
  }>
}
```

**Règles importantes**:
- **Retourner UNIQUEMENT des `mainProcess`** (pas de domainGroup imbriqués)
- **Labels doivent être les vrais noms extraits** de l'image via OCR
- Ne pas retourner de labels génériques comme "Processus 1", "Processus 2"
- Si l'OCR échoue pour un processus, ne pas l'inclure dans les résultats

**Technologies suggérées**:
- Vision API (GPT-4 Vision, Google Cloud Vision, Azure Computer Vision)
- OCR pour extraction de texte (Tesseract, Cloud Vision OCR)
- Détection de formes pour identifier les rectangles/processus

### Endpoint 2: Génération depuis prompt texte

**URL**: `POST /api/process-map-ai/generate-from-text`

**Input**:
```typescript
{
  prompt: string
  processMapId?: string
  context?: {
    existingProcesses?: string[] // Processus déjà dans le groupe
    domain?: string // Domaine métier
  }
}
```

**Output**:
```typescript
{
  success: boolean
  processes: Array<{
    label: string
    type?: 'mainProcess' | 'domainGroup'
    description?: string // Description générée
    suggestedLinks?: string[] // Liens suggérés avec d'autres processus
  }>
}
```

**Technologies suggérées**:
- LLM (GPT-4, Claude, etc.)
- Prompt engineering pour extraction structurée
- Few-shot learning avec exemples de processus métier

## Mock Data (Développement)

Actuellement, le système utilise des données mockées :

**Pour l'image**:
```typescript
await new Promise(resolve => setTimeout(resolve, 1500))
return [
  { label: 'Processus détecté 1', type: 'mainProcess' },
  { label: 'Processus détecté 2', type: 'mainProcess' },
  { label: 'Groupe détecté', type: 'domainGroup' },
]
```

**Pour le texte**:
```typescript
// Extraction simple basée sur les lignes/virgules
const lines = prompt.split(/[,\n]/).map(l => l.trim()).filter(l => l.length > 0)
return lines.slice(0, 5).map(label => ({ label, type: 'mainProcess' }))
```

## Intégration avec le système existant

### Service AI existant

**Fichier**: `apps/api/src/modules/process-map/services/process-map-ai.service.ts`

Ce service existe déjà et gère l'analyse d'images pour la détection de processus. Il peut être étendu pour :

1. **Méthode `analyzeImage`**: Déjà implémentée
   - Analyse l'image uploadée
   - Détecte les formes et structures de processus
   - Retourne une structure JSON

2. **Nouvelle méthode `generateFromText`**: À créer
   - Accepte un prompt texte
   - Utilise un LLM pour extraire des processus
   - Retourne la même structure JSON

### Format JSON de réponse (standard)

**IMPORTANT**: Pour l'extraction depuis image dans un groupe (domainGroup), retourner **UNIQUEMENT des mainProcess** (pas de domainGroup imbriqués) avec les vrais labels extraits de l'image.

```typescript
interface AIProcessDetectionResult {
  processes: Array<{
    label: string  // Le vrai nom extrait de l'image (ex: "Gestion des commandes")
    type: 'mainProcess'  // Toujours 'mainProcess' pour extraction d'image dans groupe
    confidence?: number
    position?: { x: number; y: number } // Optionnel si détecté depuis image
    metadata?: {
      description?: string
      category?: string
      suggestedColor?: string
    }
  }>
  metadata?: {
    imageAnalysis?: {
      width: number
      height: number
      detectedShapes: number
    }
    llmModel?: string
    processingTime?: number
  }
}
```

**Exemple de réponse pour image**:
```json
{
  "processes": [
    { "label": "Réception commande", "type": "mainProcess", "confidence": 0.95 },
    { "label": "Validation stock", "type": "mainProcess", "confidence": 0.92 },
    { "label": "Préparation livraison", "type": "mainProcess", "confidence": 0.88 },
    { "label": "Expédition", "type": "mainProcess", "confidence": 0.91 }
  ]
}
```

## État d'avancement

✅ **Implémenté**:
- Modal AIGenerateModal avec workflow complet
- Écran de prévisualisation éditable
- Bouton Sparkles dans toolbar domainGroup
- Handlers pour génération et confirmation
- Support types mixtes (mainProcess + domainGroup)
- Auto-layout et auto-expansion du groupe
- Mock data pour tests

⏳ **À faire**:
- Implémenter endpoints API backend
- Connecter avec service AI existant
- Gérer les erreurs et états de chargement
- Ajouter analytics/telemetry
- Tests E2E du workflow complet
- Documentation utilisateur

## Exemples d'utilisation

### Cas 1: Génération depuis prompt texte

**Input utilisateur**:
```
Créer les processus du cycle de vente:
- Prospection
- Qualification
- Proposition commerciale
- Négociation
- Signature
```

**Résultat généré**:
5 nœuds mainProcess avec les labels correspondants

### Cas 2: Upload d'image de diagramme

**Input**: Image PNG d'un diagramme dessiné à la main ou scanné

**Traitement AI**:
1. OCR pour extraire les textes
2. Détection de formes (rectangles, hexagones, etc.)
3. Classification des types de nœuds
4. Extraction de la hiérarchie

**Résultat**: Nœuds avec labels extraits et types appropriés

## Points d'attention

1. **Sécurité**: Valider et sanitizer les uploads d'images
2. **Performance**: Limiter la taille des images (10MB max)
3. **Coût**: Surveiller l'utilisation des API AI (tokens, appels)
4. **UX**: Loading states clairs pendant traitement
5. **Qualité**: Permettre édition avant création définitive
6. **Limites**: Max 10-15 processus par génération

## Technologies utilisées

- **Frontend**: React, TypeScript, TanStack Router
- **UI**: @repo/ui (Dialog, Button, Textarea)
- **Icons**: lucide-react (Sparkles, Upload, Check, etc.)
- **State**: React useState, useCallback
- **Backend** (à implémenter): NestJS, OpenAI API, Vision APIs
