# Plan d'Implémentation - Modèle Process Unifié

## Vue d'ensemble

Ce plan détaille l'implémentation de l'architecture unifiée avec un seul modèle `Process` utilisant `ProcessLevel` comme discriminant et le Strategy Pattern pour gérer les comportements spécifiques par niveau.

---

## Phase 1 : Préparation du Schéma Prisma

### 1.1 Créer l'enum ProcessLevel
- [ ] Ajouter `enum ProcessLevel` avec `MACRO_PROCESS`, `PROCESS`, `PROCEDURE`
- [ ] Mettre à jour le modèle `Process` pour utiliser `ProcessLevel` au lieu de `Int level`

### 1.2 Unifier le modèle Process
- [ ] Ajouter les champs spécifiques Niveau 1 (MacroProcess) : `color`, `icon`, `order`, `active`
- [ ] Ajouter les champs spécifiques Niveau 3 (Procedure) : `objective`, `scope`, `validatedBy`, `validatedAt`, `effectiveDate`, `expirationDate`
- [ ] Changer `version` de `Int` à `String` pour compatibilité Procedure
- [ ] Supprimer `macroId` (remplacé par `parentId`)
- [ ] Supprimer les relations legacy : `subProcessNodes`, `instructionNodes`, `versions ProcessVersion[]`
- [ ] Supprimer `currentDraft` et `currentPublished` (legacy)
- [ ] Ajouter relation `sipocDiagram SipocDiagram?` (1-1)
- [ ] Ajouter index `@@index([type])` pour ProcessType

### 1.3 Mettre à jour DiagramNode, DiagramEdge, DiagramLane
- [ ] Supprimer `macroProcessId`, `processId`, `procedureId` (multi-niveaux)
- [ ] Ajouter `processId String` (unique, fonctionne pour tous les niveaux)
- [ ] Mettre à jour les relations vers `Process`

### 1.4 Mettre à jour SipocDiagram
- [ ] Ajouter `@unique` sur `processId` pour garantir relation 1-1
- [ ] Mettre à jour la relation vers `Process`

### 1.5 Supprimer les modèles obsolètes
- [ ] Supprimer le modèle `MacroProcess`
- [ ] Supprimer le modèle `Procedure`
- [ ] Supprimer le modèle `ProcessVersion` (legacy)

### 1.6 Créer la migration Prisma
- [ ] Générer la migration avec `prisma migrate dev --name unified_process_model`
- [ ] Vérifier que la migration est correcte
- [ ] Tester la migration sur une base de données de test

---

## Phase 2 : Migration des Données

### 2.1 Créer le script de migration
- [ ] Créer `apps/api/src/scripts/migrate-to-unified-process.ts`
- [ ] Migrer `MacroProcess` → `Process` (level = MACRO_PROCESS)
- [ ] Migrer `Process` existant → `Process` (level = PROCESS, mettre à jour `macroId` → `parentId`)
- [ ] Migrer `Procedure` → `Process` (level = PROCEDURE, `processId` → `parentId`)
- [ ] Mettre à jour `DiagramNode` : `macroProcessId`/`processId`/`procedureId` → `processId`
- [ ] Mettre à jour `DiagramEdge` : même logique
- [ ] Mettre à jour `DiagramLane` : même logique
- [ ] Migrer `ProcedureVersion` pour pointer vers le nouveau `Process`
- [ ] Vérifier l'intégrité des données après migration

### 2.2 Tester la migration
- [ ] Exécuter la migration sur une copie de la base de données de production
- [ ] Vérifier que toutes les données sont migrées correctement
- [ ] Vérifier les relations (hiérarchie, diagram elements, etc.)

---

## Phase 3 : Architecture Domain Layer

### 3.1 Créer les Domain Entities
- [ ] Créer `apps/api/src/domain/process/entities/process.entity.ts` (classe abstraite)
- [ ] Créer `apps/api/src/domain/process/entities/macro-process.entity.ts` (extends ProcessEntity)
- [ ] Créer `apps/api/src/domain/process/entities/process-level2.entity.ts` (extends ProcessEntity)
- [ ] Créer `apps/api/src/domain/process/entities/procedure.entity.ts` (extends ProcessEntity)
- [ ] Implémenter les méthodes abstraites : `validate()`, `canHaveChildren()`, `getAllowedChildLevels()`

