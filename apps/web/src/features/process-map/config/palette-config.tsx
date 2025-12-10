/**
 * Palette Configuration System
 * SOLID Architecture for managing node palettes by level
 * 
 * Strategy Pattern: Each level has its own palette configuration
 * Open/Closed Principle: Easy to add new levels without modifying existing code
 */

import { ReactNode } from 'react';
import {
  Activity,
  Settings,
  Shield,
  Building2,
  Users,
  Globe,
  Type,
  FileText,
  Play,
  Square,
  Circle,
  Diamond,
  GitBranch,
  Zap,
  Clock,
  Mail,
  AlertCircle,
  Radio,
  X,
  ArrowUp,
  Bell,
  RefreshCw,
  User,
  Wrench,
  Code,
  FileCheck,
  Send,
  Download,
  MessageSquare,
} from 'lucide-react';

/**
 * Node definition for palette
 */
export interface PaletteNodeDefinition {
  type: string;
  label: string;
  icon: ReactNode;
  category: string;
}

/**
 * Palette configuration interface
 * Strategy interface following Dependency Inversion Principle
 */
export interface PaletteConfig {
  /**
   * Get allowed node types for this level
   */
  getAllowedNodeTypes(): string[];

  /**
   * Get all node definitions for this level
   */
  getNodeDefinitions(): PaletteNodeDefinition[];

  /**
   * Get default expanded categories
   */
  getDefaultExpandedCategories(): string[];

  /**
   * Get palette title
   */
  getTitle(): string;
}

/**
 * Level 1 Palette Configuration (ProcessMap)
 * Only allows: Process, Group, Procedure nodes
 */
export class ProcessMapPaletteConfig implements PaletteConfig {
  private readonly nodeDefinitions: PaletteNodeDefinition[] = [
    // Process Category
    {
      type: 'mainProcess',
      label: 'Processus Principal',
      icon: <Activity className="w-3 h-3 text-purple-600" />,
      category: 'Processus',
    },
    {
      type: 'supportProcess',
      label: 'Processus Support',
      icon: <Settings className="w-3 h-3 text-blue-600" />,
      category: 'Processus',
    },
    {
      type: 'managementProcess',
      label: 'Processus Management',
      icon: <Shield className="w-3 h-3 text-purple-600" />,
      category: 'Processus',
    },
    // Structure Category
    {
      type: 'domainGroup',
      label: 'Groupe de Domaine',
      icon: <Building2 className="w-3 h-3 text-gray-600" />,
      category: 'Structure',
    },
    {
      type: 'actorDepartment',
      label: 'Acteur / Département',
      icon: <Users className="w-3 h-3 text-green-600" />,
      category: 'Structure',
    },
    // External Category
    {
      type: 'externalEntity',
      label: 'Entité Externe',
      icon: <Globe className="w-3 h-3 text-orange-600" />,
      category: 'Externe',
    },
    // Text/Title Category
    {
      type: 'text',
      label: 'Texte / Titre',
      icon: <Type className="w-3 h-3 text-gray-600" />,
      category: 'Texte',
    },
  ];

  getAllowedNodeTypes(): string[] {
    return ['mainProcess', 'supportProcess', 'managementProcess', 'domainGroup', 'actorDepartment', 'externalEntity', 'text'];
  }

  getNodeDefinitions(): PaletteNodeDefinition[] {
    return this.nodeDefinitions;
  }

  getDefaultExpandedCategories(): string[] {
    return ['Processus', 'Structure', 'Externe', 'Texte'];
  }

  getTitle(): string {
    return 'Éléments disponibles';
  }
}

/**
 * Level 2 Palette Configuration (Process)
 * Allows: Procedure nodes, Tasks, Events, Gateways, etc.
 */
