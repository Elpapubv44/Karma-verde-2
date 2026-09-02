import { useSyncExternalStore } from "react";

let pendingRequests = 0;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

/** Shared request activity indicator. Nested/concurrent requests remain loading until all settle. */
export function setGlobalLoading(isLoading: boolean) {
  pendingRequests = Math.max(0, pendingRequests + (isLoading ? 1 : -1));
  notify();
}

export function useLoading() {
  const isLoading = useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => pendingRequests > 0,
    () => false,
  );

  return {
    isLoading,
    setLoading: setGlobalLoading,
    LoadingSpinner: () => (
      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-label="Cargando">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          className="opacity-90"
          fill="currentColor"
          d="M12 3a9 9 0 0 1 9 9h-3a6 6 0 0 0-6-6V3z"
        />
      </svg>
    ),
  };
}
