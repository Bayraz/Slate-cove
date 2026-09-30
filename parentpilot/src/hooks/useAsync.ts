import { useCallback, useEffect, useRef, useState } from "react";

export type AsyncState<T> =
  | { status: "loading"; data?: undefined; error?: undefined }
  | { status: "success"; data: T; error?: undefined }
  | { status: "error"; data?: undefined; error: Error };

/** Runs `load` on mount and whenever `reload` is called. Ignores results from stale runs. */
export function useAsync<T>(load: () => Promise<T>, deps: unknown[]): AsyncState<T> & { reload: () => void } {
  const [state, setState] = useState<AsyncState<T>>({ status: "loading" });
  const [tick, setTick] = useState(0);
  const loadRef = useRef(load);
  loadRef.current = load;

  useEffect(() => {
    let active = true;
    setState({ status: "loading" });
    loadRef.current().then(
      (data) => active && setState({ status: "success", data }),
      (error) => active && setState({ status: "error", error: error instanceof Error ? error : new Error(String(error)) }),
    );
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { ...state, reload } as AsyncState<T> & { reload: () => void };
}