export class ProcessPaletteConfig implements PaletteConfig {
  private readonly nodeDefinitions: PaletteNodeDefinition[] = [
    // Procedures Category
    {
      type: 'procedure',
      label: 'Procédure',
      icon: <FileText className="w-3 h-3 text-blue-600" />,
      category: 'Procédures',
    },
    // Events Category
    {
      type: 'startEvent',
      label: 'Événement Début',
      icon: <Activity className="w-3 h-3 text-green-600" />,
      category: 'Événements',
    },
    {
      type: 'endEvent',
      label: 'Événement Fin',
      icon: <Activity className="w-3 h-3 text-red-600" />,
      category: 'Événements',
    },
    {
      type: 'intermediateEvent',
      label: 'Événement Intermédiaire',
      icon: <Activity className="w-3 h-3 text-blue-600" />,
      category: 'Événements',
    },
    {
      type: 'timerEvent',
      label: 'Événement Timer',
      icon: <Activity className="w-3 h-3 text-purple-600" />,
      category: 'Événements',
    },
    {
      type: 'messageEvent',
      label: 'Événement Message',
      icon: <Activity className="w-3 h-3 text-indigo-600" />,
      category: 'Événements',
    },
    // Tasks Category
    {
      type: 'task',
      label: 'Tâche',
      icon: <Activity className="w-3 h-3 text-orange-600" />,
      category: 'Tâches',
    },
    {
      type: 'userTask',
      label: 'Tâche Utilisateur',
      icon: <Users className="w-3 h-3 text-blue-600" />,
      category: 'Tâches',
    },
    {
      type: 'serviceTask',
      label: 'Tâche Service',
      icon: <Settings className="w-3 h-3 text-green-600" />,
      category: 'Tâches',
    },
    {
      type: 'manualTask',
      label: 'Tâche Manuelle',
      icon: <Activity className="w-3 h-3 text-gray-600" />,
      category: 'Tâches',
    },
    {
      type: 'scriptTask',
      label: 'Tâche Script',
      icon: <FileText className="w-3 h-3 text-purple-600" />,
      category: 'Tâches',
    },
    // Gateways Category
    {
      type: 'gateway',
      label: 'Passerelle',
      icon: <Activity className="w-3 h-3 text-yellow-600" />,
      category: 'Passerelles',
    },
    {
      type: 'exclusiveGateway',
      label: 'Passerelle Exclusive',
      icon: <Activity className="w-3 h-3 text-orange-600" />,
      category: 'Passerelles',
    },
    {
      type: 'parallelGateway',
      label: 'Passerelle Parallèle',
      icon: <Activity className="w-3 h-3 text-purple-600" />,
      category: 'Passerelles',
    },
    {
      type: 'inclusiveGateway',
      label: 'Passerelle Inclusive',
      icon: <Activity className="w-3 h-3 text-green-600" />,
      category: 'Passerelles',
    },
    {
      type: 'eventBasedGateway',
      label: 'Passerelle Basée sur Événement',
      icon: <Activity className="w-3 h-3 text-blue-600" />,
      category: 'Passerelles',
    },
    // Text/Title Category
    {
      type: 'text',
      label: 'Texte / Titre',
      icon: <Type className="w-3 h-3 text-gray-600" />,
      category: 'Texte',
    },
  ];

  getAllowedNodeTypes(): string[] {
    return [
      'procedure',
      'startEvent',
      'endEvent',
      'intermediateEvent',
      'timerEvent',
      'messageEvent',
      'task',
      'userTask',
      'serviceTask',
      'manualTask',
      'scriptTask',
      'gateway',
      'exclusiveGateway',
      'parallelGateway',
      'inclusiveGateway',
      'eventBasedGateway',
      'text',
    ];
  }

  getNodeDefinitions(): PaletteNodeDefinition[] {
    return this.nodeDefinitions;
  }

  getDefaultExpandedCategories(): string[] {
    return ['Procédures', 'Événements', 'Tâches', 'Passerelles', 'Texte'];
  }

  getTitle(): string {
    return 'Éléments disponibles';
  }
}

/**
 * Level 3 Palette Configuration (Procedure)
 * Allows: All BPMN elements (Start, End, Tasks, Gateways, Intermediate Events, etc.)
 */
