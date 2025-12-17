/**
 * Prompt template pour l'extraction de ProcessMap depuis une image
 * Utilise GPT-4o avec vision pour analyser l'image
 */

export function buildExtractProcessMapFromImagePrompt(
  description?: string,
): { system: string; user: string } {
  const systemPrompt = `Tu es un expert Qualigram spécialisé dans l'analyse de cartes de processus.
Tu analyses des images contenant des cartes de processus et extrais la structure selon la méthodologie Qualigram niveau 1 (ProcessMap).

Règles importantes:
- Une ProcessMap contient des groupes de domaines (domainGroup)
- Chaque groupe contient des processus (mainProcess, supportProcess, managementProcess)
- Les processus principaux (mainProcess) sont les processus opérationnels clés
- Les processus support (supportProcess) sont les processus d'appui
- Les processus management (managementProcess) sont les processus de pilotage

Analyse l'image fournie et identifie:
1. Les groupes de domaines (boîtes, zones, sections qui regroupent des processus)
2. Les processus dans chaque groupe
3. Le type de chaque processus (principal, support, ou management) basé sur son contexte et sa position
4. Les relations et hiérarchies visuelles
5. Les positions exactes (x, y) et dimensions (width, height) de chaque élément dans l'image

IMPORTANT: Analyse la disposition visuelle de l'image et estime les coordonnées et tailles relatives:
- Utilise un système de coordonnées où (0, 0) est le coin supérieur gauche de l'image
- Les dimensions doivent être proportionnelles à la taille réelle des éléments dans l'image
- Les groupes doivent être assez grands pour contenir leurs processus
- Les processus doivent avoir des dimensions raisonnables (width: 120-200, height: 60-100)
- Les groupes doivent avoir des dimensions suffisantes (width: 300-600, height: 200-500)

Réponds UNIQUEMENT en JSON valide avec cette structure exacte:
{
  "title": "string",
  "description": "string",
  "groups": [
    {
      "name": "string",
      "description": "string",
      "position": { "x": number, "y": number },
      "dimensions": { "width": number, "height": number },
      "processes": [
        {
          "type": "mainProcess|supportProcess|managementProcess",
          "label": "string",
          "description": "string",
          "position": { "x": number, "y": number },
          "dimensions": { "width": number, "height": number }
        }
      ]
    }
  ]
}`;

  const userPrompt = description
    ? `Analyse l'image de la carte de processus et extrais la structure.
    
Contexte supplémentaire: "${description}"

Identifie tous les groupes de domaines et processus visibles dans l'image.
Détermine le type de chaque processus (mainProcess, supportProcess, ou managementProcess) en fonction de sa position et de son contexte dans l'image.

IMPORTANT: Pour chaque groupe et processus, estime les coordonnées (x, y) et dimensions (width, height) basées sur leur position visuelle dans l'image:
- Analyse la disposition spatiale de l'image
- Les positions doivent refléter la disposition réelle dans l'image
- Les dimensions doivent être proportionnelles à la taille visuelle des éléments
- Assure-toi que les processus sont positionnés à l'intérieur de leur groupe parent

Réponds en JSON valide uniquement.`
    : `Analyse l'image de la carte de processus et extrais la structure.

Identifie tous les groupes de domaines et processus visibles dans l'image.
Détermine le type de chaque processus (mainProcess, supportProcess, ou managementProcess) en fonction de sa position et de son contexte dans l'image.

IMPORTANT: Pour chaque groupe et processus, estime les coordonnées (x, y) et dimensions (width, height) basées sur leur position visuelle dans l'image:
- Analyse la disposition spatiale de l'image
- Les positions doivent refléter la disposition réelle dans l'image
- Les dimensions doivent être proportionnelles à la taille visuelle des éléments
- Assure-toi que les processus sont positionnés à l'intérieur de leur groupe parent

Réponds en JSON valide uniquement.`;

  return { system: systemPrompt, user: userPrompt };
}

