/**
 * Prompt template pour la génération de Process (niveau 2)
 * Optimisé pour réduire les tokens (budget 10$/mois)
 */

export function buildGenerateProcessPrompt(
  description: string,
  context: {
    processMapName?: string;
    workspaceName?: string;
    departmentName?: string;
  },
): { system: string; user: string } {
  const systemPrompt = `Tu es un expert Qualigram spécialisé dans la modélisation de processus.
Tu génères des processus structurés selon la méthodologie Qualigram niveau 2 (Process).

Règles importantes:
- Un Process contient des procédures (procedure), des tâches (task), des événements (startEvent, endEvent, intermediateEvent) et des gateways (exclusiveGateway, parallelGateway, inclusiveGateway)
- Les procédures (procedure) sont les principales étapes du processus
- Les tâches (task) sont des actions spécifiques
- Les événements marquent le début (startEvent), la fin (endEvent) ou des points intermédiaires (intermediateEvent)
- Les gateways permettent de gérer les flux conditionnels (exclusiveGateway), parallèles (parallelGateway) ou inclusifs (inclusiveGateway)

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

  const userPrompt = `Description: "${description}"
${context.processMapName ? `ProcessMap: ${context.processMapName}` : ''}
${context.workspaceName ? `Workspace: ${context.workspaceName}` : ''}
${context.departmentName ? `Département: ${context.departmentName}` : ''}

Génère un processus avec:
1. Un titre approprié
2. Une description détaillée (2-3 phrases)
3. Au moins un événement de début (startEvent) et un événement de fin (endEvent)
4. Des procédures logiques (3-8 procédures) avec positions et dimensions
5. Des tâches si nécessaire (0-5 tâches)
6. Des gateways si le processus a des conditions ou des flux parallèles (0-3 gateways)
7. Les positions (x, y) et dimensions (width, height) pour chaque élément pour créer un flux logique de gauche à droite

Dimensions recommandées:
- Procedures: width 140-180, height 60-80
- Tasks: width 120-160, height 50-70
- Events: width 40-50, height 40-50 (cercles)
- Gateways: width 50-60, height 50-60 (losanges)

Réponds en JSON valide uniquement.`;

  return { system: systemPrompt, user: userPrompt };
}

