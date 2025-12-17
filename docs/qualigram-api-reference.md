# Référence API Qualigram

## Base URL

```
/api/v1
```

## Authentification

Tous les endpoints nécessitent une authentification JWT via le header :
```
Authorization: Bearer <token>
```

## MacroProcess API

### Liste des macro-processus

```http
GET /macro-processes?active=true&search=qualité&page=1&limit=10
```

**Réponse** :
```json
{
  "data": [
    {
      "id": "uuid",
      "code": "MP-001",
      "name": "Gestion Qualité",
      "description": "...",
      "color": "#ea580c",
      "icon": "📋",
      "order": 0,
      "active": true,
      "_count": { "processes": 5 }
    }
  ],
  "meta": {
    "total": 10,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### Créer un macro-processus

```http
POST /macro-processes
Content-Type: application/json

{
  "code": "MP-001",
  "name": "Gestion Qualité",
  "description": "...",
  "color": "#ea580c",
  "icon": "📋",
  "order": 0
}
```

### Réorganiser les macro-processus

```http
PATCH /macro-processes/reorder
Content-Type: application/json

{
  "items": [
    { "id": "uuid1", "order": 0 },
    { "id": "uuid2", "order": 1 }
  ]
}
```

## Process API

### Liste des processus

```http
GET /processes?macroId=uuid&status=PUBLISHED&page=1&limit=10
```

### Créer un processus

```http
POST /processes
Content-Type: application/json

{
  "macroId": "uuid",
  "code": "PROC-001",
  "title": "Titre du processus",
  "objectif": "Objectif principal",
  "perimetre": "Périmètre d'application",
  "finalite": "Finalité",
  "level": 1,
  "workspaceId": "uuid"
}
```

### Acteurs du processus

```http
GET /processes/:id/actors
POST /processes/:id/actors
PATCH /processes/:id/actors/:actorId
DELETE /processes/:id/actors/:actorId
```

**Body pour création** :
```json
{
  "name": "Service Qualité",
  "type": "DEPARTMENT",
  "role": "Responsable Qualité",
  "responsibilities": "...",
  "order": 0
}
```

### Entrées/Sorties

```http
GET /processes/:id/inputs
GET /processes/:id/outputs
POST /processes/:id/ios
PATCH /processes/:id/ios/:ioId
DELETE /processes/:id/ios/:ioId
```

**Body pour création** :
```json
{
  "name": "Demande client",
  "description": "...",
  "type": "Document",
  "isInput": true,
  "order": 0
}
```

### Indicateurs

```http
GET /processes/:id/indicators
POST /processes/:id/indicators
PATCH /processes/:id/indicators/:indicatorId
DELETE /processes/:id/indicators/:indicatorId
```

**Body pour création** :
```json
{
  "name": "Taux de satisfaction",
  "description": "...",
  "formula": "Nombre satisfaits / Total * 100",
  "target": "85%",
  "frequency": "Mensuel",
  "unit": "%",
  "order": 0
}
```

### Risques

```http
GET /processes/:id/risks
POST /processes/:id/risks
PATCH /processes/:id/risks/:riskId
DELETE /processes/:id/risks/:riskId
```

**Body pour création** :
```json
{
  "description": "Risque de non-conformité",
  "level": "HIGH",
  "probability": 4,
  "impact": 5,
  "mitigation": "Actions de mitigation...",
  "owner": "Service Qualité",
  "order": 0
}
```

### Documents

```http
GET /processes/:id/documents
POST /processes/:id/documents
PATCH /processes/:id/documents/:documentId
DELETE /processes/:id/documents/:documentId
```

**Body pour création** :
```json
{
  "name": "Manuel qualité",
  "reference": "MAN-QUAL-001",
  "type": "REFERENCE",
  "url": "https://...",
  "version": "1.0",
  "order": 0
}
```

## Procedure API

### Liste des procédures

```http
GET /procedures?processId=uuid
```

### Créer une procédure

```http
POST /procedures
Content-Type: application/json

{
  "processId": "uuid",
  "name": "Procédure de validation",
  "description": "...",
  "objective": "...",
  "scope": "...",
  "version": "1.0"
}
```

### Obtenir une procédure avec relations

```http
GET /procedures/:id
```

**Réponse** :
```json
{
  "id": "uuid",
  "processId": "uuid",
  "name": "...",
  "nodes": [...],
  "edges": [...],
  "lanes": [...],
  "_count": {
    "nodes": 10,
    "edges": 12,
    "lanes": 3
  }
}
```

### Gestion des nœuds

```http
GET /procedures/:id/nodes
POST /procedures/:id/nodes
PATCH /procedures/:id/nodes/:nodeId
DELETE /procedures/:id/nodes/:nodeId
```

**Body pour création** :
```json
{
  "nodeId": "node_1",
  "type": "ACTIVITY",
  "label": "Valider demande",
  "description": "...",
  "positionX": 100,
  "positionY": 200,
  "width": 120,
  "height": 60,
  "laneId": "lane_1",
  "responsible": "Service Qualité",
  "accountable": "Responsable Qualité"
}
```

### Gestion des arêtes

```http
GET /procedures/:id/edges
POST /procedures/:id/edges
PATCH /procedures/:id/edges/:edgeId
DELETE /procedures/:id/edges/:edgeId
```

**Body pour création** :
```json
{
  "edgeId": "edge_1",
  "sourceId": "node_1",
  "targetId": "node_2",
  "type": "SEQUENCE",
  "label": "Suivant",
  "condition": "Si validé"
}
```

### Gestion des swimlanes

```http
GET /procedures/:id/lanes
POST /procedures/:id/lanes
PATCH /procedures/:id/lanes/:laneId
DELETE /procedures/:id/lanes/:laneId
```

**Body pour création** :
```json
{
  "laneId": "lane_1",
  "name": "Service Qualité",
  "color": "#ea580c",
  "order": 0,
  "height": 150,
  "collapsed": false
}
```

### Validation

```http
GET /procedures/:id/validate
```

**Réponse** :
```json
{
  "isValid": false,
  "errors": [
    {
      "code": "NO_START_NODE",
      "message": "Procedure must have at least one START node"
    },
    {
      "code": "MISSING_RESPONSIBLE",
      "message": "Activity 'Valider demande' is missing a Responsible actor",
      "nodeId": "node_1"
    }
  ],
  "warnings": [
    {
      "code": "MULTIPLE_START_NODES",
      "message": "Procedure has 2 START nodes. Consider having only one."
    }
  ]
}
```

### Publication

```http
POST /procedures/:id/publish
```

### Versions

```http
GET /procedures/:id/versions
POST /procedures/:id/versions
```

**Body pour création de version** :
```json
{
  "changeLog": "Ajout de nouvelles activités de validation"
}
```

## Codes d'erreur

- `400` : Requête invalide
- `401` : Non authentifié
- `403` : Non autorisé
- `404` : Ressource non trouvée
- `409` : Conflit (ex: code déjà existant)
- `500` : Erreur serveur

## Pagination

Les endpoints de liste supportent la pagination :
- `page` : Numéro de page (défaut: 1)
- `limit` : Nombre d'éléments par page (défaut: 10)

## Filtres

Les endpoints de liste supportent des filtres :
- `search` : Recherche textuelle
- `active` : Filtrer par statut actif/inactif
- `status` : Filtrer par statut
- `macroId` : Filtrer par macro-processus

