# Migration OpenID Connect - Guide Rapide

## ✅ Implémentation Terminée

Le module d'authentification OpenID Connect avec discovery automatique et PKCE est maintenant intégré.

## 📋 Nouveaux Fichiers Créés

```
apps/api/src/modules/auth/
├── services/
│   └── oidc-discovery.service.ts          # Service de découverte OIDC automatique
├── providers/
│   └── prisma-auth.provider.ts            # Provider pour gestion utilisateurs OIDC
├── guards/
│   └── oidc-auth.guard.ts                 # Guard pour routes OIDC
└── oidc.controller.ts                     # Controller dédié OIDC (/auth/oidc)
```

## 🔧 Configuration .env

Mettre à jour votre `.env` avec :

```bash
# Orange OpenID Connect (Discovery automatique)
OIDC_DISCOVERY_URI="https://your-orange-sso/.well-known/openid-configuration"
OIDC_CLIENT_ID="your-client-id"
OIDC_CLIENT_SECRET="your-client-secret"
OIDC_CALLBACK_URL="http://localhost:3001/api/auth/oidc/callback"
OIDC_SCOPES="openid profile email"

# Frontend URL pour redirection
FRONTEND_URL="http://localhost:5173"
```

## 🚀 Endpoints Disponibles

### Login OIDC avec PKCE

```
GET /api/auth/oidc
→ Redirige vers Orange SSO avec PKCE challenge
```

### Callback OIDC

```
GET /api/auth/oidc/callback?code=...
→ Traite le callback, crée/met à jour l'utilisateur
→ Redirige vers frontend avec token JWT
```

### Profile OIDC

```
GET /api/auth/oidc/profile
Authorization: Bearer <jwt_token>
→ Retourne profil utilisateur + tokens OIDC stockés
```

## 🔄 Flow Complet

```
1. Frontend → GET /api/auth/oidc
   ↓
2. API génère PKCE challenge + state
   ↓
3. Redirect → Orange SSO login page
   ↓
4. User login sur Orange SSO
   ↓
5. Orange → Callback /api/auth/oidc/callback?code=xxx
   ↓
6. Strategy OpenID valide le code
   ↓
7. PrismaAuthProvider trouve/crée utilisateur
   ↓
8. Tokens OIDC stockés dans providerData
   ↓
9. Génération JWT interne
   ↓
10. Redirect → Frontend avec JWT
```

## 🔐 Sécurité

- ✅ **PKCE (S256)** : Protection contre interception de code
- ✅ **State parameter** : Protection CSRF
- ✅ **Discovery automatique** : URLs endpoints récupérées dynamiquement
- ✅ **Tokens stockés** : idToken, accessToken, refreshToken dans DB
- ✅ **Validation email** : Email requis du provider OIDC

## 📊 Données Utilisateur Stockées

```typescript
{
  email: "user@orange.com",
  firstName: "John",
  lastName: "Doe",
  orangeId: "sub-from-oidc",  // Subject ID Orange
  provider: "orange-openid",
  providerData: {
    profile: { /* profil OIDC complet */ },
    tokens: {
      idToken: "eyJ...",
      accessToken: "eyJ...",
      refreshToken: "eyJ...",
      expiresAt: 1234567890,
      jti: "jwt-id",
      scope: "openid profile email"
    }
  }
}
```

## 🧪 Test Local

1. Démarrer l'API :
```bash
cd apps/api
pnpm dev
```

2. Tester discovery :
```bash
curl http://localhost:3001/api/auth/oidc
# Devrait rediriger vers Orange SSO
```

3. Voir logs de découverte dans la console

## 📝 Prochaines Étapes

1. **Configurer Orange SSO** :
   - Enregistrer l'app dans le portail Orange
   - Obtenir CLIENT_ID et CLIENT_SECRET
   - Configurer callback URL

2. **Implémenter refresh token** :
   - Méthode `refreshOidcTokens` actuellement en placeholder
   - Appeler token endpoint avec refresh_token

3. **Frontend** :
   - Créer page `/auth/callback` pour recevoir le token
   - Stocker JWT dans localStorage/cookies
   - Rediriger vers dashboard

## 🆘 Troubleshooting

### Discovery Failed

```
Failed to discover OIDC configuration
```

**Solution** : Vérifier OIDC_DISCOVERY_URI dans .env

### Invalid Credentials

```
User exists with different authentication method
```

**Solution** : Utilisateur existe déjà avec auth locale

### No Email in Profile

```
Email is required from OIDC provider
```

**Solution** : Vérifier scopes incluent `email`

## 📚 Documentation

- [user-management-module.md](./user-management-module.md) - Documentation complète
- [user-management-quickstart.md](./user-management-quickstart.md) - Guide de démarrage

## ✨ Différences avec l'ancien système

| Ancien | Nouveau |
|--------|---------|
| URLs hardcodées | Discovery automatique |
| Pas de PKCE | PKCE S256 |
| Controller unique | Controller OIDC dédié |
| Tokens non stockés | Tokens stockés dans DB |
| Pas de refresh | Support refresh token |
