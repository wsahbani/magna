# Refactorisation ProcessesPage - Clean Architecture

## Vue d'ensemble

Refactorisation complète de `ProcessesPage.tsx` selon les principes SOLID, Clean Code et les règles du projet.

## Changements effectués

### 1. Structure modulaire par composants

**Avant** : Un seul fichier monolithique de ~350 lignes avec logique UI, filtres et affichage mélangés.

**Après** : 6 composants réutilisables dans `/features/processes/components/` :

```
components/
├── ProcessPageHeader.tsx      # En-tête avec titre et bouton création
├── ProcessFilters.tsx         # Filtres (recherche, niveau, statut)
├── ViewModeToggle.tsx         # Basculement grid/table
├── ProcessGridView.tsx        # Vue grille de cartes
├── ProcessTable.tsx           # Vue tableau
└── ProcessEmptyState.tsx      # État vide
```

### 2. Nouveau composant Select (@repo/ui)

Ajout du composant `Select` shadcn/ui manquant :
- **Fichier** : `packages/ui/components/ui/select.tsx`
- **Exports** : `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectValue`, etc.
- **Basé sur** : `@radix-ui/react-select`
- **Thème** : Focus ring orange (cohérence avec la charte)

### 3. Typographie @repo/ui

Remplacement de toutes les balises HTML brutes par les composants typographiques :

| Avant | Après | Emplacement |
|-------|-------|-------------|
| `<h1 className="text-3xl...">` | `<Heading1>` | ProcessPageHeader |
| `<p className="text-gray-500">` | `<Body>` | ProcessPageHeader, ProcessEmptyState |
| `<span className="text-sm">` | `<BodySmall>` | ProcessTable, Pagination |
| `<th className="text-xs...">` | `<Caption>` | ProcessTable headers |

### 4. Suppression des `<select>` natifs

Remplacement par le composant `Select` shadcn/ui :

```tsx
// ❌ Avant
<select
  value={levelFilter}
  onChange={(e) => setLevelFilter(e.target.value as ProcessLevel | 'all')}
  className="px-4 py-2 border border-gray-300 rounded-md..."
>
  <option value="all">Tous les niveaux</option>
  <option value={1}>Flow</option>
</select>

// ✅ Après
<Select value={String(levelFilter)} onValueChange={onLevelChange}>
  <SelectTrigger className="w-full md:w-[200px]">
    <SelectValue>{getLevelLabel(levelFilter)}</SelectValue>
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">Tous les niveaux</SelectItem>
    <SelectItem value="1">Flow</SelectItem>
  </SelectContent>
</Select>
```

### 5. Séparation des responsabilités (Single Responsibility Principle)

Chaque composant a une responsabilité unique :

#### ProcessPageHeader
```tsx
interface ProcessPageHeaderProps {
  onCreateClick: () => void;
}
```
- Affichage titre + description
- Bouton "Nouveau processus"

#### ProcessFilters
```tsx
interface ProcessFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  levelFilter: ProcessLevel | 'all';
  onLevelChange: (value: ProcessLevel | 'all') => void;
  statusFilter: ProcessStatus | 'all';
  onStatusChange: (value: ProcessStatus | 'all') => void;
}
```
- Gestion des 3 filtres (recherche, niveau, statut)
- Labels localisés en français
- Logique de transformation des valeurs

#### ProcessTable
```tsx
interface ProcessTableProps {
  processes: Process[];
  onEdit: (process: Process) => void;
  onDelete: (id: string) => void;
}
```
- Affichage tableau avec tri visuel
- Badges colorés (niveau, statut)
- Actions (modifier, supprimer)
- Utilise `BodySmall` et `Caption` pour la typographie

#### ProcessGridView
```tsx
interface ProcessGridViewProps {
  processes: Process[];
  onEdit: (process: Process) => void;
  onView: (process: Process) => void;
  onDelete: (id: string) => void;
}
```
- Wrapper autour de `ProcessCard`
- Layout responsive (1/2/4 colonnes)

### 6. Clean Code & DRY

**Fonctions helper centralisées** :

- `getLevelLabel()` : ProcessFilters, ProcessTable (même logique)
- `getStatusLabel()` : ProcessFilters, ProcessTable (même logique)
- `getLevelStyle()` : ProcessTable (badges colorés)
- `getStatusStyle()` : ProcessTable (badges colorés)

**Avant** : Duplication de logique dans JSX inline
**Après** : Fonctions pures, testables, réutilisables

