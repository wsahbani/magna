# PageWrapper - Résultat Visuel

## Structure de la Page Avec PageWrapper

```
┌─────────────────────────────────────────────────────────────────────┐
│ 🏠 › Workspaces › Direction Marketing › Équipe Marketing           │ Breadcrumbs
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Équipe Marketing                           [Exporter] [+ Nouveau] │ Header
│  Gérez les membres de l'équipe                                     │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                                                             │  │
│  │                    CONTENU DE LA PAGE                       │  │ Content
│  │                                                             │  │
│  │                    (Votre composant)                        │  │
│  │                                                             │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Exemple: WorkspacesPage

```
┌─────────────────────────────────────────────────────────────────────┐
│ 🏠 › Workspaces                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Workspaces                                  [+ Nouveau Workspace] │
│  Gérez la structure organisationnelle de votre entreprise          │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [🔍 Rechercher...]  [Type ▼]  [Grid] [Table]                      │ Filters
│                                                                     │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐          │
│  │ Workspace │ │ Workspace │ │ Workspace │ │ Workspace │          │ Grid View
│  │   Card    │ │   Card    │ │   Card    │ │   Card    │          │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘          │
│                                                                     │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐          │
│  │ Workspace │ │ Workspace │ │ Workspace │ │ Workspace │          │
│  │   Card    │ │   Card    │ │   Card    │ │   Card    │          │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Espacement Cohérent

### Padding Global
```
┌─ p-6 (24px) ──────────────────────────────────────────────────┐
│                                                                │
│  ┌─ Container ─────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │  Breadcrumbs                                             │  │
│  │                                                          │  │
│  │  ▼ space-y-6 (24px)                                      │  │
│  │                                                          │  │
│  │  Header (Title + Actions)                                │  │
│  │                                                          │  │
│  │  ▼ space-y-6 (24px)                                      │  │
│  │                                                          │  │
│  │  Content                                                 │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Breadcrumbs Détaillés
```
🏠 › 🏢 Workspaces › Direction Marketing › 👥 Équipe Marketing
^   ^             ^                        ^
│   │             │                        └─ Dernier (gras, pas de lien)
│   │             └────────────────────────── Lien cliquable
│   └──────────────────────────────────────── Icône + texte
└──────────────────────────────────────────── Home (toujours présent)
```

### Header Layout
```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  ┌─ flex-1 ──────────────────┐  ┌─ Actions ─────────────┐   │
│  │                            │  │                        │   │
│  │  Workspaces (H1)           │  │  [🔽 Export]           │   │
│  │  Gérez la structure...     │  │  [+ Nouveau]           │   │
│  │                            │  │                        │   │
│  └────────────────────────────┘  └────────────────────────┘   │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Couleurs et Typographie

### Background
```
Page Background: bg-gray-50 (#F9FAFB)
Content: bg-white (#FFFFFF)
```

### Texte
```
Title (H1): text-gray-900 (#111827) - Heading1 from @repo/ui
Description: text-gray-600 (#4B5563) - Body from @repo/ui
Breadcrumbs: text-gray-500 (#6B7280)
Breadcrumb actif: text-gray-900 (#111827)
```

### Hover States
```
Breadcrumb link: hover:text-orange-600 (#EA580C)
Bouton primaire: bg-orange-600 hover:bg-orange-700
```

## Responsive Behavior

### Desktop (> 1024px)
```
┌──────────────────────────────────────────────────────┐
│ 🏠 › Workspaces › Marketing                          │
│                                                      │
│ Workspaces                      [Export] [+ Nouveau] │
│ Description...                                       │
│                                                      │
│ [Grid content...]                                    │
└──────────────────────────────────────────────────────┘
```

### Tablet (768px - 1024px)
```
┌──────────────────────────────────────┐
│ 🏠 › Workspaces › Marketing          │
│                                      │
│ Workspaces                           │
│ Description...   [Export] [+ Nouveau]│
│                                      │
│ [Grid content...]                    │
└──────────────────────────────────────┘
```