### 3.2 Créer les Value Objects
- [ ] Créer `apps/api/src/domain/process/value-objects/process-level.vo.ts`
- [ ] Créer `apps/api/src/domain/process/value-objects/process-type.vo.ts`
- [ ] Créer `apps/api/src/domain/process/value-objects/process-status.vo.ts`

---

## Phase 4 : Infrastructure Layer (Repository)

### 4.1 Créer l'interface IProcessRepository
- [ ] Créer `apps/api/src/infrastructure/repositories/interfaces/process-repository.interface.ts`
- [ ] Définir les méthodes : `findById()`, `findByLevel()`, `findByParentId()`, `save()`, `delete()`

### 4.2 Implémenter PrismaProcessRepository
- [ ] Créer `apps/api/src/infrastructure/repositories/prisma-process.repository.ts`
- [ ] Implémenter `toDomain()` : convertir Prisma → Domain Entity selon le level
- [ ] Implémenter `toPersistence()` : convertir Domain Entity → Prisma selon le level
- [ ] Implémenter toutes les méthodes de l'interface

---

## Phase 5 : Application Layer (Services & Strategies)

### 5.1 Créer les interfaces
- [ ] Créer `apps/api/src/application/services/process/interfaces/process-service.interface.ts`
- [ ] Créer `apps/api/src/application/services/process/interfaces/process-level-strategy.interface.ts`

### 5.2 Créer ProcessServiceFactory
- [ ] Créer `apps/api/src/application/services/process/factories/process-service.factory.ts`
- [ ] Implémenter `getService(level: ProcessLevel)` pour retourner la bonne strategy

### 5.3 Créer les Strategies
- [ ] Créer `apps/api/src/application/services/process/strategies/macro-process.strategy.ts`
- [ ] Créer `apps/api/src/application/services/process/strategies/process-level2.strategy.ts`
- [ ] Créer `apps/api/src/application/services/process/strategies/procedure.strategy.ts`
- [ ] Implémenter `create()`, `update()`, `validateHierarchy()` pour chaque strategy
- [ ] Ajouter la logique de création automatique de `SipocDiagram` dans `ProcessLevel2Strategy` si `type === SIPOC`

### 5.4 Créer ProcessService principal
- [ ] Créer `apps/api/src/application/services/process/process.service.ts`
- [ ] Utiliser `ProcessServiceFactory` pour déléguer aux strategies
- [ ] Implémenter les méthodes communes : `findById()`, `findByLevel()`, etc.

---

## Phase 6 : DTOs et Validation

### 6.1 Créer CreateProcessDto unifié
- [ ] Créer `apps/api/src/modules/process/dto/create-process-unified.dto.ts`
- [ ] Ajouter `@IsEnum(ProcessLevel)` pour `level`
- [ ] Ajouter `@IsEnum(ProcessType)` pour `type` (optionnel, default FLOW)
- [ ] Ajouter validation conditionnelle avec `@ValidateIf()` pour les champs spécifiques par niveau
- [ ] Valider `color`, `icon`, `order`, `active` uniquement si `level === MACRO_PROCESS`
- [ ] Valider `objectif`, `perimetre`, `finalite` uniquement si `level === PROCESS`
- [ ] Valider `objective`, `scope` uniquement si `level === PROCEDURE`

### 6.2 Créer UpdateProcessDto unifié
- [ ] Créer `apps/api/src/modules/process/dto/update-process-unified.dto.ts`
- [ ] Tous les champs optionnels
- [ ] Même validation conditionnelle que CreateProcessDto

### 6.3 Créer ProcessQueryDto
- [ ] Mettre à jour `apps/api/src/modules/process/dto/process-query.dto.ts`
- [ ] Ajouter filtre par `level` (ProcessLevel)
- [ ] Ajouter filtre par `type` (ProcessType)
- [ ] Ajouter filtre par `parentId`

---

## Phase 7 : Controllers

