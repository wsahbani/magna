# Excel Import Feature - SIPOC

## Vue d'ensemble

La fonctionnalité d'import Excel permet aux utilisateurs d'importer des données SIPOC depuis des fichiers Excel (.xlsx, .xls, .ods) avec prévisualisation et édition avant sauvegarde.

## Architecture

### Composants

#### 1. **SipocImportModal** (`/apps/web/src/features/sipoc/components/SipocImportModal.tsx`)
Modal principal avec workflow en 3 phases :
- **Phase 1 : Upload** - Sélection et validation du fichier
- **Phase 2 : Preview** - Prévisualisation et édition des données
- **Phase 3 : Saving** - Enregistrement en base de données

**Props:**
```typescript
interface SipocImportModalProps {
  open: boolean;           // État d'ouverture du modal
  onClose: () => void;     // Callback de fermeture
  sipocId: string;         // ID du diagramme SIPOC cible
  onImportComplete: () => void; // Callback après import réussi
}
```

**Fonctionnalités clés:**
- Drag & drop de fichiers
- Validation de format et taille (max 10 MB)
- Parsing avec détection automatique des colonnes
- Édition inline des titres
- Suppression d'éléments
- Statistiques en temps réel

#### 2. **Excel Parser** (`/apps/web/src/features/sipoc/utils/excel-parser.ts`)
Utilitaires de parsing et validation Excel.

**Fonctions principales:**

```typescript
// Parse fichier Excel en données SIPOC
parseExcelFile(file: File): Promise<ParsedSipocData>

// Convertit données parsées en éléments SIPOC
convertToSipocElements(parsedData: ParsedSipocRow[]): SipocElementImport[]

// Valide le type de fichier
isValidExcelFile(file: File): boolean

// Formate la taille de fichier pour affichage
formatFileSize(bytes: number): string
```

**Types:**

```typescript
interface ParsedSipocRow {
  flowId: string;          // ID unique du flow
  suppliers: string[];     // Liste des fournisseurs
  inputs: string[];        // Liste des entrées
  processes: string[];     // Liste des processus
  outputs: string[];       // Liste des sorties
  customers: string[];     // Liste des clients
  rowIndex: number;        // Index de la ligne dans Excel
}

interface ParsedSipocData {
  rows: ParsedSipocRow[];  // Données parsées
  errors: string[];        // Erreurs bloquantes
  warnings: string[];      // Avertissements non-bloquants
}

interface SipocElementImport {
  type: ElementType;       // Type d'élément SIPOC
  title: string;           // Titre de l'élément
  description: string;     // Description (vide par défaut)
  flowId: string;          // ID du flow parent
  position: number;        // Position dans le type
  globalOrder: number;     // Ordre global dans le diagramme
}
```

## Format Excel Attendu

### Structure des colonnes

Le fichier Excel doit contenir **5 colonnes** dans cet ordre :

| Fournisseurs | Entrées | Processus | Sorties | Clients |
|--------------|---------|-----------|---------|---------|
| Fournisseur A | Entrée 1 | Processus 1 | Sortie 1 | Client A |
| Fournisseur B | Entrée 2 | Processus 2 | Sortie 2 | Client B |

### Noms de colonnes supportés

Le parser détecte automatiquement les colonnes avec support **français et anglais** :

- **Fournisseurs**: `Fournisseurs`, `Fournisseur`, `Suppliers`, `Supplier`
- **Entrées**: `Entrées`, `Entrees`, `Entrée`, `Entree`, `Inputs`, `Input`
- **Processus**: `Processus`, `Process`, `Processes`
- **Sorties**: `Sorties`, `Sortie`, `Outputs`, `Output`
- **Clients**: `Clients`, `Client`, `Customers`, `Customer`

### Éléments multiples par cellule

Plusieurs éléments peuvent être saisis dans une cellule en les séparant par :
- **Saut de ligne** (Alt + Entrée dans Excel)
- **Point-virgule** (;)

**Exemple:**
```
Fournisseur A
Fournisseur B
Fournisseur C
```
ou
```
Fournisseur A; Fournisseur B; Fournisseur C
```

### Règles de validation

