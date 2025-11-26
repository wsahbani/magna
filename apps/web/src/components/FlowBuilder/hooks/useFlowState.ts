import { useState, useRef } from 'react'
import { Node, Edge, ReactFlowInstance } from '@xyflow/react'

/**
 * Hook to manage flow builder internal state
 */
export function useFlowState(nodes: Node[], edges: Edge[]) {
  const [helperLines, setHelperLines] = useState<{
    horizontal?: number
    vertical?: number
  }>({})
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const [groupCounter, setGroupCounter] = useState(1)
  const [isLoaded, setIsLoaded] = useState(false)
  
  // Refs to track nodes/edges without causing re-renders
  const nodesRef = useRef(nodes)
  const edgesRef = useRef(edges)
  
  // Update refs when props change
  nodesRef.current = nodes
  edgesRef.current = edges

  return {
    helperLines,
    setHelperLines,
    reactFlowInstance,
    setReactFlowInstance,
    groupCounter,
    setGroupCounter,
    isLoaded,
    setIsLoaded,
    nodesRef,
    edgesRef,
  }
}
