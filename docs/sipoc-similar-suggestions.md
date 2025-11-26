# Fonctionnalité de Suggestions Similaires SIPOC (IA)

## Vue d'ensemble

La fonctionnalité de suggestions similaires utilise un algorithme de similarité de texte pour suggérer automatiquement des éléments SIPOC connexes à travers différents diagrammes SIPOC. Cela aide les utilisateurs à découvrir des relations potentielles et à créer des connexions entre éléments.

## Architecture

### Backend (NestJS + Prisma)

#### 1. Repository - `sipoc-diagram.repository.ts`

**Méthode ajoutée :** `findByIds(sipocIds: string[])`
```typescript
async findByIds(sipocIds: string[]): Promise<Array<{ sipoc_id: string; title: string }>> {
  return this.prisma.sipocDiagram.findMany({
    where: { sipoc_id: { in: sipocIds } },
    select: { sipoc_id: true, title: true }
  });
}
```

**Méthode existante :** `findAllExcept(sipoc_id: string)` dans `sipoc-element.repository.ts`
- Récupère tous les éléments SIPOC sauf ceux du diagramme actuel

#### 2. Service - `sipoc.service.ts`

**Méthode principale :** `findSimilarElements(sourceTitle, currentSipocId, threshold)`

**Algorithme de similarité :**

1. **Correspondance exacte (score: 1.0)**
   - Les titres sont identiques

2. **Contient (score: 0.85-0.9)**
   - Un titre contient l'autre

3. **Correspondance de mots (score: 0.7 * ratio)**
   - Mots individuels qui correspondent
   - Ratio = mots correspondants / total mots recherchés

4. **Partielle (score: 0.6 * ratio)**
   - Similarité caractère par caractère (Levenshtein-like)

**Structure de retour :**
```typescript
{
  element: {
    id: string,
    title: string,
    description: string,
    type: ElementType,
    sipoc_id: string
  },
  sipoc: {
    sipoc_id: string,
    title: string
  },
  similarityScore: number, // 0.0 - 1.0
  matchType: 'exact' | 'contains' | 'partial' | 'word_match'
}
```

#### 3. Controller - `sipoc-elements.controller.ts`

**Endpoint :** `GET /sipoc/:sipocId/elements/similar/:title`

**Query params :**
- `threshold` (optional): Seuil de similarité minimum (défaut: 0.3)

**Exemple :**
```bash
GET /sipoc/abc-123/elements/similar/Demande%20formation?threshold=0.3
```

### Frontend (React + React Query)

#### 1. API Service - `sipoc.api.ts`

**Méthode :** `findSimilarElements(sipocId, title, threshold)`
```typescript
async findSimilarElements(sipocId: string, title: string, threshold: number = 0.3) {
  return await get(
    `${this.baseUrl}/${sipocId}/elements/similar/${encodeURIComponent(title)}`,
    { params: { threshold } }
  )
}
```

#### 2. React Query Hook - `hooks/sipoc/useSipoc.ts`

**Hook :** `useSimilarElements(sipocId, title, threshold)`

**Configuration :**
- **queryKey:** `['sipoc', 'similar-elements', sipocId, title, threshold]`
- **enabled:** Uniquement si `sipocId` et `title` sont fournis
- **staleTime:** 2 minutes
- **gcTime:** 5 minutes

**Utilisation :**
```typescript
const { data: similarElements, isLoading } = useSimilarElements(
  sipocId,
  element.title,
  0.3 // threshold
);
```

#### 3. Composant - `SipocSimilarSuggestions.tsx`

**Props :**
```typescript
interface SipocSimilarSuggestionsProps {
  sipocId: string;
  elementTitle: string;
  threshold?: number;
  onSuggestionClick?: (suggestion: SimilarElement) => void;
}
```

**Affichage :**
- 🔍 Recherche en cours (loading)
- 💡 Suggestions IA avec badges de type de correspondance
- 📊 Score de similarité en pourcentage
- 🔗 Titre du SIPOC source
- ℹ️ Description de l'élément

**Badges de correspondance :**
- **Exact** (vert) : Correspondance exacte
- **Contient** (bleu) : Contient le terme
- **Mots similaires** (orange) : Mots individuels correspondent
- **Partielle** (gris) : Similarité partielle

#### 4. Intégration dans `SipocElementCard.tsx`

Le composant affiche déjà un menu déroulant "Suggestions IA" qui :
- Charge automatiquement les suggestions au survol
- Affiche jusqu'à 5 suggestions
- Permet de cliquer pour créer une connexion rapide
- Montre le score de similarité et le type de correspondance

## Flux de données

