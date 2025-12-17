# Intégration des Suggestions IA dans SipocFlowRow

## Vue d'ensemble

Les suggestions IA ont été intégrées directement dans le composant `SipocFlowRow` pour afficher des éléments SIPOC similaires sous chaque élément de la ligne de flux.

## Architecture

### Composant SuggestionDropdown

**Localisation:** `/apps/web/src/features/sipoc/board/SipocFlowRow.tsx` (composant interne)

**Responsabilités:**
- Affichage d'un bouton toggle avec icône Lightbulb
- Chargement des suggestions via `useSimilarElements` hook
- Affichage expandable/collapsible des suggestions
- Gestion du clic pour créer une relation automatiquement

**Props:**
```typescript
interface SuggestionDropdownProps {
  element: SipocElement;           // Élément source
  currentSipocId: string;           // SIPOC actuel
  isExpanded: boolean;              // État d'expansion
  onToggle: () => void;             // Toggle expansion
  onSuggestionClick: (suggestion: SimilarElement) => void; // Callback de clic
  matchTypeConfig: Record<string, { label, color, bg }>; // Config des badges
}
```

### Intégration dans SipocFlowRow

**État ajouté:**
```typescript
const [expandedSuggestions, setExpandedSuggestions] = useState<string | null>(null);
```
- Stocke l'ID de l'élément dont les suggestions sont affichées
- Un seul élément peut avoir ses suggestions ouvertes à la fois

**Handler ajouté:**
```typescript
const handleSuggestionClick = (suggestion: SimilarElement, sourceElementId: string) => {
  onCreateRelation(
    sourceElementId,
    suggestion.sipoc.sipoc_id,
    suggestion.element.id,
    `Connexion suggérée par IA (${Math.round(suggestion.similarityScore * 100)}% similarité)`
  );
  setExpandedSuggestions(null);
};
```

**Configuration des badges:**
```typescript
const matchTypeConfig = {
  exact: { label: 'Exact', color: 'text-green-600', bg: 'bg-green-50' },
  contains: { label: 'Contient', color: 'text-blue-600', bg: 'bg-blue-50' },
  word_match: { label: 'Similaire', color: 'text-orange-600', bg: 'bg-orange-50' },
  partial: { label: 'Partiel', color: 'text-gray-600', bg: 'bg-gray-50' },
};
```

## Flux d'utilisation

### 1. Affichage initial

Pour chaque élément SIPOC dans une ligne de flux :
```
┌─────────────────────────────┐
│ Titre de l'élément          │
│ Description...              │
├─────────────────────────────┤
│ 💡 3 suggestions IA    ▼   │  ← Bouton toggle
└─────────────────────────────┘
```

### 2. Expansion des suggestions

Quand l'utilisateur clique sur le bouton :
```
┌─────────────────────────────┐
│ Titre de l'élément          │
│ Description...              │
├─────────────────────────────┤
│ 💡 3 suggestions IA    ▲   │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ Service RH Formation    │ │
│ │ [Exact] 📈 95%          │ │
│ │ de SIPOC Formation 2024 │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ RH                      │ │
│ │ [Contient] 📈 85%       │ │
│ │ de SIPOC Admin          │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Ressources Humaines     │ │
│ │ [Similaire] 📈 65%      │ │
│ │ de SIPOC Gestion        │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### 3. Création de relation

Quand l'utilisateur clique sur une suggestion :
1. ✅ Appel de `onCreateRelation()`
2. ✅ Création d'une connexion SIPOC automatique
3. ✅ Description générée: "Connexion suggérée par IA (85% similarité)"
4. ✅ Fermeture automatique du dropdown
5. ✅ Rafraîchissement de la vue

## Caractéristiques visuelles

### États du bouton

**Non chargé / Aucune suggestion:**
- Bouton masqué (ne s'affiche pas)

**Chargement:**
```
💡 Chargement...
```

**Avec suggestions (fermé):**
```
💡 3 suggestions IA    ▼
```
- Hover: fond orange léger
- Icône chevron vers le bas

**Avec suggestions (ouvert):**
```
💡 3 suggestions IA    ▲
```
- Icône chevron vers le haut
- Liste déroulante visible en dessous

### Cartes de suggestions

**Structure:**
```
┌─────────────────────────────────┐
│ Titre élément               🔗  │  ← Icône external link au hover
│ [Badge Type] 📈 85% de SIPOC... │  ← Badges + score + source
└─────────────────────────────────┘
```

**Interactions:**
- Hover: bordure orange, fond orange léger
- Clic: crée la relation automatiquement

**Badges de type:**
- 🟢 **Exact** (vert): Correspondance exacte
- 🔵 **Contient** (bleu): Contient le terme
- 🟠 **Similaire** (orange): Mots similaires
- ⚪ **Partiel** (gris): Similarité partielle

**Limite d'affichage:**
- Maximum 5 suggestions affichées
- Si plus de 5: "+X autres" en bas de liste
- Scroll automatique si liste dépasse hauteur max (256px)

## Optimisations

### Performance

1. **Lazy loading des suggestions:**
   - Hook `useSimilarElements` appelé uniquement quand l'élément est monté
   - `enabled: true` toujours actif pour pre-fetching

2. **Cache React Query:**
   - 2 minutes staleTime
   - 5 minutes gcTime
   - Évite requêtes répétées pour même élément

3. **Affichage conditionnel:**
   - Dropdown masqué si aucune suggestion
   - Pas de DOM rendu inutilement

### UX

1. **Un seul dropdown ouvert:**
   - `expandedSuggestions` stocke l'ID actif
   - Toggle ferme automatiquement les autres

2. **Feedback immédiat:**
   - État "Chargement..." pendant requête
   - Loader animé si expansion pendant chargement

3. **Actions claires:**
   - Icône 🔗 au hover indique action possible
   - Description auto-générée avec score de similarité

## Exemple d'utilisation

### Dans SipocFlowRow

```tsx
{/* Sous chaque élément */}
<SuggestionDropdown
  element={element}
  currentSipocId={currentSipocId}
  isExpanded={expandedSuggestions === element.id}
  onToggle={() => setExpandedSuggestions(
    expandedSuggestions === element.id ? null : element.id
  )}
  onSuggestionClick={(suggestion) => 
    handleSuggestionClick(suggestion, element.id)
  }
  matchTypeConfig={matchTypeConfig}
