# Prochaines Étapes - Qualigram Implementation

## ✅ Tâches Complétées

### Backend
- ✅ Schéma Prisma adapté avec MacroProcess, Procedure et modèles structurés
- ✅ Module MacroProcess API complet
- ✅ Module Process API refactorisé avec métadonnées
- ✅ Module Procedure API complet
- ✅ Service de validation Qualigram
- ✅ Script de migration corrigé et prêt

### Frontend
- ✅ Feature MacroProcess complète
- ✅ Feature Process adaptée
- ✅ Feature Procedure avec éditeur ReactFlow
- ✅ Routes ajoutées au router
- ✅ Dépendances installées (zod, @hookform/resolvers)

### Documentation
- ✅ Guide de migration
- ✅ Référence API
- ✅ Modèle de données
- ✅ Résumé d'implémentation

## 🔄 Prochaines Étapes

### 1. Migration de la Base de Données

**Avant la migration** :
```bash
# Sauvegarder la base de données
pg_dump -U postgres -d magna > backup_before_migration.sql
```

**Exécuter la migration** :
```bash
cd apps/api
pnpm db:generate  # Régénérer le client Prisma
pnpm ts-node src/scripts/migrate-to-qualigram.ts
```

**Vérifier la migration** :
- Vérifier que les MacroProcess ont été créés
- Vérifier que les Processes ont été mis à jour avec macroId
- Vérifier que les Procedures ont été créées
- Vérifier que les DiagramNode/DiagramEdge/DiagramLane ont été migrés

### 2. Migration Prisma (si nécessaire)

Si le schéma Prisma a été modifié, créer une migration :
```bash
cd apps/api
pnpm db:migrate --name qualigram_schema
```

### 3. Tests API

Tester les nouveaux endpoints :

**MacroProcess** :
```bash
# Liste
curl http://localhost:3000/api/v1/macro-processes

# Création
curl -X POST http://localhost:3000/api/v1/macro-processes \
  -H "Content-Type: application/json" \
  -d '{"code":"MP-001","name":"Test MacroProcess"}'
```

**Process** :
```bash
# Liste avec filtre MacroProcess
curl http://localhost:3000/api/v1/processes?macroId=<id>

# Créer un acteur
curl -X POST http://localhost:3000/api/v1/processes/<id>/actors \
  -H "Content-Type: application/json" \
  -d '{"name":"Service Qualité","type":"DEPARTMENT"}'
```

**Procedure** :
```bash
# Liste
curl http://localhost:3000/api/v1/procedures?processId=<id>

# Créer un nœud
curl -X POST http://localhost:3000/api/v1/procedures/<id>/nodes \
  -H "Content-Type: application/json" \
  -d '{"nodeId":"node_1","type":"START","label":"Début","positionX":100,"positionY":100}'

# Valider
curl http://localhost:3000/api/v1/procedures/<id>/validate
```

### 4. Tests Frontend

**MacroProcess** :
1. Naviguer vers `/macro-processes`
2. Créer un nouveau MacroProcess
3. Vérifier l'affichage en liste
4. Tester la réorganisation (drag & drop)

**Process** :
1. Naviguer vers `/processes`
2. Filtrer par MacroProcess
3. Créer/éditer un Process avec les nouveaux champs Qualigram
4. Tester les onglets : Acteurs, IO, Indicateurs, Risques, Documents

**Procedure** :
1. Naviguer vers `/procedures/<id>`
2. Tester l'éditeur ReactFlow :
   - Glisser-déposer des nœuds depuis la palette
   - Connecter les nœuds
   - Créer des swimlanes
   - Modifier les propriétés (RACI)
   - Valider la procédure
3. Tester la gestion des versions

### 5. Corrections TypeScript Restantes

**App.tsx** :
- Corriger les types de `sampleProcesses` pour correspondre au type `Process`
- Ou mettre à jour le type `Process` pour inclure les anciens types si nécessaire

**Autres fichiers** :
- Vérifier les imports manquants
- Corriger les types implicites `any`

### 6. Améliorations Futures

**Fonctionnalités** :
- [ ] Export PDF/PNG/SVG des procédures
- [ ] Collaboration en temps réel (WebSockets)
- [ ] Templates de procédures
- [ ] Auto-layout pour diagrammes complexes
- [ ] Recherche avancée dans les processus
- [ ] Tableau de bord avec KPIs

**Performance** :
- [ ] Optimisation des requêtes Prisma
- [ ] Cache des données fréquemment utilisées
- [ ] Pagination côté serveur pour grandes listes

**UX** :
- [ ] Guide de démarrage pour nouveaux utilisateurs
- [ ] Tutoriels interactifs
- [ ] Raccourcis clavier avancés
- [ ] Mode sombre

## 📝 Notes Importantes

### Migration
- ⚠️ **Toujours sauvegarder la base de données avant migration**
- ⚠️ Tester la migration sur un environnement de staging d'abord
- ⚠️ Vérifier les données migrées après exécution

### Compatibilité
- Les champs `name` sont conservés pour compatibilité ascendante
- Les anciens endpoints Process restent fonctionnels
- Les données existantes sont migrées automatiquement

### Performance
- Les index ont été créés sur les champs fréquemment utilisés
- La pagination est implémentée sur tous les endpoints de liste
- Les snapshots JSON pour versions optimisent le stockage

## 🐛 Problèmes Connus

1. **App.tsx** : Types de processus incompatibles (non bloquant, fichier de démo)
2. **Seed.ts** : Erreurs de types Prisma (à corriger si utilisé)

## 📚 Ressources

- Documentation Qualigram : `docs/qualigram-schema-migration.md`
- Référence API : `docs/qualigram-api-reference.md`
- Modèle de données : `docs/qualigram-data-model.md`
- Résumé implémentation : `docs/qualigram-implementation-summary.md`

