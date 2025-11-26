# Algorithme de Parsing Excel - Process as Pivot

## Vue d'ensemble

Le parsing Excel pour SIPOC utilise **la colonne Processus comme pivot** pour déterminer les flux. Cette approche reflète la nature du diagramme SIPOC où le processus est l'élément central autour duquel gravitent les autres éléments.

## Algorithme Principal

### Étape 1 : Détection des colonnes

```typescript
const columnMapping = detectColumns(firstRow);
// Résultat: { suppliers, inputs, processes, outputs, customers }
```

**Support multilingue** :
- Français : Fournisseurs, Entrées, Processus, Sorties, Clients
- Anglais : Suppliers, Inputs, Process, Outputs, Customers
- Fallback : Utilise l'ordre des colonnes (0, 1, 2, 3, 4)

### Étape 2 : Parsing ligne par ligne avec accumulation

```typescript
let currentFlow: ParsedSipocRow | null = null;
let firstProcessFound = false;

jsonData.forEach((row, index) => {
  // Parse each column
  const suppliers = parseCell(row[columnMapping.suppliers]);
  const inputs = parseCell(row[columnMapping.inputs]);
  const processes = parseCell(row[columnMapping.processes]);
  const outputs = parseCell(row[columnMapping.outputs]);
  const customers = parseCell(row[columnMapping.customers]);
  
  // Skip completely empty rows
  if (noData) return;
  
  // PIVOT LOGIC: Check for process
  if (processes.length > 0) {
    // NEW FLOW: Process found → Start new flow
    if (currentFlow) {
      rows.push(currentFlow); // Save previous flow
    }
    
    currentFlow = {
      flowId: uuid(),
      suppliers: [...suppliers],
      inputs: [...inputs],
      processes: [...processes],
      outputs: [...outputs],
      customers: [...customers],
      rowIndex: index + 2
    };
    
    firstProcessFound = true;
  } else {
    // ACCUMULATION: No process → Add to current flow
    if (!currentFlow) {
      // Warning: Data before first process
      return;
    }
    
    // Accumulate to current flow
    currentFlow.suppliers.push(...suppliers);
    currentFlow.inputs.push(...inputs);
    currentFlow.outputs.push(...outputs);
    currentFlow.customers.push(...customers);
  }
});

// Don't forget last flow
if (currentFlow) {
  rows.push(currentFlow);
}
```

## Scénarios de parsing

### Scénario 1 : Flux simple (1 ligne par processus)

**Excel :**
```
| Fournisseurs | Entrées | Processus | Sorties | Clients |
| Fournisseur1 | Entrée1 | Process1  | Sortie1 | Client1 |
| Fournisseur2 | Entrée2 | Process2  | Sortie2 | Client2 |
```

**Résultat :**
```javascript
[
  {
    flowId: "uuid-1",
    suppliers: ["Fournisseur1"],
    inputs: ["Entrée1"],
    processes: ["Process1"],
    outputs: ["Sortie1"],
    customers: ["Client1"]
  },
  {
    flowId: "uuid-2",
    suppliers: ["Fournisseur2"],
    inputs: ["Entrée2"],
    processes: ["Process2"],
    outputs: ["Sortie2"],
    customers: ["Client2"]
  }
]
```

### Scénario 2 : Flux avec accumulation (lignes multiples)

**Excel :**
```
| Fournisseurs | Entrées | Processus | Sorties | Clients |
| Fournisseur1 | Entrée1 | Process1  | Sortie1 | Client1 |
| Fournisseur2 | Entrée2 |           | Sortie2 | Client2 |
| Fournisseur3 |         |           |         |         |
| Fournisseur4 | Entrée3 | Process2  | Sortie3 | Client3 |
```

