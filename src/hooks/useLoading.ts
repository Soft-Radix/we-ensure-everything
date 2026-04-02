import { useState, useCallback } from "react";

type UseLoadingReturn = {
  isLoading: boolean;
  error: Error | null;
  withLoading: <T>(fn: () => Promise<T>) => Promise<T | undefined>;
  reset: () => void;
};

export function useLoading(initialState = false): UseLoadingReturn {
  const [isLoading, setIsLoading] = useState<boolean>(initialState);
  const [error, setError] = useState<Error | null>(null);

  const withLoading = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T | undefined> => {
      setIsLoading(true);
      setError(null);
      try {
        return await fn();
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return { isLoading, error, withLoading, reset };
}
