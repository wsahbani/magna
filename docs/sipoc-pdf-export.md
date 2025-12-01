# Export PDF SIPOC

## Vue d'ensemble

La fonctionnalité d'export PDF permet d'exporter le diagramme SIPOC complet dans un format PDF professionnel avec un tableau personnalisé, incluant toutes les informations du diagramme et son contenu structuré.

## Fonctionnalités

- **Export complet** : Génère un tableau structuré du diagramme SIPOC avec tous ses flux et éléments
- **Mise en page optimisée** : Format A4 paysage avec pagination automatique pour les diagrammes longs
- **Tableau personnalisé** : Création d'un tableau PDF avec colonnes (Fournisseur, Entrée, Processus, Sortie, Client) et lignes (flux)
- **Métadonnées incluses** : Titre, description, propriétaire, département, version et date
- **Qualité vectorielle** : Export en texte vectoriel pour une meilleure qualité et lisibilité
- **Gestion multi-pages** : Pagination automatique pour les diagrammes qui dépassent une page
- **Mise en évidence** : La colonne Processus est mise en évidence avec une couleur orange

## Architecture

### Fichiers

- **`apps/web/src/features/sipoc/utils/sipoc-pdf-export.ts`** : Fonction utilitaire principale pour l'export PDF
- **`apps/web/src/features/sipoc/components/SipocEditor.tsx`** : Composant principal avec le bouton d'export

### Dépendances

- **`jspdf`** : Bibliothèque pour la génération de PDF et création de tableaux personnalisés

## Utilisation

### Dans le composant SipocEditor

Le bouton d'export PDF est disponible dans le header du composant, à côté des autres actions (Importer, Enregistrer, Publier).

```typescript
<Button 
  variant="outline" 
  size="sm"
  onClick={handleExportPdf}
  disabled={isExportingPdf}
>
  {isExportingPdf ? (
    <>
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      Export...
    </>
  ) : (
    <>
      <FileText className="w-4 h-4 mr-2" />
      Exporter PDF
    </>
  )}
</Button>
```

### Fonction d'export

```typescript
export async function exportSipocToPdf({
  diagram,
  elements,
  boardElement,
  filename,
}: ExportPdfOptions): Promise<void>
```

**Paramètres :**
- `diagram` : Objet SipocDiagram contenant les métadonnées du diagramme
- `elements` : Tableau des éléments SIPOC à exporter
- `filename` : (optionnel) Nom du fichier PDF à générer

## Structure du PDF généré

1. **En-tête** :
   - Logo Orange (en haut à droite)
   - Titre du diagramme (gras, 18pt)
   - Description (si disponible, 10pt)

2. **Métadonnées** :
   - Propriétaire du processus
   - Département
   - Version
   - Date de mise à jour

3. **Tableau SIPOC** :
   - **En-tête du tableau** : Colonnes avec labels (Fournisseur, Entrée, Processus, Sortie, Client)
   - **Lignes** : Chaque ligne représente un flux (flow_id)
   - **Cellules** : Contiennent les éléments de chaque type avec :
     - Titre de l'élément
     - Description (si disponible)
     - Responsable (si disponible)
     - Critères de qualité (si disponible)
   - **Mise en évidence** : La colonne Processus a un fond orange pour la distinguer
   - **Pagination automatique** : Les lignes sont réparties sur plusieurs pages si nécessaire

4. **En-tête et pied de page** (sur chaque page) :
   - Logo Orange (en haut à droite de chaque page)
   - Pied de page avec numéro de page (ex: "Page 1 sur 3")
   - Date d'export

## Format du nom de fichier

Par défaut, le nom du fichier suit le format :
```
SIPOC_{titre}_v{version}.pdf
```

Le titre est nettoyé pour ne contenir que des caractères alphanumériques et des underscores.

## Gestion des erreurs

La fonction gère les erreurs et affiche un message d'erreur approprié en cas d'échec :
- Groupement des éléments par flux
- Génération du tableau PDF
- Pagination automatique
- Sauvegarde du fichier

## Améliorations futures

- [ ] Options d'export personnalisables (orientation, format, etc.)
- [ ] Export sélectif (uniquement certains flux)
- [ ] Template personnalisable pour le PDF
- [ ] Export avec annotations et commentaires
- [ ] Compression du PDF pour réduire la taille du fichier
- [ ] Support des connexions entre éléments dans le PDF
- [ ] Export avec graphiques et visualisations supplémentaires

