/**
 * Solveur LBL (Layer By Layer) - Méthode débutant
 */

import type { SolveStep } from "../../types/cube";

export class LBLSolver {
  /**
   * Résout un cube mélangé en utilisant la méthode LBL
   * Retourne une liste d'étapes avec descriptions
   */
  static solve(): SolveStep[] {
    const steps: SolveStep[] = [];

    // Pour l'MVP, retournons une seule étape
    steps.push({
      id: "lbl-1",
      phaseLabel: "Croix blanche",
      description:
        "Placez les 4 arêtes blanches autour du centre blanc (face Up).",
      moves: ["U", "R", "R'", "U2"],
      highlightFaces: [0], // Face Up
    });

    steps.push({
      id: "lbl-2",
      phaseLabel: "Coins blancs",
      description: "Complétez le côté blanc avec les 4 coins.",
      moves: ["R", "U'", "R'", "U"],
      highlightFaces: [0],
    });

    steps.push({
      id: "lbl-3",
      phaseLabel: "Deuxième couronne",
      description: "Insérez les 4 arêtes de la belle intermédiaire.",
      moves: ["U", "R", "U", "R'", "U", "F'", "U", "F"],
      highlightFaces: [2, 4, 5, 3],
    });

    steps.push({
      id: "lbl-4",
      phaseLabel: "Croix jaune",
      description: "Construisez une croix sur la face jaune (Down).",
      moves: ["F", "R", "U", "R'", "U'", "F'"],
      highlightFaces: [1],
    });

    steps.push({
      id: "lbl-5",
      phaseLabel: "Coins jaunes positionnés",
      description: "Positionnez les 4 coins de la face jaune.",
      moves: ["R", "U", "R'", "U", "R", "U", "R'"],
      highlightFaces: [1],
    });

    steps.push({
      id: "lbl-6",
      phaseLabel: "Coins jaunes orientés",
      description: "Orientez correctement les 4 coins jaunes.",
      moves: ["R'", "U'", "R", "U", "R'", "U'", "R"],
      highlightFaces: [1],
    });

    steps.push({
      id: "lbl-7",
      phaseLabel: "Arêtes finales",
      description: "Terminez en positionnant les 4 arêtes du dernier étage.",
      moves: ["R", "U'", "R'", "U"],
      highlightFaces: [1],
    });

    return steps;
  }
}
