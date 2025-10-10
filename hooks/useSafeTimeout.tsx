import { useEffect, useRef, useCallback } from 'react';

/**
 * A hook that provides a safe setTimeout that auto-clears on unmount
 * and prevents memory leaks
 */
export const useSafeTimeout = () => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setSafeTimeout = useCallback((callback: () => void, delay: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback();
      timeoutRef.current = null;
    }, delay);
  }, []);

  const clearSafeTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        console.debug('cleared');
      }
    };
  }, []);

  return { setSafeTimeout, clearSafeTimeout };
};