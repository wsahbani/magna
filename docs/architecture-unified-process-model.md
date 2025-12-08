# Architecture Unifiée - Modèle Process Unique

## Analyse de la Situation Actuelle

### Différences entre les 3 Modèles

| Aspect | MacroProcess (Niveau 1) | Process (Niveau 2) | Procedure (Niveau 3) |
|--------|------------------------|---------------------|----------------------|
| **Champs spécifiques** | `color`, `icon`, `order`, `active` | `objectif`, `perimetre`, `finalite`, `priority`, `confidentiality`, `reviewFrequency` | `objective`, `scope`, `validatedBy`, `validatedAt`, `effectiveDate`, `expirationDate` |
| **Relations principales** | `processes[]` | `macro`, `workspace`, `department`, `actors[]`, `processIOs[]`, `indicators[]`, `risks[]`, `procedures[]` | `process`, `editors[]`, `documents[]`, `comments[]` |
| **Versioning** | Aucun | `ProcedureVersion[]` avec snapshots JSON | `ProcedureVersion[]` avec snapshots JSON |
| **Diagram elements** | `diagramNodes[]`, `diagramEdges[]`, `diagramLanes[]` | `diagramNodes[]`, `diagramEdges[]`, `diagramLanes[]` | `diagramNodes[]`, `diagramEdges[]`, `diagramLanes[]` |
| **Métadonnées structurées** | Non | Oui (Actors, IO, Indicators, Risks) | Non |
| **Complexité** | Simple | Complexe | Moyenne |

---

## Solution Architecturale Recommandée

### Approche : **Single Table Inheritance (STI) avec Strategy Pattern**

Cette approche unifie les trois modèles en un seul modèle `Process` tout en respectant les principes SOLID :

- ✅ **Single Responsibility** : Chaque service/strategy gère un niveau spécifique
- ✅ **Open/Closed** : Extensible sans modifier le modèle de base
- ✅ **Liskov Substitution** : Tous les niveaux sont substituables comme Process
- ✅ **Interface Segregation** : Interfaces spécifiques par niveau
- ✅ **Dependency Inversion** : Dépendances vers abstractions (strategies)

---

## 1. Modèle Prisma Unifié

### Important : ProcessType vs ProcessLevel

**`ProcessType` (FLOW, SIPOC, BPMN) est indépendant de `ProcessLevel`** :
- Un Process de type **SIPOC** reste un Process normal, sans champs ou relations supplémentaires
- Le type SIPOC peut déclencher la création automatique d'un `SipocDiagram` (entité séparée)
- Les diagrammes SIPOC sont gérés via le modèle `SipocDiagram` qui référence un `Process`
- **Le type ne change pas la structure du modèle Process**

**Exemples valides** :
- `level: MACRO_PROCESS, type: FLOW` ✅
- `level: PROCESS, type: SIPOC` ✅ (Process normal, diagramme SIPOC créé séparément)
- `level: PROCESS, type: FLOW` ✅
- `level: PROCEDURE, type: BPMN` ✅