- ✅ **Minimum requis**: Au moins une ligne avec un processus
- ⚠️ **Avertissement**: Ligne sans processus (processus manquant)
- ❌ **Erreur**: Fichier vide ou format de colonnes invalide
- ❌ **Erreur**: Fichier > 10 MB

## Workflow utilisateur

### Phase 1 : Upload

1. L'utilisateur ouvre le modal via le bouton "Importer" dans `SipocEditor`
2. Deux options de sélection :
   - **Drag & drop** dans la zone de dépôt
   - **Clic sur "Sélectionner un fichier"**
3. Validation automatique :
   - Format de fichier (.xlsx, .xls, .ods)
   - Taille < 10 MB
4. Affichage des informations du fichier (nom, taille)
5. Clic sur "Analyser le fichier" → passage en Phase 2

### Phase 2 : Preview

1. Parsing du fichier Excel avec `parseExcelFile()`
2. Affichage des **statistiques** par type d'élément
3. Affichage des **avertissements** si présents
4. **Tableau de prévisualisation** avec :
   - Badge coloré du type d'élément
   - Champ de titre éditable
   - Bouton de suppression
5. Possibilités :
   - **Modifier** les titres inline
   - **Supprimer** des éléments indésirables
   - **Retour** pour changer de fichier
6. Clic sur "Importer X élément(s)" → passage en Phase 3

### Phase 3 : Saving

1. Affichage d'un spinner de chargement
2. Appel API pour créer les éléments (TODO)
3. Callback `onImportComplete()` pour rafraîchir les données
4. Fermeture automatique du modal

## Intégration dans SipocEditor

### Ajout du bouton Import

```tsx
<Button 
  variant="outline" 
  size="sm"
  onClick={() => setIsImportModalOpen(true)}
  disabled={diagram.status === 'published'}
>
  <FileDown className="w-4 h-4 mr-2" />
  Importer
</Button>
```

### Modal et handlers

```tsx
const [isImportModalOpen, setIsImportModalOpen] = useState(false);

const handleImportComplete = useCallback(() => {
  fetchElements(sipocId);
  setHasUnsavedChanges(true);
}, [fetchElements, sipocId]);

return (
  <>
    {/* ... SipocFlowBoard ... */}
    
    <SipocImportModal
      open={isImportModalOpen}
      onClose={() => setIsImportModalOpen(false)}
      sipocId={sipocId}
      onImportComplete={handleImportComplete}
    />
  </>
);
```

## Parsing Excel - Détails techniques

### Détection des colonnes

L'algorithme `detectColumns()` :
1. Récupère les clés de la première ligne Excel
2. Pour chaque type SIPOC, recherche les patterns français/anglais
3. Fallback sur l'index de colonne si aucun pattern trouvé (colonnes 0-4)
4. Retourne `null` si moins de 5 colonnes détectées

### Parsing des cellules

L'algorithme `parseCell()` :
1. Split par sauts de ligne (`\n`) et points-virgules (`;`)
2. Trim de chaque élément
3. Filtrage des éléments vides
4. Retourne un tableau de chaînes

### Génération des flow_id

- Chaque **ligne Excel** = 1 **flow** SIPOC
- Un `crypto.randomUUID()` unique est généré par ligne
- Tous les éléments d'une ligne partagent le même `flowId`

### Ordre et position

- **globalOrder**: Index de la ligne dans le fichier (0, 1, 2, ...)
- **position**: Index dans le type d'élément (supplier 0, supplier 1, ...)

**Exemple:**
```
Ligne 1 (globalOrder=0):
  - Supplier "Acme Corp" (position=0)
  - Input "Matières premières" (position=0)
  - Process "Fabrication" (position=0)
  
Ligne 2 (globalOrder=1):
  - Supplier "Provider Ltd" (position=0)
  - Supplier "Local Supplies" (position=1)
  - Input "Électricité" (position=0)
  - Process "Assemblage" (position=0)
```

## UX et design

### Principes appliqués

- **Progressive Disclosure**: Affichage par phases (upload → preview → save)
- **Immediate Feedback**: Validation en temps réel, erreurs claires
- **Error Prevention**: Validation de format/taille avant parsing
- **Recognition over Recall**: Statistiques visuelles, badges colorés
- **Aesthetic & Minimalist**: Design épuré, focus sur les données

### Code coloré par type

