# SIPOC Board - Architecture Row-Based

## Vue d'ensemble

Le `SipocBoard` a été restructuré pour afficher les éléments SIPOC par **lignes de flux** (rows) au lieu de colonnes indépendantes. Chaque ligne représente un flux complet : Fournisseurs → Entrées → **Processus** → Sorties → Clients.

## Changements majeurs

### Avant (Architecture en colonnes)
```
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│ Suppliers   │ Inputs      │ Process     │ Outputs     │ Customers   │
├─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ Supplier 1  │ Input 1     │ Process 1   │ Output 1    │ Customer 1  │
│ Supplier 2  │ Input 2     │ Process 2   │ Output 2    │ Customer 2  │
│ Supplier 3  │ Input 3     │ Process 3   │ Output 3    │ Customer 3  │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```
❌ Problème : Difficile de voir les relations entre éléments d'un même flux

### Après (Architecture en lignes)
```
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│ Fournisseurs│   Entrées   │  Processus  │   Sorties   │   Clients   │
├─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ Row 1: Flux Formation                                                │
├─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ Supplier 1  │ Input 1     │             │ Output 1    │ Customer 1  │
│ Supplier 2  │ Input 2     │  Process 1  │ Output 2    │ Customer 2  │
│             │             │ (FULL HEIGHT)│            │             │
├─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ Row 2: Flux Validation                                               │
├─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ Supplier 3  │ Input 3     │  Process 2  │ Output 3    │ Customer 3  │
│             │ Input 4     │ (FULL HEIGHT)│            │             │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```
✅ Avantages :
- Chaque ligne = 1 flux complet SIPOC
- Le processus prend toute la hauteur → visibilité maximale
- Relations claires entre éléments connectés

## Structure des données

### Interface SipocRow
```typescript
interface SipocRow {
  process: SipocElement;           // 1 processus par ligne
  suppliers: SipocElement[];       // N fournisseurs connectés
  inputs: SipocElement[];          // N entrées connectées
  outputs: SipocElement[];         // N sorties connectées
  customers: SipocElement[];       // N clients connectés
}
```

### Algorithme de groupement
```typescript
// 1. Récupérer tous les processus (triés par position)
const processes = elements.filter(el => el.type === 'process')

// 2. Pour chaque processus, trouver les éléments connectés
processes.map(process => {
  // Trouver toutes les connexions liées à ce processus
  const processConnections = connections.filter(
    conn => conn.source_element_id === process.id || 
            conn.target_element_id === process.id
  )
  
  // Extraire les IDs des éléments connectés
  const connectedIds = processConnections.map(...)
  
  // Grouper par type
  return {
    process,
    suppliers: elements.filter(el => el.type === 'supplier' && connectedIds.has(el.id)),
    inputs: elements.filter(el => el.type === 'input' && connectedIds.has(el.id)),
    outputs: elements.filter(el => el.type === 'output' && connectedIds.has(el.id)),
    customers: elements.filter(el => el.type === 'customer' && connectedIds.has(el.id))
  }
})
```

## Composants visuels

### 1. Header sticky (en-têtes fixes)
```tsx
<div className="sticky top-0 z-10 bg-white border-b shadow-sm">
  <div className="grid grid-cols-5 gap-4 p-4">
    {/* Fournisseurs | Entrées | Processus | Sorties | Clients */}
    {/* Chaque colonne a un bouton + pour ajouter un élément */}
  </div>
</div>
```

### 2. SIPOC Rows (lignes de flux)
```tsx
<div className="p-4 space-y-4">
  {rows.map(row => (
    <div className="grid grid-cols-5 gap-4 bg-white rounded-lg border shadow-sm p-4 min-h-[120px]">
      {/* Colonne 1: Suppliers */}
      <div className="space-y-2">
        {row.suppliers.map(...)}
      </div>
      
      {/* Colonne 2: Inputs */}
      <div className="space-y-2">
        {row.inputs.map(...)}
      </div>
      
      {/* Colonne 3: Process - FULL HEIGHT */}
      <div className="flex items-stretch">
        <div className="flex-1">
          <SipocElementCard 
            element={row.process} 
            className="h-full"  // ← Prend toute la hauteur !
          />
        </div>
      </div>
      
      {/* Colonne 4: Outputs */}
      <div className="space-y-2">
        {row.outputs.map(...)}
      </div>
      
      {/* Colonne 5: Customers */}
      <div className="space-y-2">
        {row.customers.map(...)}
      </div>
    </div>
  ))}
</div>
```