```prisma
enum ProcessLevel {
  MACRO_PROCESS  // Niveau 1
  PROCESS        // Niveau 2
  PROCEDURE      // Niveau 3
}

enum ProcessType {
  FLOW           // Processus avec diagramme de flux (par défaut)
  SIPOC          // Processus avec diagramme SIPOC (création automatique de SipocDiagram)
  BPMN           // Processus avec notation BPMN
}

enum ProcessStatus {
  DRAFT
  IN_REVIEW
  VALIDATED
  PUBLISHED
  ARCHIVED
  OBSOLETE
}

model Process {
  id              String        @id @default(cuid())
  level           ProcessLevel  // Discriminant principal (détermine les champs disponibles)
  type            ProcessType   @default(FLOW) // Type de diagramme (orthogonal au level)
  
  // Champs communs à tous les niveaux
  code            String        @unique
  name            String
  title           String?       // Alias pour name (compatibilité)
  description     String?
  status          ProcessStatus @default(DRAFT)
  version         String        @default("1.0") // Version au format string (ex: "1.0", "1.1")
  
  // Hiérarchie Qualigram
  parentId        String?       // Parent Process (peut être MacroProcess, Process, ou Procedure)
  parent          Process?      @relation("ProcessHierarchy", fields: [parentId], references: [id])
  children        Process[]     @relation("ProcessHierarchy")
  
  // Organisation
  workspaceId     String
  workspace       Workspace     @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  departmentId    String?
  department      Department?   @relation(fields: [departmentId], references: [id])
  
  // Champs spécifiques Niveau 1 (MacroProcess)
  color           String?       // Niveau 1 uniquement
  icon            String?       // Niveau 1 uniquement
  order           Int?          @default(0) // Niveau 1 uniquement
  active          Boolean?       @default(true) // Niveau 1 uniquement
  
  // Champs spécifiques Niveau 2 (Process)
  objectif        String?       // Niveau 2 uniquement
  perimetre       String?       // Niveau 2 uniquement
  finalite        String?       // Niveau 2 uniquement
  priority        ProcessPriority? @default(MEDIUM) // Niveau 2 uniquement
  confidentiality ConfidentialityLevel? @default(INTERNAL) // Niveau 2 uniquement
  reviewFrequency Int?          // Niveau 2 uniquement
  
  // Champs spécifiques Niveau 3 (Procedure)
  objective       String?       // Niveau 3 uniquement (alias objectif)
  scope           String?       // Niveau 3 uniquement (alias perimetre)
  validatedBy     String?       // Niveau 3 uniquement
  validatedAt     DateTime?     // Niveau 3 uniquement
  effectiveDate   DateTime?     // Niveau 3 uniquement
  expirationDate  DateTime?     // Niveau 3 uniquement
  
  // Métadonnées communes
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  publishedAt     DateTime?
  archivedAt      DateTime?
  nextReviewDate  DateTime?
  approvalDate    DateTime?
  
  // Relations communes
  createdById     String
  createdBy       User          @relation("ProcessCreator", fields: [createdById], references: [id])
  owners          User[]        @relation("ProcessOwners")
  editors         User[]        @relation("ProcessEditors") // Niveau 3 principalement
  
  // Relations spécifiques Niveau 2
  actors          ProcessActor[]
  processIOs      ProcessIO[]
  processIndicators Indicator[]
  processRisks    Risk[]
  linkedDocs      LinkedDocument[]
  qualigramTags  ProcessQualigramTag[]
  identityCard    ProcessIdentityCard?
  
  // Relations versioning
  procedureVersions ProcedureVersion[] // Versioning avec snapshots JSON (tous niveaux)
  
  // Relations diagram elements (tous niveaux)
  diagramNodes    DiagramNode[]
  diagramEdges    DiagramEdge[]
  diagramLanes    DiagramLane[]
  
  // Relations collaboration
  comments        Comment[]
  approvalRequests ApprovalRequest[]
  documents       Document[]
  means           Mean[]
  tags            ProcessTag[]
  inputs          ProcessInput[]
  outputs         ProcessOutput[]
  journalEntries  JournalEntry[]
  notifications   Notification[]
  
  // Relations spécifiques
  sipocDiagram     SipocDiagram? // Relation 1-1 : si type=SIPOC, un SipocDiagram peut être créé automatiquement
  
  // Note: Le versioning est géré via ProcedureVersion pour tous les niveaux
  
  @@unique([workspaceId, code, level])
  @@index([level, status])
  @@index([workspaceId, level])
  @@index([type]) // Index pour filtrer par type (FLOW, SIPOC, BPMN)
  @@index([parentId])
  @@index([code])
  @@map("processes")
}
```

### Note sur ProcessType

**Le champ `type` est purement informatif et déclencheur** :
- **FLOW** : Processus standard avec diagramme de flux (DiagramNode, DiagramEdge, DiagramLane)
- **SIPOC** : Processus normal, mais peut déclencher la création automatique d'un `SipocDiagram` (relation 1-1)
  - Le Process lui-même reste identique (mêmes champs, mêmes relations)
  - Le diagramme SIPOC est une entité séparée (`SipocDiagram`) avec une relation **1-1** vers ce Process
  - Relation : `Process.sipocDiagram` (optionnel) ↔ `SipocDiagram.process` (optionnel mais unique)
  - Aucune complexité supplémentaire dans le modèle Process
- **BPMN** : Processus avec notation BPMN (peut utiliser les mêmes DiagramNode/Edge/Lane)

**Aucun champ ou relation supplémentaire n'est ajouté au modèle Process selon le type.**

### Relation Process ↔ SipocDiagram (1-1)

