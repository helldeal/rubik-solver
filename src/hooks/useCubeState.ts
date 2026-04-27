/**
 * Hook pour gérer l'état du cube
 */

import { useCallback } from "react";
import { useCubeStore } from "../store/cubeStore";
import { CubeModel } from "../engine/cube/CubeModel";
import { validateCube } from "../engine/cube/validator";
import type { MoveNotation, CubeState } from "../types/cube";

export function useCubeState() {
  const state = useCubeStore((s) => s.cubeState);
  const hasCustomComposition = useCubeStore((s) => s.hasCustomComposition);
  const moveCount = useCubeStore((s) => s.moveCount);
  const isAnimating = useCubeStore((s) => s.isAnimating);
  const currentMove = useCubeStore((s) => s.currentMove);

  const applyMove = useCallback((move: MoveNotation) => {
    useCubeStore.getState().applyMove(move);
  }, []);

  const reset = useCallback(() => {
    useCubeStore.getState().resetCube();
  }, []);

  const scramble = useCallback((numMoves: number = 20) => {
    useCubeStore.getState().scrambleCube(numMoves);
  }, []);

  const setCustomState = useCallback((newState: CubeState) => {
    const validation = validateCube(newState);
    if (validation.valid) {
      useCubeStore.getState().setCubeState(newState);
      return null;
    }
    return validation.error;
  }, []);

  const isSolved = useCallback(() => {
    const model = new CubeModel(state);
    return model.isSolved();
  }, [state]);

  return {
    state,
    moveCount,
    isAnimating,
    currentMove,
    hasCustomComposition,
    applyMove,
    reset,
    scramble,
    setCustomState,
    isSolved,
  };
}
