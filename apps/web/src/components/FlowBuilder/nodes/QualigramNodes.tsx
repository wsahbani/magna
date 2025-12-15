/**
 * Types de nœuds Qualigram pour ProcessMap (Niveau 1)
 * Implémente les types de nœuds de la méthodologie Qualigram
 */

import { memo } from 'react'
import type React from 'react'
import { Position, useNodes } from '@xyflow/react'
import { 
  Activity, 
  Settings, 
  Shield, 
  Users, 
  Building2,
  Globe,
  Link2,
  Plus
} from 'lucide-react'
import { createNode, defineNodeConfig, HANDLE_CONFIGS, COLOR_SCHEMES } from './BaseNode'

/**
 * Nœud Processus Principal - Rectangle arrondi
 * Processus opérationnels principaux
 */
export const MainProcessNode = createNode(
  defineNodeConfig({
    shape: 'custom',
    backgroundColor: 'white',
    borderColor: 'border-purple-500',
    borderWidth: 2,
    icon: <Activity className="w-5 h-5 text-purple-600" />,
    resizable: true,
    minWidth: 140,
    minHeight: 80,
    maxWidth: 500,
    maxHeight: 400,
    handles: [
      HANDLE_CONFIGS.targetLeft,
      HANDLE_CONFIGS.sourceRight,
    ],
    showLabel: true,
    labelPosition: 'inside',
    customRender: ({ data, selected, renderHandles, renderIcon, renderLabel, width, height }) => {
      const selectedClass = selected ? 'ring-4 ring-orange-400 ring-opacity-50 shadow-lg' : 'shadow'
      const hasLink = !!data?.linkedProcessId
      
      const inlineStyle: any = {
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      }
      if (data?.style?.backgroundColor) inlineStyle.backgroundColor = data.style.backgroundColor
      if (data?.style?.color) inlineStyle.color = data.style.color
      
      return (
        <div
          className={`relative bg-white border-2 border-purple-500 rounded-lg px-5 py-4 min-w-[140px] min-h-[80px] flex flex-col items-center justify-center w-full h-full ${selectedClass} transition-all`}
          style={inlineStyle}
        >
          {renderHandles()}
          {hasLink && (
            <div className="absolute top-1 right-1 bg-orange-500 rounded-full p-1 shadow-sm">
              <Link2 className="w-3 h-3 text-white" />
            </div>
          )}
          <div className="flex items-center gap-2 mb-2">
            {renderIcon()}
          </div>
          {renderLabel()}
        </div>
      )
    },
  })
)

MainProcessNode.displayName = 'MainProcessNode'

/**
 * Nœud Processus Support - Rectangle en pointillés
 * Finance, RH, IT, etc.
 */
export const SupportProcessNode = createNode(
  defineNodeConfig({
    shape: 'custom',
    backgroundColor: 'white',
    borderColor: 'border-blue-500',
    borderWidth: 2,
    icon: <Settings className="w-5 h-5 text-blue-600" />,
    resizable: true,
    minWidth: 140,
    minHeight: 80,
    maxWidth: 500,
    maxHeight: 400,
    handles: [
      HANDLE_CONFIGS.targetLeft,
      HANDLE_CONFIGS.sourceRight,
    ],
    showLabel: true,
    labelPosition: 'inside',
    customRender: ({ data, selected, renderHandles, renderIcon, renderLabel, width, height }) => {
      const selectedClass = selected ? 'ring-4 ring-orange-400 ring-opacity-50 shadow-lg' : 'shadow'
      const hasLink = !!data?.linkedProcessId
      
      const inlineStyle: any = {
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      }
      if (data?.style?.backgroundColor) inlineStyle.backgroundColor = data.style.backgroundColor
      if (data?.style?.color) inlineStyle.color = data.style.color
      
      return (
        <div
          className={`relative bg-white border-2 border-blue-500 border-dashed rounded-lg px-5 py-4 min-w-[140px] min-h-[80px] flex flex-col items-center justify-center ${selectedClass} transition-all w-full h-full`}
          style={inlineStyle}
        >
          {renderHandles()}
          {hasLink && (
            <div className="absolute top-1 right-1 bg-orange-500 rounded-full p-1 shadow-sm">
              <Link2 className="w-3 h-3 text-white" />
            </div>
          )}
          <div className="flex items-center gap-2 mb-2">
            {renderIcon()}
          </div>
          {renderLabel()}
        </div>
      )
    },
  })
)

SupportProcessNode.displayName = 'SupportProcessNode'

/**
 * Nœud Processus Management - Hexagone
 * Stratégie et gouvernance
 */
