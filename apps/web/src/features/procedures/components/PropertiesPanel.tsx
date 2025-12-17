import { useState } from 'react'
import { Heading3, BodySmall } from '@repo/ui'
import { Input } from '@repo/ui/components/ui/input'
import { Textarea } from '@repo/ui/components/ui/textarea'
import { Label } from '@repo/ui/components/ui/label'
import { Node, Edge } from '@xyflow/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs'
import type { QualigramEdgeType } from '../types/procedure.types'

interface PropertiesPanelProps {
  selectedNode: Node | null
  selectedEdge: Edge | null
  onNodeUpdate: (nodeId: string, data: Partial<Node['data']>) => void
  onEdgeUpdate: (edgeId: string, data: Partial<{ label?: string; condition?: string; type?: QualigramEdgeType; data?: any }>) => void
}

export function PropertiesPanel({
  selectedNode,
  selectedEdge,
  onNodeUpdate,
  onEdgeUpdate,
}: PropertiesPanelProps) {
  const [nodeData, setNodeData] = useState(
    selectedNode?.data || {},
  )

  if (!selectedNode && !selectedEdge) {
    return (
      <div className="p-4 text-center text-gray-500">
        <BodySmall>Sélectionnez un nœud ou une arête pour voir ses propriétés</BodySmall>
      </div>
    )
  }

  if (selectedNode) {
    return (
      <div className="p-4 space-y-4 overflow-y-auto">
        <Heading3 className="text-sm font-semibold">Propriétés du nœud</Heading3>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="raci">RACI</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div>
              <Label>Label</Label>
              <Input
                value={typeof nodeData.label === 'string' ? nodeData.label : ''}
                onChange={(e) => {
                  const newData = { ...nodeData, label: e.target.value }
                  setNodeData(newData)
                  onNodeUpdate(selectedNode.id, newData)
                }}
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={typeof nodeData.description === 'string' ? nodeData.description : ''}
                onChange={(e) => {
                  const newData = { ...nodeData, description: e.target.value }
                  setNodeData(newData)
                  onNodeUpdate(selectedNode.id, newData)
                }}
                rows={3}
              />
            </div>

            <div>
              <Label>Type</Label>
              <Input value={typeof nodeData.type === 'string' ? nodeData.type : ''} disabled />
            </div>

            {nodeData.duration !== undefined && (
              <div>
                <Label>Durée (minutes)</Label>
                <Input
                  type="number"
                  value={typeof nodeData.duration === 'number' ? nodeData.duration : ''}
                  onChange={(e) => {
                    const newData = {
                      ...nodeData,
                      duration: parseInt(e.target.value) || 0,
                    }
                    setNodeData(newData)
                    onNodeUpdate(selectedNode.id, newData)
                  }}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="raci" className="space-y-4">
            <div>
              <Label>Responsible (R)</Label>
              <Input
                value={typeof nodeData.responsible === 'string' ? nodeData.responsible : ''}
                onChange={(e) => {
                  const newData = { ...nodeData, responsible: e.target.value }
                  setNodeData(newData)
                  onNodeUpdate(selectedNode.id, newData)
                }}
                placeholder="Acteur responsable"
              />
            </div>

            <div>
              <Label>Accountable (A)</Label>
              <Input
                value={typeof nodeData.accountable === 'string' ? nodeData.accountable : ''}
                onChange={(e) => {
                  const newData = { ...nodeData, accountable: e.target.value }
                  setNodeData(newData)
                  onNodeUpdate(selectedNode.id, newData)
                }}
                placeholder="Acteur imputable"
              />
            </div>

            <div>
              <Label>Consulted (C)</Label>
              <Input
                value={typeof nodeData.consulted === 'string' ? nodeData.consulted : ''}
                onChange={(e) => {
                  const newData = { ...nodeData, consulted: e.target.value }
                  setNodeData(newData)
                  onNodeUpdate(selectedNode.id, newData)
                }}
                placeholder="Acteur consulté"
              />
            </div>

            <div>
              <Label>Informed (I)</Label>
              <Input
                value={typeof nodeData.informed === 'string' ? nodeData.informed : ''}
                onChange={(e) => {
                  const newData = { ...nodeData, informed: e.target.value }
                  setNodeData(newData)
                  onNodeUpdate(selectedNode.id, newData)
                }}
                placeholder="Acteur informé"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  if (selectedEdge) {
    return (
      <div className="p-4 space-y-4 overflow-y-auto">
        <Heading3 className="text-sm font-semibold">Propriétés de l'arête</Heading3>

        <div>
          <Label>Label</Label>
          <Input
            value={typeof selectedEdge.label === 'string' ? selectedEdge.label : ''}
            onChange={(e) => {
              onEdgeUpdate(selectedEdge.id, { label: e.target.value })
            }}
          />
        </div>

        <div>
          <Label>Condition</Label>
          <Textarea
            value={typeof selectedEdge.data?.condition === 'string' ? selectedEdge.data.condition : ''}
            onChange={(e) => {
              onEdgeUpdate(selectedEdge.id, {
                data: { ...selectedEdge.data, condition: e.target.value },
              })
            }}
            placeholder="Condition pour cette arête..."
            rows={3}
          />
        </div>

        <div>
          <Label>Type</Label>
          <Input value={typeof selectedEdge.data?.type === 'string' ? selectedEdge.data.type : 'SEQUENCE'} disabled />
        </div>
      </div>
    )
  }

  return null
}

