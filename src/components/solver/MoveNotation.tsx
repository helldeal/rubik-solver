/**
 * Affichage de la notation Singmaster
 */

import React from "react";
import type { MoveNotation } from "../../types/cube";

interface MoveNotationProps {
  moves: MoveNotation[];
  currentMove?: MoveNotation;
}

const MOVE_COLORS: Record<string, string> = {
  U: "bg-yellow-400",
  D: "bg-white",
  R: "bg-red-500",
  L: "bg-orange-500",
  F: "bg-green-600",
  B: "bg-blue-600",
  M: "bg-gray-400",
  E: "bg-gray-400",
  S: "bg-gray-400",
  x: "bg-purple-500",
  y: "bg-indigo-500",
  z: "bg-pink-500",
};

const MoveNotationDisplay: React.FC<MoveNotationProps> = ({
  moves,
  currentMove,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {moves.map((move, idx) => {
        const firstChar = move[0];
        const bgColor = MOVE_COLORS[firstChar] || "bg-gray-400";
        const isCurrentMove = currentMove === move;

        return (
          <span
            key={idx}
            className={`px-3 py-1 rounded font-semibold text-white transition ${bgColor} ${
              isCurrentMove ? "ring-2 ring-orange-400 scale-110" : ""
            }`}
          >
            {move}
          </span>
        );
      })}
    </div>
  );
};

export default MoveNotationDisplay;