export class ProcedurePaletteConfig implements PaletteConfig {
  private readonly nodeDefinitions: PaletteNodeDefinition[] = [
    // Events Category - Start Events
    {
      type: 'startEvent',
      label: 'Événement Début',
      icon: <Play className="w-3 h-3 text-green-600" />,
      category: 'Événements',
    },
    {
      type: 'timerStartEvent',
      label: 'Début Timer',
      icon: <Clock className="w-3 h-3 text-green-600" />,
      category: 'Événements',
    },
    {
      type: 'messageStartEvent',
      label: 'Début Message',
      icon: <Mail className="w-3 h-3 text-green-600" />,
      category: 'Événements',
    },
    {
      type: 'signalStartEvent',
      label: 'Début Signal',
      icon: <Radio className="w-3 h-3 text-green-600" />,
      category: 'Événements',
    },
    {
      type: 'errorStartEvent',
      label: 'Début Erreur',
      icon: <AlertCircle className="w-3 h-3 text-green-600" />,
      category: 'Événements',
    },
    
    // Events Category - End Events
    {
      type: 'endEvent',
      label: 'Événement Fin',
      icon: <Square className="w-3 h-3 text-red-600" />,
      category: 'Événements',
    },
    {
      type: 'messageEndEvent',
      label: 'Fin Message',
      icon: <Send className="w-3 h-3 text-red-600" />,
      category: 'Événements',
    },
    {
      type: 'errorEndEvent',
      label: 'Fin Erreur',
      icon: <AlertCircle className="w-3 h-3 text-red-600" />,
      category: 'Événements',
    },
    {
      type: 'cancelEndEvent',
      label: 'Fin Annulation',
      icon: <X className="w-3 h-3 text-red-600" />,
      category: 'Événements',
    },
    {
      type: 'signalEndEvent',
      label: 'Fin Signal',
      icon: <Radio className="w-3 h-3 text-red-600" />,
      category: 'Événements',
    },
    {
      type: 'terminateEndEvent',
      label: 'Fin Terminaison',
      icon: <Square className="w-3 h-3 text-red-600" />,
      category: 'Événements',
    },
    
    // Events Category - Intermediate Events
    {
      type: 'intermediateEvent',
      label: 'Événement Intermédiaire',
      icon: <Circle className="w-3 h-3 text-blue-600" />,
      category: 'Événements',
    },
    {
      type: 'timerIntermediateEvent',
      label: 'Timer Intermédiaire',
      icon: <Clock className="w-3 h-3 text-blue-600" />,
      category: 'Événements',
    },
    {
      type: 'messageIntermediateEvent',
      label: 'Message Intermédiaire',
      icon: <MessageSquare className="w-3 h-3 text-blue-600" />,
      category: 'Événements',
    },
    {
      type: 'signalIntermediateEvent',
      label: 'Signal Intermédiaire',
      icon: <Radio className="w-3 h-3 text-blue-600" />,
      category: 'Événements',
    },
    {
      type: 'errorIntermediateEvent',
      label: 'Erreur Intermédiaire',
      icon: <AlertCircle className="w-3 h-3 text-blue-600" />,
      category: 'Événements',
    },
    {
      type: 'escalationIntermediateEvent',
      label: 'Escalade Intermédiaire',
      icon: <ArrowUp className="w-3 h-3 text-blue-600" />,
      category: 'Événements',
    },
    {
      type: 'compensationIntermediateEvent',
      label: 'Compensation Intermédiaire',
      icon: <RefreshCw className="w-3 h-3 text-blue-600" />,
      category: 'Événements',
    },
    
    // Tasks Category
    {
      type: 'task',
      label: 'Tâche',
      icon: <Activity className="w-3 h-3 text-purple-600" />,
      category: 'Tâches',
    },
    {
      type: 'userTask',
      label: 'Tâche Utilisateur',
      icon: <User className="w-3 h-3 text-purple-600" />,
      category: 'Tâches',
    },
    {
      type: 'serviceTask',
      label: 'Tâche Service',
      icon: <Settings className="w-3 h-3 text-purple-600" />,
      category: 'Tâches',
    },
    {
      type: 'manualTask',
      label: 'Tâche Manuelle',
      icon: <Wrench className="w-3 h-3 text-purple-600" />,
      category: 'Tâches',
    },
    {
      type: 'scriptTask',
      label: 'Tâche Script',
      icon: <Code className="w-3 h-3 text-purple-600" />,
      category: 'Tâches',
    },
    {
      type: 'businessRuleTask',
      label: 'Tâche Règle Métier',
      icon: <FileCheck className="w-3 h-3 text-purple-600" />,
      category: 'Tâches',
    },
    {
      type: 'receiveTask',
      label: 'Tâche Réception',
      icon: <Download className="w-3 h-3 text-purple-600" />,
      category: 'Tâches',
    },
    {
      type: 'sendTask',
      label: 'Tâche Envoi',
      icon: <Send className="w-3 h-3 text-purple-600" />,
      category: 'Tâches',
    },
    
    // Gateways Category
    {
      type: 'gateway',
      label: 'Passerelle',
      icon: <Diamond className="w-3 h-3 text-orange-600" />,
      category: 'Passerelles',
    },
    {
      type: 'exclusiveGateway',
      label: 'Passerelle Exclusive (XOR)',
      icon: <Diamond className="w-3 h-3 text-orange-600" />,
      category: 'Passerelles',
    },
    {
      type: 'parallelGateway',
      label: 'Passerelle Parallèle (AND)',
      icon: <Diamond className="w-3 h-3 text-orange-600" />,
      category: 'Passerelles',
    },
    {
      type: 'inclusiveGateway',
      label: 'Passerelle Inclusive (OR)',
      icon: <Diamond className="w-3 h-3 text-orange-600" />,
      category: 'Passerelles',
    },
    {
      type: 'eventBasedGateway',
      label: 'Passerelle Basée sur Événement',
      icon: <Diamond className="w-3 h-3 text-orange-600" />,
      category: 'Passerelles',
    },
    {
      type: 'complexGateway',
      label: 'Passerelle Complexe',
      icon: <Diamond className="w-3 h-3 text-orange-600" />,
      category: 'Passerelles',
    },
    
    // Subprocess Category
    {
      type: 'subprocess',
      label: 'Sous-Processus',
      icon: <Building2 className="w-3 h-3 text-indigo-600" />,
      category: 'Sous-Processus',
    },
    {
      type: 'adHocSubprocess',
      label: 'Sous-Processus Ad-Hoc',
      icon: <GitBranch className="w-3 h-3 text-indigo-600" />,
      category: 'Sous-Processus',
    },
    {
      type: 'eventSubprocess',
      label: 'Sous-Processus Événement',
      icon: <Zap className="w-3 h-3 text-indigo-600" />,
      category: 'Sous-Processus',
    },
    
    // Text/Title Category
    {
      type: 'text',
      label: 'Texte / Titre',
      icon: <Type className="w-3 h-3 text-gray-600" />,
      category: 'Texte',
    },
  ];