```tsx
const getTypeStyle = (type: ElementType): string => {
  switch (type) {
    case ElementType.supplier:  return 'bg-purple-100 text-purple-800';
    case ElementType.input:     return 'bg-blue-100 text-blue-800';
    case ElementType.process:   return 'bg-orange-100 text-orange-800';
    case ElementType.output:    return 'bg-green-100 text-green-800';
    case ElementType.customer:  return 'bg-pink-100 text-pink-800';
  }
}
```

### Labels français

Tous les textes sont en français :
- "Glissez-déposez votre fichier Excel ici"
- "Sélectionner un fichier"
- "Analyser le fichier"
- "Importer X élément(s)"
- "Fournisseur", "Entrée", "Processus", "Sortie", "Client"

## TODO - Intégration API

### Backend nécessaire

Endpoint à créer pour l'import bulk :

```typescript
POST /api/sipoc/:sipocId/elements/bulk
{
  elements: SipocElementImport[]
}
```

### Service SIPOC

Ajouter une méthode dans `SipocService` :

```typescript
async bulkCreateElements(
  sipocId: string,
  elements: CreateSipocElementDto[]
): Promise<SipocElement[]> {
  return this.prisma.$transaction(
    elements.map(element => 
      this.prisma.sipocElement.create({
        data: {
          ...element,
          sipoc_id: sipocId
        }
      })
    )
  );
}
```

### Hook React Query

Créer un hook `useBulkCreateSipocElements` :

```typescript
export const useBulkCreateSipocElements = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { 
      sipocId: string; 
      elements: SipocElementImport[] 
    }) => sipocApi.bulkCreateElements(params.sipocId, params.elements),
    
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['sipoc-elements', variables.sipocId] 
      });
    },
  });
};
```

### Mise à jour handleSave

Dans `SipocImportModal.tsx` :

```typescript
const bulkCreateMutation = useBulkCreateSipocElements();

const handleSave = useCallback(async () => {
  setPhase('saving');
  
  try {
    await bulkCreateMutation.mutateAsync({
      sipocId,
      elements: editableElements
    });
    
    onImportComplete();
    handleClose();
  } catch (error) {
    console.error('Import failed:', error);
    setParseError('Erreur lors de l\'enregistrement');
    setPhase('preview');
  }
}, [editableElements, sipocId, bulkCreateMutation, onImportComplete, handleClose]);
```

## Dépendances

### Packages installés

```bash
pnpm add xlsx           # 0.18.5 - Parsing Excel
```

### Types inclus

Le package `xlsx` fournit ses propres types TypeScript, donc `@types/xlsx` n'est pas nécessaire (bien qu'installé, il est deprecated).

## Exemple de fichier Excel

Créer un fichier `exemple-sipoc.xlsx` avec :

| Fournisseurs | Entrées | Processus | Sorties | Clients |
|--------------|---------|-----------|---------|---------|
| Équipe Marketing<br>Équipe Ventes | Brief produit<br>Données marché | Analyse des besoins | Spécifications<br>Budget prévisionnel | Équipe Développement |
| Fournisseur IT | Infrastructure<br>Outils | Développement | Application<br>Documentation | Utilisateurs finaux<br>Support technique |
| Équipe Qualité | Tests utilisateurs<br>Retours bugs | Validation | Version validée<br>Rapport de tests | Équipe Déploiement |

Ce fichier générera **3 flows** avec plusieurs éléments par type.

## Améliorations futures

### Court terme
- [ ] API backend pour l'import bulk
- [ ] Gestion des doublons (détecter éléments existants)
- [ ] Export Excel du SIPOC actuel
- [ ] Templates Excel téléchargeables

### Moyen terme
- [ ] Support CSV en plus d'Excel
- [ ] Import incrémental (ajouter à un SIPOC existant)
- [ ] Mapping de colonnes personnalisé
- [ ] Historique des imports

### Long terme
- [ ] Import depuis Google Sheets
- [ ] Import depuis API externe
- [ ] OCR pour images de tableaux
- [ ] AI suggestions pour catégorisation automatique

## Références

- **xlsx library**: https://github.com/SheetJS/sheetjs
- **Nielsen's Heuristics**: Progressive disclosure, Error prevention
- **SIPOC Methodology**: Suppliers → Inputs → Process → Outputs → Customers
