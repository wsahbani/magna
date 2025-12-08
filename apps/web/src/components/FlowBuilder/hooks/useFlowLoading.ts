import { useEffect, useRef } from 'react'
import { Node, Edge } from '@xyflow/react'

interface LoadedFlow {
  nodes: Node[]
  edges: Edge[]
}

interface UseFlowLoadingProps {
  loadedFlow: LoadedFlow | null
  isLoaded: boolean
  setIsLoaded: (loaded: boolean) => void
  onNodesChange: (changes: Node[]) => void
  onEdgesChange: (changes: Edge[]) => void
  onLoadSuccess?: (nodes: Node[], edges: Edge[]) => void
  onLoadError?: (error: Error) => void
  loadError: Error | null
}

/**
 * Hook to handle flow data loading
 */
export function useFlowLoading({
  loadedFlow,
  isLoaded,
  setIsLoaded,
  onNodesChange,
  onEdgesChange,
  onLoadSuccess,
  onLoadError,
  loadError,
}: UseFlowLoadingProps) {
  // Use refs to store callbacks to avoid dependency issues
  const onNodesChangeRef = useRef(onNodesChange)
  const onEdgesChangeRef = useRef(onEdgesChange)
  const onLoadSuccessRef = useRef(onLoadSuccess)
  const onLoadErrorRef = useRef(onLoadError)
  
  // Update refs when callbacks change
  onNodesChangeRef.current = onNodesChange
  onEdgesChangeRef.current = onEdgesChange
  onLoadSuccessRef.current = onLoadSuccess
  onLoadErrorRef.current = onLoadError
  
  // Load flow data when processVersionId changes
  useEffect(() => {
    if (loadedFlow && !isLoaded) {
      onNodesChangeRef.current(loadedFlow.nodes)
      onEdgesChangeRef.current(loadedFlow.edges)
      setIsLoaded(true)
      onLoadSuccessRef.current?.(loadedFlow.nodes, loadedFlow.edges)
    }
  }, [loadedFlow, isLoaded, setIsLoaded])
  
  // Handle load errors
  useEffect(() => {
    if (loadError) {
      console.error('Failed to load flow:', loadError)
      onLoadErrorRef.current?.(loadError)
    }
  }, [loadError])
}