```prisma
// Dans Process
sipocDiagram SipocDiagram? // Relation 1-1 optionnelle

// Dans SipocDiagram
processId String? @unique // Optionnel mais unique (garantit 1-1)
process   Process? @relation(fields: [processId], references: [id])
```

**Règle métier** :
- Un Process de type SIPOC peut avoir **au maximum un** SipocDiagram
- Un SipocDiagram peut être lié à **au maximum un** Process
- La relation est optionnelle : un Process peut exister sans SipocDiagram (même si type=SIPOC)

### Avantages de cette approche :
1. **Un seul modèle** : Simplifie les relations
2. **Champs optionnels** : Seuls les champs pertinents sont remplis
3. **Index sur level** : Performance optimale pour les requêtes par niveau
4. **Hiérarchie unifiée** : `parentId` fonctionne pour tous les niveaux
5. **Relations communes** : Diagram elements, comments, etc. fonctionnent pour tous

### Contraintes à valider au niveau application :
- Niveau 1 ne peut avoir que des enfants Niveau 2
- Niveau 2 ne peut avoir que des enfants Niveau 3
- Niveau 3 ne peut pas avoir d'enfants
- Champs spécifiques validés selon le niveau

---

## 2. Architecture en Couches (SOLID)

### 2.1 Domain Layer (Entities & Value Objects)

```typescript
// Domain/Process/Process.ts
export abstract class ProcessEntity {
  constructor(
    public readonly id: string,
    public readonly level: ProcessLevel,
    public readonly code: string,
    public readonly name: string,
    // ... autres champs communs
  ) {}
  
  // Méthodes abstraites à implémenter par niveau
  abstract validate(): ValidationResult
  abstract canHaveChildren(): boolean
  abstract getAllowedChildLevels(): ProcessLevel[]
}

// Domain/Process/MacroProcess.ts
export class MacroProcess extends ProcessEntity {
  constructor(
    id: string,
    code: string,
    name: string,
    public readonly color?: string,
    public readonly icon?: string,
    public readonly order: number = 0,
    public readonly active: boolean = true,
  ) {
    super(id, ProcessLevel.MACRO_PROCESS, code, name)
  }
  
  validate(): ValidationResult {
    // Validation spécifique MacroProcess
    if (!this.code.match(/^MACRO-\d+$/)) {
      return ValidationResult.failure('Code must match MACRO-XXX format')
    }
    return ValidationResult.success()
  }
  
  canHaveChildren(): boolean {
    return true
  }
  
  getAllowedChildLevels(): ProcessLevel[] {
    return [ProcessLevel.PROCESS]
  }
}

// Domain/Process/ProcessLevel2.ts
export class ProcessLevel2 extends ProcessEntity {
  constructor(
    id: string,
    code: string,
    name: string,
    public readonly objectif?: string,
    public readonly perimetre?: string,
    public readonly finalite?: string,
    // ...
  ) {
    super(id, ProcessLevel.PROCESS, code, name)
  }
  
  validate(): ValidationResult {
    // Validation spécifique Process
    if (this.objectif && this.objectif.length < 10) {
      return ValidationResult.failure('Objectif must be at least 10 characters')
    }
    return ValidationResult.success()
  }
  
  canHaveChildren(): boolean {
    return true
  }
  
  getAllowedChildLevels(): ProcessLevel[] {
    return [ProcessLevel.PROCEDURE]
  }
}

// Domain/Process/Procedure.ts
export class Procedure extends ProcessEntity {
  constructor(
    id: string,
    code: string,
    name: string,
    public readonly objective?: string,
    public readonly scope?: string,
    public readonly validatedBy?: string,
    // ...
  ) {
    super(id, ProcessLevel.PROCEDURE, code, name)
  }
  
  validate(): ValidationResult {
    // Validation spécifique Procedure
    if (this.status === ProcessStatus.VALIDATED && !this.validatedBy) {
      return ValidationResult.failure('Validated procedure must have a validator')
    }
    return ValidationResult.success()
  }
  
  canHaveChildren(): boolean {
    return false
  }
  
  getAllowedChildLevels(): ProcessLevel[] {
    return []
  }
}
```

### 2.2 Repository Layer (Repository Pattern)

