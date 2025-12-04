# PageWrapper - Composant de Layout Réutilisable

## ✅ Créé avec Succès

### Composant Principal
- **Fichier**: `apps/web/src/components/layout/PageWrapper.tsx`
- **Export**: `apps/web/src/components/layout/index.ts`

### Documentation
- **Guide Complet**: `docs/page-wrapper-component.md`
- **Exemples**: `apps/web/src/components/layout/PageWrapperExamples.tsx`

### Migration Effectuée
- ✅ **WorkspacesPage** utilise maintenant PageWrapper

## 🎯 Fonctionnalités

### 1. Breadcrumbs (Fil d'Ariane)
```tsx
breadcrumbs={[
  { label: 'Workspaces', href: '/workspaces', icon: <Building2 /> },
  { label: 'Direction Marketing', href: '/workspaces/123' },
  { label: 'Équipe Marketing', icon: <Users /> },
]}
```
- Icône Home automatique
- Séparateurs chevrons
- Dernier item en gras (page actuelle)
- Hover state orange

### 2. Header Cohérent
```tsx
title="Workspaces"
description="Gérez la structure organisationnelle"
```
- Titre H1 avec typographie `Heading1` de @repo/ui
- Description avec typographie `Body` de @repo/ui

### 3. Actions Flexibles
```tsx
actions={
  <Button className="bg-orange-600">
    <Plus className="w-4 h-4 mr-2" />
    Nouveau Workspace
  </Button>
}
```
- Boutons d'action
- Filtres
- Exports
- Tout élément React

### 4. Espacement Standardisé
- Padding: `p-6` (24px)
- Spacing: `space-y-6` (24px entre sections)
- Background: `bg-gray-50`
- Min height: `min-h-screen`

### 5. Largeur Configurable
```tsx
maxWidth="2xl"  // Limite à 1536px
maxWidth="full" // Pleine largeur (défaut)
```

## 📋 Utilisation Rapide

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
        { label: 'Ma Page', icon: <Building2 /> },
      ]}
      actions={
        <Button className="bg-orange-600">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Action
        </Button>
      }
    >
      {/* Votre contenu ici */}
      <div>Contenu de la page</div>
    </PageWrapper>
  );
};
```

## 🔄 Migration des Pages Existantes

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

## 📦 Props Complètes

```typescript
interface PageWrapperProps {
  // Required
  title: string;
  children: ReactNode;

  // Optional
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  className?: string;
  noPadding?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | 'full';
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}
```

## 🎨 Exemples de Cas d'Usage

### 1. Page Liste Simple
```tsx
<PageWrapper
  title="Workspaces"
  description="Gérez votre organisation"
  breadcrumbs={[{ label: 'Workspaces' }]}
  actions={<Button>Nouveau</Button>}
>
  <div className="grid grid-cols-4 gap-4">
    {/* Cards */}
  </div>
</PageWrapper>
```

### 2. Page Détails avec Navigation
```tsx
<PageWrapper
  title="Équipe Marketing"
  breadcrumbs={[
    { label: 'Workspaces', href: '/workspaces' },
    { label: 'Direction Marketing', href: '/workspaces/123' },
    { label: 'Équipe Marketing' },
  ]}
  actions={
    <>
      <Button variant="outline">Exporter</Button>
      <Button>Modifier</Button>
    </>
  }
>
  <div>Détails de l'équipe</div>
</PageWrapper>
```

### 3. Page Formulaire (Largeur Limitée)
```tsx
<PageWrapper
  title="Paramètres"
  description="Configurez votre compte"
  maxWidth="2xl"
  breadcrumbs={[{ label: 'Paramètres' }]}
>
  <form className="bg-white p-6 rounded-lg shadow">
    {/* Form fields */}
  </form>
</PageWrapper>
```

### 4. Éditeur Plein Écran (Sans Padding)
```tsx
<PageWrapper
  title="Éditeur de Diagramme"
  noPadding
  actions={
    <>
      <Button variant="outline">Annuler</Button>
      <Button>Enregistrer</Button>
    </>
  }
>
  <div className="h-screen">
    {/* Full screen editor */}
  </div>
</PageWrapper>
```

## 🎯 Avantages

✅ **Cohérence** - Toutes les pages ont le même look  
✅ **Breadcrumbs automatiques** - Navigation claire  
✅ **Espacement uniforme** - Design professionnel  
✅ **Responsive** - S'adapte à tous les écrans  
✅ **Accessible** - ARIA labels, sémantique HTML  
✅ **Maintenable** - Un seul composant à modifier  
✅ **DRY** - Plus de code dupliqué  

## 📝 Pages à Migrer

Prochaines pages à convertir:
- [ ] ProcessesPage
- [ ] ProcessDetailsPage
- [ ] SipocEditorPage
- [ ] UsersPage
- [ ] SettingsPage
- [ ] DashboardPage

## 📚 Documentation

- **Guide Complet**: [docs/page-wrapper-component.md](docs/page-wrapper-component.md)
- **Exemples de Code**: [PageWrapperExamples.tsx](apps/web/src/components/layout/PageWrapperExamples.tsx)

## 🔧 Support

Pour toute question, consultez la documentation ou les exemples fournis.

---

**Status**: ✅ Prêt à l'utilisation  
**Version**: 1.0.0  
**Date**: 2025-12-01
