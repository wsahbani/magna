# User Management Feature - Frontend

## Vue d'ensemble

Interface complète de gestion des utilisateurs avec Vue Grille/Tableau, filtres avancés, et formulaires de création/édition. Seuls les administrateurs peuvent créer, modifier ou supprimer des utilisateurs.

## Architecture

### Structure des fichiers

```
features/users/
├── types/
│   └── user.types.ts         # Types TypeScript (User, CreateUserDto, UpdateUserDto)
├── api/
│   └── usersApi.ts            # Appels API REST
├── hooks/
│   └── useUsers.ts            # React Query hooks
├── components/
│   ├── UserCard.tsx           # Vue carte utilisateur
│   ├── UserTable.tsx          # Vue tableau avec pagination
│   └── UserForm.tsx           # Formulaire création/édition
├── pages/
│   └── UsersPage.tsx          # Page principale
└── index.ts                   # Barrel export
```

## Composants

### UsersPage

Page principale avec :
- **Vue switchable** : Grille de cartes ⇄ Tableau
- **Recherche** : Par nom, email
- **Filtres** : Groupe, Statut (actif/inactif)
- **Statistiques** : Total, Actifs, Admins, Sans groupe
- **Actions admin** : Créer, Modifier, Supprimer, Assigner groupe

#### Modes d'affichage

```tsx
type ViewMode = 'grid' | 'table';
```

- **Grid** : Cartes avec toutes les infos utilisateur + badges
- **Table** : Tableau paginé avec tri par colonnes

### UserCard

Carte utilisateur avec :
- Nom complet + display name
- Email, poste, département
- Badge groupe avec couleur
- Badge Admin si `isAdmin = true`
- Badge statut (Actif/Inactif)
- Provider badge (🍊 Orange SSO)
- Actions : Modifier, Supprimer

### UserTable

Tableau avec react-table :
- Tri par colonnes (firstName, email, etc.)
- Pagination (10 lignes/page)
- Colonnes :
  - Nom complet
  - Email
  - Groupe (badge coloré)
  - Poste
  - Rôle (Admin/Utilisateur)
  - Statut (Actif/Inactif)
  - Actions (Modifier, Groupe, Supprimer)

### UserForm

Formulaire react-hook-form :

**Sections** :
1. **Informations personnelles**
   - Prénom*, Nom* (required)
   - Email* (disabled en édition)
   - Nom d'affichage
   - Poste

2. **Sécurité** (création uniquement)
   - Mot de passe* (min 8 caractères)

3. **Affectation**
   - Groupe (select)

4. **Options**
   - Compte actif (switch)
   - Administrateur (switch)
   - Email vérifié (switch)

**Validation** :
- Email : regex pattern
- Mot de passe : min 8 caractères
- Champs required marqués *

## Hooks React Query

### useUsers

```tsx
const { data: users, isLoading } = useUsers({ isActive: true, groupId: 'xxx' });
```

Récupère la liste des utilisateurs avec filtres optionnels.

### useCreateUser

```tsx
const createUser = useCreateUser();
createUser.mutate(userData, {
  onSuccess: () => setShowDialog(false),
});
```

Crée un utilisateur (Admin only). Toast success/error automatique.

### useUpdateUser

```tsx
const updateUser = useUpdateUser();
updateUser.mutate({ id, data }, {
  onSuccess: () => setEditingUser(null),
});
```

Modifie un utilisateur (Admin only).

### useDeleteUser

```tsx
const deleteUser = useDeleteUser();
deleteUser.mutate(userId);
```

Supprime un utilisateur (Admin only).

### useAssignGroup / useRemoveGroup

```tsx
const assignGroup = useAssignGroup();
assignGroup.mutate({ userId, groupId });
```

Assigne/retire un utilisateur d'un groupe (Admin only).

## API

### Endpoints

