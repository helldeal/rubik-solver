/**
 * Panneau latéral de résolution
 */

import React from "react";
import { useSolver } from "../../hooks/useSolver";
import StepCard from "./StepCard";

const SolverPanel: React.FC = () => {
  const { steps, currentStepIndex, nextStep, previousStep, setCurrentStep } =
    useSolver();

  if (steps.length === 0) {
    return (
      <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-500 text-center">
          Lisez une résolution pour voir les étapes
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm bg-white rounded-lg shadow-lg overflow-hidden flex flex-col max-h-screen">
      {/* En-tête */}
      <div className="bg-blue-600 text-white p-4">
        <h2 className="text-xl font-bold">
          Étape {currentStepIndex + 1} / {steps.length}
        </h2>
      </div>

      {/* Liste des étapes */}
      <div className="flex-1 overflow-y-auto">
        {steps.map((step, idx) => (
          <StepCard
            key={step.id}
            step={step}
            isActive={idx === currentStepIndex}
            isCompleted={idx < currentStepIndex}
            onClick={() => setCurrentStep(idx)}
          />
        ))}
      </div>

      {/* Contrôles de navigation */}
      <div className="border-t p-4 flex gap-2">
        <button
          onClick={previousStep}
          disabled={currentStepIndex === 0}
          className="flex-1 px-3 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50 hover:disabled:cursor-not-allowed"
        >
          ← Précédent
        </button>
        <button
          onClick={nextStep}
          disabled={currentStepIndex === steps.length - 1}
          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:disabled:cursor-not-allowed"
        >
          Suivant →
        </button>
      </div>
    </div>
  );
};

export default SolverPanel;