### 7.1 Unifier ProcessController
- [ ] Mettre à jour `apps/api/src/modules/process/process.controller.ts`
- [ ] Utiliser `ProcessService` unifié au lieu de services séparés
- [ ] Adapter les endpoints pour utiliser les DTOs unifiés
- [ ] Supprimer les endpoints spécifiques à MacroProcess/Procedure (intégrés dans Process)

### 7.2 Supprimer les controllers obsolètes
- [ ] Supprimer `apps/api/src/modules/macro-process/macro-process.controller.ts`
- [ ] Supprimer `apps/api/src/modules/procedure/procedure.controller.ts`
- [ ] Migrer les endpoints spécifiques vers ProcessController si nécessaire

---

## Phase 8 : Modules NestJS

### 8.1 Mettre à jour ProcessModule
- [ ] Mettre à jour `apps/api/src/modules/process/process.module.ts`
- [ ] Importer les strategies
- [ ] Importer ProcessServiceFactory
- [ ] Exporter ProcessService et IProcessRepository

### 8.2 Supprimer les modules obsolètes
- [ ] Supprimer `apps/api/src/modules/macro-process/macro-process.module.ts`
- [ ] Supprimer `apps/api/src/modules/procedure/procedure.module.ts`
- [ ] Mettre à jour `apps/api/src/app.module.ts` pour supprimer les imports

---

## Phase 9 : DiagramService

### 9.1 Mettre à jour DiagramService
- [ ] Mettre à jour `apps/api/src/modules/procedure/services/diagram.service.ts`
- [ ] Simplifier : utiliser uniquement `processId` au lieu de `macroProcessId`/`processId`/`procedureId`
- [ ] Mettre à jour toutes les méthodes pour utiliser `processId` uniquement

### 9.2 Mettre à jour les endpoints diagram
- [ ] Mettre à jour `ProcessController` pour les endpoints `/processes/:id/nodes`, `/edges`, `/lanes`
- [ ] Supprimer les endpoints diagram de MacroProcessController et ProcedureController

---

## Phase 10 : Frontend

### 10.1 Mettre à jour les types
- [ ] Mettre à jour `apps/web/src/features/processes/types/process.types.ts`
- [ ] Ajouter `ProcessLevel` enum
- [ ] Mettre à jour `Process` interface pour inclure tous les champs unifiés
- [ ] Supprimer les types `MacroProcess` et `Procedure` séparés (ou les adapter)

### 10.2 Mettre à jour les API services
- [ ] Mettre à jour `apps/web/src/lib/api/process.api.ts` pour utiliser les nouveaux endpoints
- [ ] Mettre à jour `apps/web/src/lib/api/diagram.api.ts` pour utiliser uniquement `processId`
- [ ] Supprimer `apps/web/src/lib/api/macro-process.api.ts` (intégré dans process.api.ts)
- [ ] Supprimer `apps/web/src/lib/api/procedure.api.ts` (intégré dans process.api.ts)

### 10.3 Mettre à jour les hooks React Query
- [ ] Mettre à jour `apps/web/src/features/processes/hooks/useProcesses.ts`
- [ ] Ajouter hooks pour filtrer par `level` : `useMacroProcesses()`, `useProcedures()`
- [ ] Supprimer `apps/web/src/features/macro-processes/hooks/useMacroProcesses.ts`
- [ ] Supprimer `apps/web/src/features/procedures/hooks/useProcedures.ts`

### 10.4 Mettre à jour les composants
- [ ] Mettre à jour `ProcessForm.tsx` pour gérer tous les niveaux avec validation conditionnelle
- [ ] Mettre à jour `ProcessesPage.tsx` pour filtrer par level
- [ ] Adapter les composants MacroProcess et Procedure pour utiliser Process unifié
- [ ] Mettre à jour `QualigramFlowEditor` pour utiliser `processId` uniquement

### 10.5 Mettre à jour les routes
- [ ] Mettre à jour `apps/web/src/router.tsx`
- [ ] Unifier les routes : `/processes` pour tous les niveaux
- [ ] Ajouter paramètre de route optionnel `?level=MACRO_PROCESS|PROCESS|PROCEDURE`

---

## Phase 11 : Tests

