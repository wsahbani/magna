# Excel Preview Table - Tableau d'édition interactif

## Vue d'ensemble

Le composant `ExcelPreviewTable` affiche les données Excel importées dans un tableau interactif qui reproduit la structure du fichier Excel original, avec possibilité de modifier ou supprimer chaque cellule et chaque ligne.

## Architecture

### Composant principal
- **Fichier** : `/apps/web/src/features/sipoc/components/ExcelPreviewTable.tsx`
- **Type** : Composant React avec édition inline
- **Responsabilité** : Affichage et édition des données Excel avant sauvegarde

### Interface

```typescript
interface ExcelPreviewTableProps {
  rows: ParsedSipocRow[];                    // Données parsées du fichier Excel
  onRowUpdate: (rowIndex: number, updatedRow: ParsedSipocRow) => void;
  onRowDelete: (rowIndex: number) => void;
  onCellUpdate: (rowIndex: number, columnType: ColumnType, cellIndex: number, newValue: string) => void;
  onCellDelete: (rowIndex: number, columnType: ColumnType, cellIndex: number) => void;
}
```

## Fonctionnalités

### 1. Affichage en tableau
- **5 colonnes** avec couleurs distinctives :
  - Fournisseurs (violet)
  - Entrées (bleu)
  - Processus (orange)
  - Sorties (vert)
  - Clients (rose)
- **Numérotation des lignes** à gauche
- **Colonne Actions** à droite
- **En-têtes sticky** qui restent visibles au scroll

### 2. Édition de cellules
- **Mode édition inline** : Clic sur icône crayon
- **Validation** : Touche Entrée ou bouton Check
- **Annulation** : Touche Échap ou bouton X
- **Auto-focus** sur le champ d'édition
- **Affichage hover** : Icônes visibles au survol uniquement

### 3. Suppression
- **Cellule** : Bouton poubelle rouge sur chaque cellule
- **Ligne complète** : Bouton poubelle dans colonne Actions
- **Confirmation visuelle** : Couleurs rouge au hover

### 4. Gestion des cellules multiples
Chaque cellule peut contenir plusieurs éléments :
```tsx
<div className="space-y-1">
  {cells.map((cell, cellIndex) => (
    <div className="group flex items-center gap-2">
      {/* Contenu éditable */}
    </div>
  ))}
</div>
```

### 5. États visuels
- **Normal** : Bordure grise, fond blanc
- **Hover** : Bordure orange, icônes visibles
- **Édition** : Bordure orange, ring orange au focus
- **Vide** : Texte gris italique "Vide"

## Intégration avec SipocImportModal

### Handlers implémentés

```typescript
// Mise à jour d'une cellule
const handleCellUpdate = useCallback(
  (rowIndex, columnType, cellIndex, newValue) => {
    // 1. Met à jour parsedRows
    setParsedRows(updated);
    // 2. Reconvertit en éléments SIPOC
    const elements = convertToSipocElements(parsedRows);
    setEditableElements(elements);
  },
  [parsedRows]
);

// Suppression d'une cellule
const handleCellDelete = useCallback(
  (rowIndex, columnType, cellIndex) => {
    // Supprime la cellule du tableau
    cells.splice(cellIndex, 1);
    // Reconvertit les éléments
  },
  [parsedRows]
);

// Suppression d'une ligne
const handleRowDelete = useCallback((rowIndex) => {
  const updatedRows = parsedRows.filter((_, i) => i !== rowIndex);
  const elements = convertToSipocElements(updatedRows);
  setEditableElements(elements);
}, [parsedRows]);
```

### Flux de données

```
Excel File Upload
      ↓
parseExcelFile()
      ↓
ParsedSipocRow[] → setParsedRows
      ↓
convertToSipocElements()
      ↓
SipocElementImport[] → setEditableElements
      ↓
ExcelPreviewTable (affichage)
      ↓
User edits/deletes
      ↓
handleCellUpdate/Delete/RowDelete
      ↓
Reconversion → Update stats
      ↓
Save to API
```

## Styles et Design System

### Couleurs par type
```typescript
const COLUMNS = [
  { key: 'suppliers', label: 'Fournisseurs', color: 'bg-purple-50 border-purple-200' },
  { key: 'inputs', label: 'Entrées', color: 'bg-blue-50 border-blue-200' },
  { key: 'processes', label: 'Processus', color: 'bg-orange-50 border-orange-200' },
  { key: 'outputs', label: 'Sorties', color: 'bg-green-50 border-green-200' },
  { key: 'customers', label: 'Clients', color: 'bg-pink-50 border-pink-200' },
];
```

