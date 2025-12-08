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
 * TODO: To be implemented when Process level is implemented
 */
export class ProcessPaletteConfig implements PaletteConfig {
  private readonly nodeDefinitions: PaletteNodeDefinition[] = [
    {
      type: 'procedure',
      label: 'Procédure',
      icon: <FileText className="w-4 h-4 text-blue-600" />,
      category: 'Procédures',
    },
    // Add more nodes for Process level when needed
  ];

  getAllowedNodeTypes(): string[] {
    return ['procedure'];
  }

  getNodeDefinitions(): PaletteNodeDefinition[] {
    return this.nodeDefinitions;
  }

  getDefaultExpandedCategories(): string[] {
    return ['Procédures'];
  }

  getTitle(): string {
    return 'Palette Process (Niveau 2)';
  }
}

/**
 * Level 3 Palette Configuration (Procedure)
 * Allows: All BPMN elements (Start, End, Tasks, Gateways, etc.)
 * TODO: To be implemented when Procedure level is implemented
 */
export class ProcedurePaletteConfig implements PaletteConfig {
  private readonly nodeDefinitions: PaletteNodeDefinition[] = [
    // Will include all BPMN elements
    // This will be populated when Procedure level is implemented
  ];

  getAllowedNodeTypes(): string[] {
    return [];
  }

  getNodeDefinitions(): PaletteNodeDefinition[] {
    return this.nodeDefinitions;
  }

  getDefaultExpandedCategories(): string[] {
    return [];
  }

  getTitle(): string {
    return 'Palette Procedure (Niveau 3)';
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

