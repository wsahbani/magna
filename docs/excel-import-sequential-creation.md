# Import Excel - Création séquentielle des processus

## Vue d'ensemble

L'import Excel crée les processus **un par un** (pas de bulk) pour permettre une meilleure gestion des erreurs et un suivi détaillé de la création.

## Workflow d'import

### Phase 1 : Upload
1. Utilisateur sélectionne fichier Excel
2. Validation du format (.xlsx, .xls, .ods)
3. Validation de la taille (< 10 MB)

### Phase 2 : Preview
1. **Parsing** : Analyse du fichier avec logique "Process as Pivot"
2. **Conversion** : Transformation en `SipocElementImport[]`
3. **Édition** : Tableau interactif pour modifier/supprimer
4. **Statistiques** : Affichage du nombre d'éléments par type

### Phase 3 : Saving
1. **Groupement** : Éléments groupés par `flowId`
2. **Création séquentielle** : Pour chaque flow
   - Trouver le processus (1 par flow)
   - Créer via API : `POST /sipoc/:sipocId/elements`
   - Logger le succès
3. **Completion** : Rafraîchir la liste des éléments

## Flow ID - Clé de séparation des lignes

### Concept

Le `flow_id` est un **UUID unique** généré lors du parsing Excel qui identifie chaque flux SIPOC. C'est la clé qui permet au SipocBoard de séparer les processus en lignes distinctes.

### Génération

```typescript
// Dans parseExcelFile → parseSipocData
if (processes.length > 0) {
  currentFlow = {
    flowId: crypto.randomUUID(), // ← Génère UUID unique
    suppliers: [...],
    inputs: [...],
    processes: [...],
    outputs: [...],
    customers: [...]
  };
}
```

### Utilisation dans SipocBoard

```typescript
// SipocBoard groupe les éléments par flow_id
const rows = useMemo(() => {
  const processes = elements
    .filter((el) => el.type === ElementType.process)
    .sort((a, b) => a.position - b.position);

  return processes.map((process): SipocRow => {
    // Chaque processus avec un flow_id différent = nouvelle ligne
    const connectedElements = elements.filter(
      (el) => el.flow_id === process.flow_id
    );
    
    return {
      process,
      suppliers: connectedElements.filter(el => el.type === 'supplier'),
      inputs: connectedElements.filter(el => el.type === 'input'),
      outputs: connectedElements.filter(el => el.type === 'output'),
      customers: connectedElements.filter(el => el.type === 'customer'),
    };
  });
}, [elements]);
```

### Problème sans flow_id

**Sans flow_id** (tous `null` ou identiques) :
```
┌──────────────────────────────────────────┐
│ Row 1 - Tous les processus regroupés    │
│ ┌────────────────────────────────────┐  │
│ │ Process 1                          │  │
│ │ Process 2                          │  │ ← Tous dans la même ligne !
│ │ Process 3                          │  │
│ └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

**Avec flow_id unique** :
```
┌──────────────────────────────────────────┐
│ Row 1 - Process 1 (flow: abc-123)       │
│ ┌────────────────────────────────────┐  │
│ │ Process 1                          │  │
│ └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
┌──────────────────────────────────────────┐
│ Row 2 - Process 2 (flow: def-456)       │
│ ┌────────────────────────────────────┐  │
│ │ Process 2                          │  │
│ └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
┌──────────────────────────────────────────┐
│ Row 3 - Process 3 (flow: ghi-789)       │
│ ┌────────────────────────────────────┐  │
│ │ Process 3                          │  │
│ └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

### Traçabilité

Le `flow_id` permet aussi de :
1. **Tracer l'origine** : Savoir quels éléments viennent du même flux Excel
2. **Grouper les connexions** : Les éléments d'un même flow seront connectés entre eux
3. **Debugging** : Identifier facilement les problèmes d'import

## Implémentation

### Structure des données

```typescript
interface SipocElementImport {
  type: ElementType;           // process | supplier | input | output | customer
  title: string;               // Titre de l'élément
  description: string;         // Description (vide par défaut)
  flowId: string;              // UUID du flux parent
  position: number;            // Position dans la colonne
  globalOrder: number;         // Ordre global du flux
}
```

### Algorithme de sauvegarde