### 11.1 Tests unitaires
- [ ] Tests pour Domain Entities (validation, hiérarchie)
- [ ] Tests pour Strategies (création, mise à jour par niveau)
- [ ] Tests pour Repository (conversion domain ↔ persistence)
- [ ] Tests pour DTOs (validation conditionnelle)

### 11.2 Tests d'intégration
- [ ] Tests pour ProcessController (tous les niveaux)
- [ ] Tests pour DiagramService (avec processId unifié)
- [ ] Tests pour la migration des données

### 11.3 Tests end-to-end
- [ ] Tester la création d'un MacroProcess (level = MACRO_PROCESS)
- [ ] Tester la création d'un Process (level = PROCESS)
- [ ] Tester la création d'une Procedure (level = PROCEDURE)
- [ ] Tester la hiérarchie (parent-enfant)
- [ ] Tester les diagram elements (nodes, edges, lanes)
- [ ] Tester la création automatique de SipocDiagram si type = SIPOC

---

## Phase 12 : Documentation

### 12.1 Mettre à jour la documentation
- [ ] Mettre à jour `docs/prisma-relations.md` avec le nouveau modèle unifié
- [ ] Créer `docs/api-unified-process.md` avec la documentation des endpoints
- [ ] Mettre à jour `docs/qualigram-implementation-summary.md`
- [ ] Créer un guide de migration pour les développeurs

### 12.2 Documentation technique
- [ ] Documenter l'architecture Strategy Pattern
- [ ] Documenter les règles de validation par niveau
- [ ] Documenter la migration des données

---

## Phase 13 : Nettoyage Final

### 13.1 Supprimer le code obsolète
- [ ] Supprimer tous les fichiers des modules `macro-process` et `procedure`
- [ ] Supprimer les DTOs obsolètes
- [ ] Supprimer les services obsolètes
- [ ] Nettoyer les imports inutilisés

### 13.2 Vérification finale
- [ ] Vérifier qu'il n'y a plus de références à `MacroProcess` ou `Procedure` dans le code
- [ ] Vérifier que tous les tests passent
- [ ] Vérifier que l'application démarre sans erreurs
- [ ] Vérifier que les migrations Prisma sont correctes

---

## Ordre d'Exécution Recommandé

1. **Phase 1** : Préparation du Schéma Prisma (base de tout)
2. **Phase 2** : Migration des Données (pour tester le schéma)
3. **Phase 3-5** : Architecture (Domain, Infrastructure, Application)
4. **Phase 6-8** : DTOs, Controllers, Modules (couche API)
5. **Phase 9** : DiagramService (dépend de l'API)
6. **Phase 10** : Frontend (dépend de l'API)
7. **Phase 11** : Tests (tout tester)
8. **Phase 12-13** : Documentation et Nettoyage

---

## Points d'Attention

### Migration des Données
- ⚠️ **Backup obligatoire** avant migration
- ⚠️ Tester la migration sur une copie de production
- ⚠️ Vérifier l'intégrité des relations après migration

### Compatibilité
- ⚠️ Maintenir la compatibilité avec le frontend pendant la transition
- ⚠️ Versionner les endpoints API si nécessaire
- ⚠️ Gérer les données existantes qui pourraient ne pas correspondre au nouveau modèle

### Performance
- ⚠️ Vérifier les performances des requêtes avec le nouveau modèle
- ⚠️ Optimiser les index si nécessaire
- ⚠️ Tester avec un volume de données réaliste

---

## Estimation

- **Phase 1-2** : 2-3 jours (Schéma + Migration)
- **Phase 3-5** : 3-4 jours (Architecture)
- **Phase 6-8** : 2-3 jours (API)
- **Phase 9-10** : 3-4 jours (Services + Frontend)
- **Phase 11** : 2-3 jours (Tests)
- **Phase 12-13** : 1-2 jours (Documentation + Nettoyage)

**Total estimé** : 13-19 jours de développement

---

## Prochaines Étapes

1. Commencer par la **Phase 1** : Mise à jour du schéma Prisma
2. Tester la migration sur une base de données de développement
3. Implémenter progressivement chaque phase
4. Tester après chaque phase
5. Documenter les changements au fur et à mesure

