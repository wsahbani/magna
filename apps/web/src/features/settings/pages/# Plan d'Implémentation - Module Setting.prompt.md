# Plan d'Implémentation - Module Settings

## Vue d'Ensemble
Module de paramétrage pour configurer les clés API AI, le modèle, le logo de l'application et autres paramètres système.

## Architecture Backend (NestJS + Prisma)

### 1. Schéma Prisma (`apps/api/prisma/schema.prisma`)

```prisma
model Setting {
  id          String   @id @default(uuid())
  key         String   @unique // Ex: "ai.openai.apiKey", "app.logo", "ai.model"
  value       String?  // Valeur du paramètre (peut être null)
  type        SettingType // Type de donnée
  category    String   // Catégorie: "ai", "app", "system", "email"
  description String?  // Description du paramètre
  isEncrypted Boolean  @default(false) // Indique si la valeur est chiffrée
  isPublic    Boolean  @default(false) // Accessible sans auth admin
  metadata    Json?    // Métadonnées supplémentaires (options, validation, etc.)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("settings")
}

enum SettingType {
  STRING
  NUMBER
  BOOLEAN
  JSON
  FILE
  SECRET // Pour les clés API, mots de passe
}
```

### 2. Structure du Module Backend

```
apps/api/src/modules/settings/
├── dto/
│   ├── create-setting.dto.ts
│   ├── update-setting.dto.ts
│   └── setting-response.dto.ts
├── entities/
│   └── setting.entity.ts
├── repositories/
│   └── settings.repository.ts
├── services/
│   ├── settings.service.ts
│   └── encryption.service.ts
├── guards/
│   └── admin-only.guard.ts
├── settings.controller.ts
└── settings.module.ts
```

### 3. API Endpoints

```typescript
// Endpoints protégés par AdminOnlyGuard (sauf GET public settings)
GET    /api/settings                    // Liste tous les paramètres (filtrés par role)
GET    /api/settings/:key               // Récupère un paramètre spécifique
POST   /api/settings                    // Crée un nouveau paramètre (admin only)
PUT    /api/settings/:key               // Met à jour un paramètre (admin only)
PATCH  /api/settings/:key/value         // Met à jour uniquement la valeur (admin only)
DELETE /api/settings/:key               // Supprime un paramètre (admin only)
GET    /api/settings/categories         // Liste les catégories disponibles
GET    /api/settings/category/:category // Récupère tous les paramètres d'une catégorie
POST   /api/settings/logo/upload        // Upload du logo (multipart/form-data)
```

### 4. Paramètres par Défaut (Seed Data)

**Catégorie AI:**
- `ai.provider` (string) - "openai" | "anthropic" | "azure"
- `ai.openai.apiKey` (secret) - Clé API OpenAI
- `ai.openai.model` (string) - "gpt-4", "gpt-3.5-turbo"
- `ai.anthropic.apiKey` (secret) - Clé API Claude
- `ai.anthropic.model` (string) - "claude-3-opus", "claude-3-sonnet"
- `ai.temperature` (number) - 0.0 à 1.0
- `ai.maxTokens` (number) - Limite de tokens

**Catégorie Application:**
- `app.name` (string) - Nom de l'application
- `app.logo` (file) - URL ou path du logo
- `app.favicon` (file) - URL ou path du favicon
- `app.primaryColor` (string) - Couleur principale (hex)
- `app.language` (string) - "fr" | "en"
- `app.timezone` (string) - "Europe/Paris"

**Catégorie Système:**
- `system.maintenanceMode` (boolean) - Mode maintenance
- `system.allowRegistration` (boolean) - Autoriser les inscriptions
- `system.sessionTimeout` (number) - Durée session (minutes)

**Catégorie Email:**
- `email.smtp.host` (string)
- `email.smtp.port` (number)
- `email.smtp.user` (string)
- `email.smtp.password` (secret)
- `email.from.name` (string)
- `email.from.address` (string)

### 5. Services Clés

**EncryptionService:**
- `encrypt(value: string): string` - Chiffre une valeur sensible
- `decrypt(value: string): string` - Déchiffre une valeur
- Utilise `crypto` avec AES-256-GCM
- Clé de chiffrement stockée en variable d'environnement

