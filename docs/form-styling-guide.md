# Guide de Style des Formulaires - Modal Moderne

## Vue d'ensemble

Ce guide définit les styles visuels à appliquer aux composants de formulaire pour obtenir l'apparence moderne du design system.

## Styles des Composants

### 1. Input / Select - Avec Validation Visuelle

#### Style de base
```tsx
// Input standard avec placeholder
<Input
  placeholder="Choisissez un bouquet"
  className="h-11 border-gray-300 text-gray-900 placeholder:text-gray-500"
/>
```

#### Avec checkmark de validation (champ rempli)
```tsx
<div className="relative">
  <Input
    value={value}
    placeholder="Référence kenobi"
    className="h-11 pr-10 border-gray-300"
  />
  {value && (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
      <Check className="w-5 h-5 text-green-600" />
    </div>
  )}
</div>
```

#### Select avec checkmark
```tsx
<div className="relative">
  <Select value={value} onValueChange={setValue}>
    <SelectTrigger className="h-11 border-gray-300">
      <SelectValue placeholder="Choisissez une zone" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="zone1">Zone 1</SelectItem>
    </SelectContent>
  </Select>
  {value && (
    <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none z-10">
      <Check className="w-5 h-5 text-green-600" />
    </div>
  )}
</div>
```

### 2. Label avec Champ Requis

```tsx
<Label htmlFor="field" className="text-sm font-medium text-gray-900">
  Bouquet <span className="text-red-500">*</span>
</Label>
```

### 3. Boutons

#### Bouton Annuler (outline)
```tsx
<Button 
  type="button" 
  variant="outline"
  className="border-gray-300 text-gray-900 hover:bg-gray-50"
>
  Annuler
</Button>
```

#### Bouton Valider (primaire)
```tsx
<Button 
  type="submit"
  disabled={!isValid}
  className="bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500"
>
  Valider
</Button>
```

### 4. Layout du Formulaire

#### Structure en grille
```tsx
<form className="space-y-6 py-4">
  {/* Ligne 1: 3 colonnes */}
  <div className="grid grid-cols-3 gap-4">
    <div className="space-y-2">
      <Label>Champ 1 <span className="text-red-500">*</span></Label>
      <Select>...</Select>
    </div>
    <div className="space-y-2">
      <Label>Champ 2</Label>
      <Select>...</Select>
    </div>
    <div className="space-y-2">
      <Label>Champ 3 <span className="text-red-500">*</span></Label>
      <Select>...</Select>
    </div>
  </div>

  {/* Ligne 2: 2 colonnes */}
  <div className="grid grid-cols-2 gap-4">
    <div className="space-y-2">
      <Label>Champ 4</Label>
      <Input />
    </div>
    <div className="space-y-2">
      <Label>Champ 5</Label>
      <Select>...</Select>
    </div>
  </div>
</form>
```

### 5. Modal Header

```tsx
<DialogHeader>
  <DialogTitle className="text-xl font-semibold text-gray-900">
    Ajouter un référentiel kenobi
  </DialogTitle>
</DialogHeader>
```

### 6. Modal Footer

```tsx
<DialogFooter className="gap-2 sm:gap-2">
  <Button variant="outline" onClick={onClose}>
    Annuler
  </Button>
  <Button type="submit" disabled={!isValid}>
    Valider
  </Button>
</DialogFooter>
```

## Palette de Couleurs

### Texte
- **Titre modal** : `text-gray-900`
- **Label** : `text-gray-900` 
- **Placeholder** : `text-gray-500`
- **Texte input** : `text-gray-900`
- **Requis** : `text-red-500`

### Bordures
- **Input/Select** : `border-gray-300`
- **Focus** : `ring-orange-500` (automatique via composant)

### Boutons
- **Primaire** : `bg-gray-900 hover:bg-gray-800`
- **Primaire désactivé** : `bg-gray-300 text-gray-500`
- **Outline** : `border-gray-300 hover:bg-gray-50`

### Validation
- **Checkmark** : `text-green-600`
- **Erreur** : `text-red-600`

## Espacements

### Hauteurs
- **Input/Select** : `h-11` (44px)
- **Icône checkmark** : `w-5 h-5` (20px)

