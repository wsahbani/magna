# Module de Gestion des Utilisateurs et Authentification

## Vue d'ensemble

Ce module fournit un système complet de gestion des utilisateurs avec authentification via OpenID Connect (Orange SSO) et connexion locale, ainsi qu'un système de groupes métier.

## Architecture

### 🔐 Authentification

Le système supporte deux méthodes d'authentification :

1. **Authentification locale** : Email/mot de passe avec JWT
2. **Orange OpenID Connect** : SSO avec compte Orange

### 👥 Groupes Métier

Les utilisateurs appartiennent à un seul groupe qui détermine leurs permissions :

- **Groupe RH** : Ressources humaines
- **Groupe Commercial** : Équipe commerciale
- **Groupe Qualité** : Gestion qualité
- **Groupe IT** : Informatique
- etc.

## Schéma de Base de Données

### Modèle User (Étendu)

```prisma
model User {
  // ... champs existants
  
  // OpenID Connect (Orange SSO)
  orangeId       String?   @unique // Orange SSO unique identifier
  provider       String?   @default("local") // local, orange-openid
  providerData   Json? // Additional provider data
  
  // Group Assignment
  groupId        String?
  group          Group?    @relation(fields: [groupId], references: [id])
}
```

### Modèle Group

```prisma
model Group {
  id          String   @id @default(cuid())
  name        String   @unique
  code        String   @unique // RH, COM, QUAL, etc.
  description String?
  color       String?  @default("#EA580C")
  isActive    Boolean  @default(true)
  
  users       User[]
  permissions GroupPermission[]
}

model GroupPermission {
  id         String   @id
  groupId    String
  resource   String   // e.g., "processes", "workspaces"
  action     String   // e.g., "create", "read", "update", "delete"
  conditions Json?
  
  group Group @relation(fields: [groupId], references: [id])
}
```

## API Endpoints

### 🔐 Authentication (`/api/auth`)

#### Login Local

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@orange.com",
  "password": "Password123!"
}

Response 200:
{
  "access_token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": "clx...",
    "email": "user@orange.com",
    "firstName": "John",
    "lastName": "Doe",
    "groupId": "clx...",
    "groupName": "Groupe RH"
  }
}
```

#### Login via Orange SSO

```http
GET /api/auth/openid
→ Redirects to Orange SSO login page
```

```http
GET /api/auth/openid/callback?code=...
→ Processes OAuth callback
→ Redirects to frontend with token:
   http://localhost:5173/auth/callback?token=eyJhbGci...
```

#### Get Profile

```http
GET /api/auth/profile
Authorization: Bearer eyJhbGci...

Response 200:
{
  "userId": "clx...",
  "email": "user@orange.com",
  "firstName": "John",
  "lastName": "Doe",
  "groupId": "clx...",
  "group": {
    "id": "clx...",
    "name": "Groupe RH",
    "code": "RH",
    "color": "#EA580C"
  }
}
```

### 👤 Users (`/api/users`)

#### Create User

```http
POST /api/users
Authorization: Bearer eyJhbGci...
Content-Type: application/json

{
  "email": "newuser@orange.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "password": "Password123!", // Optional
  "groupId": "clx...",
  "position": "Responsable RH",
  "phone": "+216 12 345 678"
}
```

#### Get All Users

```http
GET /api/users
GET /api/users?groupId=clx...
GET /api/users?isActive=true
Authorization: Bearer eyJhbGci...

Response 200:
[
  {
    "id": "clx...",
    "email": "user@orange.com",
    "firstName": "John",
    "lastName": "Doe",
    "groupId": "clx...",
    "group": {
      "name": "Groupe RH",
      "code": "RH"
    }
  }
]
```

#### Get User by ID

```http
GET /api/users/:id
Authorization: Bearer eyJhbGci...
```

#### Update User

```http
PATCH /api/users/:id
Authorization: Bearer eyJhbGci...
Content-Type: application/json

