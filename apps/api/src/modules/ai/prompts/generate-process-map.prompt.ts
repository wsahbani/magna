/**
 * Prompt template pour la génération de ProcessMap
 * Optimisé pour réduire les tokens (budget 10$/mois)
 */

export function buildGenerateProcessMapPrompt(
  description: string,
  context: {
    workspaceName?: string;
    departmentName?: string;
  },
): { system: string; user: string } {
  const systemPrompt = `Tu es un expert Qualigram spécialisé dans la cartographie de processus.
Tu génères des cartes de processus structurées selon la méthodologie Qualigram niveau 1 (ProcessMap).

Règles importantes:
- Une ProcessMap contient des groupes de domaines (domainGroup)
- Chaque groupe contient des processus (mainProcess, supportProcess, managementProcess)
- Les processus principaux (mainProcess) sont les processus opérationnels clés
- Les processus support (supportProcess) sont les processus d'appui
- Les processus management (managementProcess) sont les processus de pilotage

Réponds UNIQUEMENT en JSON valide avec cette structure exacte:
{
  "title": "string",
  "description": "string",
  "groups": [
    {
      "name": "string",
      "description": "string",
      "processes": [
        {
          "type": "mainProcess|supportProcess|managementProcess",
          "label": "string",
          "description": "string"
        }
      ]
    }
  ]
}`;

  const userPrompt = `Description: "${description}"
${context.workspaceName ? `Workspace: ${context.workspaceName}` : ''}
${context.departmentName ? `Département: ${context.departmentName}` : ''}

Génère une carte de processus avec:
1. Un titre approprié
2. Une description détaillée (2-3 phrases)
3. Des groupes de domaines logiques (2-5 groupes)
4. Pour chaque groupe, 2-4 processus appropriés avec leur type (mainProcess, supportProcess, ou managementProcess)

Réponds en JSON valide uniquement.`;

  return { system: systemPrompt, user: userPrompt };
}

