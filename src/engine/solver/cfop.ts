/**
 * Solveur CFOP (Fridrich method) - Méthode intermédiaire
 */

import type { SolveStep } from "../../types/cube";

export class CFOPSolver {
  /**
   * Résout un cube avec la méthode CFOP
   * Retourne une liste d'étapes
   */
  static solve(): SolveStep[] {
    const steps: SolveStep[] = [];

    steps.push({
      id: "cfop-1",
      phaseLabel: "Croix (Cross)",
      description:
        "Constru isez la croix blanche avec 4 arêtes correctement orientées.",
      moves: ["D", "L", "F'", "U"],
      highlightFaces: [0],
    });

    steps.push({
      id: "cfop-2",
      phaseLabel: "F2L: Paires 1-4",
      description:
        "Insérez les 4 paires coin-arête dans les 4 emplacements F2L.",
      moves: ["R", "U", "R'", "U'"],
      highlightFaces: [0, 2, 4, 5],
    });

    steps.push({
      id: "cfop-3",
      phaseLabel: "OLL: Orientation dernier étage",
      description: "Orientez les 8 pièces du dernier étage (passe 1/2).",
      moves: ["F", "R", "U", "R'", "U'", "F'"],
      highlightFaces: [1],
    });

    steps.push({
      id: "cfop-4",
      phaseLabel: "PLL: Permutation dernier étage",
      description: "Permutez les 8 pièces du dernier étage pour terminer.",
      moves: [
        "R",
        "U'",
        "R'",
        "U",
        "R'",
        "F",
        "R2",
        "U",
        "R'",
        "U'",
        "R'",
        "U",
        "R",
        "U'",
        "R'",
        "F'",
      ],
      highlightFaces: [1],
    });

    return steps;
  }
}
