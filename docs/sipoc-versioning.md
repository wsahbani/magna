# Système de Versioning SIPOC

## Vue d'ensemble

Le système de versioning SIPOC permet de gérer plusieurs versions d'un diagramme SIPOC avec un workflow complet de draft → publication → archivage, inspiré du système de versioning des Process.

## Architecture

### Modèles Prisma

- **SipocDiagram** : Conteneur principal pour toutes les versions
  - `currentDraftId` : Référence vers la version draft actuelle
  - `currentPublishedId` : Référence vers la version publiée actuelle

- **SipocVersion** : Une version spécifique du diagramme
  - Statuts : `DRAFT`, `REVIEW`, `APPROVED`, `PUBLISHED`, `ARCHIVED`
  - Contient tous les éléments et connexions

- **SipocElement** : Éléments du diagramme (Supplier, Input, Process, Output, Customer)
  - Lié à une `SipocVersion` spécifique

- **SipocConnection** : Connexions entre éléments
  - Lié à une `SipocVersion` spécifique

- **SipocHistory** : Historique des modifications
  - Traçabilité complète des changements

## API Endpoints

### Gestion des Versions

#### Créer une nouvelle version
```http
POST /sipoc/:sipocId/versions
Content-Type: application/json

{
  "title": "Diagramme SIPOC - Service Client",
  "description": "Processus de gestion des réclamations",
  "changesLog": "Première version"
}
```

#### Dupliquer une version existante
```http
POST /sipoc/:sipocId/versions/:versionId/duplicate
Content-Type: application/json

{
  "title": "Diagramme SIPOC - Service Client v2",
  "description": "Processus amélioré",
  "changesLog": "Ajout de nouvelles étapes de validation"
}
```

#### Récupérer toutes les versions
```http
GET /sipoc/:sipocId/versions
```

#### Récupérer une version spécifique
```http
GET /sipoc/:sipocId/versions/:versionId
```

#### Mettre à jour une version draft
```http
PUT /sipoc/:sipocId/versions/:versionId
Content-Type: application/json

{
  "title": "Nouveau titre",
  "description": "Nouvelle description",
  "changesLog": "Mise à jour des informations"
}
```

#### Publier une version
```http
POST /sipoc/:sipocId/versions/:versionId/publish
Content-Type: application/json

{
  "changesLog": "Version validée et approuvée par le comité"
}
```

#### Archiver une version
```http
POST /sipoc/:sipocId/versions/:versionId/archive
```

#### Supprimer une version draft
```http
DELETE /sipoc/:sipocId/versions/:versionId
```

## Workflow Typique

### 1. Création d'un nouveau SIPOC avec versioning

```typescript
// 1. Créer le diagramme SIPOC
const sipoc = await sipocService.create({
  title: "Processus Service Client",
  description: "Gestion des réclamations",
  process_owner: "Manager Service Client",
  department: "Service Client"
});

// 2. Créer la première version
const version = await versionService.createVersion(sipoc.sipoc_id, {
  title: "Version initiale",
  description: "Première version du processus",
  changesLog: "Création initiale"
});

// 3. Ajouter des éléments à la version
await elementService.create(version.id, {
  type: "supplier",
  title: "Client",
  description: "Client émettant une réclamation",
  position: 0
});
```

### 2. Modification et nouvelle version

```typescript
// 1. Dupliquer la version publiée actuelle
const newVersion = await versionService.duplicateVersion(
  sipocId,
  currentPublishedVersionId,
  {
    title: "Version 2.0",
    description: "Améliorations du processus",
    changesLog: "Ajout d'étapes de validation supplémentaires"
  }
);

// 2. Modifier les éléments dans la nouvelle version
await elementService.update(elementId, {
  title: "Nouveau titre",
  description: "Nouvelle description"
});

// 3. Publier la nouvelle version
await versionService.publishVersion(newVersion.id, {
  changesLog: "Version 2.0 validée et approuvée"
});
```

