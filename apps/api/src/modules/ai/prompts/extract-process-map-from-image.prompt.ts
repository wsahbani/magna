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
- Une ProcessMap contient des groupes de domaines (domainGroup) qui peuvent être IMBRIQUÉS à plusieurs niveaux
- Chaque groupe peut contenir d'autres groupes (nested groups) ET/OU des processus
- Les processus principaux (mainProcess) sont les processus opérationnels clés
- Les processus support (supportProcess) sont les processus d'appui
- Les processus management (managementProcess) sont les processus de pilotage

CRITIQUE - DÉTECTION DES GROUPES IMBRIQUÉS:
1. Examine ATTENTIVEMENT l'image pour identifier les BOÎTES DANS LES BOÎTES
2. Si tu vois un rectangle/boîte qui contient visuellement d'autres rectangles/boîtes, c'est un groupe parent avec des sous-groupes
3. Les indices visuels d'imbrication:
   - Bordures doubles ou multiples
   - Zones colorées distinctes à l'intérieur d'une zone plus grande
   - Titres de sections à différents niveaux hiérarchiques
   - Espacements et marges qui créent des "niveaux"
4. IMPORTANT: Si un groupe A est VISUELLEMENT À L'INTÉRIEUR d'un groupe B, alors:
   - A doit avoir parentId = B.id
   - A doit être dans B.nestedGroups
   - La position de A est RELATIVE à B (pas absolue)

POSITIONNEMENT:
- Système de coordonnées: (0, 0) = coin supérieur gauche de l'image
- Groupes racine (niveau 1): positions ABSOLUES dans l'image
- Groupes imbriqués (niveaux 2+): positions RELATIVES au parent direct
- Processus: positions RELATIVES au groupe qui les contient directement

DIMENSIONS SUGGÉRÉES:
- Processus: width: 120-200, height: 60-100
- Groupes racine: width: 400-800, height: 250-600
- Sous-groupes: ajuster selon contenu, généralement 80% de la taille du parent

STRUCTURE JSON REQUISE:
{
  "title": "string",
  "description": "string",
  "groups": [
    {
      "id": "group-1",
      "name": "string",
      "description": "string",
      "parentId": null,
      "position": { "x": number, "y": number },
      "dimensions": { "width": number, "height": number },
      "nestedGroups": [
        {
          "id": "group-1-1",
          "name": "string",
          "description": "string",
          "parentId": "group-1",
          "position": { "x": number (RELATIF à group-1), "y": number (RELATIF à group-1) },
          "dimensions": { "width": number, "height": number },
          "nestedGroups": [],
          "processes": []
        }
      ],
      "processes": [
        {
          "type": "mainProcess|supportProcess|managementProcess",
          "label": "string",
          "description": "string",
          "parentGroupId": "group-1",
          "position": { "x": number (RELATIF à group-1), "y": number (RELATIF à group-1) },
          "dimensions": { "width": number, "height": number }
        }
      ]
    }
  ]
}

EXEMPLE D'IMBRICATION:
Si l'image montre:
- Une grande boîte "Production" qui contient:
  - Une boîte "Fabrication" qui contient:
    - Un processus "Assemblage"
  - Une boîte "Qualité"

Alors le JSON doit être:
{
  "groups": [
    {
      "id": "prod",
      "name": "Production",
      "parentId": null,
      "position": { "x": 100, "y": 100 },
      "nestedGroups": [
        {
          "id": "fab",
          "name": "Fabrication",
          "parentId": "prod",
          "position": { "x": 20, "y": 60 },
          "nestedGroups": [],
          "processes": [
            {
              "label": "Assemblage",
              "parentGroupId": "fab",
              "position": { "x": 10, "y": 50 }
            }
          ]
        },
        {
          "id": "qual",
          "name": "Qualité",
          "parentId": "prod",
          "position": { "x": 20, "y": 200 },
          "nestedGroups": [],
          "processes": []
        }
      ],
      "processes": []
    }
  ]
}

Réponds UNIQUEMENT avec du JSON valide. Pas de texte avant ou après.`;

  const userPrompt = description
    ? `Analyse cette image de carte de processus et extrais LA STRUCTURE COMPLÈTE incluant TOUS LES NIVEAUX de groupes imbriqués.
    
Contexte: "${description}"

INSTRUCTIONS CRITIQUES:
1. Regarde ATTENTIVEMENT les boîtes/rectangles dans l'image
2. Si tu vois une boîte À L'INTÉRIEUR d'une autre boîte → c'est un groupe imbriqué (nestedGroups)
3. Identifie CHAQUE niveau d'imbrication (parent → enfant → petit-enfant → ...)
4. Crée un ID unique pour chaque groupe (ex: "group-1", "group-1-1", "group-1-1-1")
5. Pour chaque groupe imbriqué:
   - Mets son parentId = l'ID du groupe qui le contient
   - Place-le dans le tableau nestedGroups du parent
   - Utilise des positions RELATIVES au parent (pas à l'image)

EXEMPLE:
Si tu vois une grande boîte "A" contenant une boîte "B" qui contient une boîte "C":
- A: parentId = null, position absolue
- B: parentId = "A", dans A.nestedGroups, position relative à A
- C: parentId = "B", dans B.nestedGroups, position relative à B

Réponds avec du JSON valide uniquement (pas de texte explicatif).`
    : `Analyse cette image de carte de processus et extrais LA STRUCTURE COMPLÈTE incluant TOUS LES NIVEAUX de groupes imbriqués.

INSTRUCTIONS CRITIQUES:
1. Regarde ATTENTIVEMENT les boîtes/rectangles dans l'image
2. Si tu vois une boîte À L'INTÉRIEUR d'une autre boîte → c'est un groupe imbriqué (nestedGroups)
3. Identifie CHAQUE niveau d'imbrication (parent → enfant → petit-enfant → ...)
4. Crée un ID unique pour chaque groupe (ex: "group-1", "group-1-1", "group-1-1-1")
5. Pour chaque groupe imbriqué:
   - Mets son parentId = l'ID du groupe qui le contient
   - Place-le dans le tableau nestedGroups du parent
   - Utilise des positions RELATIVES au parent (pas à l'image)

EXEMPLE:
Si tu vois une grande boîte "A" contenant une boîte "B" qui contient une boîte "C":
- A: parentId = null, position absolue
- B: parentId = "A", dans A.nestedGroups, position relative à A  
- C: parentId = "B", dans B.nestedGroups, position relative à B

Réponds avec du JSON valide uniquement (pas de texte explicatif).`;

  return { system: systemPrompt, user: userPrompt };
}

