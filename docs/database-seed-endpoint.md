# Database Seed Endpoint

## Vue d'ensemble

Un endpoint API a été créé pour initialiser la base de données avec des données de test/démo, similaire à la commande `db:seed` mais accessible via HTTP. L'endpoint garantit que le seeding ne peut être exécuté qu'une seule fois lorsque la base de données est vide.

## Architecture

### Module DatabaseModule

Localisation: `apps/api/src/modules/database/`

#### Structure
```
database/
├── database.module.ts      # Module NestJS
├── database.service.ts     # Logique métier
└── database.controller.ts  # Endpoints REST
```

### Fichiers créés

#### 1. `database.module.ts`
Module NestJS qui expose le service de base de données et le contrôleur.

**Providers**:
- `DatabaseService`: Logique de seeding
- `PrismaService`: Accès à la base de données

**Exports**: 
- `DatabaseService` (réutilisable dans d'autres modules)

#### 2. `database.service.ts`
Service contenant la logique de seeding avec protection contre les exécutions multiples.

**Méthodes principales**:

- `isDatabaseEmpty()`: Vérifie si la base est vide
  - Compte les users, groups et workspaces
  - Retourne `true` si tous sont à 0

- `seedDatabase()`: Crée les données initiales
  - **Groupes** (5): Administrateurs, RH, Commerciaux, IT, Opérations
  - **Users** (4): Admin + 3 utilisateurs de test
  - **Workspaces** (3): RH, Commercial, IT
  - **ProcessMap** (1): Cartographie RH
  - **Processes** (2): Recrutement, Onboarding

**Sécurité**: Mot de passe par défaut haché avec bcrypt (10 rounds)

#### 3. `database.controller.ts`
Contrôleur REST exposant 2 endpoints.

## API Endpoints

### GET `/database/status`

Vérifie si la base de données est vide.

**Response**:
```json
{
  "isEmpty": true
}
```

**Codes HTTP**:
- `200 OK`: Statut récupéré avec succès

---

### POST `/database/seed`

Initialise la base de données avec des données de démo.

**Protection**: 
- ❌ Refuse le seeding si la base contient déjà des données
- ✅ Accepte uniquement si la base est complètement vide

**Response Success** (201):
```json
{
  "message": "Database seeded successfully"
}
```

**Response Already Seeded** (400):
```json
{
  "error": "Database is not empty",
  "statusCode": 400,
  "message": "Cannot seed database that already contains data"
}
```

**Codes HTTP**:
- `201 Created`: Seeding réussi
- `400 Bad Request`: Base déjà remplie

## Données créées

### 1. Groupes (5)
| Nom | Permissions |
|-----|------------|
| Administrateurs | Gestion complète système |
| Ressources Humaines | Gestion processus RH |
| Commerciaux | Gestion processus vente |
| IT | Gestion processus technique |
| Opérations | Gestion processus opérationnels |

### 2. Users (4)
| Email | Mot de passe | Rôle | Groupe |
|-------|--------------|------|--------|
| admin@orange-processes.com | Orange123! | Super Admin | Administrateurs |
| marie.martin@orange-processes.com | Orange123! | Editor | RH |
| pierre.dupont@orange-processes.com | Orange123! | Editor | Commerciaux |
| sophie.bernard@orange-processes.com | Orange123! | Viewer | IT |

### 3. Workspaces (3)
| Nom | Code | Type | Membres |
|-----|------|------|---------|
| Espace RH | RH | DEPARTMENT | marie.martin (EDITOR) |
| Espace Commercial | COM | DEPARTMENT | pierre.dupont (EDITOR) |
| Espace IT | IT | DEPARTMENT | sophie.bernard (VIEWER) |

### 4. ProcessMap (1)
| Code | Titre | Statut | Workspace |
|------|-------|--------|-----------|
| PM-RH-001 | Cartographie des Processus RH | PUBLISHED | Espace RH |

### 5. Processes (2)
| Code | Titre | Type | Statut | ProcessMap |
|------|-------|------|--------|------------|
| PROC-REC-001 | Recrutement | FLOW | PUBLISHED | PM-RH-001 |
| PROC-ON-001 | Onboarding | SIPOC | DRAFT | PM-RH-001 |

## Utilisation

### 1. Vérifier le statut de la base

```bash
curl -X GET http://localhost:3001/database/status
```

### 2. Initialiser la base (première fois uniquement)

```bash
curl -X POST http://localhost:3001/database/status
```

### 3. Tentative de re-seed (sera refusée)

```bash
curl -X POST http://localhost:3001/database/seed
# Retourne 400 Bad Request
```

## Différences avec `db:seed`

| Aspect | `db:seed` (CLI) | `/database/seed` (API) |
|--------|----------------|------------------------|
| Accès | Terminal uniquement | HTTP (accessible depuis n'importe où) |
| Protection | Aucune | Vérifie que la base est vide |
| Utilisation | Dev local | Dev + déploiement automatisé |
| Logs | Console | Logger NestJS |
| Idempotence | ❌ Échoue si data existe | ✅ Refuse proprement avec 400 |

## Cas d'usage

### Développement local
```bash
# Après un reset de la base
pnpm db:reset

# Initialiser via API
curl -X POST http://localhost:3001/database/seed
```

### CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
- name: Initialize database
  run: |
    # Attendre que l'API soit prête
    curl --retry 10 --retry-delay 3 http://api:3001/health
    
    # Seeder la base
    curl -X POST http://api:3001/database/seed
```

### Tests E2E
```typescript
beforeAll(async () => {
  // Vérifier si seed nécessaire
  const { data } = await axios.get('/database/status');
  
  if (data.isEmpty) {
    await axios.post('/database/seed');
  }
});
```

## Sécurité

⚠️ **En production**, il est recommandé de:

1. **Désactiver l'endpoint** ou le protéger:
```typescript
// database.controller.ts
@Post('seed')
@UseGuards(AdminGuard) // Ajouter une guard
async seed() { ... }
```

2. **Utiliser des variables d'environnement** pour les mots de passe:
```typescript
const defaultPassword = process.env.SEED_PASSWORD || 'Orange123!';
```

3. **Logger toutes les tentatives**:
```typescript
this.logger.warn(`Seed attempt from IP: ${req.ip}`);
```

## Dépannage

### Erreur: "Database is not empty"
**Solution**: La base contient déjà des données. Utilisez:
```bash
cd apps/api
npx prisma migrate reset # ⚠️ SUPPRIME TOUTES LES DONNÉES
curl -X POST http://localhost:3001/database/seed
```

### Erreur: "Can't reach database server"
**Solution**: PostgreSQL n'est pas démarré:
```bash
docker-compose -f docker-compose-db.yml up -d
```

### L'endpoint retourne toujours 400
**Solution**: Vérifiez manuellement:
```bash
# Compter les users
cd apps/api
npx prisma studio
# Ou SQL direct
psql -h localhost -U postgres -d magna_turbo -c "SELECT COUNT(*) FROM users;"
```

## Tests

Pour tester l'endpoint:

```bash
# 1. Reset complet
cd apps/api
npx prisma migrate reset --force

# 2. Vérifier que la base est vide
curl http://localhost:3001/database/status
# {"isEmpty":true}

# 3. Seeder
curl -X POST http://localhost:3001/database/seed
# {"message":"Database seeded successfully"}

# 4. Vérifier que le re-seed est refusé
curl -X POST http://localhost:3001/database/seed
# {"error":"Database is not empty",...}

# 5. Se connecter avec le compte admin
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@orange-processes.com","password":"Orange123!"}'
```

## Intégration avec app.module.ts

Le module a été ajouté à `app.module.ts`:

```typescript
@Module({
  imports: [
    // ... autres modules
    DatabaseModule, // ✅ Ajouté
  ],
})
export class AppModule {}
```

## Documentation API (Swagger)

L'endpoint est documenté avec Swagger/OpenAPI et visible sur:
```
http://localhost:3001/api/docs
```

Tags: `database`, `seed`, `initialization`

## Changelog

**v1.0.0** (15/12/2025)
- ✅ Création du module DatabaseModule
- ✅ Implémentation de `isDatabaseEmpty()`
- ✅ Implémentation de `seedDatabase()`
- ✅ Protection contre le double-seeding
- ✅ Endpoints REST avec Swagger docs
- ✅ Intégration dans app.module.ts
- ✅ Tests manuels réussis (nécessite Docker)

## Références

- Architecture complète: [architecture.md](./architecture.md)
- Module Process: [process-module.md](./process-module.md)
- Guide développement: [development.md](./development.md)
- Prisma Schema: [../apps/api/prisma/schema.prisma](../apps/api/prisma/schema.prisma)
