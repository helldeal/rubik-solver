/**
 * Contrôles principaux du cube
 * Boutons: Random, Reset, Solve, Play/Pause
 */

import React from "react";
import { useCubeState } from "../../hooks/useCubeState";
import { useSolver } from "../../hooks/useSolver";
import { validateCube } from "../../engine/cube/validator";

interface ControlsProps {
  onEditCube: () => void;
}

const Controls: React.FC<ControlsProps> = ({ onEditCube }) => {
  const { scramble, reset, isSolved, state, hasCustomComposition } =
    useCubeState();
  const { startSolve, togglePlay, isPlaying, method, steps } = useSolver();
  const hasSolveCycle = steps.length > 0;
  const validation = validateCube(state);
  const canSolve = validation.valid && !isSolved() && !hasSolveCycle;

  const confirmIfCustomComposition = (
    actionLabel: string,
    action: () => void,
  ) => {
    if (
      hasCustomComposition &&
      !window.confirm(
        `La composition du cube a été personnalisée. Voulez-vous vraiment ${actionLabel} ?`,
      )
    ) {
      return;
    }

    action();
  };

  return (
    <div className="flex flex-wrap gap-3 rounded-lg bg-gray-100 p-4">
      <button
        onClick={onEditCube}
        className="w-full rounded bg-slate-800 px-4 py-2 text-white transition hover:bg-slate-900 sm:w-auto"
        title="Modifier les couleurs du cube"
      >
        ✏️ Éditer le cube
      </button>

      {/* Bouton Mélanger */}
      <button
        onClick={() =>
          confirmIfCustomComposition("mélanger le cube", () => scramble(20))
        }
        className="w-full rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 sm:w-auto"
        title="Générer un mélange aléatoire"
      >
        🔀 Mélanger
      </button>

      {/* Bouton Reset */}
      <button
        onClick={() =>
          confirmIfCustomComposition("réinitialiser le cube", reset)
        }
        className="w-full rounded bg-gray-600 px-4 py-2 text-white transition hover:bg-gray-700 sm:w-auto"
        title="Réinitialiser le cube"
      >
        ↺ Réinitialiser
      </button>

      {/* Bouton Résoudre */}
      <button
        onClick={() => startSolve(method)}
        disabled={!canSolve}
        className={`px-4 py-2 rounded text-white transition ${
          isSolved()
            ? "bg-green-600 hover:bg-green-700"
            : !validation.valid
              ? "bg-red-500 cursor-not-allowed"
              : hasSolveCycle
                ? "bg-orange-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700"
        }`}
        title={
          !validation.valid
            ? (validation.error ?? "Cube invalide")
            : hasSolveCycle
              ? "Un cycle de résolution existe déjà"
              : "Démarrer la résolution"
        }
      >
        {isSolved()
          ? "✓ Résolu"
          : !validation.valid
            ? "Cube invalide"
            : hasSolveCycle
              ? "Cycle prêt"
              : "🎯 Résoudre"}
      </button>

      {/* Bouton Play/Pause */}
      <button
        onClick={togglePlay}
        className={`w-full rounded px-4 py-2 text-white transition sm:w-auto ${
          isPlaying
            ? "bg-red-600 hover:bg-red-700"
            : "bg-green-600 hover:bg-green-700"
        }`}
        title={isPlaying ? "Pause" : "Lecture"}
      >
        {isPlaying ? "⏸ Pause" : "▶ Lecture"}
      </button>

      {!validation.valid && (
        <p className="w-full rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {validation.error}
        </p>
      )}
    </div>
  );
};

export default Controls;