### 7. Accessibilité & UX

- **Focus ring** : Orange sur tous les composants Select
- **Labels** : Textes explicites en français
- **Transitions** : `transition-colors` sur les lignes du tableau
- **États** : Loading spinner, empty state dédié
- **Responsive** : Breakpoints cohérents (md, lg)

### 8. Réduction de la complexité

**ProcessesPage.tsx** :
- **Avant** : ~350 lignes, 2 fonctions helper, JSX complexe
- **Après** : ~120 lignes, import de composants, logique claire

```tsx
// Page simplifiée
return (
  <div className="space-y-4 p-3">
    <ProcessPageHeader onCreateClick={() => setIsCreateDialogOpen(true)} />
    
    <div className="flex flex-col md:flex-row gap-4 items-end">
      <div className="flex-1 w-full">
        <ProcessFilters {...filterProps} />
      </div>
      <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
    </div>

    {isLoading ? <Spinner /> : 
     data?.data.length === 0 ? <ProcessEmptyState /> :
     viewMode === 'grid' ? <ProcessGridView /> : 
     <ProcessTable />}
    
    {/* Dialogs */}
  </div>
)
```

## Principes appliqués

### SOLID

✅ **Single Responsibility** : Chaque composant a une seule raison de changer  
✅ **Open/Closed** : Composants extensibles via props, pas de modification interne  
✅ **Liskov Substitution** : ProcessGridView et ProcessTable interchangeables  
✅ **Interface Segregation** : Props minimales, pas de dépendances inutiles  
✅ **Dependency Inversion** : Composants dépendent d'abstractions (callbacks), pas d'implémentations

### Clean Code

✅ **DRY** : Logique de labels centralisée  
✅ **KISS** : Composants simples, une responsabilité  
✅ **Meaningful Names** : `ProcessFilters`, `ViewModeToggle` (auto-documenté)  
✅ **Small Functions** : Composants < 100 lignes  
✅ **No Magic Numbers** : Breakpoints nommés (md, lg)

### Règles du projet

✅ **Composants @repo/ui** : Heading1, Body, BodySmall, Caption, Select  
✅ **Pas de HTML brut** : Aucun `<h1>`, `<p>`, `<span>` natif  
✅ **Structure features/** : Composants dans `components/`, hooks dans `hooks/`  
✅ **Labels français** : Tous les textes UI localisés  
✅ **Thème orange** : Focus rings, boutons, spinner

## Exports ajoutés (@repo/ui)

```ts
// packages/ui/index.ts
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from "./components/ui/select"
```

## Migration path

Pour migrer d'autres pages similaires :

1. **Identifier les sections** : Header, filtres, contenu, pagination
2. **Extraire les composants** : Un fichier par section
3. **Définir les interfaces** : Props typées, événements callbacks
4. **Remplacer les HTML** : Utiliser @repo/ui typography
5. **Remplacer les `<select>`** : Utiliser `Select` shadcn/ui
6. **Centraliser la logique** : Helper functions dans composants

## Tests recommandés

```tsx
// ProcessFilters.test.tsx
describe('ProcessFilters', () => {
  it('should call onSearchChange when typing', () => {
    const onSearchChange = vi.fn()
    render(<ProcessFilters search="" onSearchChange={onSearchChange} />)
    fireEvent.change(screen.getByPlaceholderText('Rechercher...'), { target: { value: 'test' } })
    expect(onSearchChange).toHaveBeenCalledWith('test')
  })
})
```

## Performance

✅ **Moins de re-renders** : Composants memoizables  
✅ **Code splitting** : Chaque composant peut être lazy-loaded  
✅ **Bundle size** : Réduction grâce à la déduplication du code

## Compatibilité

- ✅ TanStack Router navigation
- ✅ React Query hooks (useProcesses, useCreateProcess)
- ✅ shadcn/ui Dialog pour les modales
- ✅ Tailwind CSS classes
- ✅ TypeScript strict mode

## Prochaines étapes

1. **Ajouter tests unitaires** pour chaque composant
2. **Documenter ProcessCard** (déjà existant, voir s'il suit les mêmes règles)
3. **Créer Storybook stories** pour visualiser les composants isolés
4. **Migrer d'autres pages** avec le même pattern

---

**Date** : 25 novembre 2025  
**Impact** : ProcessesPage + 6 nouveaux composants + Select component  
**Breaking changes** : Aucun (API externe inchangée)
