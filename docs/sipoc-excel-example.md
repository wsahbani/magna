# Exemple SIPOC Import

Ce dossier contient un exemple de fichier Excel pour l'import SIPOC.

## Créer votre fichier d'exemple

Copiez la structure suivante dans Excel :

### Ligne 1 (En-têtes)
```
Fournisseurs | Entrées | Processus | Sorties | Clients
```

### Ligne 2 - Processus de Formation
```
Service RH | Demande formation
Budget disponible | Analyser besoin formation | Plan de formation
Programme validé | Employés
Service formation
```

### Ligne 3 - Sélection Organisme
```
Organisme formation
Consultant externe | Contenu formation
Catalogue formations
Tarifs | Sélectionner organisme | Contrat formation
Devis validé | Service RH
Direction
```

### Ligne 4 - Organisation Session
```
Service IT
Service logistique | Liste participants
Salle disponible
Matériel pédagogique | Organiser session formation | Convocations
Planning
Attestations présence | Participants
Formateur
```

### Ligne 5 - Évaluation
```
Participants
Formateur | Questionnaire satisfaction
Résultats tests | Évaluer formation | Rapport évaluation
Certificats | Service RH
Service qualité
```

## Notes

- Séparez les multiples éléments par **saut de ligne** (Alt+Entrée)
- Ou utilisez des **points-virgules** : `Element1; Element2; Element3`
- Les cellules vides sont autorisées
- Les lignes vides sont ignorées

## Test rapide

1. Créez un fichier Excel avec cette structure
2. Enregistrez-le en `.xlsx`
3. Importez-le via le bouton "Importer depuis Excel" dans le SIPOC Editor
4. Vérifiez la prévisualisation
5. Modifiez si nécessaire
6. Enregistrez

## Résultat attendu

Après import, vous devriez voir :
- **4 flows** (lignes) de processus complets
- **≈ 7 Fournisseurs**
- **≈ 10 Entrées**
- **4 Processus**
- **≈ 9 Sorties**
- **≈ 11 Clients**

Total : environ **41 éléments SIPOC** créés automatiquement !
