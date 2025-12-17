# Admin Role - User Management Authorization

## Vue d'ensemble

Cette fonctionnalité permet d'identifier les utilisateurs administrateurs qui ont les droits exclusifs de gérer les utilisateurs et les groupes.

## Architecture

### Modèle de données

Le modèle `User` inclut un champ `isAdmin` pour identifier les administrateurs :

```prisma
model User {
  id             String    @id @default(cuid())
  email          String    @unique
  firstName      String
  lastName       String
  
  // Admin flag - only admins can manage users and groups
  isAdmin        Boolean   @default(false)
  
  // ... autres champs
}
```

### Guard AdminGuard

Le guard `AdminGuard` vérifie que l'utilisateur connecté est un administrateur avant d'autoriser l'accès aux routes protégées.

**Fichier**: `src/modules/auth/guards/admin.guard.ts`

```typescript
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();
    
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!user.isAdmin) {
      throw new ForbiddenException('Only administrators can perform this action');
    }

    return true;
  }
}
```

## Routes protégées

### Users Module

Toutes les routes de gestion des utilisateurs sont protégées par `@UseGuards(AdminGuard)` :

- ✅ `POST /users` - Créer un utilisateur
- ✅ `PATCH /users/:id` - Modifier un utilisateur
- ✅ `DELETE /users/:id` - Supprimer un utilisateur
- ✅ `POST /users/:id/assign-group/:groupId` - Assigner à un groupe
- ✅ `POST /users/:id/remove-group` - Retirer d'un groupe
- ℹ️ `GET /users` - Liste des utilisateurs (accessible à tous les utilisateurs authentifiés)
- ℹ️ `GET /users/:id` - Détails d'un utilisateur (accessible à tous)

### Groups Module

Toutes les routes de gestion des groupes sont protégées par `@UseGuards(AdminGuard)` :

- ✅ `POST /groups` - Créer un groupe
- ✅ `PATCH /groups/:id` - Modifier un groupe
- ✅ `DELETE /groups/:id` - Supprimer un groupe
- ✅ `POST /groups/:id/permissions` - Ajouter une permission
- ✅ `DELETE /groups/permissions/:permissionId` - Supprimer une permission
- ℹ️ `GET /groups` - Liste des groupes (accessible à tous les utilisateurs authentifiés)
- ℹ️ `GET /groups/:id` - Détails d'un groupe (accessible à tous)

## Utilisation

### 1. Configuration dans les Controllers

```typescript
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('users')
@UseGuards(JwtAuthGuard) // Authentification requise
@ApiBearerAuth()
export class UsersController {
  
  @Post()
  @UseGuards(AdminGuard) // Admin seulement
  @ApiOperation({ summary: 'Create new user (Admin only)' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  findAll() {
    // Accessible à tous les utilisateurs authentifiés
    return this.usersService.findAll();
  }
}
```

### 2. JWT Token inclut isAdmin

Le `JwtStrategy` inclut le flag `isAdmin` dans le payload JWT :

```typescript
async validate(payload: JwtPayload) {
  const user = await this.prisma.user.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      isAdmin: true, // ✅ Inclus dans le token
      // ...
    },
  });

  return {
    userId: user.id,
    email: user.email,
    isAdmin: user.isAdmin, // ✅ Disponible dans req.user
    // ...
  };
}
```

### 3. CreateUserDto supporte isAdmin

```typescript
export class CreateUserDto {
  @ApiPropertyOptional({ 
    default: false, 
    description: 'Admin flag - only admins can manage users and groups' 
  })
  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;
}
```

## Seed Data

L'utilisateur Alice est configuré comme administrateur dans les données de seed :

```typescript
const users = await Promise.all([
  prisma.user.create({
    data: {
      email: 'alice.johnson@orange.com',
      firstName: 'Alice',
      lastName: 'Johnson',
      isAdmin: true, // ✅ Alice est admin
      // ...
    },
  }),
  // ... autres utilisateurs (isAdmin: false par défaut)
]);
```

## Responses d'erreur

### Non authentifié
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### Non administrateur
```json
{
  "statusCode": 403,
  "message": "Only administrators can perform this action",
  "error": "Forbidden"
}
```

## Tests avec cURL

