'use client';

import { useMemo, useState } from "react";

import type { DebugUseCase } from "@/domain/usecases/debug/DebugUseCase";
import { appContainer } from "@/infrastructure/ioc/container";
import { USE_CASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";

interface UseDebugState {
  result: string | null;
  error: string | null;
  loading: boolean;
  runDebug: () => Promise<void>;
}

const useDebug = (): UseDebugState => {
  const debugUseCase = useMemo(
    () => appContainer.get<DebugUseCase>(USE_CASE_TYPES.DebugUseCase),
    [],
  );
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const runDebug = async () => {
    setLoading(true);
    setError(null);

    try {
      const output = await debugUseCase.execute();
      setResult(output);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  return { result, error, loading, runDebug };
};

export { useDebug };
