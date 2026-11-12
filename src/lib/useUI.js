import { useSyncExternalStore } from 'react';
import { getSnapshot, subscribe } from './experience';

/**
 * Subscribe to a single primitive slice of the external UI store.
 * Keeping the selector primitive means only components whose value
 * actually changed re-render.
 */
export const useUISelect = (selector) => {
  const read = () => selector(getSnapshot());
  return useSyncExternalStore(subscribe, read, read);
};
