/**
 * Prompt template pour la génération de Procedure (niveau 3)
 * Optimisé pour réduire les tokens (budget 10$/mois)
 */

export function buildGenerateProcedurePrompt(
  description: string,
  context: {
    processName?: string;
    workspaceName?: string;
    departmentName?: string;
  },
): { system: string; user: string } {
  const systemPrompt = `Tu es un expert Qualigram spécialisé dans la modélisation de procédures BPMN.
Tu génères des procédures structurées selon la méthodologie Qualigram niveau 3 (Procedure) avec des éléments BPMN complets.

Règles importantes:
- Une Procedure contient des événements (startEvent, endEvent, intermediateEvent), des tâches (task, userTask, serviceTask, manualTask, scriptTask) et des gateways (exclusiveGateway, parallelGateway, inclusiveGateway, eventBasedGateway)
- Les événements de début (startEvent) marquent le début du processus
- Les événements de fin (endEvent) marquent la fin du processus
- Les événements intermédiaires (intermediateEvent, timerEvent, messageEvent, signalEvent, errorEvent) marquent des points intermédiaires
- Les tâches représentent les activités à effectuer
- Les gateways permettent de gérer les flux conditionnels, parallèles ou inclusifs

Réponds UNIQUEMENT en JSON valide avec cette structure exacte:
{
  "title": "string",
  "description": "string",
  "startEvents": [
    {
      "type": "startEvent|timerStartEvent|messageStartEvent|signalStartEvent|errorStartEvent",
      "label": "string",
      "description": "string",
      "position": { "x": number, "y": number },
      "dimensions": { "width": number, "height": number }
    }
  ],
  "endEvents": [
    {
      "type": "endEvent|messageEndEvent|errorEndEvent|cancelEndEvent|terminateEndEvent",
      "label": "string",
      "description": "string",
      "position": { "x": number, "y": number },
      "dimensions": { "width": number, "height": number }
    }
  ],
  "intermediateEvents": [
    {
      "type": "intermediateEvent|timerEvent|messageEvent|signalEvent|errorEvent",
      "label": "string",
      "description": "string",
      "position": { "x": number, "y": number },
      "dimensions": { "width": number, "height": number }
    }
  ],
  "tasks": [
    {
      "type": "task|userTask|serviceTask|manualTask|scriptTask",
      "label": "string",
      "description": "string",
      "position": { "x": number, "y": number },
      "dimensions": { "width": number, "height": number }
    }
  ],
  "gateways": [
    {
      "type": "exclusiveGateway|parallelGateway|inclusiveGateway|eventBasedGateway",
      "label": "string",
      "description": "string",
      "position": { "x": number, "y": number },
      "dimensions": { "width": number, "height": number }
    }
  ]
}`;

  const userPrompt = `Description: "${description}"
${context.processName ? `Process: ${context.processName}` : ''}
${context.workspaceName ? `Workspace: ${context.workspaceName}` : ''}
${context.departmentName ? `Département: ${context.departmentName}` : ''}

Génère une procédure BPMN avec:
1. Un titre approprié
2. Une description détaillée (2-3 phrases)
3. Au moins un événement de début (startEvent) et un événement de fin (endEvent)
4. Des tâches logiques (3-10 tâches) avec positions et dimensions
5. Des gateways si le processus a des conditions ou des flux parallèles (0-5 gateways)
6. Des événements intermédiaires si nécessaire (0-3 événements)
7. Les positions (x, y) et dimensions (width, height) pour chaque élément pour créer un flux logique de gauche à droite

Dimensions recommandées:
- Events: width 40-50, height 40-50 (cercles)
- Tasks: width 140-180, height 60-80
- Gateways: width 50-60, height 50-60 (losanges)

Réponds en JSON valide uniquement.`;

  return { system: systemPrompt, user: userPrompt };
}

