# Quick Start - Nouveaux Styles de Formulaire

## 🎯 Objectif

Appliquer le style moderne des formulaires avec validation visuelle (checkmarks verts, layout en grille) à tous vos modals et formulaires.

## 🚀 Utilisation Rapide

### 1. Import des composants

```typescript
import { ValidatedInput, ValidatedSelect, SelectItem, Label, Button } from '@repo/ui';
```

### 2. Input avec Checkmark

```tsx
<ValidatedInput
  value={value}
  onChange={handleChange}
  placeholder="Entrez une valeur"
/>
```

✅ Le checkmark vert apparaît automatiquement quand `value` est rempli

### 3. Select avec Checkmark

```tsx
<ValidatedSelect
  value={value}
  onValueChange={setValue}
  placeholder="Sélectionnez..."
>
  <SelectItem value="opt1">Option 1</SelectItem>
  <SelectItem value="opt2">Option 2</SelectItem>
</ValidatedSelect>
```

✅ Le checkmark vert apparaît automatiquement quand une option est sélectionnée

### 4. Layout en Grille (3 colonnes)

```tsx
<div className="grid grid-cols-3 gap-4">
  <div className="space-y-2">
    <Label>Champ 1 <span className="text-red-500">*</span></Label>
    <ValidatedSelect placeholder="...">...</ValidatedSelect>
  </div>
  <div className="space-y-2">
    <Label>Champ 2</Label>
    <ValidatedInput placeholder="..." />
  </div>
  <div className="space-y-2">
    <Label>Champ 3 <span className="text-red-500">*</span></Label>
    <ValidatedInput placeholder="..." />
  </div>
</div>
```

### 5. Layout en Grille (2 colonnes)

```tsx
<div className="grid grid-cols-2 gap-4">
  <div className="space-y-2">
    <Label>Champ 1</Label>
    <ValidatedInput placeholder="..." />
  </div>
  <div className="space-y-2">
    <Label>Champ 2</Label>
    <ValidatedSelect placeholder="...">...</ValidatedSelect>
  </div>
</div>
```

### 6. Boutons du Footer

```tsx
<DialogFooter className="gap-2 sm:gap-2">
  <Button variant="outline" onClick={onClose}>
    Annuler
  </Button>
  <Button disabled={!isValid}>
    Valider
  </Button>
</DialogFooter>
```

## 📋 Template Complet

```tsx
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Label,
  ValidatedInput,
  ValidatedSelect,
  SelectItem,
} from '@repo/ui';

export const MyModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    field1: '',
    field2: '',
  });

  const isValid = formData.field1; // Ajoutez votre logique de validation

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Titre du Modal
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="field1">
                Champ 1 <span className="text-red-500">*</span>
              </Label>
              <ValidatedInput
                id="field1"
                value={formData.field1}
                onChange={(e) => setFormData({...formData, field1: e.target.value})}
                placeholder="Entrez une valeur"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="field2">Champ 2</Label>
              <ValidatedSelect
                id="field2"
                value={formData.field2}
                onValueChange={(v) => setFormData({...formData, field2: v})}
                placeholder="Sélectionnez"
              >
                <SelectItem value="opt1">Option 1</SelectItem>
                <SelectItem value="opt2">Option 2</SelectItem>
              </ValidatedSelect>
            </div>
          </div>
        </form>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button disabled={!isValid}>
            Valider
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
```

## 🎨 Classes CSS Importantes

| Élément | Classes |
|---------|---------|
| Form container | `space-y-6 py-4` |
| Grille 3 cols | `grid grid-cols-3 gap-4` |
| Grille 2 cols | `grid grid-cols-2 gap-4` |
| Field wrapper | `space-y-2` |
| Label requis | `text-red-500` (pour le *) |
| Footer | `gap-2 sm:gap-2` |

## 🔧 Props des Composants

### ValidatedInput
- Accepte toutes les props standard de `Input`
- `showCheckmark?: boolean` - Force l'affichage/masquage du checkmark

### ValidatedSelect
- `value?: string`
- `onValueChange?: (value: string) => void`
- `placeholder?: string`
- `children: ReactNode` (les SelectItem)
- `showCheckmark?: boolean` - Force l'affichage/masquage du checkmark

## 📦 Fichiers Créés

- `packages/ui/components/validated-input.tsx` - Input avec checkmark
- `packages/ui/components/validated-select.tsx` - Select avec checkmark
- `apps/web/src/features/sipoc/components/ModernModalExample.tsx` - Exemple complet
- `apps/web/src/pages/StyleShowcasePage.tsx` - Page de démonstration
- `docs/form-styling-guide.md` - Documentation complète

## 🎯 Voir la Démo

Ajoutez cette route dans votre app pour voir la démo:

```tsx
import { StyleShowcasePage } from './pages/StyleShowcasePage';

// Dans vos routes
<Route path="/style-showcase" element={<StyleShowcasePage />} />
```

## 📚 Documentation Complète

Pour plus de détails, consultez [docs/form-styling-guide.md](docs/form-styling-guide.md)

## ✅ Checklist Migration

- [ ] Remplacer `Input` par `ValidatedInput` dans les formulaires
- [ ] Remplacer `Select` par `ValidatedSelect` dans les formulaires
- [ ] Ajouter layout en grille (`grid grid-cols-X gap-4`)
- [ ] Ajouter astérisques rouges sur champs requis
- [ ] Utiliser le nouveau style de boutons du footer
- [ ] Tester la validation visuelle (checkmarks)
- [ ] Vérifier le responsive (mobile/tablette)
