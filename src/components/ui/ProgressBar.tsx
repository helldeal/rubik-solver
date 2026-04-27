/**
 * Barre de progression
 */

import React from "react";
import { useSolver } from "../../hooks/useSolver";

const ProgressBar: React.FC = () => {
  const { getProgress } = useSolver();
  const progress = getProgress();

  return (
    <div className="w-full bg-gray-200 rounded-lg overflow-hidden h-8">
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300 flex items-center justify-center"
        style={{ width: `${progress}%` }}
      >
        {progress > 10 && (
          <span className="text-xs font-bold text-white">
            {Math.round(progress)}%
          </span>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
