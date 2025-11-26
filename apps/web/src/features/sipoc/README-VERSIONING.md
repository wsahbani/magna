# SIPOC Versioning - Frontend

## Vue d'ensemble

Cette fonctionnalité implémente un système complet de gestion des versions pour les diagrammes SIPOC, permettant de créer, publier, archiver et gérer plusieurs versions d'un même diagramme.

## Composants

### 1. SipocVersionManager
**Fichier**: `components/SipocVersionManager.tsx`

Composant principal qui orchestre toute la gestion des versions.

**Props**:
- `sipocId: string` - ID du diagramme SIPOC
- `onVersionChange?: (versionId: string) => void` - Callback lors du changement de version
- `className?: string` - Classes CSS additionnelles

**Fonctionnalités**:
- Affichage et sélection de version
- Création de nouvelle version
- Duplication de version existante
- Actions sur les versions (publier, archiver, supprimer)
- Historique des modifications

**Exemple d'utilisation**:
```tsx
import { SipocVersionManager } from '@/features/sipoc';

function MyPage() {
  return (
    <SipocVersionManager
      sipocId="sipoc-123"
      onVersionChange={(versionId) => {
        console.log('Version changée:', versionId);
      }}
    />
  );
}
```

### 2. SipocVersionSelector
**Fichier**: `components/SipocVersionSelector.tsx`

Sélecteur dropdown pour choisir une version spécifique.

**Props**:
- `sipocId: string` - ID du SIPOC
- `selectedVersionId?: string` - Version actuellement sélectionnée
- `onVersionChange: (versionId: string) => void` - Callback de changement
- `className?: string`

**Exemple**:
```tsx
<SipocVersionSelector
  sipocId="sipoc-123"
  selectedVersionId={currentVersionId}
  onVersionChange={setCurrentVersionId}
/>
```

### 3. SipocVersionActions
**Fichier**: `components/SipocVersionActions.tsx`

Boutons d'actions pour gérer une version (publier, archiver, dupliquer, supprimer).

**Props**:
- `sipocId: string` - ID du SIPOC
- `version: SipocVersion` - Version à gérer
- `onDuplicate?: () => void` - Callback pour duplication
- `className?: string`

**Actions disponibles**:
- 🟢 **Publier** (status = DRAFT)
- 📋 **Dupliquer** (status = PUBLISHED)
- 📦 **Archiver** (status = PUBLISHED)
- 🗑️ **Supprimer** (status = DRAFT)

### 4. SipocVersionHistory
**Fichier**: `components/SipocVersionHistory.tsx`

Affiche l'historique chronologique des modifications d'une version.

**Props**:
- `history: SipocHistory[]` - Tableau d'entrées d'historique
- `className?: string`

**Informations affichées**:
- Type de modification (création, mise à jour, publication, archivage)
- Date et heure
- Utilisateur
- Description des changements
- États précédent et nouveau (détails)

### 5. CreateVersionModal
**Fichier**: `components/CreateVersionModal.tsx`

Modal pour créer une nouvelle version ou dupliquer une version existante.

**Props**:
- `sipocId: string` - ID du SIPOC
- `isOpen: boolean` - État d'ouverture
- `onClose: () => void` - Callback de fermeture
- `onSuccess?: (versionId: string) => void` - Callback de succès
- `duplicateFromVersionId?: string` - Si fourni, duplique cette version

**Champs du formulaire**:
- Titre (obligatoire)
- Description (optionnel)
- Journal des modifications (optionnel)

## Hooks React Query

### useSipocVersions
Récupère toutes les versions d'un SIPOC.

```typescript
const { data: versions, isLoading } = useSipocVersions(sipocId);
```

### useSipocVersion
Récupère une version spécifique avec ses détails.

```typescript
const { data: version } = useSipocVersion(sipocId, versionId);
```

### useCreateSipocVersion
Crée une nouvelle version.

```typescript
const createMutation = useCreateSipocVersion();

await createMutation.mutateAsync({
  sipocId: 'sipoc-123',
  dto: {
    title: 'Version 2.0',
    description: 'Nouvelle version améliorée',
    changesLog: 'Ajout de nouvelles étapes'
  }
});
```

### useDuplicateSipocVersion
Duplique une version existante.

```typescript
const duplicateMutation = useDuplicateSipocVersion();

await duplicateMutation.mutateAsync({
  sipocId: 'sipoc-123',
  versionId: 'version-456',
  dto: {
    title: 'Copie de version 1',
    changesLog: 'Duplication pour modifications'
  }
});
```

### usePublishSipocVersion
Publie une version draft.

```typescript
const publishMutation = usePublishSipocVersion();

await publishMutation.mutateAsync({
  sipocId: 'sipoc-123',
  versionId: 'version-456',
  dto: {
    changesLog: 'Version validée et approuvée'
  }
});
```

### useArchiveSipocVersion
Archive une version publiée.

```typescript
const archiveMutation = useArchiveSipocVersion();

await archiveMutation.mutateAsync({
  sipocId: 'sipoc-123',
  versionId: 'version-456'
});
```

