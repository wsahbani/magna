# Implémentation Qualigram Multi-Niveaux - Documentation

## Vue d'ensemble

Cette implémentation permet la modélisation visuelle de tous les niveaux Qualigram dans un seul FlowEditor :
- **MacroProcess (Niveau 1)** : Peut contenir des nœuds représentant des **Process (Niveau 2)**
- **Process (Niveau 2)** : Peut contenir des nœuds représentant des **Procedure (Niveau 3)**
- **Procedure (Niveau 3)** : Contient les nœuds du logigramme Qualigram (START, END, ACTIVITY, etc.)

## Architecture

### Backend (API)

#### Schéma Prisma

**Modifications principales :**

1. **DiagramNode** - Support multi-niveaux
   - `macroProcessId String?` - Niveau 1
   - `processId String?` - Niveau 2
   - `procedureId String?` - Niveau 3
   - `referencedEntityId String?` - ID de l'entité créée automatiquement
   - `referencedEntityType String?` - 'PROCESS' ou 'PROCEDURE'

2. **DiagramEdge** - Support multi-niveaux
   - `macroProcessId String?`
   - `processId String?`
   - `procedureId String?`

3. **DiagramLane** - Support multi-niveaux
   - `macroProcessId String?`
   - `processId String?`
   - `procedureId String?`

4. **QualigramNodeType** - Nouveaux types
   - `PROCESS_NODE` - Représente un Process dans un MacroProcess
   - `PROCEDURE_NODE` - Représente une Procedure dans un Process

5. **Relations**
   - `MacroProcess` → `diagramNodes`, `diagramEdges`, `diagramLanes`
   - `Process` → `diagramNodes`, `diagramEdges`, `diagramLanes`

#### Services

**DiagramService** (`apps/api/src/modules/procedure/services/diagram.service.ts`)
- Service générique pour gérer les diagram elements des trois niveaux
- Création automatique de Process/Procedure lors du drop de nœuds
- Méthodes CRUD pour nodes, edges, lanes

**Endpoints API :**

- **MacroProcess**
  - `GET /macro-processes/:id/nodes`
  - `POST /macro-processes/:id/nodes`
  - `PATCH /macro-processes/:id/nodes/:nodeId`
  - `DELETE /macro-processes/:id/nodes/:nodeId`
  - (Mêmes endpoints pour `edges` et `lanes`)

- **Process**
  - `GET /processes/:id/nodes`
  - `POST /processes/:id/nodes`
  - `PATCH /processes/:id/nodes/:nodeId`
  - `DELETE /processes/:id/nodes/:nodeId`
  - (Mêmes endpoints pour `edges` et `lanes`)

- **Procedure** (existants)
  - `GET /procedures/:id/nodes`
  - `POST /procedures/:id/nodes`
  - etc.

### Frontend

#### Services API

**diagram.api.ts** (`apps/web/src/lib/api/diagram.api.ts`)
- Service générique pour les trois niveaux
- Méthodes : `getNodes`, `createNode`, `updateNode`, `deleteNode`, etc.

#### Hooks React Query

**useDiagramElements.ts** (`apps/web/src/features/qualigram/hooks/useDiagramElements.ts`)
- `useDiagramNodes(level, levelId)`
- `useDiagramEdges(level, levelId)`
- `useDiagramLanes(level, levelId)`
- Mutations pour créer/mettre à jour/supprimer

#### Composants

**NodePalette** (`apps/web/src/features/procedures/components/NodePalette.tsx`)
- Affiche les types selon le niveau :
  - MacroProcess → seulement `PROCESS_NODE`
  - Process → seulement `PROCEDURE_NODE`
  - Procedure → tous les types Qualigram (sauf PROCESS_NODE et PROCEDURE_NODE)

**QualigramFlowEditor** (`apps/web/src/features/qualigram/components/QualigramFlowEditor.tsx`)
- Orchestre les trois panneaux (hiérarchie, canvas, propriétés)
- Charge les bons éléments selon le niveau sélectionné

