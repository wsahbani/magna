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
    flowDirection?: 'horizontal' | 'vertical';
  },
): { system: string; user: string } {
  const flowDirection = context.flowDirection || 'horizontal';
  const isHorizontal = flowDirection === 'horizontal';
  const systemPrompt = `Tu es un expert Qualigram spécialisé dans la modélisation de processus.
Tu génères des processus structurés selon la méthodologie Qualigram niveau 2 (Process).

Règles importantes:
- Un Process contient des procédures (procedure), des tâches spécialisées, des événements et des gateways
- Les procédures (procedure) sont les principales étapes du processus

Types de tâches disponibles:
- task: Tâche générique (utiliser par défaut si aucun type spécifique ne convient)
- userTask: Tâche nécessitant une intervention humaine (validation, saisie, décision, approbation, révision)
- serviceTask: Tâche automatisée appelant un service externe (API REST, web service, appel système)
- manualTask: Tâche manuelle non automatisée (impression, envoi postal, manipulation physique)
- scriptTask: Tâche exécutant un script ou calcul (transformation de données, calculs complexes, scripts)

Types d'événements disponibles:
- startEvent: Événement de début du processus (obligatoire, un seul)
- endEvent: Événement de fin du processus (obligatoire, un ou plusieurs)
- intermediateEvent: Événement intermédiaire dans le flux (notification, signal)
- timerEvent: Événement déclenché par un délai (attente, rappel, expiration, deadline)
- messageEvent: Événement déclenché par réception d'un message (email, notification, message externe)

Types de gateways disponibles:
- exclusiveGateway: Passerelle exclusive (XOR) - un seul chemin est pris selon une condition
- parallelGateway: Passerelle parallèle (AND) - tous les chemins sont pris simultanément
- inclusiveGateway: Passerelle inclusive (OR) - un ou plusieurs chemins peuvent être pris
- eventBasedGateway: Passerelle basée sur événement - le flux continue selon le premier événement reçu

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
      "type": "exclusiveGateway|parallelGateway|inclusiveGateway|eventBasedGateway",
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
      "label": "optional label for conditions"
    }
  ]
}

IMPORTANT pour les IDs:
- Chaque nœud DOIT avoir un "id" unique et descriptif (ex: "start-1", "proc-1", "task-1", "gateway-1", "end-1")
- Les IDs doivent être cohérents entre les nœuds et les edges
- Utilise des préfixes clairs: "start-", "end-", "proc-", "task-", "gateway-", "event-"

IMPORTANT pour les edges:
- Les edges connectent les nœuds dans un flux logique ${isHorizontal ? 'de gauche à droite' : 'de haut en bas'}
- startEvent → première procédure/tâche
- Connexions séquentielles entre procédures/tâches dans l'ordre logique
- Gateways:
  * exclusiveGateway: plusieurs edges sortants avec labels de condition (ex: "Si condition A", "Sinon")
  * parallelGateway: plusieurs edges sortants sans labels (tous les chemins sont pris)
  * inclusiveGateway: plusieurs edges sortants avec labels de condition (un ou plusieurs chemins)
  * eventBasedGateway: plusieurs edges sortants vers des événements (timerEvent, messageEvent)
- Dernière procédure/tâche → endEvent
- Tous les nœuds doivent être connectés (pas de nœuds orphelins)

IMPORTANT pour le positionnement des branches de gateways:
- Lorsqu'un gateway a plusieurs branches sortantes (2 ou plus), les nœuds cibles doivent être positionnés EN PARALLÈLE pour une meilleure présentation visuelle:
  * Flow HORIZONTAL: Les nœuds cibles doivent avoir la MÊME coordonnée X (position horizontale identique), mais des coordonnées Y différentes (espacées verticalement)
    - Exemple: Gateway à x=400, y=200. Branches à x=550 (identique pour toutes), y=100, y=200, y=300 (espacées verticalement)
  * Flow VERTICAL: Les nœuds cibles doivent avoir la MÊME coordonnée Y (position verticale identique), mais des coordonnées X différentes (espacées horizontalement)
    - Exemple: Gateway à x=300, y=400. Branches à y=550 (identique pour toutes), x=200, x=300, x=400 (espacées horizontalement)
- Espacement recommandé entre branches parallèles: 150-200px
- Cette disposition parallèle améliore la lisibilité et respecte les conventions BPMN

IMPORTANT pour les positions selon la direction du flow:
${isHorizontal ? `- Flow HORIZONTAL (par défaut): Les positions doivent être de gauche à droite
  * x augmente progressivement (ex: 100, 250, 400, 550, 700...)
  * y reste constant ou légèrement variable pour éviter les chevauchements (ex: 200, 200, 210, 200...)
  * ESPACEMENT MINIMAL OBLIGATOIRE entre nœuds pour éviter les chevauchements:
    - Après une procédure (width 140-180): espacement minimum = largeur procédure + 100px (ex: si width=160, prochain x = x + 160 + 100 = x + 260)
    - Après une tâche (width 120-160): espacement minimum = largeur tâche + 80px (ex: si width=140, prochain x = x + 140 + 80 = x + 220)
    - Après un événement (width 40-50): espacement minimum = taille événement + 60px (ex: si width=45, prochain x = x + 45 + 60 = x + 105)
    - Après un gateway (width 50-60): espacement minimum = taille gateway + 70px (ex: si width=55, prochain x = x + 55 + 70 = x + 125)
  * RÈGLE CRITIQUE: La position x du nœud suivant DOIT être >= position x du nœud précédent + largeur du nœud précédent + espacement minimal
  * Exemple: Si procédure à x=250 avec width=160, prochaine position x >= 250 + 160 + 100 = 510` : `- Flow VERTICAL: Les positions doivent être de haut en bas
  * y augmente progressivement (ex: 100, 250, 400, 550, 700...)
  * x reste constant ou légèrement variable pour éviter les chevauchements (ex: 300, 300, 310, 300...)
  * ESPACEMENT MINIMAL OBLIGATOIRE entre nœuds pour éviter les chevauchements:
    - Après une procédure (height 60-80): espacement minimum = hauteur procédure + 100px (ex: si height=70, prochain y = y + 70 + 100 = y + 170)
    - Après une tâche (height 50-70): espacement minimum = hauteur tâche + 80px (ex: si height=60, prochain y = y + 60 + 80 = y + 140)
    - Après un événement (height 40-50): espacement minimum = taille événement + 60px (ex: si height=45, prochain y = y + 45 + 60 = y + 105)
    - Après un gateway (height 50-60): espacement minimum = taille gateway + 70px (ex: si height=55, prochain y = y + 55 + 70 = y + 125)
  * RÈGLE CRITIQUE: La position y du nœud suivant DOIT être >= position y du nœud précédent + hauteur du nœud précédent + espacement minimal
  * Exemple: Si procédure à y=250 avec height=70, prochaine position y >= 250 + 70 + 100 = 420`}`;

  const userPrompt = `Description: "${description}"
${context.processMapName ? `ProcessMap: ${context.processMapName}` : ''}
${context.workspaceName ? `Workspace: ${context.workspaceName}` : ''}
${context.departmentName ? `Département: ${context.departmentName}` : ''}

Génère un processus avec:
1. Un titre approprié
2. Une description détaillée (2-3 phrases)
3. Exactement un événement de début (startEvent) et au moins un événement de fin (endEvent)
4. Des procédures logiques (3-8 procédures) avec positions et dimensions
5. Des tâches spécialisées si nécessaire (0-10 tâches) :
   - Utilise userTask pour les validations, approbations, saisies utilisateur
   - Utilise serviceTask pour les appels API, web services, intégrations automatisées
   - Utilise manualTask pour les actions physiques non automatisées
   - Utilise scriptTask pour les calculs, transformations de données
   - Utilise task pour les tâches génériques
6. Des événements avancés si nécessaire :
   - Utilise timerEvent pour les délais, attentes, rappels
   - Utilise messageEvent pour les réceptions de messages externes
7. Des gateways si le processus a des conditions ou des flux parallèles (0-5 gateways) :
   - Utilise exclusiveGateway pour les conditions simples (si/sinon)
   - Utilise parallelGateway pour les tâches parallèles
   - Utilise inclusiveGateway pour les chemins multiples possibles
   - Utilise eventBasedGateway pour attendre différents événements possibles
8. Les positions (x, y) et dimensions (width, height) pour chaque élément pour créer un flux logique ${isHorizontal ? 'de gauche à droite (x augmente, y constant)' : 'de haut en bas (y augmente, x constant)'}
9. Des IDs uniques pour chaque nœud (ex: "start-1", "proc-1", "task-1", "gateway-1", "end-1")
10. Des edges pour connecter tous les nœuds dans un flux logique :
    - startEvent → première procédure/tâche
    - Connexions séquentielles entre les éléments dans l'ordre logique
    - Pour les gateways exclusifs/inclusifs: ajoute des labels de condition sur les edges sortants (ex: "Si oui", "Si non", "Si condition A")
    - Pour les gateways parallèles: plusieurs edges sortants sans labels
    - Dernière procédure/tâche → endEvent
    - Assure-toi que tous les nœuds sont connectés (pas de nœuds orphelins)

Dimensions recommandées:
- Procedures: width 140-180, height 60-80
- Tasks: width 120-160, height 50-70
- Events: width 40-50, height 40-50 (cercles)
- Gateways: width 50-60, height 50-60 (losanges)

Positions recommandées selon la direction:
${isHorizontal ? `- Flow HORIZONTAL:
  * startEvent: x=100, y=200, width=45, height=45
  * Après startEvent (x=100, width=45): prochaine position x >= 100 + 45 + 60 = 205 (arrondir à 250)
  * procédures: x=250 (width=160), puis x=250+160+100=510 (width=160), puis x=510+160+100=770...
  * tâches: x=250 (width=140), puis x=250+140+80=470 (width=140), puis x=470+140+80=690...
  * gateways: x=350 (width=55), puis x=350+55+70=475 (width=55), puis x=475+55+70=600...
  * endEvent: x=position dernière procédure/tâche + largeur + 60
  * y reste constant à 200 pour tous les éléments (ou légèrement variable ±10px si nécessaire)
  * IMPORTANT: Toujours calculer la position suivante en fonction de la position + largeur + espacement minimal du nœud précédent` : `- Flow VERTICAL:
  * startEvent: x=300, y=100, width=45, height=45
  * Après startEvent (y=100, height=45): prochaine position y >= 100 + 45 + 60 = 205 (arrondir à 250)
  * procédures: y=250 (height=70), puis y=250+70+100=420 (height=70), puis y=420+70+100=590...
  * tâches: y=250 (height=60), puis y=250+60+80=390 (height=60), puis y=390+60+80=530...
  * gateways: y=350 (height=55), puis y=350+55+70=475 (height=55), puis y=475+55+70=600...
  * endEvent: y=position dernière procédure/tâche + hauteur + 60
  * x reste constant à 300 pour tous les éléments (ou légèrement variable ±10px si nécessaire)
  * IMPORTANT: Toujours calculer la position suivante en fonction de la position + hauteur + espacement minimal du nœud précédent`}

Exemples d'utilisation:
- "Valider la commande" → userTask
- "Appeler l'API de paiement" → serviceTask
- "Imprimer le bon de commande" → manualTask
- "Calculer le total avec TVA" → scriptTask
- "Attendre 24h" → timerEvent
- "Recevoir confirmation email" → messageEvent

Réponds en JSON valide uniquement.`;

  return { system: systemPrompt, user: userPrompt };
}