**Résultat :**
```javascript
[
  {
    flowId: "uuid-1",
    suppliers: ["Fournisseur1", "Fournisseur2", "Fournisseur3"],
    inputs: ["Entrée1", "Entrée2"],
    processes: ["Process1"],
    outputs: ["Sortie1", "Sortie2"],
    customers: ["Client1", "Client2"]
  },
  {
    flowId: "uuid-2",
    suppliers: ["Fournisseur4"],
    inputs: ["Entrée3"],
    processes: ["Process2"],
    outputs: ["Sortie3"],
    customers: ["Client3"]
  }
]
```

### Scénario 3 : Cellule avec multiples valeurs

**Excel :**
```
| Fournisseurs        | Entrées           | Processus | Sorties | Clients |
| Fournisseur1        | Entrée1           | Process1  | Sortie1 | Client1 |
| Fournisseur2;       | Entrée2;          |           | Sortie2 | Client2 |
| Fournisseur3        | Entrée3           |           |         |         |
```

**Parsing des cellules :**
```typescript
parseCell("Fournisseur2;\nFournisseur3")
// → ["Fournisseur2", "Fournisseur3"]

parseCell("Entrée2; Entrée3")
// → ["Entrée2", "Entrée3"]
```

**Résultat :**
```javascript
[
  {
    flowId: "uuid-1",
    suppliers: ["Fournisseur1", "Fournisseur2", "Fournisseur3"],
    inputs: ["Entrée1", "Entrée2", "Entrée3"],
    processes: ["Process1"],
    outputs: ["Sortie1", "Sortie2"],
    customers: ["Client1", "Client2"]
  }
]
```

## Gestion des cas limites

### Cas 1 : Données avant le premier processus

**Excel :**
```
| Fournisseurs | Entrées | Processus | Sorties | Clients |
| Fournisseur1 | Entrée1 |           | Sortie1 | Client1 |  ← Ignoré
| Fournisseur2 | Entrée2 | Process1  | Sortie2 | Client2 |  ← Crée Flow 1
```

**Comportement :**
- Warning : "Éléments SIPOC trouvés avant le premier processus - ignorés"
- La ligne 1 est ignorée car aucun processus n'existe encore
- La ligne 2 crée le premier flux

### Cas 2 : Multiples processus dans une cellule

**Excel :**
```
| Fournisseurs | Entrées | Processus           | Sorties | Clients |
| Fournisseur1 | Entrée1 | Process1; Process2  | Sortie1 | Client1 |
```

**Comportement :**
```javascript
{
  processes: ["Process1", "Process2"]
}
```

**Warning :** "Flow 1: 2 processus trouvés - seul le premier sera utilisé comme pivot"

**Conversion :**
```typescript
// Only first process is used as main pivot
elements.push({
  type: ElementType.process,
  title: row.processes[0], // "Process1" only
  flowId: row.flowId
});
```

### Cas 3 : Lignes complètement vides

**Excel :**
```
| Fournisseurs | Entrées | Processus | Sorties | Clients |
| Fournisseur1 | Entrée1 | Process1  | Sortie1 | Client1 |
|              |         |           |         |         |  ← Ignorée
| Fournisseur2 | Entrée2 | Process2  | Sortie2 | Client2 |
```

**Comportement :**
- Ligne vide détectée et ignorée silencieusement
- Ne crée pas de warning
- N'affecte pas l'accumulation

## Conversion en éléments SIPOC

### Structure de sortie

```typescript
interface SipocElementImport {
  type: ElementType;           // supplier | input | process | output | customer
  title: string;               // Titre de l'élément
  description: string;         // Vide par défaut
  flowId: string;              // UUID du flux parent
  position: number;            // Position dans la colonne (0, 1, 2...)
  globalOrder: number;         // Ordre global du flux (0, 1, 2...)
}
```

### Algorithme de conversion

