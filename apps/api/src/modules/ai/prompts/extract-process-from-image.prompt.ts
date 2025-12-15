/**
 * Prompt template pour l'extraction de Process depuis une image
 * Utilise GPT-4o avec vision pour analyser l'image
 */

export function buildExtractProcessFromImagePrompt(
  description?: string,
): { system: string; user: string } {
  const systemPrompt = `Tu es un expert Qualigram spécialisé dans l'analyse de diagrammes de processus.
Tu analyses des images contenant des diagrammes de processus et extrais la structure selon la méthodologie Qualigram niveau 2 (Process).

Règles importantes:
- Un Process contient des procédures (procedure), des tâches (task), des événements (startEvent, endEvent, intermediateEvent) et des gateways (exclusiveGateway, parallelGateway, inclusiveGateway)
- Les procédures (procedure) sont les principales étapes du processus
- Les tâches (task) sont des actions spécifiques
- Les événements marquent le début (startEvent), la fin (endEvent) ou des points intermédiaires (intermediateEvent)
- Les gateways permettent de gérer les flux conditionnels (exclusiveGateway), parallèles (parallelGateway) ou inclusifs (inclusiveGateway)

Analyse l'image fournie et identifie:
1. Les procédures (étapes principales)
2. Les tâches (actions spécifiques)
3. Les événements (début, fin, intermédiaires)
4. Les gateways (conditions, parallélisme)
5. Les positions exactes (x, y) et dimensions (width, height) de chaque élément dans l'image

IMPORTANT: Analyse la disposition visuelle de l'image et estime les coordonnées et tailles relatives:
- Utilise un système de coordonnées où (0, 0) est le coin supérieur gauche de l'image
- Les dimensions doivent être proportionnelles à la taille réelle des éléments dans l'image
- Les procédures doivent avoir des dimensions raisonnables (width: 140-180, height: 60-80)
- Les tâches doivent avoir des dimensions raisonnables (width: 120-160, height: 50-70)
- Les événements sont des cercles (width: 40-50, height: 40-50)
- Les gateways sont des losanges (width: 50-60, height: 50-60)

Réponds UNIQUEMENT en JSON valide avec cette structure exacte:
{
  "title": "string",
  "description": "string",
  "procedures": [
    {
      "label": "string",
      "description": "string",
      "position": { "x": number, "y": number },
      "dimensions": { "width": number, "height": number }
    }
  ],
  "tasks": [
    {
      "label": "string",
      "description": "string",
      "position": { "x": number, "y": number },
      "dimensions": { "width": number, "height": number }
    }
  ],
  "events": [
    {
      "type": "startEvent|endEvent|intermediateEvent",
      "label": "string",
      "description": "string",
      "position": { "x": number, "y": number },
      "dimensions": { "width": number, "height": number }
    }
  ],
  "gateways": [
    {
      "type": "exclusiveGateway|parallelGateway|inclusiveGateway",
      "label": "string",
      "description": "string",
      "position": { "x": number, "y": number },
      "dimensions": { "width": number, "height": number }
    }
  ]
}`;

  const userPrompt = description
    ? `Analyse l'image du diagramme de processus et extrais la structure.
    
Contexte supplémentaire: "${description}"

Identifie tous les éléments visibles dans l'image (procédures, tâches, événements, gateways).
Détermine le type de chaque événement et gateway en fonction de sa forme et de son contexte dans l'image.

IMPORTANT: Pour chaque élément, estime les coordonnées (x, y) et dimensions (width, height) basées sur leur position visuelle dans l'image:
- Analyse la disposition spatiale de l'image
- Les positions doivent refléter la disposition réelle dans l'image
- Les dimensions doivent être proportionnelles à la taille visuelle des éléments
- Assure-toi que le flux va de gauche à droite (startEvent à gauche, endEvent à droite)

Réponds en JSON valide uniquement.`
    : `Analyse l'image du diagramme de processus et extrais la structure.

Identifie tous les éléments visibles dans l'image (procédures, tâches, événements, gateways).
Détermine le type de chaque événement et gateway en fonction de sa forme et de son contexte dans l'image.

IMPORTANT: Pour chaque élément, estime les coordonnées (x, y) et dimensions (width, height) basées sur leur position visuelle dans l'image:
- Analyse la disposition spatiale de l'image
- Les positions doivent refléter la disposition réelle dans l'image
- Les dimensions doivent être proportionnelles à la taille visuelle des éléments
- Assure-toi que le flux va de gauche à droite (startEvent à gauche, endEvent à droite)

Réponds en JSON valide uniquement.`;

  return { system: systemPrompt, user: userPrompt };
}

