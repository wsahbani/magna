# Module FIP - Fiche Identité Processus

## Vue d'ensemble

Le module FIP (Fiche d'Identité de Processus) permet de créer et gérer des fiches d'identité complètes pour chaque processus. Une FIP est en relation one-to-one avec un Process et contient toutes les informations essentielles pour documenter et gérer un processus métier.

## Architecture

### Backend (NestJS)

#### Structure du module (`apps/api/src/modules/fip/`)

```
fip/
├── dto/
│   ├── create-fip.dto.ts
│   └── update-fip.dto.ts
├── entities/
│   └── fip.entity.ts
├── repositories/
│   └── fip.repository.ts
├── services/
│   └── fip.service.ts
├── controllers/
│   └── fip.controller.ts
└── fip.module.ts
```

#### Modèle Prisma

Le modèle `ProcessIdentityCard` est défini dans `schema.prisma` avec :

- **Relation one-to-one** : `processId String @unique` garantit qu'un seul FIP existe par Process
- **Champs spécifiques FIP** :
  - `objectives` : Objectifs du processus
  - `scope` : Périmètre d'application
  - `indicators` : Indicateurs de performance/KPIs (JSON)
  - `stakeholders` : Acteurs et responsabilités (JSON)
  - `risks` : Risques identifiés (JSON)
  - `opportunities` : Opportunités (JSON)
  - `resources` : Ressources nécessaires (JSON)
  - `performanceTargets` : Cibles de performance (JSON)

#### API Endpoints

- `GET /fip/:id` - Récupérer une FIP par ID
- `GET /fip/process/:processId` - Récupérer la FIP d'un processus
- `POST /fip` - Créer une nouvelle FIP
- `PUT /fip/:id` - Mettre à jour une FIP
- `DELETE /fip/:id` - Supprimer une FIP

### Frontend (React)

#### Structure du module (`apps/web/src/features/fip/`)

```
fip/
├── components/
│   ├── FipEditor.tsx      # Éditeur principal
│   ├── FipForm.tsx        # Formulaire avec sections
│   └── FipView.tsx        # Vue en lecture seule
├── hooks/
│   └── useFip.ts          # React Query hooks
├── store/
│   └── fipStore.ts        # Zustand store
├── types/
│   └── fip.types.ts       # Types TypeScript
├── services/
│   └── fipApi.ts          # Client API
└── pages/
    └── FipDetailPage.tsx  # Page dédiée
```

#### Routes

- `/processes/:processId/fip` - Page d'édition/visualisation de la FIP

## Fonctionnalités

### Sections de la FIP

1. **Objectifs** : Description des objectifs du processus
2. **Périmètre** : Définition du périmètre d'application
3. **Indicateurs de Performance** : Liste d'indicateurs avec :
   - Nom, description, unité
   - Valeur cible et valeur actuelle
   - Fréquence de mesure
   - Responsable
4. **Acteurs et Responsabilités** : Liste des acteurs avec :
   - Nom, rôle
   - Responsabilités
   - Contact
5. **Risques** : Liste des risques avec :
   - Description
   - Probabilité et impact
   - Mesures de mitigation
6. **Opportunités** : Liste des opportunités avec :
   - Description
   - Potentiel
   - Plan d'action
7. **Ressources** : Liste des ressources avec :
   - Type (humaine, matérielle, financière, technique)
   - Description, quantité, coût
8. **Cibles de Performance** : Liste des cibles avec :
   - Indicateur associé
   - Valeur cible
   - Échéance
   - Responsable

## Utilisation

### Créer une FIP

```typescript
import { useCreateFip } from '@/features/fip';

const createFip = useCreateFip();

await createFip.mutateAsync({
  processId: 'process-id',
  objectives: 'Objectifs du processus',
  scope: 'Périmètre d\'application',
  indicators: [],
  stakeholders: [],
  // ...
});
```

### Récupérer une FIP

```typescript
import { useFipByProcess } from '@/features/fip';

const { data: fip } = useFipByProcess(processId);
```

### Mettre à jour une FIP

```typescript
import { useUpdateFip } from '@/features/fip';

const updateFip = useUpdateFip();

await updateFip.mutateAsync({
  fipId: 'fip-id',
  data: {
    objectives: 'Nouveaux objectifs',
    // ...
  },
});
```

## Structure des données JSON

### Indicateurs

```typescript
interface FipIndicator {
  name: string;
  description?: string;
  unit?: string;
  targetValue?: number;
  currentValue?: number;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  responsible?: string;
}
```

### Acteurs

```typescript
interface FipStakeholder {
  name: string;
  role: string;
  responsibility?: string;
  contact?: string;
}
```

### Risques

```typescript
interface FipRisk {
  description: string;
  probability?: 'low' | 'medium' | 'high';
  impact?: 'low' | 'medium' | 'high';
  mitigation?: string;
}
```

### Opportunités

```typescript
interface FipOpportunity {
  description: string;
  potential?: string;
  actionPlan?: string;
}
```

### Ressources

```typescript
interface FipResource {
  type: 'human' | 'material' | 'financial' | 'technical';
  description: string;
  quantity?: string;
  cost?: number;
}
```

### Cibles de Performance

```typescript
interface FipPerformanceTarget {
  indicator: string;
  target: number;
  deadline?: string;
  responsible?: string;
}
```

## Principes SOLID appliqués

1. **Single Responsibility** : Chaque repository/service/controller a une responsabilité unique
2. **Open/Closed** : Les DTOs sont extensibles via class-validator
3. **Liskov Substitution** : Utilisation de PrismaService abstraction
4. **Interface Segregation** : DTOs séparés pour create/update
5. **Dependency Inversion** : Services dépendent des repositories, pas de Prisma directement

## Points d'attention

1. **Relation one-to-one** : La contrainte `processId @unique` garantit qu'un seul FIP existe par Process
2. **Validation** : Les champs JSON sont validés côté frontend avec TypeScript
3. **Création automatique** : La FIP peut être créée manuellement ou automatiquement lors de la création d'un Process (à implémenter si nécessaire)
4. **Statut** : La FIP suit le même cycle de vie que le Process (draft, published, archived)

## Améliorations futures

- [ ] Export PDF de la FIP
- [ ] Templates de FIP réutilisables
- [ ] Historique des modifications
- [ ] Validation automatique des indicateurs
- [ ] Tableaux de bord avec visualisation des KPIs
- [ ] Intégration avec le module SIPOC pour enrichir automatiquement certaines sections

