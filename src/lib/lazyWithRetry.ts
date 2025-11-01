import { lazy } from 'react';

type LazyFactory<T extends React.ComponentType<any>> = () => Promise<{ default: T }>;

const isChunkLoadError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error ?? '');
  return (
    message.includes('ChunkLoadError') ||
    message.includes('Failed to fetch dynamically imported module') ||
    message.includes('Importing a module script failed')
  );
};

/**
 * Wrap React.lazy so that if a chunk fails to load (usually because a new
 * deployment invalidated the hash), the page refreshes once to fetch the
 * latest bundle. Prevents users from being stuck on a blank screen.
 */
export function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: LazyFactory<T>,
  storageKey?: string,
) {
  const cacheKey = `lazy-retry:${storageKey ?? factory.toString()}`;

  return lazy(async () => {
    try {
      return await factory();
    } catch (error) {
      if (typeof window !== 'undefined' && isChunkLoadError(error)) {
        const hasRetried = sessionStorage.getItem(cacheKey);
        if (!hasRetried) {
          sessionStorage.setItem(cacheKey, '1');
          window.location.reload();
        } else {
          sessionStorage.removeItem(cacheKey);
        }
      }
      throw error;
    }
  });
}
