# Modèle de Données Qualigram

## Vue d'ensemble

Le modèle de données Qualigram suit une hiérarchie à 3 niveaux conforme aux standards ISO 9001:2015 et BPMN 2.0.

## Hiérarchie

```
MacroProcess (Niveau 1 - Stratégique)
  └── Process (Niveau 2 - Management)
        └── Procedure (Niveau 3 - Opérationnel)
              ├── DiagramNode[] (Nœuds du logigramme)
              ├── DiagramEdge[] (Arêtes de connexion)
              └── DiagramLane[] (Swimlanes)
```

## Modèles Principaux

### MacroProcess

**Table** : `macro_processes`

**Champs** :
- `id` : UUID (PK)
- `code` : String unique (ex: "MP-001")
- `name` : String
- `description` : String?
- `color` : String? (Hex color)
- `icon` : String?
- `order` : Int (pour réorganisation)
- `active` : Boolean
- `createdAt` : DateTime
- `updatedAt` : DateTime

**Relations** :
- `processes` : Process[] (un MacroProcess a plusieurs Process)

### Process

**Table** : `processes`

**Champs principaux** :
- `id` : CUID (PK)
- `macroId` : UUID? (FK → MacroProcess)
- `code` : String unique
- `title` : String (nouveau champ Qualigram)
- `name` : String (conservé pour compatibilité)
- `description` : String?
- `objectif` : String? (Objectif du processus)
- `perimetre` : String? (Périmètre d'application)
- `finalite` : String? (Purpose/Goal)
- `type` : ProcessType (FLOW, SIPOC, BPMN)
- `level` : Int (1-4)
- `status` : ProcessStatus (DRAFT, IN_REVIEW, VALIDATED, PUBLISHED, ARCHIVED, OBSOLETE)
- `approvalDate` : DateTime?
- `nextReviewDate` : DateTime?
- `reviewFrequency` : Int? (en mois)

**Relations** :
- `macro` : MacroProcess?
- `procedures` : Procedure[]
- `actors` : ProcessActor[]
- `processIOs` : ProcessIO[]
- `processIndicators` : Indicator[]
- `processRisks` : Risk[]
- `linkedDocs` : LinkedDocument[]

### ProcessActor

**Table** : `process_actors`

**Champs** :
- `id` : UUID (PK)
- `processId` : UUID (FK → Process)
- `name` : String
- `type` : ActorType (ROLE, DEPARTMENT, EXTERNAL, SYSTEM)
- `role` : String? (Fonction/Position)
- `responsibilities` : String?
- `order` : Int

### ProcessIO

**Table** : `process_ios`

**Champs** :
- `id` : UUID (PK)
- `processId` : UUID (FK → Process)
- `name` : String
- `description` : String?
- `type` : String? (Document, Data, Material, etc.)
- `isInput` : Boolean (true = entrée, false = sortie)
- `order` : Int

### Indicator

**Table** : `indicators`

**Champs** :
- `id` : UUID (PK)
- `processId` : UUID (FK → Process)
- `name` : String
- `description` : String?
- `formula` : String?
- `target` : String? (Valeur cible)
- `frequency` : String? (Fréquence de mesure)
- `unit` : String?
- `order` : Int

### Risk

**Table** : `risks`

**Champs** :
- `id` : UUID (PK)
- `processId` : UUID (FK → Process)
- `description` : String
- `level` : RiskLevel (LOW, MEDIUM, HIGH, CRITICAL)
- `probability` : Int? (1-5)
- `impact` : Int? (1-5)
- `mitigation` : String?
- `owner` : String?
- `order` : Int

### Procedure

**Table** : `procedures`

**Champs** :
- `id` : UUID (PK)
- `processId` : UUID (FK → Process)
- `name` : String
- `description` : String?
- `objective` : String?
- `scope` : String?
- `version` : String (ex: "1.0")
- `status` : ProcessStatus
- `validatedBy` : String? (FK → User)
- `validatedAt` : DateTime?
- `effectiveDate` : DateTime?
- `expirationDate` : DateTime?
- `createdAt` : DateTime
- `updatedAt` : DateTime

**Relations** :
- `process` : Process
- `nodes` : DiagramNode[]
- `edges` : DiagramEdge[]
- `lanes` : DiagramLane[]
- `versions` : ProcedureVersion[]

### DiagramNode

**Table** : `diagram_nodes`

**Champs** :
- `id` : UUID (PK)
- `procedureId` : UUID (FK → Procedure)
- `nodeId` : String (Identifiant frontend, unique par procedure)
- `type` : QualigramNodeType
- `label` : String
- `description` : String?
- `positionX` : Float
- `positionY` : Float
- `width` : Float? (défaut: 120)
- `height` : Float? (défaut: 60)
- `laneId` : UUID? (FK → DiagramLane)
- `duration` : Int? (minutes)
- `dueDate` : DateTime?
- `responsible` : String? (RACI - R)
- `accountable` : String? (RACI - A)
- `consulted` : String? (RACI - C)
- `informed` : String? (RACI - I)
- `data` : Json? (Données personnalisées)
- `style` : Json? (Styles visuels)
- `createdAt` : DateTime
- `updatedAt` : DateTime

**Contraintes** :
- `@@unique([procedureId, nodeId])` : nodeId unique par procedure

### DiagramEdge

**Table** : `diagram_edges`

**Champs** :
- `id` : UUID (PK)
- `procedureId` : UUID (FK → Procedure)
- `edgeId` : String (Identifiant frontend, unique par procedure)
- `sourceId` : UUID (FK → DiagramNode.id)
- `targetId` : UUID (FK → DiagramNode.id)
- `type` : QualigramEdgeType (SEQUENCE, CONDITIONAL, DEFAULT, MESSAGE)
- `label` : String?
- `condition` : String? (Pour arêtes conditionnelles)
- `animated` : Boolean
- `style` : Json?
- `data` : Json?
- `createdAt` : DateTime
- `updatedAt` : DateTime

**Contraintes** :
- `@@unique([procedureId, edgeId])` : edgeId unique par procedure

### DiagramLane

**Table** : `diagram_lanes`

**Champs** :
- `id` : UUID (PK)
- `procedureId` : UUID (FK → Procedure)
- `laneId` : String (Identifiant frontend, unique par procedure)
- `name` : String (Nom acteur/rôle/département)
- `color` : String? (Hex color)
- `order` : Int
- `height` : Float? (défaut: 150)
- `collapsed` : Boolean
- `data` : Json?
- `createdAt` : DateTime
- `updatedAt` : DateTime

**Contraintes** :
- `@@unique([procedureId, laneId])` : laneId unique par procedure

### ProcedureVersion

**Table** : `procedure_versions`

**Champs** :
- `id` : UUID (PK)
- `procedureId` : UUID (FK → Procedure)
- `version` : String (ex: "1.0")
- `versionNumber` : Int (1, 2, 3...)
- `changeLog` : String?
- `status` : ProcessStatus
- `nodesSnapshot` : Json (Snapshot complet des nodes)
- `edgesSnapshot` : Json (Snapshot complet des edges)
- `lanesSnapshot` : Json (Snapshot complet des lanes)
- `metadata` : Json?
- `validatedBy` : String? (FK → User)
- `validatedAt` : DateTime?
- `createdAt` : DateTime

## Enums

### ProcessStatus
```prisma
enum ProcessStatus {
  DRAFT
  IN_REVIEW
  VALIDATED
  PUBLISHED
  ARCHIVED
  OBSOLETE
}
```

### QualigramNodeType
```prisma
enum QualigramNodeType {
  START
  END
  ACTIVITY
  DECISION
  SUBPROCESS
  DOCUMENT
  COMMENT
  CONNECTOR
  GATEWAY_AND
  GATEWAY_OR
  GATEWAY_XOR
  EVENT_TIMER
  EVENT_MESSAGE
}
```

### QualigramEdgeType
```prisma
enum QualigramEdgeType {
  SEQUENCE
  CONDITIONAL
  DEFAULT
  MESSAGE
}
```

### ActorType
```prisma
enum ActorType {
  ROLE
  DEPARTMENT
  EXTERNAL
  SYSTEM
}
```

### RiskLevel
```prisma
enum RiskLevel {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}
```

### DocumentType
```prisma
enum DocumentType {
  INPUT
  OUTPUT
  REFERENCE
  TEMPLATE
  RECORD
}
```

## Relations Clés

### MacroProcess → Process
- Un MacroProcess peut avoir plusieurs Process
- Un Process appartient à un MacroProcess (optionnel)

### Process → Procedure
- Un Process peut avoir plusieurs Procedure
- Une Procedure appartient à un Process

### Procedure → DiagramNode/DiagramEdge/DiagramLane
- Une Procedure a plusieurs DiagramNode
- Une Procedure a plusieurs DiagramEdge
- Une Procedure a plusieurs DiagramLane

### DiagramNode → DiagramLane
- Un DiagramNode peut appartenir à une DiagramLane
- Une DiagramLane a plusieurs DiagramNode

### DiagramEdge → DiagramNode
- Une DiagramEdge connecte deux DiagramNode (source et target)

## Index

Index créés pour optimiser les requêtes :
- `MacroProcess` : `code`, `order`
- `Process` : `macroId`, `code`, `workspaceId + status`, `departmentId`
- `ProcessActor` : `processId`
- `ProcessIO` : `processId`, `isInput`
- `Indicator` : `processId`
- `Risk` : `processId`, `level`
- `LinkedDocument` : `processId`, `procedureId`, `type`
- `Procedure` : `processId`, `status`
- `DiagramNode` : `procedureId`, `laneId`, `type`
- `DiagramEdge` : `procedureId`, `sourceId`, `targetId`
- `DiagramLane` : `procedureId`, `order`
- `ProcedureVersion` : `procedureId`, `versionNumber`, `status`

## Contraintes d'Unicité

- `MacroProcess.code` : Unique
- `Process.code` : Unique
- `Process.workspaceId + name + version` : Unique
- `ProcedureVersion.procedureId + version` : Unique
- `DiagramNode.procedureId + nodeId` : Unique
- `DiagramEdge.procedureId + edgeId` : Unique
- `DiagramLane.procedureId + laneId` : Unique

## Soft Deletes

Les suppressions sont gérées via le champ `active` :
- `MacroProcess.active` : false = supprimé
- `Process` : Utilise `status: ARCHIVED` pour soft delete

## Versioning

Le versioning est géré via :
- `Procedure.version` : String (ex: "1.0", "1.1", "2.0")
- `ProcedureVersion` : Snapshots complets stockés en JSON
- Chaque version capture l'état complet du diagramme

