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
      <div className="w-full rounded-lg bg-white p-6 shadow-lg">
        <p className="text-gray-500 text-center">
          Lisez une résolution pour voir les étapes
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-lg bg-white shadow-lg xl:max-h-[calc(100dvh-15rem)]">
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
      <div className="flex gap-2 border-t p-4">
        <button
          onClick={previousStep}
          disabled={currentStepIndex === 0}
          className="flex-1 rounded bg-gray-300 px-3 py-2 text-gray-800 disabled:opacity-50 hover:disabled:cursor-not-allowed"
        >
          ← Précédent
        </button>
        <button
          onClick={nextStep}
          disabled={currentStepIndex === steps.length - 1}
          className="flex-1 rounded bg-blue-600 px-3 py-2 text-white disabled:opacity-50 hover:disabled:cursor-not-allowed"
        >
          Suivant →
        </button>
      </div>
    </div>
  );
};

export default SolverPanel;
