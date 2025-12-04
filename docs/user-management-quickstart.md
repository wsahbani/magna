# Guide de Démarrage Rapide - Module User Management

## 🚀 Installation

### 1. Générer la migration Prisma

```bash
cd apps/api
npx prisma migrate dev --name add-user-groups-and-auth
```

### 2. Vérifier les dépendances

Les packages suivants sont déjà installés :
- `@nestjs/passport`
- `@nestjs/jwt`
- `passport`
- `passport-jwt`
- `passport-openidconnect`
- `bcrypt`

### 3. Configuration .env

Copiez `.env.example` vers `.env` et configurez :

```bash
# JWT
JWT_SECRET="votre-secret-jwt-minimum-32-caracteres"

# Orange OpenID (contactez votre admin IT)
OPENID_ISSUER="https://orange-sso.example.com"
OPENID_CLIENT_ID="votre-client-id"
OPENID_CLIENT_SECRET="votre-client-secret"
OPENID_CALLBACK_URL="http://localhost:3001/api/auth/openid/callback"
```

## 📊 Seed Initial Data

Ajoutez dans `apps/api/prisma/seed.ts` :

```typescript
async function seedGroups(prisma: PrismaClient) {
  console.log('🏢 Seeding groups...');
  
  const groups = [
    { name: 'Groupe RH', code: 'RH', description: 'Ressources Humaines', color: '#EA580C' },
    { name: 'Groupe Commercial', code: 'COM', description: 'Équipe Commerciale', color: '#10B981' },
    { name: 'Groupe Qualité', code: 'QUAL', description: 'Gestion Qualité', color: '#3B82F6' },
    { name: 'Groupe IT', code: 'IT', description: 'Informatique', color: '#8B5CF6' },
  ];
  
  for (const group of groups) {
    await prisma.group.upsert({
      where: { code: group.code },
      update: {},
      create: group,
    });
  }
  
  console.log('✅ Groups created');
}

// Ajouter dans la fonction main
await seedGroups(prisma);
```

Puis exécuter :

```bash
npx prisma db seed
```

## 🧪 Tester l'API

### 1. Créer un groupe

```bash
curl -X POST http://localhost:3001/api/groups \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Groupe Test",
    "code": "TEST",
    "description": "Groupe de test"
  }'
```

### 2. Créer un utilisateur

```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@orange.com",
    "password": "Password123!",
    "firstName": "Test",
    "lastName": "User",
    "groupId": "clx..."
  }'
```

### 3. Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@orange.com",
    "password": "Password123!"
  }'
```

Response :
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clx...",
    "email": "test@orange.com",
    "firstName": "Test",
    "lastName": "User",
    "groupId": "clx...",
    "groupName": "Groupe Test"
  }
}
```

### 4. Utiliser le token

```bash
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 🔐 Orange SSO Flow

### Flow utilisateur :

1. Frontend : Rediriger vers `http://localhost:3001/api/auth/openid`
2. L'utilisateur se connecte sur Orange SSO
3. Orange redirige vers `http://localhost:3001/api/auth/openid/callback?code=...`
4. L'API redirige vers `http://localhost:5173/auth/callback?token=...`
5. Frontend stocke le token et redirige vers la page d'accueil

## 📚 Documentation Swagger

Accédez à la documentation interactive :

```
http://localhost:3001/api
```

## 🛡️ Guards Disponibles

### JwtAuthGuard

Protège les routes, requiert un token JWT valide :

```typescript
@UseGuards(JwtAuthGuard)
@Get('protected')
protectedRoute() {
  return { message: 'Protected' };
}
```

### GroupsGuard

Restreint l'accès à certains groupes :

```typescript
@Groups('RH', 'QUAL')
@UseGuards(JwtAuthGuard, GroupsGuard)
@Post('restricted')
restrictedRoute() {
  return { message: 'Only RH and QUAL' };
}
```

### Public Decorator

Rend un endpoint public (sans authentification) :

```typescript
@Public()
@Get('health')
healthCheck() {
  return { status: 'ok' };
}
```

## 🎯 Prochaines Étapes

1. **Frontend** : Créer les pages Login, Users, Groups
2. **Tests** : Ajouter les tests unitaires et E2E
3. **Production** : Configurer Orange SSO avec les vraies URLs

## 📖 Documentation Complète

Voir [user-management-module.md](./user-management-module.md) pour la documentation complète.

## ⚠️ Important

- **Ne commitez JAMAIS le fichier `.env`** avec les secrets
- Changez `JWT_SECRET` en production (minimum 32 caractères)
- Utilisez HTTPS en production
- Configurez CORS correctement pour votre domaine

## 🆘 Troubleshooting

### Error: "Invalid credentials"
- Vérifiez que l'utilisateur existe avec `npx prisma studio`
- Vérifiez que le mot de passe est correct

### Error: "User not found or inactive"
- Vérifiez que `isActive = true` dans la base de données

### OpenID Error
- Vérifiez les URLs dans `.env`
- Vérifiez que le callback URL est enregistré chez Orange
- Vérifiez les CLIENT_ID et CLIENT_SECRET