### 3. Section des éléments orphelins
```tsx
{/* Éléments non connectés à aucun processus */}
<div className="mt-8 pt-8 border-t">
  <Caption>Éléments non connectés</Caption>
  <div className="grid grid-cols-5 gap-4">
    {/* Même structure mais sans processus central */}
  </div>
</div>
```

## Classes CSS importantes

### Processus pleine hauteur
```css
.flex items-stretch      /* Parent: étire les enfants */
.flex-1                  /* Enfant: prend tout l'espace disponible */
.h-full                  /* Card: hauteur 100% du parent */
```

### Grille responsive
```css
.grid grid-cols-5 gap-4  /* 5 colonnes égales avec espacement */
.min-h-[120px]          /* Hauteur minimale de ligne */
.space-y-4              /* Espacement vertical entre lignes */
```

### Header sticky
```css
.sticky top-0 z-10      /* Reste visible au scroll */
.bg-white border-b      /* Séparation visuelle */
.shadow-sm              /* Ombre légère */
```

## Modifications SipocElementCard

### Avant
```typescript
interface SipocElementCardProps {
  element: SipocElement;
  sipocId: string;
}
```

### Après
```typescript
interface SipocElementCardProps {
  element: SipocElement;
  sipocId: string;
  className?: string;  // ← Nouveau !
}

// Utilisation
<Card className={`p-4 hover:shadow-md transition-shadow ${className || ''}`}>
```

## Comportement

### Ajout d'élément
- Bouton `+` dans l'en-tête de chaque colonne
- Crée un élément orphelin (non connecté)
- Apparaît dans la section "Éléments non connectés"
- Peut être connecté ensuite via le modal de relation

### Connexions
- Les éléments connectés au même processus apparaissent dans la même ligne
- Un élément peut être connecté à plusieurs processus → apparaît dans plusieurs lignes
- Les connexions créent la structure logique des flux

### Hauteur dynamique
- La hauteur de la ligne s'adapte au nombre d'éléments dans les colonnes
- Le processus s'étire pour prendre toute la hauteur disponible
- Minimum 120px pour garantir la lisibilité

## Avantages UX

1. **Clarté visuelle** : Chaque ligne = 1 flux complet
2. **Focus sur le processus** : Pleine hauteur met en évidence le pivot central
3. **Navigation intuitive** : Lecture de gauche à droite (flow naturel)
4. **Groupement logique** : Éléments liés visuellement proches
5. **Gestion des orphelins** : Section dédiée pour éléments non connectés

## Cas d'usage

### Scénario 1 : Processus de formation
```
Ligne 1:
├─ Fournisseurs: Service RH, Service Formation
├─ Entrées: Demande formation, Budget
├─ Processus: Analyser besoin formation ← PLEINE HAUTEUR
├─ Sorties: Plan de formation, Devis
└─ Clients: Employés, Direction
```

### Scénario 2 : Processus multi-étapes
```
Ligne 1: Réception commande
Ligne 2: Validation commande
Ligne 3: Préparation
Ligne 4: Expédition
```

Chaque ligne est autonome et montre le flux complet à travers le processus central.

## Prochaines améliorations

1. **Drag & Drop** : Réorganiser les lignes
2. **Collapse/Expand** : Plier/déplier les lignes
3. **Filtrage** : Afficher uniquement certains types de flux
4. **Export PDF** : Imprimer le SIPOC avec mise en page optimisée
5. **Indicateurs visuels** : Flèches entre colonnes pour montrer le flow