```typescript
const handleSave = async () => {
  setPhase('saving');
  
  try {
    // 1. Grouper par flowId
    const flowsMap = new Map<string, SipocElementImport[]>();
    editableElements.forEach((el) => {
      if (!flowsMap.has(el.flowId)) {
        flowsMap.set(el.flowId, []);
      }
      flowsMap.get(el.flowId)!.push(el);
    });

    let totalCreated = 0;

    // 2. Pour chaque flow, créer TOUS les éléments SIPOC
    for (const [flowId, elements] of flowsMap.entries()) {
      // Trouver le processus
      const processElement = elements.find(
        (el) => el.type === ElementType.process
      );
      
      if (!processElement) {
        console.warn(`No process for flow ${flowId}, skipping...`);
        continue;
      }

      // A. Créer le processus d'abord (pivot)
      await sipocApi.createElement({
        sipoc_id: sipocId,
        type: processElement.type,
        title: processElement.title,
        description: processElement.description,
        position: processElement.globalOrder,
        flow_id: flowId, // UUID unique
      });
      totalCreated++;
      console.log(`✅ Created process: "${processElement.title}"`);

      // B. Créer tous les autres éléments du flow
      const otherElements = elements.filter(
        (el) => el.type !== ElementType.process
      );
      
      for (const element of otherElements) {
        await sipocApi.createElement({
          sipoc_id: sipocId,
          type: element.type,
          title: element.title,
          description: element.description,
          position: element.position,
          flow_id: flowId, // ← Même flow_id que le processus
        });
        totalCreated++;
        console.log(`  ↳ Created ${element.type}: "${element.title}"`);
      }

      console.log(`✅ Flow completed: ${elements.length} elements`);
    }

    console.log(`🎉 Import completed! ${totalCreated} elements across ${flowsMap.size} flows`);
    
    onImportComplete();
    handleCancelClick();
  } catch (error) {
    console.error('Error during import:', error);
    setPhase('preview');
    alert('Erreur lors de l\'import. Veuillez réessayer.');
  }
};
```

## Appel API

### Endpoint utilisé

```
POST /sipoc/:sipocId/elements
```

### Payload (CreateElementDto)

```typescript
{
  sipoc_id: string;      // ID du SIPOC parent
  type: ElementType;     // "process" pour l'instant
  title: string;         // "Analyser besoin formation"
  description: string;   // "" (vide par défaut)
  position: number;      // 0, 1, 2... (ordre global)
  flow_id: string;       // UUID unique pour chaque flux (abc-123, def-456...)
}
```

**⚠️ Important** : Le `flow_id` est crucial pour séparer les processus en lignes distinctes dans le SipocBoard. Chaque processus doit avoir un `flow_id` unique correspondant au `flowId` généré lors du parsing Excel.

### Réponse (SipocElement)

```typescript
{
  id: string;            // UUID généré
  sipoc_id: string;
  type: ElementType;
  title: string;
  description: string;
  position: number;
  flow_id: string | null;
  created_at: Date;
  updated_at: Date;
}
```

## Exemple d'exécution

### Données parsées

**3 flux SIPOC** :
```javascript
[
  {
    flowId: "abc-123",
    processes: ["Analyser besoin formation"],
    suppliers: ["Service RH", "Direction"],
    inputs: ["Demande", "Budget"],
    outputs: ["Plan formation"],
    customers: ["Employés"]
  },
  {
    flowId: "def-456",
    processes: ["Sélectionner organisme"],
    suppliers: ["Organisme formation"],
    inputs: ["Catalogue"],
    outputs: ["Contrat"],
    customers: ["Service RH"]
  },
  {
    flowId: "ghi-789",
    processes: ["Organiser session"],
    suppliers: ["Service IT"],
    inputs: ["Liste participants"],
    outputs: ["Convocations"],
    customers: ["Participants"]
  }
]
```

### Appels API séquentiels