**QualigramFlowCanvas** (`apps/web/src/features/qualigram/components/QualigramFlowCanvas.tsx`)
- Affiche `ProcedureEditor` pour tous les niveaux
- Passe les bons paramètres selon le niveau

**ProcedureEditor** (`apps/web/src/features/procedures/components/ProcedureEditor.tsx`)
- Adapté pour utiliser les bons hooks selon le niveau
- Gère la création automatique de Process/Procedure lors du drop

## Migration Prisma

### Étape 1 : Créer la migration

```bash
cd apps/api
pnpm prisma migrate dev --name add_multi_level_diagram_support
```

Cette migration va :
1. Rendre `procedureId` optionnel dans `DiagramNode`, `DiagramEdge`, `DiagramLane`
2. Ajouter `macroProcessId` et `processId` comme champs optionnels
3. Ajouter `referencedEntityId` et `referencedEntityType` dans `DiagramNode`
4. Ajouter `PROCESS_NODE` et `PROCEDURE_NODE` dans l'enum `QualigramNodeType`
5. Créer les nouvelles relations et index
6. Migrer les données existantes (tous les DiagramNode existants gardent leur `procedureId`)

### Étape 2 : Vérifier la migration

```bash
cd apps/api
pnpm prisma migrate status
```

### Étape 3 : Appliquer la migration (si nécessaire)

```bash
cd apps/api
pnpm prisma migrate deploy
```

## Flux d'utilisation

### 1. Créer un MacroProcess

1. Ouvrir `/qualigram/editor`
2. Cliquer sur "Créer MacroProcess"
3. Remplir le formulaire
4. Le MacroProcess apparaît dans le panneau de gauche

### 2. Modéliser un MacroProcess (créer des Process)

1. Sélectionner un MacroProcess
2. Le canvas s'affiche avec la palette contenant seulement `PROCESS_NODE`
3. Glisser-déposer un `PROCESS_NODE` sur le canvas
4. Un nouveau Process est créé automatiquement
5. Le nœud est lié au Process créé via `referencedEntityId`

### 3. Modéliser un Process (créer des Procedure)

1. Sélectionner un Process dans la hiérarchie
2. Le canvas s'affiche avec la palette contenant seulement `PROCEDURE_NODE`
3. Glisser-déposer un `PROCEDURE_NODE` sur le canvas
4. Une nouvelle Procedure est créée automatiquement
5. Le nœud est lié à la Procedure créée via `referencedEntityId`

### 4. Modéliser une Procedure (logigramme Qualigram)

1. Sélectionner une Procedure dans la hiérarchie
2. Le canvas s'affiche avec la palette complète Qualigram
3. Glisser-déposer les nœuds (START, END, ACTIVITY, etc.)
4. Connecter les nœuds avec des edges
5. Organiser en swimlanes si nécessaire

## Validation et règles

### Règles de validation Qualigram

- Un DiagramNode doit avoir exactement un des trois IDs (macroProcessId, processId, procedureId)
- Les DiagramEdge doivent connecter des DiagramNode du même niveau
- Les DiagramLane doivent être du même niveau que leurs DiagramNode
- Un Procedure doit avoir au moins un nœud START et un nœud END
- Les nœuds de décision doivent avoir au moins 2 edges sortants avec conditions

## Tests recommandés

### Tests Backend

1. **Créer un DiagramNode pour MacroProcess**
   ```bash
   POST /macro-processes/{id}/nodes
   {
     "nodeId": "node_1",
     "type": "PROCESS_NODE",
     "label": "Nouveau Processus",
     "positionX": 100,
     "positionY": 100
   }
   ```
   - Vérifier qu'un Process est créé automatiquement
   - Vérifier que `referencedEntityId` pointe vers le Process créé