### Gaps
- **Entre champs horizontaux** : `gap-4` (16px)
- **Entre lignes** : `space-y-6` (24px)
- **Label to Input** : `space-y-2` (8px)
- **Footer buttons** : `gap-2` (8px)

### Padding
- **Form container** : `py-4` (16px vertical)
- **Input interne** : Géré par le composant
- **Checkmark offset** : `right-3` ou `right-10` (pour select)

## Classes CSS Complètes

### Input Standard
```css
h-11 border-gray-300 text-gray-900 placeholder:text-gray-500
```

### Input avec Checkmark (wrapper)
```css
relative
```

### Checkmark Icon Container
```css
absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none
```

### Select avec Checkmark Icon
```css
absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none z-10
```

### Label avec Requis
```css
text-sm font-medium text-gray-900
```

### Span Requis
```css
text-red-500
```

### Bouton Outline
```css
border-gray-300 text-gray-900 hover:bg-gray-50
```

### Bouton Primaire
```css
bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500
```

## Exemples d'Intégration

### Formulaire Simple
```tsx
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@repo/ui';
import { Button, Label, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@repo/ui';
import { Check } from 'lucide-react';

export const ModernFormModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    field1: '',
    field2: '',
    field3: '',
  });

  const isValid = formData.field1 && formData.field3;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Titre du Modal
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-6 py-4">
          <div className="grid grid-cols-3 gap-4">
            {/* Champ requis avec select */}
            <div className="space-y-2">
              <Label htmlFor="field1" className="text-sm font-medium text-gray-900">
                Champ 1 <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.field1} 
                onValueChange={(v) => setFormData({...formData, field1: v})}
              >
                <SelectTrigger id="field1" className="h-11 border-gray-300">
                  <SelectValue placeholder="Sélectionnez..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="opt1">Option 1</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Champ optionnel avec checkmark */}
            <div className="space-y-2">
              <Label htmlFor="field2" className="text-sm font-medium text-gray-900">
                Champ 2
              </Label>
              <div className="relative">
                <Input
                  id="field2"
                  value={formData.field2}
                  onChange={(e) => setFormData({...formData, field2: e.target.value})}
                  placeholder="Entrez une valeur"
                  className="h-11 pr-10 border-gray-300 text-gray-900 placeholder:text-gray-500"
                />
                {formData.field2 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                )}
              </div>
            </div>

            {/* Champ requis */}
            <div className="space-y-2">
              <Label htmlFor="field3" className="text-sm font-medium text-gray-900">
                Champ 3 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="field3"
                value={formData.field3}
                onChange={(e) => setFormData({...formData, field3: e.target.value})}
                placeholder="Requis"
                className="h-11 border-gray-300 text-gray-900 placeholder:text-gray-500"
              />
            </div>
          </div>
        </form>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button 
            variant="outline"
            onClick={onClose}
            className="border-gray-300 text-gray-900 hover:bg-gray-50"
          >
            Annuler
          </Button>
          <Button 
            type="submit"
            disabled={!isValid}
            className="bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500"
          >
            Valider
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
```

## Responsive

Pour mobile, les grilles s'adaptent:
```tsx
{/* 3 colonnes desktop, 1 colonne mobile */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">

{/* 2 colonnes desktop, 1 colonne mobile */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
```

## Accessibilité

- ✅ Labels associés avec `htmlFor`
- ✅ Placeholders informatifs
- ✅ États disabled clairement visibles
- ✅ Contraste WCAG AA (gris-900 sur blanc)
- ✅ Focus rings automatiques via composants shadcn

## Migration d'un Modal Existant

### Avant
```tsx
<Input placeholder="Entrez..." />
<Button onClick={onClose}>Fermer</Button>
<Button onClick={onSubmit}>OK</Button>
```

### Après
```tsx
<Input 
  placeholder="Entrez..."
  className="h-11 border-gray-300 text-gray-900 placeholder:text-gray-500"
/>
<DialogFooter className="gap-2 sm:gap-2">
  <Button variant="outline" onClick={onClose}>
    Annuler
  </Button>
  <Button disabled={!isValid}>
    Valider
  </Button>
</DialogFooter>
```
