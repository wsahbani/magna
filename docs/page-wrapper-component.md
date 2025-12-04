# PageWrapper Component

## Vue d'ensemble

Le composant `PageWrapper` est un wrapper réutilisable pour toutes les pages de l'application. Il garantit un espacement cohérent, affiche les breadcrumbs (fil d'Ariane), le titre, la description et les actions de page.

## Caractéristiques

✅ **Breadcrumbs** automatiques avec icône Home  
✅ **Header cohérent** avec titre et description  
✅ **Actions** flexibles (boutons, filtres, etc.)  
✅ **Espacement standardisé** pour toutes les pages  
✅ **Largeur maximale configurable**  
✅ **Padding optionnel**

## Utilisation de Base

```tsx
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Building2, Plus } from 'lucide-react';
import { Button } from '@repo/ui';

export const MyPage = () => {
  return (
    <PageWrapper
      title="Ma Page"
      description="Description de ma page"
      breadcrumbs={[
        { label: 'Section', href: '/section' },
        { label: 'Ma Page', icon: <Building2 className="w-4 h-4" /> },
      ]}
      actions={
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Action
        </Button>
      }
    >
      {/* Contenu de votre page */}
      <div>Mon contenu</div>
    </PageWrapper>
  );
};
```

## Props

### Required

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Titre principal de la page (H1) |
| `children` | `ReactNode` | Contenu de la page |

### Optional

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `description` | `string` | - | Sous-titre descriptif |
| `breadcrumbs` | `BreadcrumbItem[]` | - | Fil d'Ariane |
| `actions` | `ReactNode` | - | Boutons/actions du header |
| `className` | `string` | `''` | Classes CSS additionnelles |
| `noPadding` | `boolean` | `false` | Désactive le padding global |
| `maxWidth` | `MaxWidth` | `'full'` | Largeur maximale du contenu |

### BreadcrumbItem

```typescript
interface BreadcrumbItem {
  label: string;        // Texte du breadcrumb
  href?: string;        // Lien (optionnel pour le dernier item)
  icon?: ReactNode;     // Icône optionnelle
}
```

### MaxWidth Options

- `'sm'` - 640px
- `'md'` - 768px
- `'lg'` - 1024px
- `'xl'` - 1280px
- `'2xl'` - 1536px
- `'4xl'` - 1600px
- `'6xl'` - 1800px
- `'full'` - Pleine largeur

## Exemples

### Page Simple

```tsx
<PageWrapper
  title="Tableau de Bord"
  description="Vue d'ensemble de vos activités"
>
  <div>Contenu du dashboard</div>
</PageWrapper>
```

### Avec Breadcrumbs

```tsx
import { Building2, Users } from 'lucide-react';

<PageWrapper
  title="Équipe Marketing"
  description="Gérez les membres de l'équipe"
  breadcrumbs={[
    { label: 'Workspaces', href: '/workspaces', icon: <Building2 /> },
    { label: 'Direction Marketing', href: '/workspaces/123' },
    { label: 'Équipe Marketing', icon: <Users /> },
  ]}
>
  <div>Contenu</div>
</PageWrapper>
```

### Avec Actions Multiples

```tsx
import { Plus, Filter, Download } from 'lucide-react';
import { Button } from '@repo/ui';

<PageWrapper
  title="Processus"
  description="Liste de tous les processus"
  breadcrumbs={[
    { label: 'Processus' },
  ]}
  actions={
    <>
      <Button variant="outline">
        <Download className="w-4 h-4 mr-2" />
        Exporter
      </Button>
      <Button variant="outline">
        <Filter className="w-4 h-4 mr-2" />
        Filtrer
      </Button>
      <Button className="bg-orange-600 hover:bg-orange-700">
        <Plus className="w-4 h-4 mr-2" />
        Nouveau
      </Button>
    </>
  }
>
  <div>Liste des processus</div>
</PageWrapper>
```

### Largeur Limitée

```tsx
<PageWrapper
  title="Paramètres"
  description="Configurez votre compte"
  maxWidth="2xl"
>
  <div>Formulaire de paramètres</div>
</PageWrapper>
```

### Sans Padding

```tsx
<PageWrapper
  title="Éditeur de Diagramme"
  noPadding
>
  <div className="h-screen">
    {/* Éditeur plein écran */}
  </div>
</PageWrapper>
```

## Structure HTML Générée