```typescript
// Infrastructure/Repositories/ProcessRepository.ts
export interface IProcessRepository {
  findById(id: string): Promise<ProcessEntity | null>
  findByLevel(level: ProcessLevel, filters?: ProcessFilters): Promise<ProcessEntity[]>
  findByParentId(parentId: string): Promise<ProcessEntity[]>
  save(process: ProcessEntity): Promise<ProcessEntity>
  delete(id: string): Promise<void>
}

// Infrastructure/Repositories/PrismaProcessRepository.ts
export class PrismaProcessRepository implements IProcessRepository {
  constructor(private prisma: PrismaService) {}
  
  async findById(id: string): Promise<ProcessEntity | null> {
    const data = await this.prisma.process.findUnique({ where: { id } })
    if (!data) return null
    return this.toDomain(data)
  }
  
  async findByLevel(level: ProcessLevel, filters?: ProcessFilters): Promise<ProcessEntity[]> {
    const data = await this.prisma.process.findMany({
      where: { level, ...filters },
      orderBy: { createdAt: 'desc' },
    })
    return data.map(d => this.toDomain(d))
  }
  
  private toDomain(data: PrismaProcess): ProcessEntity {
    switch (data.level) {
      case ProcessLevel.MACRO_PROCESS:
        return new MacroProcess(
          data.id,
          data.code,
          data.name,
          data.color,
          data.icon,
          data.order,
          data.active,
        )
      case ProcessLevel.PROCESS:
        return new ProcessLevel2(
          data.id,
          data.code,
          data.name,
          data.objectif,
          data.perimetre,
          data.finalite,
          // ...
        )
      case ProcessLevel.PROCEDURE:
        return new Procedure(
          data.id,
          data.code,
          data.name,
          data.objective,
          data.scope,
          data.validatedBy,
          // ...
        )
    }
  }
  
  async save(process: ProcessEntity): Promise<ProcessEntity> {
    const data = this.toPersistence(process)
    const saved = await this.prisma.process.upsert({
      where: { id: process.id },
      create: data,
      update: data,
    })
    return this.toDomain(saved)
  }
  
  private toPersistence(process: ProcessEntity): Prisma.ProcessCreateInput {
    const base = {
      id: process.id,
      level: process.level,
      code: process.code,
      name: process.name,
      // ... champs communs
    }
    
    if (process instanceof MacroProcess) {
      return {
        ...base,
        color: process.color,
        icon: process.icon,
        order: process.order,
        active: process.active,
      }
    }
    
    if (process instanceof ProcessLevel2) {
      return {
        ...base,
        objectif: process.objectif,
        perimetre: process.perimetre,
        finalite: process.finalite,
        // ...
      }
    }
    
    if (process instanceof Procedure) {
      return {
        ...base,
        objective: process.objective,
        scope: process.scope,
        validatedBy: process.validatedBy,
        // ...
      }
    }
    
    return base
  }
}
```

### 2.3 Service Layer (Strategy Pattern)