**SettingsService:**
- `findAll(category?: string): Promise<Setting[]>`
- `findOne(key: string): Promise<Setting>`
- `create(dto: CreateSettingDto): Promise<Setting>`
- `update(key: string, dto: UpdateSettingDto): Promise<Setting>`
- `delete(key: string): Promise<void>`
- `getDecryptedValue(key: string): Promise<string>` - Pour les secrets
- `uploadLogo(file: Express.Multer.File): Promise<string>` - Upload de fichier

## Architecture Frontend (React + TypeScript)

### 1. Structure du Module Frontend

```
apps/web/src/features/settings/
├── pages/
│   └── SettingsPage.tsx
├── components/
│   ├── SettingsLayout.tsx
│   ├── SettingsTabs.tsx
│   ├── AIConfigurationTab.tsx
│   ├── ApplicationTab.tsx
│   ├── SystemTab.tsx
│   ├── EmailTab.tsx
│   ├── SettingItem.tsx
│   ├── SecretInput.tsx
│   └── LogoUploader.tsx
├── hooks/
│   ├── useSettings.ts
│   ├── useUpdateSetting.ts
│   └── useUploadLogo.ts
├── types/
│   └── setting.types.ts
└── api/
    └── settingsApi.ts
```

### 2. Interface TypeScript

```typescript
// setting.types.ts
export type SettingType = 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON' | 'FILE' | 'SECRET';

export interface Setting {
  id: string;
  key: string;
  value: string | null;
  type: SettingType;
  category: string;
  description?: string;
  isEncrypted: boolean;
  isPublic: boolean;
  metadata?: {
    options?: string[];
    min?: number;
    max?: number;
    placeholder?: string;
    validation?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSettingDto {
  value: string;
}

export interface SettingsGroup {
  category: string;
  label: string;
  icon: LucideIcon;
  settings: Setting[];
}
```

### 3. UI/UX Design

**Page Structure:**
```
┌─────────────────────────────────────────────────┐
│  Paramètres                            [Enregistrer]
├─────────────────────────────────────────────────┤
│ ┌─────────┬─────────┬─────────┬─────────┐      │
│ │   AI    │  App    │ Système │  Email  │ (Tabs)
│ └─────────┴─────────┴─────────┴─────────┘      │
├─────────────────────────────────────────────────┤
│                                                  │
│  Configuration IA                                │
│  ─────────────────────────────────────────       │
│                                                  │
│  Fournisseur IA *                                │
│  ┌─────────────────────────────────┐            │
│  │ OpenAI                     ▼    │            │
│  └─────────────────────────────────┘            │
│                                                  │
│  Clé API OpenAI *                                │
│  ┌─────────────────────────────────┐  [Afficher]│
│  │ ••••••••••••••••••••••••••••••  │            │
│  └─────────────────────────────────┘            │
│  💡 La clé API est stockée de manière sécurisée │
│                                                  │
│  Modèle *                                        │
│  ┌─────────────────────────────────┐            │
│  │ gpt-4                      ▼    │            │
│  └─────────────────────────────────┘            │
│                                                  │
│  Température                                     │
│  ┌─────────────────────────────────┐            │
│  │ ───────●─────────────  0.7      │            │
│  └─────────────────────────────────┘            │
│  0 (Déterministe) ─────────── 1 (Créatif)       │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Composants UI:**
- **SecretInput**: Input masqué avec bouton "Afficher/Masquer"
- **LogoUploader**: Zone de drag & drop avec preview
- **SettingItem**: Composant générique pour afficher un paramètre
- Validation en temps réel avec react-hook-form
- Toast notifications pour succès/erreur

### 4. React Query Hooks

```typescript
// useSettings.ts
export function useSettings(category?: string) {
  return useQuery({
    queryKey: ['settings', category],
    queryFn: () => settingsApi.getAll(category),
  });
}

// useUpdateSetting.ts
export function useUpdateSetting() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      settingsApi.update(key, { value }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Paramètre mis à jour avec succès');
    },
  });
}