  getAllowedNodeTypes(): string[] {
    return [
      // Start Events
      'startEvent', 'timerStartEvent', 'messageStartEvent', 'signalStartEvent', 'errorStartEvent',
      // End Events
      'endEvent', 'messageEndEvent', 'errorEndEvent', 'cancelEndEvent', 'signalEndEvent', 'terminateEndEvent',
      // Intermediate Events
      'intermediateEvent', 'timerIntermediateEvent', 'messageIntermediateEvent', 'signalIntermediateEvent',
      'errorIntermediateEvent', 'escalationIntermediateEvent', 'compensationIntermediateEvent',
      // Tasks
      'task', 'userTask', 'serviceTask', 'manualTask', 'scriptTask', 'businessRuleTask', 'receiveTask', 'sendTask',
      // Gateways
      'gateway', 'exclusiveGateway', 'parallelGateway', 'inclusiveGateway', 'eventBasedGateway', 'complexGateway',
      // Subprocess
      'subprocess', 'adHocSubprocess', 'eventSubprocess',
      // Text
      'text',
    ];
  }

  getNodeDefinitions(): PaletteNodeDefinition[] {
    return this.nodeDefinitions;
  }

  getDefaultExpandedCategories(): string[] {
    return ['Événements', 'Tâches', 'Passerelles', 'Sous-Processus', 'Texte'];
  }

  getTitle(): string {
    return 'Éléments BPMN disponibles';
  }
}

/**
 * Palette Configuration Factory
 * Factory Pattern for creating appropriate palette config based on level
 */
export class PaletteConfigFactory {
  /**
   * Create palette configuration based on level
   */
  static create(level: number): PaletteConfig {
    switch (level) {
      case 1:
        return new ProcessMapPaletteConfig();
      case 2:
        return new ProcessPaletteConfig();
      case 3:
        return new ProcedurePaletteConfig();
      default:
        throw new Error(`Unsupported level: ${level}`);
    }
  }

  /**
   * Create palette configuration based on entity type
   */
  static createByEntityType(entityType: 'processMap' | 'process' | 'procedure'): PaletteConfig {
    switch (entityType) {
      case 'processMap':
        return new ProcessMapPaletteConfig();
      case 'process':
        return new ProcessPaletteConfig();
      case 'procedure':
        return new ProcedurePaletteConfig();
      default:
        throw new Error(`Unsupported entity type: ${entityType}`);
    }
  }
}