```typescript
// Application/Services/ProcessService.ts
export interface IProcessService {
  create(dto: CreateProcessDto): Promise<ProcessEntity>
  update(id: string, dto: UpdateProcessDto): Promise<ProcessEntity>
  validateHierarchy(parentId: string, childLevel: ProcessLevel): Promise<boolean>
}

// Application/Services/ProcessServiceFactory.ts
export class ProcessServiceFactory {
  constructor(
    private repository: IProcessRepository,
    private macroProcessStrategy: MacroProcessStrategy,
    private processStrategy: ProcessLevel2Strategy,
    private procedureStrategy: ProcedureStrategy,
  ) {}
  
  getService(level: ProcessLevel): IProcessLevelStrategy {
    switch (level) {
      case ProcessLevel.MACRO_PROCESS:
        return this.macroProcessStrategy
      case ProcessLevel.PROCESS:
        return this.processStrategy
      case ProcessLevel.PROCEDURE:
        return this.procedureStrategy
    }
  }
}

// Application/Services/Strategies/MacroProcessStrategy.ts
export class MacroProcessStrategy implements IProcessLevelStrategy {
  async create(dto: CreateProcessDto): Promise<ProcessEntity> {
    // Logique spécifique MacroProcess
    const process = new MacroProcess(
      generateId(),
      dto.code,
      dto.name,
      dto.color,
      dto.icon,
      dto.order ?? 0,
      dto.active ?? true,
    )
    
    const validation = process.validate()
    if (!validation.isValid) {
      throw new ValidationException(validation.errors)
    }
    
    return this.repository.save(process)
  }
  
  async validateHierarchy(parentId: string, childLevel: ProcessLevel): Promise<boolean> {
    if (childLevel !== ProcessLevel.PROCESS) {
      return false
    }
    return true
  }
}

// Application/Services/Strategies/ProcessLevel2Strategy.ts
export class ProcessLevel2Strategy implements IProcessLevelStrategy {
  constructor(
    private repository: IProcessRepository,
    private sipocService?: SipocService, // Optionnel : pour création automatique SIPOC
  ) {}
  
  async create(dto: CreateProcessDto): Promise<ProcessEntity> {
    // Logique spécifique Process
    const process = new ProcessLevel2(
      generateId(),
      dto.code,
      dto.name,
      dto.objectif,
      dto.perimetre,
      dto.finalite,
      dto.type, // ProcessType (FLOW, SIPOC, BPMN) - pas de complexité supplémentaire
      // ...
    )
    
    // Validation métier spécifique
    if (dto.macroId) {
      const parent = await this.repository.findById(dto.macroId)
      if (!parent || parent.level !== ProcessLevel.MACRO_PROCESS) {
        throw new BusinessException('Process must have a MacroProcess as parent')
      }
    }
    
    const saved = await this.repository.save(process)
    
    // Si type SIPOC, créer automatiquement un SipocDiagram (entité séparée)
    if (dto.type === ProcessType.SIPOC && this.sipocService) {
      try {
        await this.sipocService.createDiagram({
          title: dto.name,
          description: dto.description,
          processId: saved.id,
          // ... autres champs SIPOC
        })
      } catch (error) {
        // Ne pas faire échouer la création du Process si SIPOC échoue
        console.error('Failed to create SIPOC diagram', error)
      }
    }
    
    return saved
  }
  
  async validateHierarchy(parentId: string, childLevel: ProcessLevel): Promise<boolean> {
    if (childLevel !== ProcessLevel.PROCEDURE) {
      return false
    }
    return true
  }
}

// Application/Services/Strategies/ProcedureStrategy.ts
export class ProcedureStrategy implements IProcessLevelStrategy {
  async create(dto: CreateProcessDto): Promise<ProcessEntity> {
    // Logique spécifique Procedure
    const process = new Procedure(
      generateId(),
      dto.code,
      dto.name,
      dto.objective,
      dto.scope,
      // ...
    )
    
    // Validation métier spécifique
    if (!dto.parentId) {
      throw new BusinessException('Procedure must have a Process as parent')
    }
    
    const parent = await this.repository.findById(dto.parentId)
    if (!parent || parent.level !== ProcessLevel.PROCESS) {
      throw new BusinessException('Procedure must have a Process as parent')
    }
    
    return this.repository.save(process)
  }
  
  async validateHierarchy(parentId: string, childLevel: ProcessLevel): Promise<boolean> {
    // Procedure ne peut pas avoir d'enfants
    return false
  }
}
```

### 2.4 DTOs avec Validation Conditionnelle

```typescript
// Application/DTOs/CreateProcessDto.ts
export class CreateProcessDto {
  @IsEnum(ProcessLevel)
  level: ProcessLevel
  
  @IsEnum(ProcessType)
  @IsOptional()
  type: ProcessType = ProcessType.FLOW // Par défaut FLOW, peut être SIPOC ou BPMN
  
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  code: string
  
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name: string
  
  // Champs conditionnels Niveau 1
  @ValidateIf((o) => o.level === ProcessLevel.MACRO_PROCESS)
  @IsString()
  @IsOptional()
  color?: string
  
  @ValidateIf((o) => o.level === ProcessLevel.MACRO_PROCESS)
  @IsString()
  @IsOptional()
  icon?: string
  
  // Champs conditionnels Niveau 2
  @ValidateIf((o) => o.level === ProcessLevel.PROCESS)
  @IsString()
  @IsOptional()
  objectif?: string
  
  @ValidateIf((o) => o.level === ProcessLevel.PROCESS)
  @IsString()
  @IsOptional()
  perimetre?: string
  
  // Champs conditionnels Niveau 3
  @ValidateIf((o) => o.level === ProcessLevel.PROCEDURE)
  @IsString()
  @IsOptional()
  objective?: string
  
  @ValidateIf((o) => o.level === ProcessLevel.PROCEDURE)
  @IsString()
  @IsOptional()
  scope?: string
  
  // Relations
  parentId?: string
  workspaceId: string
  // ...
}
```