### 3. Gestion de l'historique

```typescript
// Récupérer toutes les versions avec historique
const versions = await versionService.getVersions(sipocId);

versions.forEach(version => {
  console.log(`Version ${version.version} - ${version.status}`);
  console.log(`Historique: ${version.history.length} entrées`);
});
```

## Migration des Données Existantes

Pour migrer les SIPOC existants vers le nouveau système :

```bash
cd apps/api
npx ts-node scripts/migrate-sipoc-versioning.ts
```

Ce script va :
1. Créer une `SipocVersion` pour chaque `SipocDiagram` existant
2. Migrer tous les éléments vers la nouvelle version
3. Migrer toutes les connexions vers la nouvelle version
4. Créer une entrée d'historique pour la migration
5. Mettre à jour les références `currentDraftId` ou `currentPublishedId`

## Avantages du Système

### ✅ Versioning Complet
- Suivi de toutes les modifications
- Historique détaillé des changements
- Possibilité de revenir à une version antérieure

### ✅ Workflow de Publication
- Draft → Review → Approved → Published → Archived
- Contrôle qualité avant publication
- Séparation claire entre versions de travail et versions publiées

### ✅ Collaboration
- Plusieurs utilisateurs peuvent travailler sur des versions différentes
- Approbations via le système de Process (relation one-to-one)
- Historique complet des modifications

### ✅ Intégrité des Données
- Cascade delete sur suppression de version
- Relations bien définies entre versions, éléments et connexions
- Contraintes d'unicité sur les versions

## Statuts des Versions

| Statut | Description | Actions possibles |
|--------|-------------|-------------------|
| `DRAFT` | Version en cours de création | Modifier, Publier, Supprimer |
| `REVIEW` | Version en révision | Approuver, Rejeter |
| `APPROVED` | Version approuvée | Publier |
| `PUBLISHED` | Version publiée et active | Archiver, Dupliquer |
| `ARCHIVED` | Version archivée | Consulter uniquement |

## Règles de Gestion

1. **Un seul draft actif** : Un SIPOC ne peut avoir qu'une seule version draft active à la fois
2. **Une seule version publiée** : Un SIPOC ne peut avoir qu'une seule version publiée active
3. **Suppression limitée** : Seules les versions DRAFT peuvent être supprimées
4. **Modification limitée** : Seules les versions DRAFT peuvent être modifiées
5. **Publication séquentielle** : Pour publier une nouvelle version, l'ancienne est automatiquement archivée

## Exemples d'Utilisation Frontend

### Sélecteur de Version

```typescript
const VersionSelector = ({ sipocId }: { sipocId: string }) => {
  const { data: versions } = useQuery(['sipoc-versions', sipocId], () =>
    sipocApi.getVersions(sipocId)
  );

  return (
    <select>
      <option value={versions?.currentDraft?.id}>
        🔨 Draft v{versions?.currentDraft?.version}
      </option>
      <option value={versions?.currentPublished?.id}>
        ✅ Published v{versions?.currentPublished?.version}
      </option>
      {versions?.archived.map(v => (
        <option key={v.id} value={v.id}>
          📦 Archived v{v.version}
        </option>
      ))}
    </select>
  );
};
```

### Bouton de Publication

```typescript
const PublishButton = ({ versionId }: { versionId: string }) => {
  const publishMutation = useMutation(
    (changesLog: string) => 
      sipocVersionApi.publish(versionId, { changesLog })
  );

  return (
    <button onClick={() => publishMutation.mutate("Version prête")}>
      Publier la Version
    </button>
  );
};
```

## Notes Techniques

- Le système réutilise le modèle `ApprovalRequest` existant (relation Process ↔ SIPOC one-to-one)
- Les migrations Prisma sont automatiquement générées
- Le script de migration préserve toutes les données existantes
- L'historique est tracé dans `SipocHistory` avec `change_type`, `previous_state`, `new_state`