// useUploadLogo.ts
export function useUploadLogo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (file: File) => settingsApi.uploadLogo(file),
    onSuccess: (logoUrl) => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'app'] });
      toast.success('Logo mis à jour avec succès');
    },
  });
}
```

## Sécurité

### Backend:
1. **Chiffrement**: Toutes les valeurs avec `isEncrypted=true` sont chiffrées en AES-256
2. **Guards**: AdminOnlyGuard pour toutes les routes de modification
3. **Validation**: DTOs avec class-validator pour toutes les entrées
4. **Audit**: Logs de toutes les modifications de paramètres sensibles
5. **Secrets**: Jamais exposés dans les logs ou réponses API (masqués)

### Frontend:
1. **RBAC**: Vérification des permissions avant affichage
2. **Input masqué**: Les secrets ne sont jamais visibles par défaut
3. **Validation**: Validation côté client avant envoi
4. **HTTPS**: Toutes les requêtes via HTTPS uniquement

## Migration et Seed

**Migration Prisma:**
```bash
cd apps/api
npx prisma migrate dev --name add-settings-table
```

**Seed Script:** Ajouter dans `prisma/seed.ts` les paramètres par défaut

## Route Frontend

Ajouter dans `apps/web/src/router.tsx`:
```typescript
{
  path: '/settings',
  element: <AdminLayout />,
  children: [
    {
      index: true,
      element: <SettingsPage />,
    },
  ],
}
```

Ajouter dans la Sidebar (AdminLayout):
```typescript
{
  name: 'Paramètres',
  path: '/settings',
  icon: Settings,
  badge: undefined,
}
```

## Tests

### Backend:
- Tests unitaires pour EncryptionService
- Tests d'intégration pour SettingsService
- Tests E2E pour les endpoints

### Frontend:
- Tests des composants avec React Testing Library
- Tests des hooks avec @testing-library/react-hooks
- Tests E2E avec Playwright

## Étapes d'Implémentation

### Phase 1 - Backend Foundation
1. ✅ Créer le schéma Prisma
2. ✅ Générer la migration
3. ✅ Créer le module Settings (structure)
4. ✅ Implémenter EncryptionService
5. ✅ Implémenter SettingsRepository
6. ✅ Implémenter SettingsService
7. ✅ Créer les DTOs
8. ✅ Implémenter le Controller
9. ✅ Ajouter AdminOnlyGuard
10. ✅ Seed les paramètres par défaut

### Phase 2 - Backend Upload
11. ✅ Configurer multer pour upload de fichiers
12. ✅ Implémenter l'upload de logo
13. ✅ Servir les fichiers statiques

### Phase 3 - Frontend Foundation
14. ✅ Créer la structure du module
15. ✅ Définir les types TypeScript
16. ✅ Créer l'API client
17. ✅ Implémenter les hooks React Query

### Phase 4 - Frontend UI
18. ✅ Créer SettingsPage
19. ✅ Implémenter SettingsTabs
20. ✅ Créer AIConfigurationTab
21. ✅ Créer ApplicationTab
22. ✅ Créer SystemTab
23. ✅ Créer EmailTab
24. ✅ Implémenter SecretInput
25. ✅ Implémenter LogoUploader
26. ✅ Ajouter la route et le lien dans Sidebar

### Phase 5 - Integration & Testing
27. ✅ Tests backend
28. ✅ Tests frontend
29. ✅ Documentation API (Swagger)
30. ✅ Documentation utilisateur

## Notes Techniques

### Variables d'Environnement Requises:
```env
# Backend (.env)
ENCRYPTION_KEY=your-32-character-encryption-key-here
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880 # 5MB
```

### Dépendances Supplémentaires:

**Backend:**
```json
{
  "@nestjs/platform-express": "^10.0.0",
  "multer": "^1.4.5-lts.1"
}
```

**Frontend:**
```json
{
  "react-dropzone": "^14.2.3"
}
```

## Améliorations Futures

1. **Versioning**: Historique des modifications de paramètres
2. **Import/Export**: Exporter/Importer la configuration complète
3. **Validation avancée**: Tester les clés API avant sauvegarde
4. **Backup**: Sauvegarde automatique de la configuration
5. **Multi-tenant**: Support de configurations par organisation
6. **Cache**: Cache Redis pour les paramètres fréquemment accédés
7. **Webhooks**: Notifications lors de changements de config
8. **Audit Trail**: Interface pour visualiser l'historique des modifications
