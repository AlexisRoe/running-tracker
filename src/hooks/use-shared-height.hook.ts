import { useCallback, useState } from "react";

/**
 * Keeps a set of independently-measured siblings at a shared height. Each item
 * reports its own natural height via the returned `report(index, height)`
 * callback, and the hook hands back the tallest (never below `minHeight`) so all
 * items can be sized to match — useful for fixed-height cards in a grid that
 * would otherwise render at different heights.
 */
export function useSharedHeight(count: number, minHeight: number) {
  const [heights, setHeights] = useState<number[]>(() => new Array(count).fill(0));

  const report = useCallback((index: number, measured: number) => {
    setHeights((prev) => (prev[index] === measured ? prev : prev.with(index, measured)));
  }, []);

  return { height: Math.max(...heights, minHeight), report };
}