| Méthode | Endpoint | Description | Admin requis |
|---------|----------|-------------|--------------|
| `GET` | `/users` | Liste utilisateurs | ❌ |
| `GET` | `/users/:id` | Détails utilisateur | ❌ |
| `POST` | `/users` | Créer utilisateur | ✅ |
| `PATCH` | `/users/:id` | Modifier utilisateur | ✅ |
| `DELETE` | `/users/:id` | Supprimer utilisateur | ✅ |
| `POST` | `/users/:id/assign-group/:groupId` | Assigner groupe | ✅ |
| `POST` | `/users/:id/remove-group` | Retirer groupe | ✅ |

### Configuration

**API Base URL** : `VITE_API_URL` (default: http://localhost:3001)

**Token** : JWT stocké dans `localStorage.getItem('access_token')`

```tsx
// apps/web/.env
VITE_API_URL=http://localhost:3001
```

## Fonctionnalités UX

### Filtrage en temps réel

```tsx
const filteredUsers = users?.filter((user) => {
  const matchSearch =
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase());

  const matchGroup = !filterGroup || user.groupId === filterGroup;
  const matchStatus =
    filterStatus === 'all' ||
    (filterStatus === 'active' && user.isActive) ||
    (filterStatus === 'inactive' && !user.isActive);

  return matchSearch && matchGroup && matchStatus;
});
```

### Notifications Toast

Utilise **sonner** pour les notifications :
- ✅ Success : Création, modification, suppression réussie
- ❌ Error : Messages d'erreur du backend

```tsx
import { toast } from 'sonner';

toast.success('Utilisateur créé avec succès');
toast.error(error?.response?.data?.message || 'Erreur');
```

### Dialogs (shadcn/ui)

- Dialog création
- Dialog édition
- Dialog assignation groupe

```tsx
<Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Créer un utilisateur</DialogTitle>
    </DialogHeader>
    <UserForm
      onSubmit={handleCreate}
      onCancel={() => setShowCreateDialog(false)}
      isLoading={createUser.isPending}
    />
  </DialogContent>
</Dialog>
```

## Charte graphique Orange

### Couleurs

- **Orange principal** : `bg-orange-500`, `text-orange-600`
- **Badge Admin** : `variant="destructive"` (rouge)
- **Badge Actif** : `bg-green-100 text-green-800`
- **Badge Groupe** : Couleur dynamique du groupe

### Icônes (lucide-react)

| Icône | Utilisation |
|-------|-------------|
| `Users` | Header page |
| `Plus` | Créer utilisateur |
| `Mail` | Email |
| `Briefcase` | Poste |
| `Shield` | Admin badge |
| `Building2` | Département |
| `Search` | Recherche |
| `Grid3x3` | Vue grille |
| `Table2` | Vue tableau |

## Navigation

Route : `/users`

```tsx
// router.tsx
const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/users',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => (
    <AdminLayout>
      <UsersPage />
    </AdminLayout>
  ),
})
```

**Menu Sidebar** :
- Label: "Users"
- Icon: `Users`
- href: `/users`

## Dépendances

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.x",
    "@tanstack/react-table": "^8.21.3",
    "react-hook-form": "^7.67.0",
    "sonner": "^2.0.7",
    "lucide-react": "^0.x",
    "axios": "^1.x"
  }
}
```

## Installation

```bash
# Frontend
cd apps/web
pnpm add sonner react-hook-form @tanstack/react-table

