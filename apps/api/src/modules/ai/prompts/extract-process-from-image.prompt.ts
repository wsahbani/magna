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
- Un Process contient des procédures (procedure), des tâches spécialisées, des événements et des gateways

Types de tâches disponibles:
- task: Tâche générique (utiliser par défaut si aucun type spécifique ne convient)
- userTask: Tâche nécessitant une intervention humaine (validation, saisie, décision, approbation, révision) - généralement représentée avec une icône utilisateur
- serviceTask: Tâche automatisée appelant un service externe (API REST, web service, appel système) - généralement représentée avec une icône d'engrenage
- manualTask: Tâche manuelle non automatisée (impression, envoi postal, manipulation physique) - généralement représentée sans icône d'automatisation
- scriptTask: Tâche exécutant un script ou calcul (transformation de données, calculs complexes, scripts) - généralement représentée avec une icône de code

Types d'événements disponibles:
- startEvent: Événement de début du processus (cercle simple avec bordure fine)
- endEvent: Événement de fin du processus (cercle avec bordure épaisse)
- intermediateEvent: Événement intermédiaire dans le flux (cercle avec bordure double)
- timerEvent: Événement déclenché par un délai (cercle avec icône d'horloge ou symbole temporel)
- messageEvent: Événement déclenché par réception d'un message (cercle avec icône d'enveloppe ou symbole de message)

