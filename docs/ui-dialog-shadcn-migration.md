# Migration Dialog vers shadcn/ui

## Contexte

Le composant `Dialog` dans `@repo/ui` était une implémentation personnalisée qui n'utilisait pas les primitives Radix UI correctement. Cette migration le remplace par la version officielle shadcn/ui.

## Changements effectués

### 1. Composant Dialog (`packages/ui/components/ui/dialog.tsx`)

**Avant** : Implémentation personnalisée avec overlay manuel
```tsx
export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      {children}
    </div>
  )
}
```

**Après** : Version shadcn/ui avec Radix UI primitives
```tsx
const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogOverlay = React.forwardRef<...>(...)
const DialogContent = React.forwardRef<...>(...)
```

### 2. Nouveaux composants exportés

- ✅ `Dialog` - Root component (Radix Root)
- ✅ `DialogPortal` - Portal pour rendu en dehors du DOM parent
- ✅ `DialogOverlay` - Overlay avec animations fade in/out
- ✅ `DialogClose` - Bouton de fermeture (intégré dans DialogContent)
- ✅ `DialogTrigger` - Trigger pour ouvrir le dialog
- ✅ `DialogContent` - Contenu avec animations et close button
- ✅ `DialogHeader` - Header avec spacing
- ✅ **`DialogFooter`** - **NOUVEAU** : Footer pour les actions
- ✅ `DialogTitle` - Titre avec styles
- ✅ `DialogDescription` - Description

### 3. Composants mis à jour

#### `/apps/web/src/features/sipoc/components/EditElementModal.tsx`

**Changements** :
- ❌ Supprimé `<DialogClose onClose={handleCancel} />` (close button intégré)
- ❌ Supprimé les divs wrapper inutiles (`border-b`, `px-6 pb-6`)
- ✅ Ajouté `DialogFooter` pour les boutons d'action
- ✅ Simplifié la structure du formulaire

**Avant** :
```tsx
<Dialog open={isOpen} onOpenChange={handleCancel}>
  <DialogContent>
    <DialogClose onClose={handleCancel} />
    <div className="border-b border-gray-200">
      <DialogHeader>...</DialogHeader>
    </div>
    <div className="px-6 pb-6">
      <form>
        ...
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button>Annuler</Button>
          <Button>Enregistrer</Button>
        </div>
      </form>
    </div>
  </DialogContent>
</Dialog>
```

**Après** :
```tsx
<Dialog open={isOpen} onOpenChange={handleCancel}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>...</DialogTitle>
    </DialogHeader>
    <form>
      ...
      <DialogFooter>
        <Button>Annuler</Button>
        <Button>Enregistrer</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
```

#### `/apps/web/src/features/sipoc/components/SipocRelationModal.tsx`

**Changements identiques** :
- ❌ Supprimé `<DialogClose onClose={handleCancel} />`
- ❌ Supprimé `<div className="border-b border-gray-200">` autour du header
- ✅ Ajouté `DialogFooter`
- ✅ Intégré l'icône `Link2` directement dans `DialogTitle`

#### `/apps/web/src/features/sipoc/components/SipocImportModal.tsx`

**Changements** :
- ✅ Ajouté import `DialogFooter`
- ✅ Remplacé `<div className="flex justify-between">` par `<DialogFooter>`

## Avantages de la migration

### 1. **Animations natives**
- Fade in/out de l'overlay
- Zoom in/out du contenu
- Slide animations configurables
- Support des data attributes (`data-[state=open]`)

### 2. **Accessibilité (a11y)**
- Gestion automatique du focus
- Trap du focus dans le dialog
- Support ESC pour fermer
- ARIA attributes corrects
- Screen reader friendly

### 3. **Comportement standardisé**
- Close button intégré (croix en haut à droite)
- Click outside pour fermer
- Gestion du scroll body
- Z-index cohérent (z-50)

### 4. **API cohérente**
```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Titre</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    
    {/* Contenu */}
    
    <DialogFooter>
      <Button>Action</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### 5. **Styling Tailwind optimisé**
- Classes utilitaires pour animations
- Responsive avec `sm:` prefix
- Dark mode ready avec `dark:` prefix
- Personnalisable via `className`

## Breaking Changes

### ❌ `DialogClose` avec prop `onClose`
**Avant** :
```tsx
<DialogClose onClose={handleCancel} />
```

**Après** : Le close button est intégré dans `DialogContent`
```tsx
<DialogContent>
  {/* Close button automatique en haut à droite */}
</DialogContent>
```

### ✅ `DialogFooter` obligatoire pour les actions
**Avant** :
```tsx
<div className="flex justify-end gap-3">
  <Button>Action</Button>
</div>
```

**Après** :
```tsx
<DialogFooter>
  <Button>Action</Button>
</DialogFooter>
```

## Configuration Tailwind

Le package `tailwindcss-animate` est déjà configuré dans `packages/ui/tailwind.config.ts` :

```typescript
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  // ...
  plugins: [tailwindcssAnimate],
}
```

Les animations suivantes sont disponibles :
- `animate-in` / `animate-out`
- `fade-in-0` / `fade-out-0`
- `zoom-in-95` / `zoom-out-95`
- `slide-in-from-*` / `slide-out-to-*`

## Tests de régression

### Composants vérifiés ✅
- `/apps/web/src/features/sipoc/components/EditElementModal.tsx`
- `/apps/web/src/features/sipoc/components/SipocRelationModal.tsx`
- `/apps/web/src/features/sipoc/components/SipocImportModal.tsx`
- `/apps/web/src/features/processes/pages/ProcessesPage.tsx`

### Composants non modifiés (footer dans ProcessForm)
- `/apps/web/src/features/workspaces/pages/WorkspacesPage.tsx`
- `/apps/web/src/features/workspaces/pages/WorkspaceDetailPage.tsx`

## Prochaines étapes

### Migration recommandée pour d'autres composants UI

Si d'autres composants personnalisés existent, envisager la migration vers shadcn/ui :

1. **Select** → `@radix-ui/react-select` ✅ (déjà installé)
2. **Dropdown Menu** → `@radix-ui/react-dropdown-menu` ✅ (déjà installé)
3. **Popover** → `@radix-ui/react-popover` ✅ (déjà installé)
4. **Toast** → `@radix-ui/react-toast` ✅ (déjà installé)
5. **Tabs** → `@radix-ui/react-tabs` ✅ (déjà installé)

Tous les packages Radix UI sont déjà installés dans `packages/ui/package.json` ! 🎉

### Vérifications post-migration

```bash
# Compiler le projet
cd /home/wsahbani/poc/process-manager-orange
pnpm build

# Vérifier les erreurs TypeScript
pnpm type-check

# Lancer le dev mode
pnpm dev
```

## Références

- [shadcn/ui Dialog](https://ui.shadcn.com/docs/components/dialog)
- [Radix UI Dialog](https://www.radix-ui.com/primitives/docs/components/dialog)
- [Tailwind CSS Animate](https://github.com/jamiebuilds/tailwindcss-animate)

## Conclusion

✅ Migration réussie vers shadcn/ui Dialog  
✅ 0 erreur de compilation liée au Dialog  
✅ API cohérente et accessible  
✅ Animations natives et fluides  
✅ Code plus maintenable et standardisé