```html
<div class="min-h-screen bg-gray-50 p-6">
  <div class="mx-auto max-w-full space-y-6">
    
    <!-- Breadcrumbs -->
    <nav aria-label="Fil d'Ariane">
      <a href="/">🏠</a>
      <span>›</span>
      <a href="/section">Section</a>
      <span>›</span>
      <span>Page Actuelle</span>
    </nav>

    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <h1>Titre</h1>
        <p>Description</p>
      </div>
      <div>
        <!-- Actions -->
      </div>
    </div>

    <!-- Content -->
    <div>
      <!-- Votre contenu -->
    </div>
  </div>
</div>
```

## Espacement Cohérent

Le PageWrapper garantit:

- **Padding global**: `p-6` (24px) sur toutes les pages
- **Espacement vertical**: `space-y-6` (24px) entre sections
- **Background**: `bg-gray-50` uniforme
- **Min height**: `min-h-screen` pour pages courtes

## Breadcrumbs

### Comportement

1. **Icône Home** toujours affichée (lien vers `/`)
2. **Séparateur chevron** (`›`) entre items
3. **Liens cliquables** pour navigation (sauf dernier item)
4. **Dernier item** en gras (page actuelle)
5. **Hover state** orange sur les liens

### Icônes

```tsx
import { Building2, Users, Settings, FileText } from 'lucide-react';

breadcrumbs={[
  { label: 'Workspaces', icon: <Building2 className="w-4 h-4" /> },
  { label: 'Équipe', icon: <Users className="w-4 h-4" /> },
]}
```

## Accessibilité

✅ **ARIA labels** sur navigation (`aria-label="Fil d'Ariane"`)  
✅ **Sémantique HTML** correcte (`nav`, `h1`)  
✅ **Contraste WCAG AA** (texte sur fond)  
✅ **Focus visible** sur liens breadcrumbs

## Responsive

Le PageWrapper s'adapte automatiquement:

- **Mobile**: Padding réduit, actions en colonne
- **Tablette**: Layout standard
- **Desktop**: Pleine largeur ou limitée selon `maxWidth`

## Migration d'une Page Existante

### Avant

```tsx
export const MyPage = () => {
  return (
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
  );
};
```

### Après

```tsx
import { PageWrapper } from '@/components/layout/PageWrapper';

export const MyPage = () => {
  return (
    <PageWrapper
      title="Titre"
      description="Description"
      breadcrumbs={[{ label: 'Ma Section' }]}
      actions={<Button>Action</Button>}
    >
      <div>Contenu</div>
    </PageWrapper>
  );
};
```

## Bonnes Pratiques

1. ✅ **Toujours utiliser PageWrapper** pour les pages principales
2. ✅ **Breadcrumbs cohérents** avec la structure de navigation
3. ✅ **Actions pertinentes** dans le header (création, export, etc.)
4. ✅ **Description claire** en une phrase
5. ✅ **Icônes dans breadcrumbs** pour meilleure lisibilité
6. ❌ **Éviter les titres trop longs** (max 50 caractères)
7. ❌ **Ne pas dupliquer le padding** dans children

## Exemples Réels

### WorkspacesPage

```tsx
<PageWrapper
  title="Workspaces"
  description="Gérez la structure organisationnelle de votre entreprise"
  breadcrumbs={[
    { label: 'Workspaces', icon: <Building2 /> },
  ]}
  actions={
    <Button className="bg-orange-600">
      <Plus className="w-4 h-4 mr-2" />
      Nouveau Workspace
    </Button>
  }
>
  {/* Filtres, tableau, etc. */}
</PageWrapper>
```

### ProcessDetailsPage

```tsx
<PageWrapper
  title={process.name}
  description={`Code: ${process.code} | Version: ${process.version}`}
  breadcrumbs={[
    { label: 'Processus', href: '/processes' },
    { label: workspace.name, href: `/workspaces/${workspace.id}` },
    { label: process.name, icon: <FileText /> },
  ]}
  actions={
    <>
      <Button variant="outline">Exporter</Button>
      <Button>Modifier</Button>
    </>
  }
>
  {/* Détails du processus */}
</PageWrapper>
```

## Personnalisation

### Classes CSS Additionnelles

```tsx
<PageWrapper
  title="Ma Page"
  className="custom-class"
>
  {/* Le className est appliqué au container du contenu */}
</PageWrapper>
```

### Background Personnalisé

```tsx
<PageWrapper title="Ma Page" noPadding>
  <div className="bg-white p-6">
    {/* Background blanc au lieu de gray-50 */}
  </div>
</PageWrapper>
```

## Support

Pour toute question ou amélioration, consultez la documentation complète ou créez une issue.
