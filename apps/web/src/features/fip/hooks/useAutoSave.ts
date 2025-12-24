import React, { useEffect, useRef, useCallback, useState } from 'react';
import { UpdateFipDto } from '../types/fip.types';

interface UseAutoSaveOptions {
  data: UpdateFipDto;
  onSave: (data: UpdateFipDto) => Promise<void>;
  debounceMs?: number;
  enabled?: boolean;
}

interface UseAutoSaveReturn {
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  saveNow: () => Promise<void>;
}

/**
 * Hook pour la sauvegarde automatique avec debounce
 * Sauvegarde automatiquement les modifications après un délai d'inactivité
 */
export function useAutoSave({
  data,
  onSave,
  debounceMs = 2000,
  enabled = true,
}: UseAutoSaveOptions): UseAutoSaveReturn {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<string>('');
  const isInitialMount = useRef(true);

  // Comparer les données pour détecter les changements
  const dataString = JSON.stringify(data);

  // Détecter les changements
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousDataRef.current = dataString;
      return;
    }

    if (dataString !== previousDataRef.current) {
      setHasUnsavedChanges(true);
      previousDataRef.current = dataString;
    }
  }, [dataString]);

  // Fonction de sauvegarde
  const saveNow = useCallback(async () => {
    if (!enabled || isSaving) return;

    setIsSaving(true);
    try {
      await onSave(data);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Auto-save failed:', error);
      // Ne pas réinitialiser hasUnsavedChanges en cas d'erreur
    } finally {
      setIsSaving(false);
    }
  }, [data, onSave, enabled, isSaving]);

  // Auto-save avec debounce
  useEffect(() => {
    if (!enabled || !hasUnsavedChanges || isSaving) return;

    // Annuler le timeout précédent
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Créer un nouveau timeout
    timeoutRef.current = setTimeout(() => {
      saveNow();
    }, debounceMs);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, hasUnsavedChanges, debounceMs, enabled, isSaving, saveNow]);

  // Sauvegarder avant de quitter la page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  return {
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    saveNow,
  };
}