### useDeleteSipocVersion
Supprime une version draft.

```typescript
const deleteMutation = useDeleteSipocVersion();

await deleteMutation.mutateAsync({
  sipocId: 'sipoc-123',
  versionId: 'version-456'
});
```

## Types TypeScript

### SipocStatus
```typescript
enum SipocStatus {
  DRAFT = 'DRAFT',
  REVIEW = 'REVIEW',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}
```

### SipocVersion
```typescript
interface SipocVersion {
  id: string;
  documentId: string;
  sipoc_id: string;
  version: number;
  status: SipocStatus;
  title: string;
  description?: string;
  releasedAt?: string;
  changesLog?: string;
  createdAt: string;
  updatedAt: string;
  elements?: SipocElement[];
  connections?: SipocConnection[];
  history?: SipocHistory[];
}
```

### SipocHistory
```typescript
interface SipocHistory {
  history_id: number;
  documentId: string;
  versionId: string;
  changed_by: string;
  changed_at: string;
  change_description?: string;
  change_type?: string;
  previous_state?: any;
  new_state?: any;
}
```

## Workflow d'Utilisation

### 1. Création d'une Nouvelle Version

```tsx
// Page SIPOC avec gestionnaire de versions
import { SipocVersionManager } from '@/features/sipoc';

function SipocPage({ sipocId }: { sipocId: string }) {
  const [currentVersionId, setCurrentVersionId] = useState<string>();

  return (
    <div>
      <SipocVersionManager
        sipocId={sipocId}
        onVersionChange={setCurrentVersionId}
      />
      
      {/* Éditeur SIPOC pour la version sélectionnée */}
      {currentVersionId && (
        <SipocEditor versionId={currentVersionId} />
      )}
    </div>
  );
}
```

### 2. Workflow de Publication

```tsx
import { useState } from 'react';
import { usePublishSipocVersion } from '@/features/sipoc';

function PublishWorkflow({ sipocId, versionId }: Props) {
  const [changesLog, setChangesLog] = useState('');
  const publishMutation = usePublishSipocVersion();

  const handlePublish = async () => {
    await publishMutation.mutateAsync({
      sipocId,
      versionId,
      dto: { changesLog }
    });
  };

  return (
    <div>
      <textarea
        value={changesLog}
        onChange={(e) => setChangesLog(e.target.value)}
        placeholder="Décrivez les changements..."
      />
      <button onClick={handlePublish}>
        Publier la version
      </button>
    </div>
  );
}
```

### 3. Comparaison de Versions

```tsx
import { useSipocVersion } from '@/features/sipoc';

function VersionComparison({ sipocId, version1Id, version2Id }: Props) {
  const { data: v1 } = useSipocVersion(sipocId, version1Id);
  const { data: v2 } = useSipocVersion(sipocId, version2Id);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3>Version {v1?.version}</h3>
        <p>{v1?.elements?.length} éléments</p>
      </div>
      <div>
        <h3>Version {v2?.version}</h3>
        <p>{v2?.elements?.length} éléments</p>
      </div>
    </div>
  );
}
```

## Intégration avec Router

```tsx
// router.tsx
import { SipocVersionPage } from '@/features/sipoc/pages/SipocVersionPage';

const routes = [
  {
    path: '/sipoc/:sipocId/versions',
    element: <SipocVersionPage />
  }
];
```

## Styles et Responsive

Tous les composants sont **responsive** et utilisent les composants de `@repo/ui` :
- Mobile-first design
- Breakpoints: `sm:` (640px), `lg:` (1024px)
- Couleurs adaptées au thème orange/noir de l'application
- Accessibilité: labels, ARIA attributes

## Configuration API

L'URL de l'API est configurée via variable d'environnement :

```env
VITE_API_URL=http://localhost:3001
```

## Gestion des Erreurs

Les hooks React Query gèrent automatiquement :
- États de chargement (`isLoading`, `isPending`)
- États d'erreur (`isError`, `error`)
- Invalidation automatique du cache
- Retry automatique

## Performance

- **Lazy loading** des versions
- **Cache React Query** pour éviter les requêtes inutiles
- **Invalidation intelligente** du cache après mutations
- **Optimistic updates** possibles

## Tests

Pour tester les composants :

```tsx
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SipocVersionManager } from './SipocVersionManager';

const queryClient = new QueryClient();

test('renders version manager', () => {
  render(
    <QueryClientProvider client={queryClient}>
      <SipocVersionManager sipocId="test-123" />
    </QueryClientProvider>
  );
  
  expect(screen.getByText(/Gestion des Versions/i)).toBeInTheDocument();
});
```

## Prochaines Améliorations

- [ ] Comparaison visuelle entre versions
- [ ] Restauration de version archivée
- [ ] Commentaires sur les versions
- [ ] Notifications lors de publication
- [ ] Export/Import de versions
- [ ] Diff visuel des éléments modifiés