2. **Créer un DiagramNode pour Process**
   ```bash
   POST /processes/{id}/nodes
   {
     "nodeId": "node_1",
     "type": "PROCEDURE_NODE",
     "label": "Nouvelle Procédure",
     "positionX": 100,
     "positionY": 100
   }
   ```
   - Vérifier qu'une Procedure est créée automatiquement
   - Vérifier que `referencedEntityId` pointe vers la Procedure créée

3. **Créer un DiagramEdge**
   - Vérifier que les nœuds source et target sont du même niveau

### Tests Frontend

1. **Navigation hiérarchique**
   - Sélectionner MacroProcess → vérifier que les Process s'affichent
   - Sélectionner Process → vérifier que les Procedure s'affichent

2. **Palette selon niveau**
   - MacroProcess → seulement PROCESS_NODE visible
   - Process → seulement PROCEDURE_NODE visible
   - Procedure → tous les types Qualigram visibles

3. **Drop et création automatique**
   - Drop PROCESS_NODE dans MacroProcess → Process créé
   - Drop PROCEDURE_NODE dans Process → Procedure créée
   - Vérifier le rafraîchissement de la hiérarchie

## Points d'attention

1. **Migration de données**
   - Les DiagramNode existants gardent leur `procedureId`
   - Les nouveaux champs (`macroProcessId`, `processId`) sont null pour les données existantes

2. **Création automatique**
   - Le workspaceId est récupéré depuis le premier Process du MacroProcess
   - Si aucun Process n'existe, utilise 'default-workspace-id' (à améliorer)

3. **Validation**
   - La validation Qualigram n'est disponible que pour le niveau Procedure
   - Les niveaux MacroProcess et Process n'ont pas de validation de logigramme

4. **Performance**
   - Les hooks React Query mettent en cache les données par niveau
   - L'invalidation se fait automatiquement lors des mutations

## Améliorations futures

1. **Gestion du workspaceId**
   - Récupérer depuis le contexte utilisateur ou le MacroProcess
   - Permettre de spécifier le workspaceId lors de la création

2. **Feedback utilisateur**
   - Toast notification lors de la création automatique de Process/Procedure
   - Indicateur de chargement pendant la création

3. **Rafraîchissement automatique**
   - Rafraîchir la hiérarchie après création automatique
   - Sélectionner automatiquement l'entité créée

4. **Validation multi-niveaux**
   - Étendre la validation pour MacroProcess et Process
   - Vérifier la cohérence entre les niveaux

5. **Export/Import**
   - Exporter un MacroProcess avec tous ses Process et Procedure
   - Importer un diagram complet

## Fichiers modifiés/créés

### Backend
- `apps/api/prisma/schema.prisma` - Schéma adapté
- `apps/api/src/modules/procedure/services/diagram.service.ts` - Nouveau service
- `apps/api/src/modules/procedure/dto/*.dto.ts` - DTOs adaptés
- `apps/api/src/modules/macro-process/macro-process.controller.ts` - Endpoints ajoutés
- `apps/api/src/modules/process/process.controller.ts` - Endpoints ajoutés
- `apps/api/src/modules/*/module.ts` - Modules mis à jour

### Frontend
- `apps/web/src/lib/api/diagram.api.ts` - Nouveau service API
- `apps/web/src/features/qualigram/hooks/useDiagramElements.ts` - Nouveaux hooks
- `apps/web/src/features/procedures/types/procedure.types.ts` - Types adaptés
- `apps/web/src/features/procedures/components/NodePalette.tsx` - Adapté pour niveaux
- `apps/web/src/features/procedures/components/ProcedureEditor.tsx` - Adapté pour niveaux
- `apps/web/src/features/qualigram/components/*.tsx` - Composants adaptés

## Commandes utiles

```bash
# Backend - Formater le schéma Prisma
cd apps/api && pnpm prisma format

# Backend - Valider le schéma
cd apps/api && pnpm prisma validate

# Backend - Générer le client Prisma
cd apps/api && pnpm prisma generate

# Frontend - Vérifier les types TypeScript
cd apps/web && pnpm run type-check

# Frontend - Linter
cd apps/web && pnpm run lint
```