### Composants UI utilisés
- `BodySmall` : Contenu des cellules
- `Caption` : En-têtes et numérotation
- Icons Lucide : `Edit2`, `Trash2`, `Check`, `X`

### Classes Tailwind importantes
```css
.group                    /* Groupe pour hover effects */
.opacity-0               /* Icônes invisibles par défaut */
.group-hover:opacity-100 /* Icônes visibles au hover */
.sticky.top-0            /* En-têtes fixes */
.z-10                    /* Z-index pour en-têtes */
.overflow-x-auto         /* Scroll horizontal */
.min-w-[200px]          /* Largeur minimale colonnes */
```

## Expérience Utilisateur

### Pattern d'édition
1. **Hover** → Affiche icônes Edit/Delete
2. **Click Edit** → Active mode édition
3. **Modify** → Tape le nouveau texte
4. **Validate** → Entrée ou Check
5. **Update** → Reconversion automatique + stats

### Feedback visuel
- Transition smooth des couleurs : `transition-colors`
- Animation du hover : `hover:border-orange-300`
- Focus ring visible : `focus:ring-2 focus:ring-orange-500`
- État loading géré par parent (phase 'saving')

### Accessibilité
- Labels ARIA via `title` attributes
- Navigation clavier (Tab, Enter, Escape)
- Contraste couleurs suffisant
- Tailles de clic généreuses (min 44x44px)

## Performance

### Optimisations
- **Callbacks memoized** avec `useCallback`
- **État local** pour édition (évite re-renders inutiles)
- **Batch updates** : Une seule reconversion après édition
- **Virtual scrolling** : Possible si >100 lignes (à implémenter)

### Limites actuelles
- Pas de virtualisation (OK pour <50 lignes)
- Reconversion complète à chaque modification
- Pas de debounce sur l'édition

## Améliorations futures

### Court terme
1. **Validation inline** : Vérifier longueur max, caractères interdits
2. **Undo/Redo** : Stack de modifications
3. **Bulk actions** : Sélection multiple et suppression groupée

### Moyen terme
4. **Drag & Drop** : Réorganiser les lignes
5. **Column resize** : Ajuster largeurs colonnes
6. **Export** : Re-générer Excel depuis le tableau modifié

### Long terme
7. **Virtual scrolling** : Pour gros fichiers (>100 lignes)
8. **Collaborative editing** : Plusieurs utilisateurs simultanés
9. **History** : Voir qui a modifié quoi et quand

## Tests recommandés

### Tests unitaires
```typescript
describe('ExcelPreviewTable', () => {
  it('should render all columns with correct colors');
  it('should enter edit mode on edit button click');
  it('should save changes on Enter key');
  it('should cancel changes on Escape key');
  it('should delete cell on delete button click');
  it('should delete entire row');
  it('should display "Vide" for empty cells');
});
```

### Tests d'intégration
- Import Excel → Affichage → Édition → Sauvegarde → Vérification DB
- Import → Suppression cellules → Reconversion → Stats correctes
- Import gros fichier → Performance acceptable

### Tests manuels
✅ Hover sur cellule → Icônes apparaissent  
✅ Édition → Sauvegarde → Stats mises à jour  
✅ Suppression cellule → Ligne réorganisée  
✅ Suppression ligne → Numérotation recalculée  
✅ Cellules vides → Affichage "Vide"  
✅ Multiples éléments par cellule → Liste verticale

## Documentation associée

- **Guide utilisateur** : `docs/sipoc-excel-import-guide.md`
- **Exemple de données** : `docs/sipoc-excel-example.md`
- **Parser Excel** : `apps/web/src/features/sipoc/utils/excel-parser.ts`
- **Modal parent** : `apps/web/src/features/sipoc/components/SipocImportModal.tsx`

## Conclusion

Le composant `ExcelPreviewTable` offre une expérience d'édition fluide et intuitive qui reproduit la familiarité d'Excel tout en ajoutant des fonctionnalités d'édition moderne (inline editing, hover actions, keyboard shortcuts). L'intégration avec le workflow d'import SIPOC permet une validation et nettoyage des données avant sauvegarde définitive.
