/**
 * Hook pour gérer le lecteur d'animation automatique
 */

import { useEffect, useRef, useCallback } from "react";
import { useCubeStore } from "../store/cubeStore";
import type { MoveNotation } from "../types/cube";

export function useAnimationPlayer() {
  const solveSteps = useCubeStore((s) => s.solveSteps);
  const currentStepIndex = useCubeStore((s) => s.currentStepIndex);
  const isPlaying = useCubeStore((s) => s.isPlaying);
  const animationSpeed = useCubeStore((s) => s.animationSpeed);

  const applyMove = useCubeStore((s) => s.applyMove);
  const nextStep = useCubeStore((s) => s.nextStep);
  const setAnimating = useCubeStore((s) => s.setAnimating);

  const moveQueueRef = useRef<string[]>([]);
  const currentMoveIndexRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);

  const getMoveDelay = useCallback(() => {
    const baseDelay = 450;
    return baseDelay / animationSpeed;
  }, [animationSpeed]);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Charger la séquence de mouvements de l'étape courante
  useEffect(() => {
    if (solveSteps.length > 0 && currentStepIndex < solveSteps.length) {
      const currentStep = solveSteps[currentStepIndex];
      moveQueueRef.current = [...currentStep.moves];
      currentMoveIndexRef.current = 0;
    }
  }, [solveSteps, currentStepIndex]);

  // Jouer la séquence automatiquement si isPlaying est true
  useEffect(() => {
    clearTimer();
    if (!isPlaying || moveQueueRef.current.length === 0) return;

    const moveDelay = Math.max(120, getMoveDelay());
    const restDelay = 60;

    const playNextMove = () => {
      if (!useCubeStore.getState().isPlaying) return;

      if (currentMoveIndexRef.current >= moveQueueRef.current.length) {
        if (currentStepIndex < solveSteps.length - 1) {
          nextStep();
        } else {
          useCubeStore.getState().togglePlay();
        }
        return;
      }

      const move = moveQueueRef.current[
        currentMoveIndexRef.current
      ] as MoveNotation;

      setAnimating(true, move);
      timeoutRef.current = window.setTimeout(() => {
        setAnimating(false);

        window.requestAnimationFrame(() => {
          applyMove(move);
          currentMoveIndexRef.current += 1;
          timeoutRef.current = window.setTimeout(playNextMove, restDelay);
        });
      }, moveDelay);
    };

    playNextMove();

    return () => {
      clearTimer();
      setAnimating(false);
    };
  }, [
    isPlaying,
    currentStepIndex,
    animationSpeed,
    applyMove,
    nextStep,
    solveSteps.length,
    setAnimating,
    clearTimer,
    getMoveDelay,
  ]);
}
