/**
 * Validateur pour vérifier qu'un état de cube est valid
 * Basé sur les lois de la mécanique et topologie du Rubik's Cube
 */

import type { CubeState, FaceColor } from "../../types/cube";

/**
 * Vérifie qu'une couleur est valide
 */
function isValidColor(color: any): color is FaceColor {
  return ["W", "Y", "R", "O", "B", "G"].includes(color);
}

/**
 * Compte chaque couleur dans tout le cube
 */
function countColors(state: CubeState): Record<FaceColor, number> {
  const counts: Record<FaceColor, number> = {
    W: 0,
    Y: 0,
    R: 0,
    O: 0,
    B: 0,
    G: 0,
  };

  for (const face of state) {
    for (const row of face) {
      for (const color of row) {
        if (isValidColor(color)) {
          counts[color]++;
        }
      }
    }
  }

  return counts;
}

/**
 * Valide la structure de base du cube
 */
export function validateCubeStructure(state: CubeState): boolean {
  // Doit avoir exactement 6 faces
  if (state.length !== 6) return false;

  // Chaque face doit être 3x3
  for (const face of state) {
    if (face.length !== 3) return false;
    for (const row of face) {
      if (row.length !== 3) return false;
      for (const color of row) {
        if (!isValidColor(color)) return false;
      }
    }
  }

  return true;
}

/**
 * Valide le nombre de chaque couleur
 * Un cube valide a exactement 9 facettes de chaque couleur
 */
export function validateColorCounts(state: CubeState): boolean {
  if (!validateCubeStructure(state)) return false;

  const counts = countColors(state);

  // Chaque couleur doit apparaître exactement 9 fois
  for (const count of Object.values(counts)) {
    if (count !== 9) return false;
  }

  return true;
}

/**
 * Valide qu'un état de cube est théoriquement résolvable
 * Vérifie la parité du cube (permutation + orientation)
 *
 * SIMPLIFIÉ: On vérifie juste la structure et le nombre de couleurs
 * Une vérification complète de parité nécessiterait l'indexation exacte des cubies
 */
export function validateCubeValidity(state: CubeState): boolean {
  return validateColorCounts(state);
}

/**
 * Message détaillé de l'erreur si le cube n'est pas valide
 */
export function getValidationError(state: CubeState): string | null {
  if (!validateCubeStructure(state)) {
    return "Structure du cube invalide (doit être 6 faces de 3×3)";
  }

  const counts = countColors(state);
  for (const [color, count] of Object.entries(counts)) {
    if (count !== 9) {
      return `Nombre incorrect de facettes ${color}: ${count}/9`;
    }
  }

  return null;
}

/**
 * Interface pour les erreurs de validation détaillées
 */
export interface ValidationResult {
  valid: boolean;
  error: string | null;
  details: {
    structureValid: boolean;
    colorCountValid: boolean;
    colorCounts: Record<FaceColor, number>;
  };
}

/**
 * Validation complète avec détails
 */
export function validateCube(state: CubeState): ValidationResult {
  const structureValid = validateCubeStructure(state);
  const counts = structureValid
    ? countColors(state)
    : ({} as Record<FaceColor, number>);
  const colorCountValid =
    structureValid && Object.values(counts).every((c) => c === 9);

  return {
    valid: structureValid && colorCountValid,
    error: getValidationError(state),
    details: {
      structureValid,
      colorCountValid,
      colorCounts: counts,
    },
  };
}
