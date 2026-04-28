/**
 * Controles principaux du cube.
 */

import React from "react";
import { useCubeState } from "../../hooks/useCubeState";
import { useSolver } from "../../hooks/useSolver";
import { validateCube } from "../../engine/cube/validator";
import { useCubeStore } from "../../store/cubeStore";

interface ControlsProps {
  onEditCube: () => void;
}

const Controls: React.FC<ControlsProps> = ({ onEditCube }) => {
  const { reset, state, hasCustomComposition } = useCubeState();
  const { togglePlay, isPlaying, method, steps, isSolving } = useSolver();
  const validation = validateCube(state);
  const hasSolveCycle = steps.length > 0;

  const confirmIfCustomComposition = (
    actionLabel: string,
    action: () => void,
  ) => {
    if (
      hasCustomComposition &&
      !window.confirm(
        `La composition du cube a ete personnalisee. Voulez-vous vraiment ${actionLabel} ?`,
      )
    ) {
      return;
    }

    action();
  };

  const handleScramble = () => {
    confirmIfCustomComposition("melanger le cube", () => {
      useCubeStore.getState().scrambleCube(20);
      void useCubeStore.getState().startSolve(method);
    });
  };

  return (
    <div className="flex flex-wrap gap-3 rounded-lg bg-gray-100 p-4">
      <button
        onClick={onEditCube}
        className="w-full rounded bg-slate-800 px-4 py-2 text-white transition hover:bg-slate-900 sm:w-auto"
        title="Modifier les couleurs du cube"
      >
        Editer le cube
      </button>

      <button
        onClick={handleScramble}
        className="w-full rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 sm:w-auto"
        title="Generer un melange aleatoire"
      >
        Melanger
      </button>

      <button
        onClick={() =>
          confirmIfCustomComposition("reinitialiser le cube", reset)
        }
        className="w-full rounded bg-gray-600 px-4 py-2 text-white transition hover:bg-gray-700 sm:w-auto"
        title="Reinitialiser le cube"
      >
        Reinitialiser
      </button>

      <button
        onClick={togglePlay}
        disabled={!hasSolveCycle || isSolving}
        className={`w-full rounded px-4 py-2 text-white transition sm:w-auto ${
          !hasSolveCycle || isSolving
            ? "cursor-not-allowed bg-gray-400"
            : isPlaying
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
        }`}
        title={
          isSolving
            ? "Resolution en calcul"
            : hasSolveCycle
            ? isPlaying
              ? "Pause"
              : "Lecture"
            : "Melange ou valide un cube custom pour generer une resolution"
        }
      >
        {isSolving ? "Calcul..." : isPlaying ? "Pause" : "Lecture"}
      </button>

      {isSolving && validation.valid && (
        <p className="w-full rounded border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
          Resolution en calcul...
        </p>
      )}

      {hasSolveCycle && !isSolving && validation.valid && (
        <p className="w-full rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Resolution prete automatiquement. Utilise Lecture ou les etapes.
        </p>
      )}

      {!validation.valid && (
        <p className="w-full rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {validation.error}
        </p>
      )}
    </div>
  );
};

export default Controls;
