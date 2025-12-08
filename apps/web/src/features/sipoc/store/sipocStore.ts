import { create } from 'zustand';
import {
  SipocDiagram,
  SipocElement,
  SipocConnection,
  CreateSipocDto,
  UpdateSipocDto,
  CreateElementDto,
  UpdateElementDto,
  CreateConnectionDto,
} from '../types/sipoc.types';
import { sipocApi } from '../../../services/sipocApi';

interface SipocState {
  // State
  diagrams: Record<string, SipocDiagram>;
  elements: Record<string, SipocElement>;
  connections: Record<string, SipocConnection>;
  currentDiagramId: string | null;
  isLoading: boolean;
  error: string | null;

  // Diagram actions
  fetchDiagrams: (userId: string, filters?: { status?: string; processId?: string }) => Promise<void>;
  fetchDiagram: (sipocId: string) => Promise<void>;
  fetchDiagramByProcess: (processId: string) => Promise<void>;
  createDiagram: (data: CreateSipocDto, userId: string) => Promise<SipocDiagram>;
  updateDiagram: (sipocId: string, data: UpdateSipocDto) => Promise<void>;
  deleteDiagram: (sipocId: string) => Promise<void>;
  setCurrentDiagram: (sipocId: string | null) => void;

  // Element actions
  fetchElements: (sipocId: string) => Promise<void>;
  createElement: (data: CreateElementDto) => Promise<SipocElement>;
  updateElement: (sipocId: string, elementId: string, data: UpdateElementDto) => Promise<void>;
  deleteElement: (sipocId: string, elementId: string) => Promise<void>;
  reorderElements: (sipocId: string, elements: Array<{ id: string; position: number }>) => Promise<void>;

  // Connection actions
  fetchConnections: (sipocId: string) => Promise<void>;
  createConnection: (data: CreateConnectionDto) => Promise<SipocConnection>;
  deleteConnection: (sipocId: string, connectionId: string) => Promise<void>;

  // Utility actions
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  diagrams: {},
  elements: {},
  connections: {},
  currentDiagramId: null,
  isLoading: false,
  error: null,
};

export const useSipocStore = create<SipocState>((set) => ({
  ...initialState,

  // Diagram actions
  fetchDiagrams: async (userId, filters) => {
    set({ isLoading: true, error: null });
    try {
      const diagrams = await sipocApi.getDiagrams(userId, filters);
      const diagramsMap = diagrams.reduce((acc, diagram) => {
        acc[diagram.sipoc_id] = diagram;
        return acc;
      }, {} as Record<string, SipocDiagram>);
      set({ diagrams: diagramsMap, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchDiagram: async (sipocId) => {
    set({ isLoading: true, error: null });
    try {
      const diagram = await sipocApi.getDiagram(sipocId);
      set((state) => ({
        diagrams: { ...state.diagrams, [sipocId]: diagram },
        isLoading: false,
      }));

      // Normalize elements if included
      if (diagram.sipocElements) {
        const elementsMap = diagram.sipocElements.reduce((acc: Record<string, unknown>, element: Record<string, unknown>) => {
          acc[element.id] = element;
          return acc;
        }, {} as Record<string, SipocElement>);
        set((state) => ({
          elements: { ...state.elements, ...elementsMap },
        }));
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  fetchDiagramByProcess: async (processId : string) => {
    set({ isLoading: true, error: null });
    try {
      const diagram = await sipocApi.getDiagramByProcess(processId);
      set((state) => ({
        diagrams: { ...state.diagrams, [diagram.sipoc_id]: diagram },
        isLoading: false,
      }));

      // Normalize elements if included
      if (diagram.sipocElements) {
        const elementsMap = diagram.sipocElements.reduce((acc: Record<string, unknown>, element: Record<string, unknown>) => {
          acc[element.id] = element;
          return acc;
        }, {} as Record<string, SipocElement>);
        set((state) => ({
          elements: { ...state.elements, ...elementsMap },
        }));
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createDiagram: async (data, userId) => {
    set({ isLoading: true, error: null });
    try {
      const diagram = await sipocApi.createDiagram(data, userId);
      set((state) => ({
        diagrams: { ...state.diagrams, [diagram.sipoc_id]: diagram },
        isLoading: false,
      }));
      return diagram;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateDiagram: async (sipocId, data) => {
    set({ isLoading: true, error: null });
    try {
      const diagram = await sipocApi.updateDiagram(sipocId, data);
      set((state) => ({
        diagrams: { ...state.diagrams, [sipocId]: diagram },
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteDiagram: async (sipocId) => {
    set({ isLoading: true, error: null });
    try {
      await sipocApi.deleteDiagram(sipocId);
      set((state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [sipocId]: _, ...remainingDiagrams } = state.diagrams;
        return {
          diagrams: remainingDiagrams,
          currentDiagramId: state.currentDiagramId === sipocId ? null : state.currentDiagramId,
          isLoading: false,
        };
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  setCurrentDiagram: (sipocId) => {
    set({ currentDiagramId: sipocId });
  },

  // Element actions
  fetchElements: async (sipocId) => {
    set({ isLoading: true, error: null });
    try {
      const elements = await sipocApi.getElements(sipocId);
      const elementsMap = elements.reduce((acc, element) => {
        acc[element.id] = element;
        return acc;
      }, {} as Record<string, SipocElement>);
      set((state) => ({
        elements: { ...state.elements, ...elementsMap },
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createElement: async (data) => {
    set({ error: null });
    try {
      const element = await sipocApi.createElement(data);
      set((state) => ({
        elements: { ...state.elements, [element.id]: element },
      }));
      return element;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  updateElement: async (sipocId, elementId, data) => {
    set({ error: null });
    try {
      const element = await sipocApi.updateElement(sipocId, elementId, data);
      set((state) => ({
        elements: { ...state.elements, [elementId]: element },
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  deleteElement: async (sipocId, elementId) => {
    set({ error: null });
    try {
      await sipocApi.deleteElement(sipocId, elementId);
      set((state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [elementId]: _, ...remainingElements } = state.elements;
        return { elements: remainingElements };
      });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  reorderElements: async (sipocId, elements) => {
    set({ error: null });
    try {
      const updatedElements = await sipocApi.reorderElements(sipocId, { elements });
      const elementsMap = updatedElements.reduce((acc, element) => {
        acc[element.id] = element;
        return acc;
      }, {} as Record<string, SipocElement>);
      set((state) => ({
        elements: { ...state.elements, ...elementsMap },
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  // Connection actions
  fetchConnections: async (sipocId) => {
    set({ isLoading: true, error: null });
    try {
      const connections = await sipocApi.getConnections(sipocId);
      const connectionsMap = connections.reduce((acc, connection) => {
        acc[connection.connection_id] = connection;
        return acc;
      }, {} as Record<string, SipocConnection>);
      set((state) => ({
        connections: { ...state.connections, ...connectionsMap },
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createConnection: async (data) => {
    set({ error: null });
    try {
      const connection = await sipocApi.createConnection(data);
      set((state) => ({
        connections: { ...state.connections, [connection.connection_id]: connection },
      }));
      return connection;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  deleteConnection: async (sipocId, connectionId) => {
    set({ error: null });
    try {
      await sipocApi.deleteConnection(sipocId, connectionId);
      set((state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [connectionId]: _, ...remainingConnections } = state.connections;
        return { connections: remainingConnections };
      });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  // Utility actions
  clearError: () => set({ error: null }),
  reset: () => set(initialState),
}));
