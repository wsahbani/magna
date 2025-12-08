/**
 * useAutoSave Hook
 * Provides debounced auto-save functionality
 */

import { useEffect, useRef, useCallback } from 'react'

interface UseAutoSaveOptions {
  delay?: number
  onSave: () => void | Promise<void>
  enabled?: boolean
}

export function useAutoSave<T>(
  value: T,
  { delay = 1000, onSave, enabled = true }: UseAutoSaveOptions,
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const previousValueRef = useRef<T>(value)

  const save = useCallback(async () => {
    if (enabled && JSON.stringify(value) !== JSON.stringify(previousValueRef.current)) {
      previousValueRef.current = value
      await onSave()
    }
  }, [value, onSave, enabled])

  useEffect(() => {
    if (!enabled) return

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      save()
    }, delay)

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [value, delay, save, enabled])

  // Save on unmount if there are unsaved changes
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (enabled && JSON.stringify(value) !== JSON.stringify(previousValueRef.current)) {
        save()
      }
    }
  }, [enabled, save])
}