### Mobile (< 768px)
```
┌────────────────────────┐
│ 🏠 › Workspaces        │
│                        │
│ Workspaces             │
│ Description...         │
│                        │
│ [+ Nouveau]            │
│ [Export]               │
│                        │
│ [List content...]      │
└────────────────────────┘
```

## Variantes de MaxWidth

### Full (défaut)
```
┌────────── 100% viewport width ──────────┐
│  Content expands to full width          │
└──────────────────────────────────────────┘
```

### 2xl (1536px)
```
        ┌───── 1536px max ─────┐
        │  Centered content    │
        └──────────────────────┘
```

### xl (1280px)
```
          ┌─── 1280px ───┐
          │   Content    │
          └──────────────┘
```

## États Spéciaux

### Page Vide (Empty State)
```
┌─────────────────────────────────────────┐
│ 🏠 › Projets                            │
│                                         │
│ Mes Projets              [+ Nouveau]    │
│ Gérez vos projets                       │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │                                   │ │
│  │         📄                        │ │
│  │                                   │ │
│  │    Aucun projet                   │ │
│  │    Commencez par créer...         │ │
│  │                                   │ │
│  │    [+ Créer un projet]            │ │
│  │                                   │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Page Formulaire (largeur limitée)
```
        ┌─────── max-w-2xl ───────┐
        │                         │
        │  🏠 › Paramètres         │
        │                         │
        │  Paramètres              │
        │  Configurez...           │
        │                         │
        │  ┌───────────────────┐  │
        │  │  Form Fields      │  │
        │  │  ...              │  │
        │  │  [Cancel] [Save]  │  │
        │  └───────────────────┘  │
        │                         │
        └─────────────────────────┘
```

### Page Plein Écran (noPadding)
```
┌─ No padding ──────────────────────────────┐
│ Header (avec padding interne)             │
│ ┌───────────────────────────────────────┐ │
│ │                                       │ │
│ │     Full Screen Editor                │ │
│ │     (ReactFlow, Canvas, etc.)         │ │
│ │                                       │ │
│ └───────────────────────────────────────┘ │
└───────────────────────────────────────────┘
```

## Comparaison Avant/Après

### AVANT (sans PageWrapper)
```tsx
<div className="p-6 space-y-6">
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-3xl font-bold">Titre</h1>
      <p className="text-gray-600">Description</p>
    </div>
    <Button>Action</Button>
  </div>
  
  <div>Contenu</div>
</div>
```

❌ Pas de breadcrumbs  
❌ Espacement manuel  
❌ Code dupliqué  
❌ Pas de cohérence  

### APRÈS (avec PageWrapper)
```tsx
<PageWrapper
  title="Titre"
  description="Description"
  breadcrumbs={[{ label: 'Section' }]}
  actions={<Button>Action</Button>}
>
  <div>Contenu</div>
</PageWrapper>
```

✅ Breadcrumbs automatiques  
✅ Espacement cohérent  
✅ Code réutilisable  
✅ Totale cohérence  

## Intégration avec la Charte Orange/Noir

### Couleurs Principales
- **Orange primaire**: `bg-orange-600` (#EA580C)
- **Orange hover**: `bg-orange-700` (#C2410C)
- **Noir**: `text-gray-900` (#111827)
- **Gris fond**: `bg-gray-50` (#F9FAFB)

### Utilisation dans PageWrapper
```tsx
// Breadcrumbs hover
hover:text-orange-600

// Actions
<Button className="bg-orange-600 hover:bg-orange-700">
```

## Accessibilité

### ARIA Labels
```html
<nav aria-label="Fil d'Ariane">
  <!-- Breadcrumbs -->
</nav>
```

### Sémantique HTML
```html
<h1>Titre</h1>
<p>Description</p>
<nav>Breadcrumbs</nav>
```

### Contraste
- Texte noir sur fond blanc: ✅ WCAG AAA
- Texte gris sur fond blanc: ✅ WCAG AA
- Orange sur blanc: ✅ WCAG AA

---

**Résultat**: Interface cohérente, professionnelle et accessible ! 🎉
