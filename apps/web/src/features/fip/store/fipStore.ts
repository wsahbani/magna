import { create } from 'zustand';
import {
  ProcessIdentityCard,
  CreateFipDto,
  UpdateFipDto,
} from '../types/fip.types';
import { fipApi } from '../../../services/fipApi';

interface FipState {
  // State
  fips: Record<string, ProcessIdentityCard>;
  currentFipId: string | null;
  isLoading: boolean;
  error: string | null;

  // FIP actions
  fetchFip: (fipId: string) => Promise<void>;
  fetchFipByProcess: (processId: string) => Promise<void>;
  createFip: (data: CreateFipDto) => Promise<ProcessIdentityCard>;
  updateFip: (fipId: string, data: UpdateFipDto) => Promise<void>;
  deleteFip: (fipId: string) => Promise<void>;
  setCurrentFip: (fipId: string | null) => void;

  // Utility actions
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  fips: {},
  currentFipId: null,
  isLoading: false,
  error: null,
};

export const useFipStore = create<FipState>((set) => ({
  ...initialState,

  // FIP actions
  fetchFip: async (fipId) => {
    set({ isLoading: true, error: null });
    try {
      const fip = await fipApi.getFipById(fipId);
      set((state) => ({
        fips: { ...state.fips, [fipId]: fip },
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchFipByProcess: async (processId) => {
    set({ isLoading: true, error: null });
    try {
      const fip = await fipApi.getFipByProcessId(processId);
      if (fip) {
        set((state) => ({
          fips: { ...state.fips, [fip.fip_id]: fip },
          isLoading: false,
        }));
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createFip: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const fip = await fipApi.createFip(data);
      set((state) => ({
        fips: { ...state.fips, [fip.fip_id]: fip },
        isLoading: false,
      }));
      return fip;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateFip: async (fipId, data) => {
    set({ isLoading: true, error: null });
    try {
      const fip = await fipApi.updateFip(fipId, data);
      set((state) => ({
        fips: { ...state.fips, [fipId]: fip },
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteFip: async (fipId) => {
    set({ isLoading: true, error: null });
    try {
      await fipApi.deleteFip(fipId);
      set((state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [fipId]: _, ...remainingFips } = state.fips;
        return {
          fips: remainingFips,
          currentFipId: state.currentFipId === fipId ? null : state.currentFipId,
          isLoading: false,
        };
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  setCurrentFip: (fipId) => {
    set({ currentFipId: fipId });
  },

  // Utility actions
  clearError: () => set({ error: null }),
  reset: () => set(initialState),
}));

