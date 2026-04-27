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
  U: "bg-white text-gray-900 border border-gray-300",
  D: "bg-yellow-400 text-gray-900",
  R: "bg-blue-600",
  L: "bg-green-600",
  F: "bg-red-500",
  B: "bg-orange-500",
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
            className={`px-3 py-1 rounded font-semibold transition ${bgColor} ${
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
