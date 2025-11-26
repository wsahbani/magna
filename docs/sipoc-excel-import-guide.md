# Guide d'import Excel pour SIPOC

## Format attendu

L'import Excel pour les diagrammes SIPOC utilise **la colonne Processus comme pivot**. Chaque processus définit un nouveau flux SIPOC, et les lignes suivantes sans processus accumulent des éléments au flux en cours.

## Logique d'import - Le Processus est le pivot

### Principe fondamental

**La colonne Processus détermine les flux** :
- Une ligne avec un Processus → Démarre un nouveau flux SIPOC
- Une ligne sans Processus → Accumule des éléments au flux précédent

### Exemple de parsing

```excel
| Fournisseurs | Entrées      | Processus           | Sorties          | Clients    |
|--------------|--------------|---------------------|------------------|------------|
| Service RH   | Demande      | Analyser besoin     | Plan formation   | Employés   |
| Direction    | Budget       |                     | Devis            | Manager    |
|              | Catalogue    |                     |                  |            |
|--------------|--------------|---------------------|------------------|------------|
| Organisme    | Contenu      | Sélectionner org.   | Contrat          | Service RH |
| Consultant   |              |                     | Planning         |            |
```

**Résultat du parsing :**

**Flow 1 - "Analyser besoin"** :
- Fournisseurs: Service RH, Direction
- Entrées: Demande, Budget, Catalogue
- Processus: **Analyser besoin** (pivot)
- Sorties: Plan formation, Devis
- Clients: Employés, Manager

**Flow 2 - "Sélectionner org."** :
- Fournisseurs: Organisme, Consultant
- Entrées: Contenu
- Processus: **Sélectionner org.** (pivot)
- Sorties: Contrat, Planning
- Clients: Service RH

### Structure du fichier

| Fournisseurs | Entrées | Processus | Sorties | Clients |
|--------------|---------|-----------|---------|---------|
| Fournisseur 1 | Entrée 1 | Processus 1 | Sortie 1 | Client 1 |
| Fournisseur 2 | Entrée 2 | Processus 2 | Sortie 2 | Client 2 |

### Règles importantes

1. **Colonne Processus = Pivot obligatoire** :
   - La première ligne doit contenir un Processus pour démarrer
   - Chaque nouveau Processus crée un nouveau flux SIPOC
   - Les lignes sans Processus ajoutent des éléments au flux en cours

2. **En-têtes requis** : La première ligne doit contenir exactement ces 5 colonnes :
   - Fournisseurs
   - Entrées  
   - Processus ← **COLONNE PIVOT**
   - Sorties
   - Clients

3. **Accumulation des éléments** :
   ```
   Ligne 1: Process A → Crée Flow 1 avec Process A
   Ligne 2: (vide)    → Ajoute éléments au Flow 1
   Ligne 3: (vide)    → Ajoute éléments au Flow 1
   Ligne 4: Process B → Crée Flow 2 avec Process B
   Ligne 5: (vide)    → Ajoute éléments au Flow 2
   ```

4. **Multiples éléments par cellule** : Vous pouvez ajouter plusieurs éléments dans une cellule en :
   - Utilisant des **sauts de ligne** (Alt+Entrée dans Excel)
   - Séparant par des **points-virgules** (`;`)
   
   Exemple dans une cellule :
   ```
   Fournisseur A
   Fournisseur B
   Fournisseur C
   ```
   ou
   ```
   Fournisseur A; Fournisseur B; Fournisseur C
   ```

5. **Lignes vides** : Les lignes complètement vides sont ignorées

6. **Cellules vides** : Les cellules vides sont acceptées - seul le Processus détermine le flux

### Exemple de fichier avec accumulation

```
| Fournisseurs           | Entrées                | Processus              | Sorties                | Clients          |
|------------------------|------------------------|------------------------|------------------------|------------------|
| Service RH             | Demande formation      | Analyser besoin        | Plan de formation      | Employés         |
|                        | Budget disponible      |                        | Devis                  | Direction        |
| Service formation      |                        |                        |                        |                  |
|------------------------|------------------------|------------------------|------------------------|------------------|
| Organisme formation    | Contenu formation      | Sélectionner           | Contrat formation      | Service RH       |
| Consultant externe     | Catalogue              | organisme              | Devis validé           | Direction        |
|                        | Tarifs                 |                        |                        |                  |
|------------------------|------------------------|------------------------|------------------------|------------------|
| Service IT             | Liste participants     | Organiser session      | Convocations           | Participants     |
| Service logistique     | Salle disponible       |                        | Planning               | Formateur        |
|                        | Matériel               |                        | Attestations           | Service RH       |
```

**Ce fichier génère 3 flux SIPOC** :

1. **Flow "Analyser besoin"** - 3 lignes accumulées
   - Fournisseurs: Service RH, Service formation
   - Entrées: Demande formation, Budget disponible
   - Processus: Analyser besoin
   - Sorties: Plan de formation, Devis
   - Clients: Employés, Direction

2. **Flow "Sélectionner organisme"** - 2 lignes accumulées
   - Fournisseurs: Organisme formation, Consultant externe
   - Entrées: Contenu formation, Catalogue, Tarifs
   - Processus: Sélectionner organisme
   - Sorties: Contrat formation, Devis validé
   - Clients: Service RH, Direction

3. **Flow "Organiser session"** - 2 lignes accumulées
   - Fournisseurs: Service IT, Service logistique
   - Entrées: Liste participants, Salle disponible, Matériel
   - Processus: Organiser session
   - Sorties: Convocations, Planning, Attestations
   - Clients: Participants, Formateur, Service RH

## Interface de prévisualisation

Après l'import, vous pouvez :

### Actions sur les cellules
- **Modifier** : Cliquer sur l'icône crayon pour éditer le contenu
- **Supprimer** : Cliquer sur l'icône poubelle pour supprimer une cellule

### Actions sur les lignes
- **Supprimer** : Bouton poubelle à droite pour supprimer toute la ligne

### Validation
- Les statistiques en haut affichent le nombre d'éléments par type
- Les avertissements signalent les éventuels problèmes détectés

## Formats de fichiers supportés

- `.xlsx` - Excel moderne (recommandé)
- `.xls` - Excel ancien format
- `.ods` - OpenDocument Spreadsheet (LibreOffice)

## Limites

- Taille maximale : **10 MB**
- Nombre maximum d'éléments : Illimité (mais pensez à la lisibilité)

## Conseils

1. **Gardez une structure cohérente** : Chaque ligne représente une "flow" complète du SIPOC
2. **Soyez concis** : Utilisez des titres courts et clairs pour chaque élément
3. **Vérifiez avant d'importer** : Utilisez la phase de prévisualisation pour corriger les erreurs
4. **Sauvegardez votre fichier Excel** : Gardez une copie de votre fichier source pour référence

## Workflow d'import

1. **Upload** : Sélectionnez ou glissez-déposez votre fichier Excel
2. **Preview** : Vérifiez et modifiez les données importées
3. **Save** : Enregistrez les éléments dans votre diagramme SIPOC

## Exemple de flux complet

```excel
Fournisseurs: Service commercial
Entrées: Commande client; Spécifications produit
Processus: Valider commande
Sorties: Bon de commande; Confirmation client
Clients: Client; Service production
```

Sera transformé en :
- 1 Fournisseur : "Service commercial"
- 2 Entrées : "Commande client", "Spécifications produit"  
- 1 Processus : "Valider commande"
- 2 Sorties : "Bon de commande", "Confirmation client"
- 2 Clients : "Client", "Service production"