/>
```

### Callback de création

```typescript
const handleSuggestionClick = useCallback((suggestion, sourceElementId) => {
  onCreateRelation(
    sourceElementId,                    // ID élément source
    suggestion.sipoc.sipoc_id,          // ID SIPOC cible
    suggestion.element.id,              // ID élément cible
    `Connexion suggérée par IA (${Math.round(suggestion.similarityScore * 100)}% similarité)`
  );
  setExpandedSuggestions(null);         // Fermer le dropdown
}, [onCreateRelation]);
```

## Avantages de cette approche

### ✅ Contextuel
- Suggestions affichées directement sous l'élément concerné
- Pas besoin de modal séparé
- Workflow fluide: voir → cliquer → connecter

### ✅ Performance
- Lazy loading par élément
- Cache efficace
- Pas de re-render inutile

### ✅ UX optimale
- Un seul dropdown ouvert à la fois
- Feedback visuel clair (badges, scores)
- Action en 1 clic pour créer relation

### ✅ Maintenable
- Composant isolé `SuggestionDropdown`
- Props claires et typées
- Réutilisable dans d'autres contextes

## Différences avec l'ancienne approche

### Ancienne approche (SipocElementCard)
```
❌ Suggestions dans un dropdown séparé
❌ Nécessite clic sur bouton "Suggestions IA"
❌ Occupait de l'espace même sans suggestions
❌ Pas de contexte visuel du flow
```

### Nouvelle approche (SipocFlowRow)
```
✅ Intégré directement dans la ligne de flux
✅ Visible sous chaque élément concerné
✅ Masqué si aucune suggestion
✅ Contexte visuel clair (même flow)
✅ Action directe: clic → relation créée
```

## Maintenance et évolutions

### Ajustements possibles

**Changer le seuil de similarité:**
```typescript
const { data: suggestions, isLoading } = useSimilarElements(
  currentSipocId,
  element.title,
  0.5  // ← Augmenter pour moins de suggestions
);
```

**Modifier le nombre max affiché:**
```typescript
{suggestions.slice(0, 10).map(...)}  // ← Afficher 10 au lieu de 5
```

**Personnaliser les badges:**
```typescript
const matchTypeConfig = {
  exact: { label: '100%', color: 'text-green-600', bg: 'bg-green-50' },
  // ...
};
```

### Évolutions futures

1. **Tri des suggestions:**
   - Par score de similarité (déjà fait)
   - Par type d'élément
   - Par SIPOC source

2. **Filtres:**
   - Filtrer par type d'élément cible
   - Filtrer par SIPOC

3. **Actions multiples:**
   - Bouton "Connecter tous"
   - Sélection multiple de suggestions

4. **Preview:**
   - Hover sur suggestion → preview du SIPOC cible
   - Tooltip avec plus d'infos

## Références

- **Hook principal:** `apps/web/src/features/sipoc/hooks/useSipoc.ts` → `useSimilarElements`
- **API:** `apps/web/src/lib/api/sipoc.api.ts` → `findSimilarElements`
- **Backend:** `apps/api/src/modules/sipoc/services/sipoc.service.ts` → `findSimilarElements`
- **Documentation complète:** `docs/sipoc-similar-suggestions.md`