# UI Package (Badge, Switch)
cd packages/ui
pnpm add @radix-ui/react-switch class-variance-authority
```

## Utilisation

### 1. Navigation

Depuis le menu sidebar, cliquer sur "Users".

### 2. Créer un utilisateur (Admin)

1. Cliquer sur "Nouvel utilisateur"
2. Remplir le formulaire :
   - Prénom, Nom, Email* (required)
   - Mot de passe* (min 8 caractères)
   - Sélectionner un groupe (optionnel)
   - Activer les switchs : Actif, Admin, Email vérifié
3. Cliquer sur "Créer"

### 3. Modifier un utilisateur (Admin)

1. Cliquer sur "Modifier" sur une carte/ligne
2. Modifier les champs souhaités
3. Cliquer sur "Modifier"

### 4. Supprimer un utilisateur (Admin)

1. Cliquer sur "Supprimer"
2. Confirmer la suppression dans l'alerte

### 5. Assigner un groupe (Admin)

1. En vue tableau : cliquer sur "Groupe"
2. Sélectionner un groupe dans la liste
3. Validation automatique

### 6. Filtrer

- **Recherche** : Taper dans la barre de recherche (nom/email)
- **Groupe** : Sélectionner un groupe dans le dropdown
- **Statut** : Sélectionner Actifs/Inactifs/Tous

### 7. Changer de vue

Cliquer sur les icônes Grille ou Tableau dans la toolbar.

## Permissions

### Lecture (tous les utilisateurs authentifiés)
- ✅ Voir la liste des utilisateurs
- ✅ Voir les détails d'un utilisateur
- ✅ Filtrer et rechercher

### Écriture (Admin uniquement)
- ✅ Créer un utilisateur
- ✅ Modifier un utilisateur
- ✅ Supprimer un utilisateur
- ✅ Assigner/Retirer d'un groupe

**Backend** : Les routes de modification sont protégées par `@UseGuards(AdminGuard)`.

**Frontend** : Les boutons d'action sont affichés à tous (le backend refuse si non-admin).

## Messages d'erreur

### Erreurs communes

**403 Forbidden** :
```
Only administrators can perform this action
```
→ L'utilisateur n'est pas admin

**404 Not Found** :
```
User not found
```
→ L'utilisateur n'existe pas

**400 Bad Request** :
```
Email already exists
```
→ Email déjà utilisé

**401 Unauthorized** :
```
Unauthorized
```
→ Token JWT invalide ou expiré

## Améliorations futures

- [ ] **Import Excel** : Importer des utilisateurs depuis un fichier Excel
- [ ] **Export CSV** : Exporter la liste des utilisateurs
- [ ] **Profil utilisateur** : Page de détails avec historique d'activité
- [ ] **Réinitialisation mot de passe** : Envoyer un email de reset
- [ ] **Désactivation en masse** : Sélectionner plusieurs utilisateurs
- [ ] **Filtres avancés** : Par département, par date de création
- [ ] **Statistiques** : Graphiques d'évolution
- [ ] **Audit log** : Voir qui a modifié quoi et quand

## Tests

### Test manuel

1. **Créer un utilisateur** :
   - Email: `test.user@orange.com`
   - Mot de passe: `Password123!`
   - Groupe: RH
   - Admin: Non

2. **Vérifier la création** :
   - Voir le toast de succès
   - Voir l'utilisateur dans la liste
   - Vérifier le badge RH

3. **Modifier** :
   - Changer le groupe à IT
   - Activer Admin
   - Vérifier le badge Admin

4. **Filtrer** :
   - Chercher "test"
   - Filtrer par groupe IT
   - Filtrer par actifs

5. **Supprimer** :
   - Confirmer la suppression
   - Vérifier la disparition

### Test avec utilisateur non-admin

1. Se connecter avec `bob.smith@orange.com`
2. Naviguer vers `/users`
3. **Voir** : Liste visible ✅
4. **Créer** : Cliquer "Nouvel utilisateur" → Erreur 403 ❌
5. **Modifier** : Cliquer "Modifier" → Erreur 403 ❌

## Résumé

✅ Interface complète de gestion des utilisateurs  
✅ Vue Grille + Vue Tableau  
✅ Filtres et recherche en temps réel  
✅ Formulaires avec validation  
✅ Notifications toast  
✅ Protection admin côté backend  
✅ Charte graphique Orange  
✅ Responsive design  
✅ React Query pour le cache  
✅ TypeScript strict  

**Route** : `/users`  
**Package** : `apps/web/src/features/users`  
**Dépendances** : sonner, react-hook-form, @tanstack/react-table