export const ManagementProcessNode = createNode(
  defineNodeConfig({
    shape: 'custom',
    backgroundColor: 'white',
    borderColor: 'border-purple-500',
    borderWidth: 2,
    icon: <Shield className="w-5 h-5 text-purple-600" />,
    resizable: true,
    minWidth: 120,
    minHeight: 120,
    maxWidth: 400,
    maxHeight: 400,
    handles: [
      HANDLE_CONFIGS.targetLeft,
      HANDLE_CONFIGS.sourceRight,
      { type: 'target', position: Position.Top },
      { type: 'source', position: Position.Bottom },
    ],
    showLabel: true,
    labelPosition: 'inside',
    customRender: ({ data, selected, renderHandles, renderIcon, renderLabel, width, height }) => {
      const selectedClass = selected ? 'ring-4 ring-orange-400 ring-opacity-50 shadow-lg' : 'shadow'
      const hasLink = !!data?.linkedProcessId
      
      const inlineStyle: any = {
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      }
      if (data?.style?.backgroundColor) inlineStyle.backgroundColor = data.style.backgroundColor
      if (data?.style?.color) inlineStyle.color = data.style.color
      
      return (
        <div
          className={`relative min-w-[120px] min-h-[120px] flex flex-col items-center justify-center w-full h-full ${selectedClass} transition-all`}
          style={inlineStyle}
        >
          {renderHandles()}
          {hasLink && (
            <div className="absolute top-1 right-1 bg-orange-500 rounded-full p-1 shadow-sm z-20">
              <Link2 className="w-3 h-3 text-white" />
            </div>
          )}
          {/* Hexagon shape using CSS clip-path */}
          <div
            className="absolute inset-0 border-2 border-purple-500 bg-white"
            style={{
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
            }}
          />
          <div className="relative z-10 flex flex-col items-center justify-center px-4 py-2 w-full h-full">
            <div className="mb-2">{renderIcon()}</div>
            {renderLabel()}
          </div>
        </div>
      )
    },
  })
)

ManagementProcessNode.displayName = 'ManagementProcessNode'

/**
 * Nœud Groupe de Domaine - Grand conteneur
 * Organiser les processus
 */
export const DomainGroupNode = createNode(
  defineNodeConfig({
    shape: 'custom',
    backgroundColor: 'bg-gray-50',
    borderColor: 'border-gray-400',
    borderWidth: 2,
    icon: <Building2 className="w-5 h-5 text-gray-600" />,
    resizable: true,
    minWidth: 200,
    minHeight: 150,
    maxWidth: 800,
    maxHeight: 600,
    isContainer: true, // This node can contain other nodes as children
    handles: [
      HANDLE_CONFIGS.targetLeft,
      HANDLE_CONFIGS.sourceRight,
    ],
    showLabel: true,
    labelPosition: 'inside',
    customRender: ({ data, selected, renderHandles, renderIcon, renderLabel, width, height, id }: any) => {
      // DomainGroupNodeWithPlus is a wrapper component that uses useNodes hook
      return <DomainGroupNodeWithPlus 
        data={data} 
        selected={selected} 
        renderHandles={renderHandles} 
        renderIcon={renderIcon} 
        renderLabel={renderLabel} 
        width={width} 
        height={height}
        id={id}
      />
    },
  })
)

DomainGroupNode.displayName = 'DomainGroupNode'

/**
 * Wrapper component for DomainGroupNode that uses useNodes hook
 * This allows us to detect children and display the plus button
 */
const DomainGroupNodeWithPlus = memo(({ 
  data, 
  selected, 
  renderHandles, 
  renderIcon, 
  renderLabel, 
  width, 
  height,
  id 
}: {
  data: any
  selected: boolean
  renderHandles: () => React.ReactNode
  renderIcon: () => React.ReactNode
  renderLabel: () => React.ReactNode
  width?: number | null
  height?: number | null
  id: string
}) => {
  const allNodes = useNodes()
  const readOnly = data?.readOnly || false
  const onAddMainProcess = data?.onAddMainProcess

  // Filter children nodes (nodes with this group as parent)
  const children = allNodes.filter((n) => (n as any).parentId === id)

  const selectedClass = selected ? 'ring-4 ring-orange-400 ring-opacity-50 shadow-lg' : 'shadow-md'
  
  const inlineStyle: any = {
    width: width ? `${width}px` : undefined,
    height: height ? `${height}px` : undefined,
  }
  if (data?.style?.backgroundColor) inlineStyle.backgroundColor = data.style.backgroundColor
  if (data?.style?.color) inlineStyle.color = data.style.color

  const isEmpty = children.length === 0
  const showPlusButton = !readOnly && onAddMainProcess

  return (
    <div
      className={`bg-gray-50 border-2 border-gray-400 border-dashed rounded-xl px-6 py-5 min-w-[200px] min-h-[150px] flex flex-col w-full h-full ${selectedClass} transition-all relative`}
      style={inlineStyle}
    >
      {renderHandles()}
      <div className="flex items-center gap-2 mb-3 border-b border-gray-300 pb-2">
        {renderIcon()}
        {renderLabel()}
      </div>
      {/* Conteneur pour les processus enfants */}
      <div className="flex-1 flex items-center justify-center text-gray-400 text-xs relative">
        {isEmpty && !showPlusButton && (data?.description || 'Glissez des processus ici')}
      </div>
      
      {/* Plus button - center when empty, right when has children */}
      {showPlusButton && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onAddMainProcess?.(id)
          }}
          className={`absolute z-10 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-2 shadow-lg transition-all hover:scale-110 pointer-events-auto ${
            isEmpty 
              ? 'left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2' 
              : 'right-3 top-1/2 transform -translate-y-1/2'
          }`}
          title="Ajouter un processus principal"
        >
          <Plus className="w-5 h-5" />
        </button>
      )}
    </div>
  )
})

