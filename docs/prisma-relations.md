# Relations entre les Entités - Schéma Prisma

## Vue d'ensemble

Le schéma Prisma est organisé en plusieurs domaines fonctionnels :
1. **Workspace & Organisation** (Workspace, Department, User, Group)
2. **Qualigram Hierarchy** (MacroProcess → Process → Procedure)
3. **Diagram Elements** (DiagramNode, DiagramEdge, DiagramLane)
4. **Process Metadata** (Actors, IO, Indicators, Risks, Documents)
5. **Versioning** (ProcessVersion, ProcedureVersion)
6. **Legacy/Compatibility** (Node, Edge - ancien système PYX4)
7. **Collaboration** (Comments, Approvals, Notifications)
8. **SIPOC & FIP** (SipocDiagram, ProcessIdentityCard)

---

## 1. HIÉRARCHIE QUALIGRAM (3 niveaux)

### MacroProcess (Niveau 1)
```
MacroProcess (1) ──< (N) Process
```
- **Relation** : Un MacroProcess contient plusieurs Process
- **Cardinalité** : 1-N (un MacroProcess peut avoir plusieurs Process)
- **Cascade** : Si un MacroProcess est supprimé, les Process sont mis à `null` (`onDelete: SetNull`)
- **Champ** : `Process.macroId` (optionnel)

### Process (Niveau 2)
```
Process (1) ──< (N) Procedure
```
- **Relation** : Un Process contient plusieurs Procedure
- **Cardinalité** : 1-N
- **Cascade** : Si un Process est supprimé, les Procedure sont supprimées (`onDelete: Cascade`)
- **Champ** : `Procedure.processId` (requis)

### Hiérarchie Process (auto-référence)
```
Process (1) ──< (N) Process (enfants)
Process (N) >── (1) Process (parent)
```
- **Relation** : Un Process peut avoir un parent Process et plusieurs enfants
- **Cardinalité** : 1-N (auto-référence)
- **Champ** : `Process.parentId` (optionnel)

---

## 2. ÉLÉMENTS DE DIAGRAMME (Multi-niveaux)

### DiagramNode (Nœuds du diagramme)
```
DiagramNode peut appartenir à :
  - MacroProcess (Niveau 1) via macroProcessId
  - Process (Niveau 2) via processId
  - Procedure (Niveau 3) via procedureId

DiagramNode (N) >── (1) DiagramLane
DiagramNode (1) ──< (N) DiagramEdge (outgoing)
DiagramNode (1) ──< (N) DiagramEdge (incoming)
```
- **Contrainte** : Un seul des trois IDs doit être défini (macroProcessId, processId, ou procedureId)
- **Unique** : `[macroProcessId, nodeId]`, `[processId, nodeId]`, `[procedureId, nodeId]`
- **Cascade** : Suppression en cascade si le parent est supprimé
- **Lane** : Optionnel, référence vers DiagramLane

### DiagramEdge (Connexions)
```
DiagramEdge peut appartenir à :
  - MacroProcess via macroProcessId
  - Process via processId
  - Procedure via procedureId

DiagramEdge (N) >── (1) DiagramNode (source)
DiagramEdge (N) >── (1) DiagramNode (target)
```
- **Contrainte** : Un seul des trois IDs doit être défini
- **Unique** : `[macroProcessId, edgeId]`, `[processId, edgeId]`, `[procedureId, edgeId]`
- **Cascade** : Suppression en cascade

### DiagramLane (Swimlanes)
```
DiagramLane peut appartenir à :
  - MacroProcess via macroProcessId
  - Process via processId
  - Procedure via procedureId

DiagramLane (1) ──< (N) DiagramNode
```
- **Contrainte** : Un seul des trois IDs doit être défini
- **Unique** : `[macroProcessId, laneId]`, `[processId, laneId]`, `[procedureId, laneId]`
- **Cascade** : Suppression en cascade

---

## 3. ORGANISATION & WORKSPACE

### Workspace
```
Workspace (1) ──< (N) Workspace (enfants - hiérarchie)
Workspace (N) >── (1) Workspace (parent)
Workspace (1) ──< (N) Department
Workspace (1) ──< (N) Process
Workspace (1) ──< (N) WorkspaceMember
Workspace (1) ──< (1) WorkspaceSettings (unique)
Workspace (1) ──< (N) ProcessTemplate
Workspace (1) ──< (N) ProcessTag
Workspace (1) ──< (N) NodeTemplate
Workspace (1) ──< (N) ProcessTheme
```
- **Hiérarchie** : Auto-référence pour créer une hiérarchie (Group > Entity > Direction > Department > Team)
- **Settings** : Relation 1-1 unique (`workspaceId` unique)

