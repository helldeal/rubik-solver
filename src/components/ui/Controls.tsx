/**
 * Contrôles principaux du cube
 * Boutons: Random, Reset, Solve, Play/Pause
 */

import React from "react";
import { useCubeState } from "../../hooks/useCubeState";
import { useSolver } from "../../hooks/useSolver";

const Controls: React.FC = () => {
  const { scramble, reset, isSolved } = useCubeState();
  const { startSolve, togglePlay, isPlaying, method, steps } = useSolver();
  const hasSolveCycle = steps.length > 0;

  return (
    <div className="flex flex-wrap gap-3 p-4 bg-gray-100 rounded-lg">
      {/* Bouton Mélanger */}
      <button
        onClick={() => scramble(20)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        title="Générer un mélange aléatoire"
      >
        🔀 Mélanger
      </button>

      {/* Bouton Reset */}
      <button
        onClick={reset}
        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        title="Réinitialiser le cube"
      >
        ↺ Réinitialiser
      </button>

      {/* Bouton Résoudre */}
      <button
        onClick={() => startSolve(method)}
        disabled={isSolved() || hasSolveCycle}
        className={`px-4 py-2 rounded text-white transition ${
          isSolved()
            ? "bg-green-600 hover:bg-green-700"
            : hasSolveCycle
              ? "bg-orange-400 cursor-not-allowed"
              : "bg-orange-600 hover:bg-orange-700"
        }`}
        title={
          hasSolveCycle
            ? "Un cycle de résolution existe déjà"
            : "Démarrer la résolution"
        }
      >
        {isSolved() ? "✓ Résolu" : hasSolveCycle ? "Cycle prêt" : "🎯 Résoudre"}
      </button>

      {/* Bouton Play/Pause */}
      <button
        onClick={togglePlay}
        className={`px-4 py-2 rounded text-white transition ${
          isPlaying
            ? "bg-red-600 hover:bg-red-700"
            : "bg-green-600 hover:bg-green-700"
        }`}
        title={isPlaying ? "Pause" : "Lecture"}
      >
        {isPlaying ? "⏸ Pause" : "▶ Lecture"}
      </button>
    </div>
  );
};

export default Controls;