{
  "firstName": "John Updated",
  "groupId": "new-group-id"
}
```

#### Assign User to Group

```http
POST /api/users/:id/assign-group/:groupId
Authorization: Bearer eyJhbGci...
```

#### Remove User from Group

```http
POST /api/users/:id/remove-group
Authorization: Bearer eyJhbGci...
```

### 🏢 Groups (`/api/groups`)

#### Create Group

```http
POST /api/groups
Authorization: Bearer eyJhbGci...
Content-Type: application/json

{
  "name": "Groupe Commercial",
  "code": "COM",
  "description": "Équipe commerciale",
  "color": "#10B981"
}
```

#### Get All Groups

```http
GET /api/groups
GET /api/groups?isActive=true
Authorization: Bearer eyJhbGci...

Response 200:
[
  {
    "id": "clx...",
    "name": "Groupe RH",
    "code": "RH",
    "description": "Ressources humaines",
    "color": "#EA580C",
    "isActive": true,
    "_count": {
      "users": 12
    }
  }
]
```

#### Get Group with Users

```http
GET /api/groups/:id
Authorization: Bearer eyJhbGci...

Response 200:
{
  "id": "clx...",
  "name": "Groupe RH",
  "code": "RH",
  "users": [
    {
      "id": "clx...",
      "email": "user@orange.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  ]
}
```

#### Update Group

```http
PATCH /api/groups/:id
Authorization: Bearer eyJhbGci...
Content-Type: application/json

{
  "name": "Groupe RH Mis à jour",
  "color": "#F59E0B"
}
```

#### Delete Group

```http
DELETE /api/groups/:id
Authorization: Bearer eyJhbGci...

Error 409 if group has users:
{
  "message": "Cannot delete group with 5 active users. Reassign users first."
}
```

## Guards & Decorators

### @Public() Decorator

Rend un endpoint accessible sans authentification :

```typescript
@Public()
@Get('health')
healthCheck() {
  return { status: 'ok' };
}
```

### @CurrentUser() Decorator

Récupère l'utilisateur actuel depuis le JWT :

```typescript
@Get('profile')
getProfile(@CurrentUser() user: any) {
  return user;
}

@Get('email')
getEmail(@CurrentUser('email') email: string) {
  return { email };
}
```

### @Groups() Decorator + GroupsGuard

Restreint l'accès aux utilisateurs de groupes spécifiques :

```typescript
@Groups('RH', 'COM')
@UseGuards(JwtAuthGuard, GroupsGuard)
@Get('restricted')
onlyRHAndCommercial() {
  return { message: 'Access granted' };
}
```

## Configuration OpenID Connect

### Variables d'environnement

```bash
# Orange OpenID Connect
OPENID_ISSUER="https://orange-sso.example.com"
OPENID_AUTH_URL="https://orange-sso.example.com/oauth/authorize"
OPENID_TOKEN_URL="https://orange-sso.example.com/oauth/token"
OPENID_USERINFO_URL="https://orange-sso.example.com/oauth/userinfo"
OPENID_CLIENT_ID="your-client-id"
OPENID_CLIENT_SECRET="your-client-secret"
OPENID_CALLBACK_URL="http://localhost:3001/api/auth/openid/callback"
```

### Configuration chez Orange

1. Enregistrer l'application dans le portail SSO Orange
2. Définir le callback URL : `http://localhost:3001/api/auth/openid/callback`
3. Obtenir le `CLIENT_ID` et `CLIENT_SECRET`
4. Configurer les scopes requis : `openid`, `profile`, `email`

## Flux d'Authentification

### Local Auth Flow

```
Client                 API                   Database
  |                     |                        |
  |--POST /auth/login-->|                        |
  |  {email, password}  |                        |
  |                     |--Find user by email--->|
  |                     |<-User data-------------|
  |                     |--Verify password------>|
  |                     |--Generate JWT--------->|
  |<-{token, user}------|                        |
```

### Orange SSO Flow

```
Client               API                Orange SSO        Database
  |                   |                      |                |
  |--GET /auth/openid->|                      |                |
  |                   |--Redirect to-------->|                |
  |<------------------|  Orange login        |                |
  |                   |                      |                |
  |--Login on Orange SSO---------------->|                |
  |                   |                      |                |
  |<--Redirect with code------------------|                |
  |                   |                      |                |
  |--GET /callback?code-->|                      |                |
  |                   |--Exchange code------->|                |
  |                   |<-Access token---------|                |
  |                   |--Get user info------->|                |
  |                   |<-User profile---------|                |
  |                   |--Find/create user----->|--------------->|
  |                   |                      |<-User data-----|
  |                   |--Generate JWT------------------------>|
  |<-Redirect with token--|                      |                |
```

## Utilisation dans le Code

### Protected Route Example

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Groups } from '../auth/decorators/group.decorator';
import { GroupsGuard } from '../auth/guards/groups.guard';

@Controller('processes')
@UseGuards(JwtAuthGuard)
export class ProcessController {
  
  @Get()
  getAllProcesses(@CurrentUser() user: any) {
    // Tous les utilisateurs authentifiés
    return this.processService.findAll(user.userId);
  }
  
  @Post()
  @Groups('RH', 'QUAL')
  @UseGuards(GroupsGuard)
  createProcess(@CurrentUser() user: any, @Body() data: any) {
    // Seulement RH et Qualité peuvent créer
    return this.processService.create(user.userId, data);
  }
}
```

### Service Example

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ProcessService {
  constructor(private prisma: PrismaService) {}
  
  async findAll(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { group: true },
    });
    
    // Filter based on user's group
    return this.prisma.process.findMany({
      where: {
        // Business logic based on group
      },
    });
  }
}
```

## Migration de la Base de Données

### Générer et appliquer la migration

```bash
cd apps/api

# Générer la migration
npx prisma migrate dev --name add-user-groups-and-auth

# Appliquer la migration en production
npx prisma migrate deploy
```

### Seed Initial Groups

Ajouter dans `prisma/seed.ts` :

```typescript
async function seedGroups() {
  const groups = [
    { name: 'Groupe RH', code: 'RH', description: 'Ressources Humaines', color: '#EA580C' },
    { name: 'Groupe Commercial', code: 'COM', description: 'Équipe Commerciale', color: '#10B981' },
    { name: 'Groupe Qualité', code: 'QUAL', description: 'Gestion Qualité', color: '#3B82F6' },
    { name: 'Groupe IT', code: 'IT', description: 'Informatique', color: '#8B5CF6' },
    { name: 'Groupe Finance', code: 'FIN', description: 'Finance et Comptabilité', color: '#F59E0B' },
  ];
  
  for (const group of groups) {
    await prisma.group.upsert({
      where: { code: group.code },
      update: {},
      create: group,
    });
  }
}
```

## Sécurité

### Best Practices

1. **JWT Secrets** : Utilisez des secrets longs et aléatoires (min 32 caractères)
2. **HTTPS** : Toujours en production pour protéger les tokens
3. **Password Hashing** : bcrypt avec salt rounds = 10
4. **Token Expiration** : 24h par défaut, ajustable selon les besoins
5. **CORS** : Configuré pour accepter uniquement le frontend

### Rate Limiting

À implémenter pour protéger contre les attaques brute-force :

```typescript
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
  ],
})
```

## Tests

### Test Login Local

```typescript
describe('AuthController', () => {
  it('should login with valid credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@orange.com',
        password: 'Password123!',
      })
      .expect(200);
    
    expect(response.body).toHaveProperty('access_token');
    expect(response.body.user.email).toBe('test@orange.com');
  });
});
```

## Documentation Swagger

Accédez à la documentation API interactive :

```
http://localhost:3001/api
```

## Prochaines Étapes

1. ✅ Créer les pages frontend (Login, Users, Groups)
2. Implémenter le refresh token
3. Ajouter le rate limiting
4. Configurer les permissions granulaires par groupe
5. Ajouter l'audit des connexions
6. Implémenter le 2FA (optionnel)

## Support

Pour toute question sur la configuration Orange SSO, contactez votre administrateur IT Orange.