```javascript
// ========================================
// Flow 1 - "Analyser besoin formation"
// ========================================

// 1. Create Process
POST /sipoc/xyz-sipoc/elements
{
  sipoc_id: "xyz-sipoc",
  type: "process",
  title: "Analyser besoin formation",
  description: "",
  position: 0,
  flow_id: "abc-123"
}
→ ✅ Created process: "Analyser besoin formation" (flow: abc-123)

// 2. Create Suppliers
POST /sipoc/xyz-sipoc/elements
{
  sipoc_id: "xyz-sipoc",
  type: "supplier",
  title: "Service RH",
  description: "",
  position: 0,
  flow_id: "abc-123" // ← Same flow as process
}
→   ↳ Created supplier: "Service RH"

POST /sipoc/xyz-sipoc/elements
{
  type: "supplier",
  title: "Direction",
  flow_id: "abc-123"
}
→   ↳ Created supplier: "Direction"

// 3. Create Inputs
POST /sipoc/xyz-sipoc/elements
{
  type: "input",
  title: "Demande formation",
  flow_id: "abc-123"
}
→   ↳ Created input: "Demande formation"

POST /sipoc/xyz-sipoc/elements
{
  type: "input",
  title: "Budget disponible",
  flow_id: "abc-123"
}
→   ↳ Created input: "Budget disponible"

// 4. Create Outputs
POST /sipoc/xyz-sipoc/elements
{
  type: "output",
  title: "Plan de formation",
  flow_id: "abc-123"
}
→   ↳ Created output: "Plan de formation"

// 5. Create Customers
POST /sipoc/xyz-sipoc/elements
{
  type: "customer",
  title: "Employés",
  flow_id: "abc-123"
}
→   ↳ Created customer: "Employés"

→ ✅ Flow completed: 7 elements created

// ========================================
// Flow 2 - "Sélectionner organisme"
// ========================================

POST /sipoc/xyz-sipoc/elements
{
  type: "process",
  title: "Sélectionner organisme",
  flow_id: "def-456"
}
→ ✅ Created process: "Sélectionner organisme" (flow: def-456)

POST /sipoc/xyz-sipoc/elements
{ type: "supplier", title: "Organisme formation", flow_id: "def-456" }
→   ↳ Created supplier: "Organisme formation"

POST /sipoc/xyz-sipoc/elements
{ type: "input", title: "Catalogue", flow_id: "def-456" }
→   ↳ Created input: "Catalogue"

POST /sipoc/xyz-sipoc/elements
{ type: "output", title: "Contrat", flow_id: "def-456" }
→   ↳ Created output: "Contrat"

POST /sipoc/xyz-sipoc/elements
{ type: "customer", title: "Service RH", flow_id: "def-456" }
→   ↳ Created customer: "Service RH"

→ ✅ Flow completed: 5 elements created

// ========================================
// Flow 3 - "Organiser session"
// ========================================

POST /sipoc/xyz-sipoc/elements
{
  type: "process",
  title: "Organiser session",
  flow_id: "ghi-789"
}
→ ✅ Created process: "Organiser session" (flow: ghi-789)

POST /sipoc/xyz-sipoc/elements
{ type: "supplier", title: "Service IT", flow_id: "ghi-789" }
→   ↳ Created supplier: "Service IT"

POST /sipoc/xyz-sipoc/elements
{ type: "input", title: "Liste participants", flow_id: "ghi-789" }
→   ↳ Created input: "Liste participants"

POST /sipoc/xyz-sipoc/elements
{ type: "output", title: "Convocations", flow_id: "ghi-789" }
→   ↳ Created output: "Convocations"

POST /sipoc/xyz-sipoc/elements
{ type: "customer", title: "Participants", flow_id: "ghi-789" }
→   ↳ Created customer: "Participants"

→ ✅ Flow completed: 5 elements created

→ 🎉 Import completed! Created 17 elements across 3 flows
```

### Logs de console

```
✅ Created process: "Analyser besoin formation" (flow: abc-123)
✅ Created process: "Sélectionner organisme" (flow: def-456)
✅ Created process: "Organiser session" (flow: ghi-789)
🎉 Import completed! Created 3 processes
```

**Résultat dans SipocBoard** :
- **Row 1** : Process "Analyser besoin formation" (flow_id: abc-123)
- **Row 2** : Process "Sélectionner organisme" (flow_id: def-456)
- **Row 3** : Process "Organiser session" (flow_id: ghi-789)

Chaque processus apparaît dans sa propre ligne car ils ont des `flow_id` différents.

## Gestion des erreurs

### Erreur réseau

```typescript
try {
  await sipocApi.createElement(...);
} catch (error) {
  console.error('Error during import:', error);
  setPhase('preview'); // Retour à la phase preview
  alert('Erreur lors de l\'import. Veuillez réessayer.');
}
```

**Comportement** :
- Phase revient à `preview`
- Utilisateur peut corriger et ré-essayer
- Processus déjà créés restent en base

### Flow sans processus

```typescript
if (!processElement) {
  console.warn(`No process for flow ${flowId}, skipping...`);
  continue; // Passe au flow suivant
}
```

