# Guide de Migration vers l'Architecture Qualigram

## Vue d'ensemble

Ce document décrit la migration du système de gestion de processus vers l'architecture Qualigram standardisée avec hiérarchie à 3 niveaux.

## Architecture Qualigram

### Hiérarchie à 3 niveaux

1. **Niveau 1 - MacroProcess** : Processus macro (niveau stratégique)
2. **Niveau 2 - Process** : Processus détaillé avec métadonnées structurées
3. **Niveau 3 - Procedure** : Logigramme avec DiagramNode, DiagramEdge, DiagramLane

### Modèles de données

#### MacroProcess
- `id`, `code` (unique), `name`, `description`
- `color`, `icon`, `order`, `active`
- Relation vers `Process[]`

#### Process (adapté)
- Nouveaux champs : `macroId`, `code` (unique), `title`, `objectif`, `perimetre`, `finalite`
- Nouveaux statuts : `IN_REVIEW`, `VALIDATED`, `OBSOLETE`
- Métadonnées structurées :
  - `ProcessActor[]` : Acteurs du processus
  - `ProcessIO[]` : Entrées/Sorties
  - `Indicator[]` : Indicateurs de performance
  - `Risk[]` : Risques identifiés
  - `LinkedDocument[]` : Documents liés

#### Procedure
- `id`, `processId`, `name`, `version`, `status`
- Métadonnées : `validatedBy`, `validatedAt`, `effectiveDate`, `expirationDate`
- Éléments du diagramme :
  - `DiagramNode[]` : Nœuds du logigramme
  - `DiagramEdge[]` : Arêtes de connexion
  - `DiagramLane[]` : Swimlanes (acteurs/rôles)

#### DiagramNode
- `nodeId` : Identifiant frontend (unique par procedure)
- `type` : QualigramNodeType (START, END, ACTIVITY, DECISION, GATEWAY_*, etc.)
- `positionX`, `positionY`, `width`, `height`
- `laneId` : Relation vers DiagramLane
- RACI : `responsible`, `accountable`, `consulted`, `informed`

#### DiagramEdge
- `edgeId` : Identifiant frontend (unique par procedure)
- `sourceId`, `targetId` : Références vers nodeId
- `type` : QualigramEdgeType (SEQUENCE, CONDITIONAL, DEFAULT, MESSAGE)
- `condition` : Condition pour les arêtes conditionnelles

#### DiagramLane
- `laneId` : Identifiant frontend (unique par procedure)
- `name` : Nom de l'acteur/rôle/département
- `color`, `order`, `height`, `collapsed`

## Script de Migration

### Exécution

```bash
cd apps/api
pnpm ts-node src/scripts/migrate-to-qualigram.ts
```

### Étapes de migration

1. **Création MacroProcess par défaut**
   - Crée un MacroProcess "DEFAULT" pour les processus existants

2. **Mise à jour des Processes**
   - Ajoute `macroId` (lien vers MacroProcess par défaut)
   - Génère `code` unique si manquant
   - Utilise `name` comme `title` si `title` manquant

3. **Migration ProcessVersion → Procedure**
   - Crée une Procedure pour chaque ProcessVersion
   - Conserve le numéro de version
   - Migre le statut

4. **Migration Node → DiagramNode**
   - Convertit chaque Node en DiagramNode
   - Génère `nodeId` unique (node_xxx)
   - Mappe les types de nœuds (START_EVENT → START, etc.)
   - Conserve les positions et styles

5. **Migration Edge → DiagramEdge**
   - Convertit chaque Edge en DiagramEdge
   - Génère `edgeId` unique (edge_xxx)
   - Trouve les DiagramNode correspondants par leurs IDs
   - Mappe les types d'arêtes

6. **Création DiagramLane**
   - Crée des swimlanes basées sur les rôles (Role) des nœuds
   - Assigne les nœuds aux swimlanes correspondantes

7. **Création ProcedureVersion snapshots**
   - Crée un snapshot initial pour chaque Procedure
   - Stocke les nodes, edges et lanes en JSON

## Changements API

### Nouveaux endpoints

#### MacroProcess
- `GET /macro-processes` : Liste avec pagination
- `POST /macro-processes` : Création
- `GET /macro-processes/:id` : Détails
- `PATCH /macro-processes/:id` : Mise à jour
- `DELETE /macro-processes/:id` : Suppression (soft delete)
- `PATCH /macro-processes/reorder` : Réorganisation

