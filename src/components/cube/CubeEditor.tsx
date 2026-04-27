/**
 * Éditeur de cube - Permet de colorier manuellement chaque facette
 */

import React, { useMemo, useState } from "react";
import { useCubeState } from "../../hooks/useCubeState";
import type { CubeState, FaceColor } from "../../types/cube";
import { validateCube } from "../../engine/cube/validator";
import CubePreview3D from "./CubePreview3D";

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

const FACE_INFO: Record<
  number,
  { center: FaceColor; top: FaceColor; inverted: boolean }
> = {
  0: { center: "W", top: "B", inverted: false },
  1: { center: "Y", top: "G", inverted: false },
  2: { center: "G", top: "W", inverted: true },
  3: { center: "B", top: "W", inverted: true },
  4: { center: "O", top: "W", inverted: true },
  5: { center: "R", top: "W", inverted: true },
};

interface CubeEditorProps {
  onConfirm?: () => void;
  onCancel: () => void;
}

const CubeEditor: React.FC<CubeEditorProps> = ({ onConfirm, onCancel }) => {
  const { state, setCustomState } = useCubeState();
  const [selectedColor, setSelectedColor] = useState<FaceColor>("W");
  const [editedState, setEditedState] = useState<CubeState>(() => {
    return state.map((face) => face.map((row) => [...row])) as CubeState;
  });
  const validation = useMemo(() => validateCube(editedState), [editedState]);

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

  const counts = validation.details.colorCounts;
  const getVisualIndices = (faceIdx: number) => {
    return FACE_INFO[faceIdx].inverted ? [2, 1, 0] : [0, 1, 2];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 sm:p-4">
      <div className="my-4 flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="border-b border-slate-200 px-4 py-4 sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900">Éditeur du Cube</h2>
          <p className="mt-1 text-sm text-slate-600">
            Clique une facelette, choisis une couleur, puis complète le cube
            pour garder exactement 9 stickers de chaque couleur.
          </p>
        </div>

        <div className="grid flex-1 gap-6 overflow-y-auto px-4 py-4 sm:px-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div>
            <div className="mb-5">
              <p className="mb-2 text-sm font-semibold text-slate-700">
                Sélectionnez une couleur
              </p>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`h-12 w-12 rounded border-2 transition-all ${
                      selectedColor === color
                        ? "border-slate-900 scale-110"
                        : "border-slate-300"
                    }`}
                    style={{ backgroundColor: COLOR_HEX[color] }}
                    title={COLOR_NAMES[color]}
                    aria-label={COLOR_NAMES[color]}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {editedState.map((face, faceIdx) => (
                <div
                  key={faceIdx}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3 shadow-sm"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-700">
                        {FACE_NAMES[faceIdx]}
                      </p>
                      <p className="text-xs text-slate-500">
                        {COLOR_NAMES[FACE_INFO[faceIdx].center]}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-slate-200 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                      Au-dessus: {COLOR_NAMES[FACE_INFO[faceIdx].top]}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {getVisualIndices(faceIdx).map((rowIdx) =>
                      getVisualIndices(faceIdx).map((colIdx) => (
                        <button
                          key={`${faceIdx}-${rowIdx}-${colIdx}`}
                          onClick={() =>
                            handleFacetteClick(faceIdx, rowIdx, colIdx)
                          }
                          disabled={rowIdx === 1 && colIdx === 1}
                          className="aspect-square w-full rounded border border-slate-400 transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:hover:scale-100"
                          style={{
                            backgroundColor: COLOR_HEX[face[rowIdx][colIdx]],
                            boxShadow:
                              rowIdx === 1 && colIdx === 1
                                ? "inset 0 0 0 2px rgba(15, 23, 42, 0.72)"
                                : undefined,
                            opacity: rowIdx === 1 && colIdx === 1 ? 0.96 : 1,
                          }}
                          title={`${FACE_NAMES[faceIdx]} - ${COLOR_NAMES[face[rowIdx][colIdx]]}`}
                          aria-disabled={rowIdx === 1 && colIdx === 1}
                          aria-label={`${FACE_NAMES[faceIdx]} ${rowIdx + 1}-${colIdx + 1}`}
                        />
                      )),
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="flex flex-col gap-4">
            <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
              <p className="mb-2 text-sm font-semibold text-slate-700">
                Prévisualisation 3D
              </p>
              <CubePreview3D cubeState={editedState} />
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">
                Validation en direct
              </p>
              <p
                className={`mt-2 rounded px-3 py-2 text-sm ${
                  validation.valid
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-800"
                }`}
              >
                {validation.valid
                  ? "Cube valide, tu peux confirmer."
                  : (validation.error ?? "Cube invalide")}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-700">
                Répartition des couleurs
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
                {COLORS.map((color) => (
                  <div
                    key={color}
                    className="flex items-center justify-between rounded border border-slate-200 px-3 py-2"
                  >
                    <span className="flex items-center gap-2 text-slate-700">
                      <span
                        className="inline-block h-3 w-3 rounded-full border border-slate-300"
                        style={{ backgroundColor: COLOR_HEX[color] }}
                      />
                      {color}
                    </span>
                    <span
                      className={
                        counts[color] === 9
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }
                    >
                      {counts[color]}/9
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            onClick={onCancel}
            className="rounded bg-slate-200 px-6 py-2 font-medium text-slate-800 transition hover:bg-slate-300"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={!validation.valid}
            className="rounded bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CubeEditor;
