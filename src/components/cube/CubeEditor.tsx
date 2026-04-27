/**
 * Éditeur de cube - Permet de colorier manuellement chaque facette
 */

import React, { useState } from "react";
import { useCubeState } from "../../hooks/useCubeState";
import type { CubeState, FaceColor } from "../../types/cube";
import { CubeModel } from "../../engine/cube/CubeModel";

const COLORS: FaceColor[] = ["W", "Y", "R", "O", "B", "G"];
const COLOR_NAMES: Record<FaceColor, string> = {
  W: "Blanc",
  Y: "Jaune",
  R: "Rouge",
  O: "Orange",
  B: "Bleu",
  G: "Vert",
};
const COLOR_HEX: Record<FaceColor, string> = {
  W: "#ffffff",
  Y: "#ffff00",
  R: "#ff0000",
  O: "#ffa500",
  B: "#0000ff",
  G: "#00aa00",
};

const FACE_NAMES: string[] = [
  "Haut (U)",
  "Bas (D)",
  "Avant (F)",
  "Arrière (B)",
  "Gauche (L)",
  "Droite (R)",
];

interface CubeEditorProps {
  onConfirm?: () => void;
  onCancel: () => void;
}

const CubeEditor: React.FC<CubeEditorProps> = ({ onConfirm, onCancel }) => {
  const { state, setCustomState } = useCubeState();
  const [selectedColor, setSelectedColor] = useState<FaceColor>("W");
  const [editedState, setEditedState] = useState<CubeState>(() => {
    const model = new CubeModel(state);
    return model.getState();
  });

  const handleFacetteClick = (
    faceIdx: number,
    rowIdx: number,
    colIdx: number,
  ) => {
    const newState = editedState.map((face) => [...face]);
    newState[faceIdx][rowIdx][colIdx] = selectedColor;
    setEditedState(newState);
  };

  const handleConfirm = () => {
    const error = setCustomState(editedState);
    if (!error) {
      onConfirm?.();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl w-full my-4">
        <h2 className="text-2xl font-bold mb-4">Éditeur du Cube</h2>

        {/* Palette de couleurs */}
        <div className="mb-6">
          <p className="text-sm font-semibold mb-2">
            Sélectionnez une couleur:
          </p>
          <div className="flex gap-2">
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-12 h-12 rounded border-2 transition-all ${
                  selectedColor === color
                    ? "border-gray-800 scale-110"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: COLOR_HEX[color] }}
                title={COLOR_NAMES[color]}
              />
            ))}
          </div>
        </div>

        {/* Grille d'édition */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          {editedState.map((face, faceIdx) => (
            <div
              key={faceIdx}
              className="border-2 border-gray-300 rounded-lg p-3 bg-gray-50"
            >
              <p className="text-sm font-semibold mb-2">
                {FACE_NAMES[faceIdx]}
              </p>
              <div className="grid grid-cols-3 gap-1">
                {face.map((row, rowIdx) =>
                  row.map((color, colIdx) => (
                    <button
                      key={`${faceIdx}-${rowIdx}-${colIdx}`}
                      onClick={() =>
                        handleFacetteClick(faceIdx, rowIdx, colIdx)
                      }
                      className="w-10 h-10 rounded border border-gray-400 hover:scale-110 transition-transform cursor-pointer"
                      style={{ backgroundColor: COLOR_HEX[color] }}
                      title={COLOR_NAMES[color]}
                    />
                  )),
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Boutons */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CubeEditor;