**Comportement** :
- Warning dans console
- Flow ignoré
- Import continue avec les autres flows

### Validation côté serveur

Le backend valide :
- ✅ `sipoc_id` existe
- ✅ `type` est valide (enum ElementType)
- ✅ `title` est non vide
- ✅ `position` est un nombre

Si validation échoue → Exception 400 Bad Request

## Avantages de l'approche séquentielle

### ✅ Avantages

1. **Contrôle fin** : Suivi détaillé de chaque création
2. **Logs clairs** : Un log par processus créé
3. **Gestion erreurs** : Si erreur sur flow 2, flows 1 est déjà créé
4. **Simplicité** : Utilise l'endpoint existant, pas de nouveau endpoint bulk
5. **Feedback UX** : Peut afficher progression (TODO)

### ❌ Inconvénients

1. **Performance** : Plus lent qu'un bulk (N requêtes au lieu de 1)
2. **Atomicité** : Pas de rollback si erreur au milieu
3. **Réseau** : Plus de latence réseau

### ⚖️ Trade-off acceptable

Pour l'import Excel SIPOC :
- Nombre de processus généralement **< 20**
- Latence réseau locale négligeable
- Contrôle > Performance pour cette feature
- Possibilité d'ajouter bulk plus tard si besoin

## Évolution future

### Phase 1 (Actuel) : Processus uniquement
```
✅ Créer les processus un par un
⏳ Créer les autres éléments SIPOC (next step)
⏳ Créer les connexions entre éléments
```

### Phase 2 : Éléments SIPOC complets
```typescript
for (const [flowId, elements] of flowsMap.entries()) {
  const processElement = elements.find(el => el.type === ElementType.process);
  
  // 1. Créer le processus
  const createdProcess = await sipocApi.createElement({...});
  
  // 2. Créer les autres éléments du flow
  const otherElements = elements.filter(el => el.type !== ElementType.process);
  for (const element of otherElements) {
    await sipocApi.createElement({
      sipoc_id: sipocId,
      type: element.type,
      title: element.title,
      description: element.description,
      position: element.position,
    });
  }
  
  // 3. Créer les connexions (suppliers/inputs → process → outputs/customers)
  // TODO: Implement connections
}
```

### Phase 3 : Optimisation avec bulk

```typescript
POST /sipoc/:sipocId/elements/bulk
{
  flows: [
    {
      process: { type, title, description, position },
      suppliers: [...],
      inputs: [...],
      outputs: [...],
      customers: [...],
      connections: [...]
    }
  ]
}
```

**Backend** :
```typescript
async bulkCreateFlows(sipocId: string, flows: FlowImport[]) {
  return this.prisma.$transaction(async (tx) => {
    const results = [];
    
    for (const flow of flows) {
      // Créer processus
      const process = await tx.sipocElement.create({...});
      
      // Créer autres éléments
      const elements = await Promise.all([
        ...flow.suppliers.map(s => tx.sipocElement.create({...})),
        ...flow.inputs.map(i => tx.sipocElement.create({...})),
        // etc.
      ]);
      
      // Créer connexions
      // ...
      
      results.push({ process, elements });
    }
    
    return results;
  });
}
```

## UI - Phase Saving

### État actuel

```tsx
case 'saving':
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-4" />
      <Body className="text-gray-600">Enregistrement en cours...</Body>
    </div>
  );
```

### Amélioration possible : Progression

```tsx
const [importProgress, setImportProgress] = useState({ current: 0, total: 0 });

// Dans handleSave
for (const [index, [flowId, elements]] of Array.from(flowsMap.entries()).entries()) {
  setImportProgress({ current: index + 1, total: flowsMap.size });
  await sipocApi.createElement({...});
}

// UI
<Body className="text-gray-600">
  Création des processus... {importProgress.current}/{importProgress.total}
</Body>
<div className="w-64 bg-gray-200 rounded-full h-2 mt-4">
  <div 
    className="bg-orange-600 h-2 rounded-full transition-all"
    style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
  />
</div>
```

## Conclusion

L'approche séquentielle pour l'import Excel SIPOC offre :
- ✅ Simplicité d'implémentation (utilise API existante)
- ✅ Logs détaillés pour debugging
- ✅ Gestion d'erreurs granulaire
- ✅ Base solide pour évolutions futures

Prochaine étape : Ajouter la création des autres éléments SIPOC (suppliers, inputs, outputs, customers) dans le même flow.