#### Process (adapté)
- Nouveaux endpoints pour métadonnées :
  - `GET /processes/:id/actors` : Liste des acteurs
  - `POST /processes/:id/actors` : Créer acteur
  - `PATCH /processes/:id/actors/:actorId` : Modifier acteur
  - `DELETE /processes/:id/actors/:actorId` : Supprimer acteur
  - Même structure pour `inputs`, `outputs`, `indicators`, `risks`, `documents`

#### Procedure
- `GET /procedures` : Liste (avec filtre processId)
- `POST /procedures` : Création
- `GET /procedures/:id` : Détails avec nodes/edges/lanes
- `PATCH /procedures/:id` : Mise à jour
- `DELETE /procedures/:id` : Suppression

**Nodes** :
- `GET /procedures/:id/nodes` : Liste des nœuds
- `POST /procedures/:id/nodes` : Créer nœud
- `PATCH /procedures/:id/nodes/:nodeId` : Modifier nœud
- `DELETE /procedures/:id/nodes/:nodeId` : Supprimer nœud

**Edges** :
- `GET /procedures/:id/edges` : Liste des arêtes
- `POST /procedures/:id/edges` : Créer arête
- `PATCH /procedures/:id/edges/:edgeId` : Modifier arête
- `DELETE /procedures/:id/edges/:edgeId` : Supprimer arête

**Lanes** :
- `GET /procedures/:id/lanes` : Liste des swimlanes
- `POST /procedures/:id/lanes` : Créer swimlane
- `PATCH /procedures/:id/lanes/:laneId` : Modifier swimlane
- `DELETE /procedures/:id/lanes/:laneId` : Supprimer swimlane

**Validation & Publication** :
- `GET /procedures/:id/validate` : Valider la procédure
- `POST /procedures/:id/publish` : Publier la procédure

**Versions** :
- `GET /procedures/:id/versions` : Liste des versions
- `POST /procedures/:id/versions` : Créer nouvelle version (snapshot)

## Règles de Validation Qualigram

Le `ProcedureValidationService` implémente les règles suivantes :

1. **START/END nodes** : Au moins un nœud START et un nœud END
2. **Nœuds orphelins** : Tous les nœuds doivent être connectés (sauf START/END)
3. **Décisions** : Les nœuds DECISION doivent avoir au moins 2 arêtes sortantes avec conditions
4. **Gateways** : Vérification des paires split/merge
5. **RACI** : Chaque ACTIVITY doit avoir au moins Responsible et Accountable
6. **Arêtes conditionnelles** : Doivent avoir une condition définie
7. **Cycles** : Détection des boucles infinies potentielles

## Migration Frontend

### Types TypeScript

Les types ont été adaptés pour inclure :
- `macroId`, `title`, `objectif`, `perimetre`, `finalite` dans `Process`
- Nouveaux types : `ProcessActor`, `ProcessIO`, `Indicator`, `Risk`, `LinkedDocument`
- Types Procedure : `DiagramNode`, `DiagramEdge`, `DiagramLane`, `ProcedureVersion`

### Composants créés

1. **MacroProcess** :
   - `MacroProcessCard`, `MacroProcessForm`, `MacroProcessListPage`

2. **Process** (adapté) :
   - `ProcessFilters` : Ajout filtre MacroProcess
   - `ProcessForm` : Ajout champs Qualigram
   - `ProcessActorsTab`, `ProcessActorForm` : Gestion des acteurs

3. **Procedure** :
   - `ProcedureEditor` : Éditeur ReactFlow complet
   - `NodePalette` : Palette de nœuds Qualigram
   - `LanePanel`, `LaneForm` : Gestion des swimlanes
   - `PropertiesPanel` : Panneau de propriétés (Général + RACI)
   - `ValidationPanel` : Affichage des résultats de validation
   - `ProcedureDetailPage` : Page principale avec onglets

## Points d'attention

1. **Compatibilité ascendante** : Les champs `name` sont conservés pour compatibilité
2. **Migration des données** : Le script de migration doit être exécuté avant le déploiement
3. **nodeId/edgeId** : Identifiants frontend uniques par procedure (pas globaux)
4. **Snapshots** : Les ProcedureVersion stockent des snapshots complets en JSON
5. **Validation** : La validation doit être effectuée avant publication

## Prochaines étapes

1. Exécuter le script de migration sur les données de production
2. Tester les nouveaux endpoints API
3. Tester l'éditeur Procedure dans le frontend
4. Former les utilisateurs sur la nouvelle structure Qualigram

