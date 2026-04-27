/**
 * Hook pour gérer la résolution du cube
 */

import { useCallback } from "react";
import { useCubeStore } from "../store/cubeStore";
import type { SolveMethod } from "../types/cube";
import { validateCube } from "../engine/cube/validator";

export function useSolver() {
  const cubeState = useCubeStore((s) => s.cubeState);
  const steps = useCubeStore((s) => s.solveSteps);
  const currentStepIndex = useCubeStore((s) => s.currentStepIndex);
  const isPlaying = useCubeStore((s) => s.isPlaying);
  const animationSpeed = useCubeStore((s) => s.animationSpeed);
  const method = useCubeStore((s) => s.solveMethod);

  const startSolve = useCallback(
    async (solveMethod: SolveMethod) => {
      if (!validateCube(cubeState).valid) {
        return;
      }
      await useCubeStore.getState().startSolve(solveMethod);
    },
    [cubeState],
  );

  const nextStep = useCallback(() => {
    useCubeStore.getState().nextStep();
  }, []);

  const previousStep = useCallback(() => {
    useCubeStore.getState().previousStep();
  }, []);

  const togglePlay = useCallback(() => {
    useCubeStore.getState().togglePlay();
  }, []);

  const setSpeed = useCallback((speed: number) => {
    useCubeStore.getState().setSpeed(speed);
  }, []);

  const setCurrentStep = useCallback((index: number) => {
    useCubeStore.getState().setCurrentStep(index);
  }, []);

  const getProgress = () => {
    if (steps.length === 0) return 0;
    return ((currentStepIndex + 1) / steps.length) * 100;
  };

  return {
    steps,
    currentStepIndex,
    isPlaying,
    animationSpeed,
    method,
    startSolve,
    nextStep,
    previousStep,
    togglePlay,
    setSpeed,
    setCurrentStep,
    getProgress,
  };
}
