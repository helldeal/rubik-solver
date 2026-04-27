/**
 * Hook pour gérer l'historique Undo/Redo
 */

import { useCallback } from "react";
import { useCubeStore } from "../store/cubeStore";

export function useHistory() {
  const history = useCubeStore.getState().history;
  const undoMove = useCubeStore((s) => s.undoMove);

  const undo = useCallback(() => {
    undoMove();
  }, [undoMove]);

  const canUndo = history.length > 1;

  return {
    canUndo,
    undo,
  };
}