### Department
```
Department (N) >── (1) Workspace
Department (1) ──< (N) User
Department (1) ──< (N) Process
```
- **Unique** : `[workspaceId, code]` (code unique par workspace)
- **Cascade** : Suppression en cascade si Workspace supprimé

### User
```
User (N) >── (1) Group (optionnel)
User (N) >── (1) Department (optionnel)
User (1) ──< (N) WorkspaceMember
User (1) ──< (N) Process (créés - ProcessCreator)
User (1) ──< (N) Process (propriétaires - ProcessOwners)
User (1) ──< (N) Procedure (éditeurs - ProcedureEditors)
User (1) ──< (N) ProcedureVersion (validateurs - VersionValidators)
User (1) ──< (N) Comment
User (1) ──< (N) Comment (résolus - CommentResolver)
User (1) ──< (N) ApprovalRequest
User (1) ──< (N) ReadingConfirmation
User (1) ──< (N) ProcessAssignment
User (1) ──< (N) AuditLog
User (1) ──< (N) Notification
User (1) ──< (N) ProcessTemplate
User (1) ──< (N) NodeTemplate
User (1) ──< (N) SipocDiagram
User (1) ──< (N) SipocHistory
User (1) ──< (N) SipocPermission (utilisateur)
User (1) ──< (N) SipocPermission (grantedBy)
User (1) ──< (N) SipocComment
User (1) ──< (N) ProcessIdentityCard
```
- **Group** : Optionnel, un utilisateur appartient à un seul groupe
- **Department** : Optionnel
- **Relations multiples** : Plusieurs relations avec Process via des noms de relation différents

### Group
```
Group (1) ──< (N) User
Group (1) ──< (N) GroupPermission
```
- **Unique** : `name` et `code` sont uniques