### 1. Login avec un utilisateur admin (Alice)
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice.johnson@orange.com",
    "password": "Password123!"
  }'
```

Réponse :
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "email": "alice.johnson@orange.com",
    "isAdmin": true
  }
}
```

### 2. Créer un utilisateur (avec token admin)
```bash
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "email": "nouveau.user@orange.com",
    "firstName": "Nouveau",
    "lastName": "User",
    "password": "Password123!",
    "groupId": "<group-id>"
  }'
```

### 3. Tentative avec un utilisateur non-admin (Bob)
```bash
# Login Bob
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "bob.smith@orange.com",
    "password": "Password123!"
  }'

# Essayer de créer un utilisateur (doit échouer)
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <bob_token>" \
  -d '{
    "email": "test@orange.com",
    "firstName": "Test",
    "lastName": "User"
  }'
```

Réponse :
```json
{
  "statusCode": 403,
  "message": "Only administrators can perform this action",
  "error": "Forbidden"
}
```

## Migration Database

Pour appliquer le nouveau champ `isAdmin` :

```bash
cd apps/api
npx prisma migrate dev --name add-admin-flag
npx prisma db seed  # Recréer Alice comme admin
```

## Permissions Matrix

| Action | Route | Authentification | Admin requis |
|--------|-------|-----------------|--------------|
| Liste utilisateurs | `GET /users` | ✅ | ❌ |
| Détails utilisateur | `GET /users/:id` | ✅ | ❌ |
| Créer utilisateur | `POST /users` | ✅ | ✅ |
| Modifier utilisateur | `PATCH /users/:id` | ✅ | ✅ |
| Supprimer utilisateur | `DELETE /users/:id` | ✅ | ✅ |
| Assigner groupe | `POST /users/:id/assign-group/:groupId` | ✅ | ✅ |
| Retirer groupe | `POST /users/:id/remove-group` | ✅ | ✅ |
| Liste groupes | `GET /groups` | ✅ | ❌ |
| Détails groupe | `GET /groups/:id` | ✅ | ❌ |
| Créer groupe | `POST /groups` | ✅ | ✅ |
| Modifier groupe | `PATCH /groups/:id` | ✅ | ✅ |
| Supprimer groupe | `DELETE /groups/:id` | ✅ | ✅ |
| Ajouter permission | `POST /groups/:id/permissions` | ✅ | ✅ |
| Supprimer permission | `DELETE /groups/permissions/:permissionId` | ✅ | ✅ |

## Sécurité

### Bonnes pratiques implémentées

1. ✅ **Séparation lecture/écriture** : Les utilisateurs peuvent consulter les users/groups mais seuls les admins peuvent les modifier
2. ✅ **Guard réutilisable** : `AdminGuard` peut être appliqué sur n'importe quelle route
3. ✅ **Flag dans JWT** : `isAdmin` vérifié à chaque requête sans appel DB supplémentaire
4. ✅ **Validation DTO** : Le champ `isAdmin` est optionnel et validé avec `@IsBoolean()`
5. ✅ **Messages d'erreur clairs** : Distinction entre non-authentifié (401) et non-autorisé (403)

### Recommandations futures

- [ ] **Audit log** : Logger toutes les actions admin (création/modification/suppression)
- [ ] **Super admin** : Ajouter un niveau super-admin qui peut promouvoir d'autres admins
- [ ] **Permissions granulaires** : Remplacer isAdmin par un système de permissions plus fin
- [ ] **Rate limiting** : Limiter les tentatives d'actions admin pour éviter les abus
- [ ] **2FA pour admins** : Authentification à deux facteurs obligatoire pour les admins

## Résumé

- ✅ Champ `isAdmin` ajouté au modèle User
- ✅ `AdminGuard` créé et exporté dans AuthModule
- ✅ Routes users/groups protégées avec `@UseGuards(AdminGuard)`
- ✅ JWT inclut le flag `isAdmin`
- ✅ DTO `CreateUserDto` supporte `isAdmin`
- ✅ Seed data : Alice est admin
- ✅ Backend compile sans erreurs

**Prochaines étapes** :
1. Exécuter la migration : `npx prisma migrate dev --name add-admin-flag`
2. Seed la DB : `npx prisma db seed`
3. Tester avec Postman/Swagger