Types de gateways disponibles:
- exclusiveGateway: Passerelle exclusive (XOR) - un seul chemin est pris selon une condition (losange avec X ou symbole de condition)
- parallelGateway: Passerelle parallèle (AND) - tous les chemins sont pris simultanément (losange avec + ou symbole de parallélisme)
- inclusiveGateway: Passerelle inclusive (OR) - un ou plusieurs chemins peuvent être pris (losange avec O ou symbole d'inclusion)
- eventBasedGateway: Passerelle basée sur événement - le flux continue selon le premier événement reçu (losange avec symbole d'événement)
- gateway: Passerelle générique (utiliser si le type spécifique ne peut pas être déterminé)

Analyse l'image fournie et identifie:
1. Les procédures (étapes principales)
2. Les tâches (actions spécifiques)
3. Les événements (début, fin, intermédiaires)
4. Les gateways (conditions, parallélisme)
5. Les positions exactes (x, y) et dimensions (width, height) de chaque élément dans l'image
6. Les connexions/flèches entre les éléments (edges) pour créer le flux logique du processus

IMPORTANT: Analyse la disposition visuelle de l'image et estime les coordonnées et tailles relatives:
- Utilise un système de coordonnées où (0, 0) est le coin supérieur gauche de l'image
- Les dimensions doivent être proportionnelles à la taille réelle des éléments dans l'image
- Les procédures doivent avoir des dimensions raisonnables (width: 140-180, height: 60-80)
- Les tâches doivent avoir des dimensions raisonnables (width: 120-160, height: 50-70)
- Les événements sont des cercles (width: 40-50, height: 40-50)
- Les gateways sont des losanges (width: 50-60, height: 50-60)

IMPORTANT pour les IDs temporaires:
- Chaque nœud DOIT avoir un "id" unique et descriptif (ex: "start-1", "proc-1", "task-1", "gateway-1", "end-1")
- Les IDs doivent être cohérents entre les nœuds et les edges
- Utilise des préfixes clairs: "start-", "end-", "proc-", "task-", "gateway-", "event-"

IMPORTANT pour les edges:
- Identifie toutes les flèches/connexions visibles dans l'image entre les éléments
- Le flux logique suit généralement: startEvent → procédures/tâches → gateways → endEvent
- Pour les gateways exclusifs/inclusifs: ajoute des labels de condition sur les edges sortants si visibles dans l'image (ex: "Si oui", "Si non", "Si condition A")
- Pour les gateways parallèles: plusieurs edges sortants sans labels
- Assure-toi que tous les nœuds sont connectés (pas de nœuds orphelins)

Réponds UNIQUEMENT en JSON valide avec cette structure exacte:
{
  "title": "string",
  "description": "string",
  "procedures": [
    {
      "id": "proc-1",
      "label": "string",
      "description": "string",
      "position": { "x": number, "y": number },
      "dimensions": { "width": number, "height": number }
    }
  ],
  "tasks": [
    {
      "id": "task-1",
      "type": "task|userTask|serviceTask|manualTask|scriptTask",
      "label": "string",
      "description": "string",
      "position": { "x": number, "y": number },
      "dimensions": { "width": number, "height": number }
    }
  ],
  "events": [
    {
      "id": "start-1",
      "type": "startEvent|endEvent|intermediateEvent|timerEvent|messageEvent",
      "label": "string",
      "description": "string",
      "position": { "x": number, "y": number },
      "dimensions": { "width": number, "height": number }
    }
  ],
  "gateways": [
    {
      "id": "gateway-1",
      "type": "gateway|exclusiveGateway|parallelGateway|inclusiveGateway|eventBasedGateway",
      "label": "string",
      "description": "string",
      "position": { "x": number, "y": number },
      "dimensions": { "width": number, "height": number }
    }
  ],
  "edges": [
    {
      "source": "start-1",
      "target": "proc-1",
      "label": "optional condition label"
    }
  ]
}`;

  const userPrompt = description
    ? `Analyse l'image du diagramme de processus et extrais la structure.
    
Contexte supplémentaire: "${description}"

Identifie tous les éléments visibles dans l'image (procédures, tâches, événements, gateways).
Détermine le type spécifique de chaque élément en fonction de sa forme, ses icônes, ses marqueurs et son contexte dans l'image:
- Pour les tâches: identifie si c'est une userTask (icône utilisateur), serviceTask (icône engrenage), manualTask (pas d'automatisation), scriptTask (icône code) ou task générique
- Pour les événements: identifie si c'est un timerEvent (icône horloge), messageEvent (icône enveloppe), startEvent (bordure fine), endEvent (bordure épaisse) ou intermediateEvent (bordure double)
- Pour les gateways: identifie le type selon les symboles (X pour exclusive, + pour parallel, O pour inclusive, symbole événement pour eventBased) ou utilise 'gateway' générique si indéterminé

IMPORTANT: Pour chaque élément, estime les coordonnées (x, y) et dimensions (width, height) basées sur leur position visuelle dans l'image:
- Analyse la disposition spatiale de l'image
- Les positions doivent refléter la disposition réelle dans l'image
- Les dimensions doivent être proportionnelles à la taille visuelle des éléments
- Assure-toi que le flux va de gauche à droite (startEvent à gauche, endEvent à droite)

IMPORTANT: Identifie toutes les connexions/flèches visibles dans l'image:
- Analyse les flèches qui relient les éléments entre eux
- Crée des edges pour chaque connexion visible dans l'image
- Utilise les IDs temporaires des nœuds pour référencer source et target
- Pour les gateways avec plusieurs branches sortantes, identifie toutes les connexions et ajoute des labels de condition si visibles dans l'image
- Le flux doit être logique: startEvent → première procédure/tâche → ... → endEvent

Réponds en JSON valide uniquement.`
    : `Analyse l'image du diagramme de processus et extrais la structure.

Identifie tous les éléments visibles dans l'image (procédures, tâches, événements, gateways).
Détermine le type spécifique de chaque élément en fonction de sa forme, ses icônes, ses marqueurs et son contexte dans l'image:
- Pour les tâches: identifie si c'est une userTask (icône utilisateur), serviceTask (icône engrenage), manualTask (pas d'automatisation), scriptTask (icône code) ou task générique
- Pour les événements: identifie si c'est un timerEvent (icône horloge), messageEvent (icône enveloppe), startEvent (bordure fine), endEvent (bordure épaisse) ou intermediateEvent (bordure double)
- Pour les gateways: identifie le type selon les symboles (X pour exclusive, + pour parallel, O pour inclusive, symbole événement pour eventBased) ou utilise 'gateway' générique si indéterminé

IMPORTANT: Pour chaque élément, estime les coordonnées (x, y) et dimensions (width, height) basées sur leur position visuelle dans l'image:
- Analyse la disposition spatiale de l'image
- Les positions doivent refléter la disposition réelle dans l'image
- Les dimensions doivent être proportionnelles à la taille visuelle des éléments
- Assure-toi que le flux va de gauche à droite (startEvent à gauche, endEvent à droite)

IMPORTANT: Identifie toutes les connexions/flèches visibles dans l'image:
- Analyse les flèches qui relient les éléments entre eux
- Crée des edges pour chaque connexion visible dans l'image
- Utilise les IDs temporaires des nœuds pour référencer source et target
- Pour les gateways avec plusieurs branches sortantes, identifie toutes les connexions et ajoute des labels de condition si visibles dans l'image
- Le flux doit être logique: startEvent → première procédure/tâche → ... → endEvent

Réponds en JSON valide uniquement.`;

  return { system: systemPrompt, user: userPrompt };
}