### WorkspaceMember (Table de jonction)
```
WorkspaceMember (N) >── (1) User
WorkspaceMember (N) >── (1) Workspace
```
- **Unique** : `[userId, workspaceId]` (un utilisateur ne peut être membre qu'une fois par workspace)
- **Cascade** : Suppression en cascade si User ou Workspace supprimé

---

## 4. MÉTADONNÉES PROCESS (Qualigram structuré)

### ProcessActor
```
ProcessActor (N) >── (1) Process
```
- **Cardinalité** : N-1
- **Cascade** : Suppression en cascade si Process supprimé

### ProcessIO
```
ProcessIO (N) >── (1) Process
```
- **Champ** : `isInput` (true = entrée, false = sortie)
- **Cascade** : Suppression en cascade

### Indicator
```
Indicator (N) >── (1) Process
```
- **Cascade** : Suppression en cascade

### Risk
```
Risk (N) >── (1) Process
```
- **Cascade** : Suppression en cascade

### LinkedDocument
```
LinkedDocument (N) >── (1) Process (optionnel)
LinkedDocument (N) >── (1) Procedure (optionnel)
```
- **Contrainte** : Au moins un des deux (processId ou procedureId) doit être défini
- **Cascade** : Suppression en cascade

### ProcessQualigramTag (Table de jonction)
```
ProcessQualigramTag (N) >── (1) Process
ProcessQualigramTag (N) >── (1) QualigramTag
```
- **Clé primaire composite** : `[processId, tagId]`
- **Cascade** : Suppression en cascade

---

## 5. VERSIONING

### ProcessVersion
```
ProcessVersion (N) >── (1) Process
ProcessVersion (1) ──< (N) Process (currentDraft)
ProcessVersion (1) ──< (N) Process (currentPublished)
ProcessVersion (1) ──< (N) Node (legacy)
ProcessVersion (1) ──< (N) Edge (legacy)
ProcessVersion (1) ──< (N) ApprovalRequest
ProcessVersion (1) ──< (N) ReadingConfirmation
ProcessVersion (1) ──< (N) Panier
ProcessVersion (1) ──< (1) ProcessLayout (unique)
```
- **Unique** : `[processId, version]`
- **Draft/Published** : Relations inverses pour pointer vers ProcessVersion depuis Process
- **Cascade** : Suppression en cascade

### ProcedureVersion
```
ProcedureVersion (N) >── (1) Procedure
ProcedureVersion (N) >── (1) User (validateur - optionnel)
```
- **Cascade** : Suppression en cascade si Procedure supprimée
- **Snapshot** : Contient des snapshots JSON complets (nodesSnapshot, edgesSnapshot, lanesSnapshot)

---

## 6. LEGACY/COMPATIBILITÉ (Node, Edge - PYX4)

### Node (Legacy)
```
Node (N) >── (1) ProcessVersion
Node (N) >── (1) Role (optionnel)
Node (N) >── (1) Process (subProcess - optionnel)
Node (N) >── (1) Document (optionnel)
Node (N) >── (1) Process (linkedInstruction - optionnel)
Node (1) ──< (N) Node (enfants - hiérarchie)
Node (N) >── (1) Node (parent - optionnel)
Node (1) ──< (N) Edge (outgoing)
Node (1) ──< (N) Edge (incoming)
Node (1) ──< (N) Constraint
Node (1) ──< (N) ControlIndicator
Node (1) ──< (N) Comment
```
- **Hiérarchie** : Auto-référence pour les nœuds imbriqués
- **Cascade** : Suppression en cascade si ProcessVersion supprimé

### Edge (Legacy)
```
Edge (N) >── (1) ProcessVersion
Edge (N) >── (1) Node (from)
Edge (N) >── (1) Node (to)
```
- **Unique** : `[versionId, fromId, toId]`
- **Cascade** : Suppression en cascade

---

## 7. COLLABORATION & APPROBATION

### Comment
```
Comment (N) >── (1) User (auteur)
Comment (N) >── (1) Process (optionnel - compatibilité)
Comment (N) >── (1) Procedure (optionnel)
Comment (N) >── (1) Node (optionnel - compatibilité)
Comment (N) >── (1) DiagramNode (optionnel)
Comment (1) ──< (N) Comment (réponses - thread)
Comment (N) >── (1) Comment (parent - optionnel)
Comment (N) >── (1) User (résolu par - optionnel)
```
- **Multi-cible** : Peut pointer vers Process, Procedure, Node (legacy), ou DiagramNode
- **Threading** : Auto-référence pour les commentaires en fil de discussion
- **Cascade** : Suppression en cascade

### ApprovalRequest
```
ApprovalRequest (N) >── (1) ProcessVersion
ApprovalRequest (N) >── (1) User
ApprovalRequest (N) >── (1) Process (optionnel)
```
- **Unique** : `[versionId, userId]` (un utilisateur ne peut approuver qu'une fois par version)
- **Cascade** : Suppression en cascade

### ReadingConfirmation
```
ReadingConfirmation (N) >── (1) ProcessVersion
ReadingConfirmation (N) >── (1) User
```
- **Unique** : `[versionId, userId]`
- **Cascade** : Suppression en cascade

### ProcessAssignment
```
ProcessAssignment (N) >── (1) Process
ProcessAssignment (N) >── (1) User
ProcessAssignment (N) >── (1) Role
```
- **Unique** : `[processId, userId, roleId]`
- **Cascade** : Suppression en cascade

---

## 8. DOCUMENTS & RESSOURCES

### Document
```
Document (N) >── (1) Process (optionnel)
Document (1) ──< (N) Node (legacy - références)
```
- **Cascade** : `onDelete: SetNull` (si Process supprimé, document reste mais sans référence)

### Mean
```
Mean (N) >── (1) Process (optionnel)
```
- **Cascade** : `onDelete: SetNull`

---

## 9. SIPOC

### SipocDiagram
```
SipocDiagram (1) >── (1) Process (optionnel, relation 1-1)
SipocDiagram (N) >── (1) User (créateur)
SipocDiagram (1) ──< (N) SipocElement
SipocDiagram (1) ──< (N) SipocConnection
SipocDiagram (1) ──< (N) SipocConnection (outgoingConnections)
SipocDiagram (1) ──< (N) SipocConnection (incomingConnections)
SipocDiagram (1) ──< (N) SipocHistory
SipocDiagram (1) ──< (N) SipocPermission
SipocDiagram (1) ──< (N) SipocComment
SipocDiagram (1) ──< (N) SipocTag
```
- **Relation 1-1** : Un Process peut avoir au maximum un SipocDiagram
- **Unique** : `processId` doit être unique dans SipocDiagram (garantit la relation 1-1)

### SipocElement
```
SipocElement (N) >── (1) SipocDiagram
SipocElement (1) ──< (N) SipocConnection (outgoing)
SipocElement (1) ──< (N) SipocConnection (incoming)
```

### SipocConnection
```
SipocConnection (N) >── (1) SipocDiagram
SipocConnection (N) >── (1) SipocDiagram (sourceSipoc)
SipocConnection (N) >── (1) SipocDiagram (targetSipoc)
SipocConnection (N) >── (1) SipocElement (sourceElement)
SipocConnection (N) >── (1) SipocElement (targetElement)
```

### SipocTag (Table de jonction)
```
SipocTag (N) >── (1) SipocDiagram
SipocTag (N) >── (1) Tag
```
- **Clé primaire composite** : `[sipoc_id, tag_id]`

---

## 10. FIP (Process Identity Card)

### ProcessIdentityCard
```
ProcessIdentityCard (N) >── (1) Process (unique - 1-1)
ProcessIdentityCard (N) >── (1) User (créateur)
```
- **Unique** : `processId` unique (un Process a une seule FIP)
- **Cascade** : Suppression en cascade si Process supprimé

---

## 11. AUTRES MODÈLES

### Role & Unit
```
Role (N) >── (1) Unit (optionnel)
Role (1) ──< (N) Node (legacy)
Role (1) ──< (N) ProcessAssignment
```

### ProcessInput & ProcessOutput
```
ProcessInput (N) >── (1) Process
ProcessOutput (N) >── (1) Process
```

### Constraint & ControlIndicator
```
Constraint (N) >── (1) Node
ControlIndicator (N) >── (1) Node
```

### Panier
```
Panier (N) >── (1) ProcessVersion
```

### JournalEntry
```
JournalEntry (N) >── (1) Process
```

### ProcessTag
```
ProcessTag (N) >── (1) Workspace
ProcessTag (1) ──< (N) Process
```

### ProcessTemplate
```
ProcessTemplate (N) >── (1) Workspace
ProcessTemplate (N) >── (1) User (créateur)
```

### NodeTemplate
```
NodeTemplate (N) >── (1) Workspace (optionnel)
NodeTemplate (N) >── (1) User (créateur - optionnel)
```

### ProcessTheme
```
ProcessTheme (N) >── (1) Workspace (optionnel)
```

### ProcessLayout
```
ProcessLayout (N) >── (1) ProcessVersion (unique)
```
- **Unique** : `versionId` unique (une version a un seul layout)

### AuditLog
```
AuditLog (N) >── (1) User
```

### Notification
```
Notification (N) >── (1) User
Notification (N) >── (1) Process (optionnel)
```
- **Cascade** : `onDelete: SetNull` pour Process

---

## RÈGLES IMPORTANTES

### Contraintes Multi-niveaux
Les modèles `DiagramNode`, `DiagramEdge`, et `DiagramLane` supportent trois niveaux :
- **Niveau 1** : `macroProcessId` (MacroProcess)
- **Niveau 2** : `processId` (Process)
- **Niveau 3** : `procedureId` (Procedure)

**Règle** : Un seul des trois IDs doit être défini (validation à faire au niveau application).

### Cascades de Suppression
- **Cascade** : Suppression en cascade des enfants
- **SetNull** : Mise à `null` de la référence (pour relations optionnelles)
- **Pas de cascade** : La relation doit être gérée manuellement

### Relations Nommées
Certaines relations utilisent des noms explicites pour éviter les conflits :
- `ProcessCreator` : User → Process (créateur)
- `ProcessOwners` : User → Process (propriétaires)
- `ProcedureEditors` : User → Procedure (éditeurs)
- `VersionValidators` : User → ProcedureVersion (validateurs)
- `CommentResolver` : User → Comment (résolu par)
- `WorkspaceHierarchy` : Workspace → Workspace (hiérarchie)
- `ProcessHierarchy` : Process → Process (hiérarchie)
- `NodeHierarchy` : Node → Node (hiérarchie)
- `CommentThread` : Comment → Comment (thread)
- `CurrentDraft` / `CurrentPublished` : ProcessVersion → Process (versions courantes)

---

## RÉSUMÉ DES CARDINALITÉS

| Relation | Type | Cardinalité |
|----------|------|-------------|
| MacroProcess → Process | 1-N | Un MacroProcess a plusieurs Process |
| Process → Procedure | 1-N | Un Process a plusieurs Procedure |
| Process → Process | 1-N | Hiérarchie (parent-enfant) |
| Workspace → Workspace | 1-N | Hiérarchie |
| Workspace → WorkspaceSettings | 1-1 | Unique |
| Process → ProcessIdentityCard | 1-1 | Unique |
| ProcessVersion → ProcessLayout | 1-1 | Unique |
| User → Group | N-1 | Optionnel |
| User → Department | N-1 | Optionnel |
| Process → MacroProcess | N-1 | Optionnel |
| Procedure → Process | N-1 | Requis |
| DiagramNode → MacroProcess/Process/Procedure | N-1 | Un seul des trois |
| DiagramEdge → DiagramNode (source/target) | N-1 | Requis |
| DiagramLane → MacroProcess/Process/Procedure | N-1 | Un seul des trois |
| DiagramNode → DiagramLane | N-1 | Optionnel |