```typescript
parsedData.forEach((row, globalOrder) => {
  // 1. Main process (PIVOT) - Only first one
  if (row.processes.length > 0) {
    elements.push({
      type: ElementType.process,
      title: row.processes[0],  // Premier processus uniquement
      flowId: row.flowId,
      position: 0,
      globalOrder
    });
  }
  
  // 2. All suppliers
  row.suppliers.forEach((supplier, position) => {
    elements.push({
      type: ElementType.supplier,
      title: supplier,
      flowId: row.flowId,
      position,
      globalOrder
    });
  });
  
  // 3-5. Inputs, Outputs, Customers (même pattern)
  // ...
});
```

### Exemple de conversion complète

**Parsed Row :**
```javascript
{
  flowId: "abc-123",
  suppliers: ["Supplier A", "Supplier B"],
  inputs: ["Input 1"],
  processes: ["Main Process"],
  outputs: ["Output 1", "Output 2"],
  customers: ["Customer A"]
}
```

**Converted Elements :**
```javascript
[
  { type: "process",  title: "Main Process", flowId: "abc-123", position: 0, globalOrder: 0 },
  { type: "supplier", title: "Supplier A",   flowId: "abc-123", position: 0, globalOrder: 0 },
  { type: "supplier", title: "Supplier B",   flowId: "abc-123", position: 1, globalOrder: 0 },
  { type: "input",    title: "Input 1",      flowId: "abc-123", position: 0, globalOrder: 0 },
  { type: "output",   title: "Output 1",     flowId: "abc-123", position: 0, globalOrder: 0 },
  { type: "output",   title: "Output 2",     flowId: "abc-123", position: 1, globalOrder: 0 },
  { type: "customer", title: "Customer A",   flowId: "abc-123", position: 0, globalOrder: 0 }
]
```

## Validations et Warnings

### Validations critiques (Errors)

1. **Fichier vide** : `"Le fichier Excel est vide"`
2. **Colonnes manquantes** : `"Format de colonnes non reconnu"`
3. **Aucun processus** : `"Aucun processus trouvé dans le fichier"`

### Avertissements (Warnings)

1. **Données avant premier processus** :
   ```
   "Ligne 2: Éléments SIPOC trouvés avant le premier processus - ignorés"
   ```

2. **Processus manquant dans un flow** :
   ```
   "Flow 1: Aucun processus défini"
   ```

3. **Multiples processus** :
   ```
   "Flow 1: 2 processus trouvés - seul le premier sera utilisé comme pivot"
   ```

## Performance

### Complexité algorithmique

- **Temps** : O(n × m) où n = nombre de lignes, m = nombre d'éléments par ligne
- **Espace** : O(n × m) pour stocker tous les éléments

### Optimisations

1. **Parsing paresseux** : Skip empty rows early
2. **Accumulation in-place** : Use array spread only when needed
3. **Single pass** : One iteration through all rows
4. **UUID generation** : Only when creating new flow

### Limites recommandées

- **Lignes** : < 1000 lignes (confort utilisateur)
- **Éléments par cellule** : < 50 (lisibilité)
- **Taille fichier** : < 10 MB (limite hard-coded)

## Tests unitaires recommandés

```typescript
describe('parseExcelFile', () => {
  it('should parse simple one-row-per-process file');
  it('should accumulate elements across multiple rows');
  it('should handle multiple values per cell (semicolon)');
  it('should handle multiple values per cell (line break)');
  it('should ignore rows before first process');
  it('should ignore completely empty rows');
  it('should warn about multiple processes per flow');
  it('should use only first process as pivot');
  it('should generate unique flowIds for each flow');
  it('should preserve order with globalOrder');
});
```

## Conclusion

L'algorithme "Process as Pivot" offre :
- ✅ **Flexibilité** : Support de fichiers avec ou sans accumulation
- ✅ **Clarté** : Le processus détermine clairement les flux
- ✅ **Robustesse** : Gestion des cas limites et validations
- ✅ **Performance** : Parsing en un seul passage
- ✅ **UX** : Warnings informatifs sans bloquer l'import
