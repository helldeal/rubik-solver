/**
 * Carte d'une étape de résolution
 */

import React from "react";
import type { SolveStep } from "../../types/cube";

interface StepCardProps {
  step: SolveStep;
  isActive: boolean;
  isCompleted: boolean;
  onClick?: () => void;
}

const StepCard: React.FC<StepCardProps> = ({
  step,
  isActive,
  isCompleted,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 border-b cursor-pointer transition ${
        isActive
          ? "bg-blue-100 border-l-4 border-l-blue-600"
          : isCompleted
            ? "bg-gray-50 opacity-60"
            : "bg-white hover:bg-gray-50"
      }`}
    >
      {/* Titre */}
      <h3 className={`font-semibold mb-2 ${isActive ? "text-blue-700" : ""}`}>
        {step.phaseLabel}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-3">{step.description}</p>

      {/* Mouvements */}
      <div className="flex flex-wrap gap-1">
        {step.moves.map((move, idx) => (
          <span
            key={idx}
            className="px-2 py-1 bg-gray-200 text-xs rounded font-mono hover:bg-gray-300"
          >
            {move}
          </span>
        ))}
      </div>

      {/* Indicateur de statut */}
      <div className="mt-2 text-xs text-gray-500">
        {isCompleted && "✓ Complétée"}
        {isActive && "→ Étape courante"}
        {!isCompleted && !isActive && "À venir"}
      </div>
    </div>
  );
};

export default StepCard;