DomainGroupNodeWithPlus.displayName = 'DomainGroupNodeWithPlus'

/**
 * Nœud Acteur/Département - Forme pill
 * Qui est responsable
 */
export const ActorDepartmentNode = createNode(
  defineNodeConfig({
    shape: 'custom',
    backgroundColor: 'white',
    borderColor: 'border-green-500',
    borderWidth: 2,
    icon: <Users className="w-5 h-5 text-green-600" />,
    resizable: true,
    minWidth: 120,
    minHeight: 50,
    maxWidth: 300,
    maxHeight: 80,
    handles: [
      HANDLE_CONFIGS.targetLeft,
      HANDLE_CONFIGS.sourceRight,
    ],
    showLabel: true,
    labelPosition: 'inside',
    customRender: ({ data, selected, renderHandles, renderIcon, renderLabel, width, height }) => {
      const selectedClass = selected ? 'ring-4 ring-orange-400 ring-opacity-50 shadow-lg' : 'shadow'
      
      const inlineStyle: any = {
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      }
      if (data?.style?.backgroundColor) inlineStyle.backgroundColor = data.style.backgroundColor
      if (data?.style?.color) inlineStyle.color = data.style.color
      
      return (
        <div
          className={`bg-white border-2 border-green-500 rounded-full px-6 py-3 min-w-[120px] min-h-[50px] flex items-center justify-center gap-2 w-full h-full ${selectedClass} transition-all`}
          style={inlineStyle}
        >
          {renderHandles()}
          {renderIcon()}
          {renderLabel()}
        </div>
      )
    },
  })
)

ActorDepartmentNode.displayName = 'ActorDepartmentNode'

/**
 * Nœud Entité Externe - Parallélogramme
 * Client / Fournisseur
 */
export const ExternalEntityNode = createNode(
  defineNodeConfig({
    shape: 'custom',
    backgroundColor: 'white',
    borderColor: 'border-orange-500',
    borderWidth: 2,
    icon: <Globe className="w-5 h-5 text-orange-600" />,
    resizable: true,
    minWidth: 140,
    minHeight: 80,
    maxWidth: 400,
    maxHeight: 200,
    handles: [
      HANDLE_CONFIGS.targetLeft,
      HANDLE_CONFIGS.sourceRight,
    ],
    showLabel: true,
    labelPosition: 'inside',
    customRender: ({ data, selected, renderHandles, renderIcon, renderLabel, width, height }) => {
      const selectedClass = selected ? 'ring-4 ring-orange-400 ring-opacity-50 shadow-lg' : 'shadow'
      
      const inlineStyle: any = {
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      }
      if (data?.style?.backgroundColor) inlineStyle.backgroundColor = data.style.backgroundColor
      if (data?.style?.color) inlineStyle.color = data.style.color
      
      return (
        <div
          className={`relative min-w-[140px] min-h-[80px] flex items-center justify-center w-full h-full ${selectedClass} transition-all`}
          style={inlineStyle}
        >
          {renderHandles()}
          {/* Forme parallélogramme utilisant la transformation CSS */}
          <div
            className="absolute inset-0 border-2 border-orange-500 bg-white flex items-center justify-center gap-2 px-5 py-4"
            style={{
              transform: 'skewX(-15deg)',
            }}
          >
            <div style={{ transform: 'skewX(15deg)' }} className="flex items-center gap-2">
              {renderIcon()}
              {renderLabel()}
            </div>
          </div>
        </div>
      )
    },
  })
)

ExternalEntityNode.displayName = 'ExternalEntityNode'