```
1. User types in SIPOC element title
   ↓
2. SipocElementCard renders with title
   ↓
3. useSimilarElements hook fetches suggestions
   ↓
4. Backend searches all elements except current SIPOC
   ↓
5. Calculates similarity scores
   ↓
6. Filters by threshold (≥ 0.3)
   ↓
7. Fetches SIPOC titles for matched elements
   ↓
8. Returns sorted suggestions (highest score first)
   ↓
9. Frontend displays in dropdown with visual indicators
```

## Exemples d'utilisation

### Cas 1 : Trouver des fournisseurs similaires

**Élément actuel :** "Service RH"

**Suggestions possibles :**
- "Service RH Formation" (score: 0.85, contient)
- "RH" (score: 0.9, contient)
- "Service Ressources Humaines" (score: 0.65, mots similaires)

### Cas 2 : Connecter des processus liés

**Élément actuel :** "Analyser besoin formation"

**Suggestions possibles :**
- "Analyse des besoins" (score: 0.7, mots similaires)
- "Identifier besoin formation" (score: 0.75, mots similaires)
- "Planifier formation" (score: 0.4, partielle)

## Configuration et personnalisation

### Ajuster le seuil de similarité

**Valeurs recommandées :**
- **0.8-1.0** : Correspondances très précises uniquement
- **0.5-0.7** : Bon équilibre (par défaut: 0.3)
- **0.3-0.4** : Plus de suggestions, moins précises
- **< 0.3** : Beaucoup de faux positifs

### Personnaliser l'algorithme

Modifiez `calculateTitleSimilarity()` dans `sipoc.service.ts` pour :
- Ajuster les poids des scores
- Ajouter des critères de correspondance
- Implémenter des algorithmes avancés (fuzzy matching, Levenshtein distance)

## Performance

### Optimisations actuelles

1. **Cache React Query :**
   - 2 minutes staleTime
   - 5 minutes gcTime
   - Évite les requêtes répétées

2. **Requête conditionnelle :**
   - Désactivée si titre vide
   - Désactivée si sipocId manquant

3. **Sélection limitée en DB :**
   - Uniquement les champs nécessaires
   - Pas de relations inutiles

### Améliorations futures

- **Indexation full-text** dans PostgreSQL pour recherche plus rapide
- **Mise en cache côté serveur** (Redis) pour suggestions fréquentes
- **Calcul asynchrone** pour gros volumes
- **Pagination** des résultats

## Tests

### Tester l'endpoint API

```bash
# Test avec curl
curl "http://localhost:3001/sipoc/abc-123/elements/similar/Service%20RH?threshold=0.3"

# Résultat attendu
[
  {
    "element": { "id": "...", "title": "Service RH Formation", ... },
    "sipoc": { "sipoc_id": "...", "title": "Formation 2024" },
    "similarityScore": 0.85,
    "matchType": "contains"
  }
]
```

### Tester dans l'interface

1. Ouvrir un diagramme SIPOC
2. Créer un élément avec titre "Formation"
3. Créer un autre SIPOC avec élément "Formation continue"
4. Revenir au premier SIPOC
5. Cliquer sur "Suggestions IA" → devrait afficher "Formation continue"

## Troubleshooting

### Aucune suggestion n'apparaît

**Causes possibles :**
- Aucun autre SIPOC dans la base de données
- Seuil trop élevé
- Titres trop différents

**Solution :**
- Vérifier qu'il existe d'autres SIPOCs
- Réduire le threshold à 0.2
- Utiliser des termes plus génériques

### Trop de suggestions non pertinentes

**Causes possibles :**
- Seuil trop bas
- Algorithme trop permissif

**Solution :**
- Augmenter threshold à 0.5 ou 0.6
- Affiner l'algorithme de similarité

### Performances lentes

**Causes possibles :**
- Trop d'éléments SIPOC en base
- Calculs complexes

**Solution :**
- Implémenter pagination
- Ajouter indexation full-text
- Utiliser cache serveur

## Évolutions futures

### Phase 2 : Connexions automatiques
- Suggestion automatique de créer des connexions
- Validation par l'utilisateur
- Historique des connexions créées par IA

### Phase 3 : Machine Learning
- Apprendre des connexions validées par utilisateurs
- Modèle personnalisé par workspace
- Suggestions basées sur le contexte métier

### Phase 4 : Analyse sémantique
- NLP pour comprendre le sens des titres
- Synonymes et termes métier
- Support multilingue

## Références

- **Algorithme similarité :** Inspiré de Jaro-Winkler et Levenshtein distance
- **React Query :** https://tanstack.com/query/latest
- **Prisma select :** https://www.prisma.io/docs/concepts/components/prisma-client/select-fields