---

## 3. Avantages de cette Architecture

### ✅ SOLID Principles

1. **Single Responsibility**
   - Chaque Strategy gère un seul niveau
   - Repository gère uniquement la persistance
   - Entities encapsulent la logique métier

2. **Open/Closed**
   - Ajout d'un nouveau niveau sans modifier le code existant
   - Extension via nouvelles strategies

3. **Liskov Substitution**
   - Tous les niveaux sont substituables comme `ProcessEntity`
   - Polymorphisme garanti

4. **Interface Segregation**
   - `IProcessLevelStrategy` : Interface spécifique par niveau
   - `IProcessRepository` : Interface de persistance

5. **Dependency Inversion**
   - Services dépendent d'abstractions (`IProcessRepository`, `IProcessLevelStrategy`)
   - Injection de dépendances

### ✅ Maintenabilité

- **Un seul modèle** : Simplifie les migrations, les requêtes, les relations
- **Code organisé** : Séparation claire des responsabilités
- **Testabilité** : Chaque couche testable indépendamment
- **Extensibilité** : Ajout facile de nouveaux niveaux ou comportements

### ✅ Performance

- **Index optimisés** : `@@index([level, status])` pour requêtes rapides
- **Requêtes ciblées** : `findByLevel()` filtre directement
- **Moins de JOINs** : Relations simplifiées

### ✅ Relations Simplifiées

```typescript
// Avant (3 modèles)
DiagramNode {
  macroProcessId?: string
  processId?: string
  procedureId?: string
}

// Après (1 modèle)
DiagramNode {
  processId: string // Fonctionne pour tous les niveaux
}
```

---

## 4. Migration Strategy

### Phase 1 : Préparation
1. Créer le nouveau modèle `Process` unifié
2. Créer les strategies et repositories
3. Créer les DTOs avec validation conditionnelle

### Phase 2 : Migration des Données
1. Migrer `MacroProcess` → `Process` (level = MACRO_PROCESS)
2. Migrer `Process` existant → `Process` (level = PROCESS)
3. Migrer `Procedure` → `Process` (level = PROCEDURE)
4. Mettre à jour les relations `DiagramNode`, `DiagramEdge`, `DiagramLane`

### Phase 3 : Mise à jour du Code
1. Adapter les services pour utiliser les strategies
2. Adapter les controllers
3. Adapter le frontend

### Phase 4 : Nettoyage
1. Supprimer les anciens modèles `MacroProcess` et `Procedure`
2. Supprimer le code legacy

---

## 5. Recommandation Finale

**✅ RECOMMANDÉ : Modèle Unifié avec Strategy Pattern**

Cette approche offre :
- **Simplicité** : Un seul modèle à maintenir
- **Flexibilité** : Comportements spécifiques par niveau
- **SOLID** : Architecture respectant tous les principes
- **Performance** : Index optimisés, requêtes efficaces
- **Maintenabilité** : Code organisé et testable

**Alternative (si contraintes techniques)** :
- Garder 3 modèles mais utiliser une **abstraction commune** (interface/type union)
- Utiliser des **composants partagés** pour la logique commune
- **Factory Pattern** pour la création selon le niveau

---

## 6. Exemple d'Utilisation

```typescript
// Controller
@Controller('processes')
export class ProcessController {
  constructor(
    private processService: ProcessService,
    private factory: ProcessServiceFactory,
  ) {}
  
  @Post()
  async create(@Body() dto: CreateProcessDto) {
    const strategy = this.factory.getService(dto.level)
    return strategy.create(dto)
  }
  
  @Get('by-level/:level')
  async findByLevel(@Param('level') level: ProcessLevel) {
    return this.processService.findByLevel(level)
  }
}
```

---

## Conclusion

L'unification en un seul modèle `Process` avec `ProcessLevel` comme discriminant, combinée à une architecture Strategy Pattern, offre la meilleure solution en termes de :
- **Simplicité** : Un seul modèle
- **Maintenabilité** : Code organisé et SOLID
- **Performance** : Index optimisés
- **Extensibilité** : Facile d'ajouter de nouveaux niveaux

Cette architecture respecte tous les principes SOLID et facilite la maintenance à long terme.

