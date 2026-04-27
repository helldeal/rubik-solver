/**
 * Slider de vitesse d'animation
 */

import React from "react";
import { useSolver } from "../../hooks/useSolver";

const SpeedSlider: React.FC = () => {
  const { animationSpeed, setSpeed } = useSolver();

  const speeds = [0.25, 0.5, 1, 2, 4];
  const speedLabels: Record<number, string> = {
    0.25: "0.25x",
    0.5: "0.5x",
    1: "1x (Normal)",
    2: "2x",
    4: "4x",
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
      <label className="text-sm font-semibold">Vitesse d'animation:</label>
      <div className="flex gap-2">
        {speeds.map((speed) => (
          <button
            key={speed}
            onClick={() => setSpeed(speed)}
            className={`px-3 py-1 rounded text-sm transition ${
              animationSpeed === speed
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-800 hover:bg-gray-400"
            }`}
          >
            {speedLabels[speed]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SpeedSlider;
