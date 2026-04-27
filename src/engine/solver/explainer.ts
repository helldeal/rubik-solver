/**
 * Générateur d'explications pédagogiques pour chaque étape
 */

import type { MoveNotation } from "../../types/cube";

const STEP_EXPLANATIONS: Record<
  string,
  { title: string; description: string }
> = {
  "lbl-1": {
    title: "Croix blanche",
    description:
      "Assemblez d'abord les 4 arêtes blanches pour créer une croix sur la face Up. Cette première étape établit la base de la résolution.",
  },
  "lbl-2": {
    title: "Coins blancs",
    description:
      "Placez les 4 coins blancs autour des arêtes blanches pour compléter la première couche.",
  },
  "lbl-3": {
    title: "Deuxième couronne",
    description:
      "Insérez les 4 arêtes intermediaires pour remplir la couche mobile du milieu.",
  },
  "lbl-4": {
    title: "Croix jaune",
    description:
      "Construisez une croix jaune sur la face Down, similarement à la croix blanche.",
  },
  "lbl-5": {
    title: "Coins jaunes positionnés",
    description:
      "Placez les 4 coins jaunes dans les bonnes positions (même s'ils sont mal orientés).",
  },
  "lbl-6": {
    title: "Coins jaunes orientés",
    description:
      "Orientez les coins jaunes correctement pour que les couleurs latérales correspondent.",
  },
  "lbl-7": {
    title: "Arêtes finales",
    description:
      "Terminez en plaçant les 4 arêtes jaunes dans leurs positions définitives.",
  },
  "cfop-1": {
    title: "Croix (Cross)",
    description:
      "Étape CFOP 1: Construisez une croix de 4 arêtes blanches autour du centre blanc.",
  },
  "cfop-2": {
    title: "F2L (First 2 Layers)",
    description:
      "Étape CFOP 2: Insérez les 4 paires coins-arêtes pour compléter les 2 premières couches.",
  },
  "cfop-3": {
    title: "OLL (Orient Last Layer)",
    description:
      "Étape CFOP 3: Orientez les 8 pièces du dernier étage sans les permuter.",
  },
  "cfop-4": {
    title: "PLL (Permute Last Layer)",
    description:
      "Étape CFOP 4: Permutez les pièces du dernier étage pour terminer le cube.",
  },
};

/**
 * Retourne une explication détaillée pour une étape
 */
export function explainStep(stepId: string): string {
  const expl = STEP_EXPLANATIONS[stepId];
  return expl ? expl.description : "Étape non documentée.";
}

/**
 * Convertit une notation de move en description lisible
 */
export function describeMoveNotation(move: MoveNotation): string {
  const descriptions: Record<MoveNotation, string> = {
    U: "Tourner la face Up (haut) dans le sens des aiguilles",
    "U'": "Tourner la face Up (haut) dans le sens inverse",
    U2: "Tourner la face Up (haut) de 180°",
    D: "Tourner la face Down (bas) dans le sens des aiguilles",
    "D'": "Tourner la face Down (bas) dans le sens inverse",
    D2: "Tourner la face Down (bas) de 180°",
    L: "Tourner la face Left (gauche) dans le sens des aiguilles",
    "L'": "Tourner la face Left (gauche) dans le sens inverse",
    L2: "Tourner la face Left (gauche) de 180°",
    R: "Tourner la face Right (droite) dans le sens des aiguilles",
    "R'": "Tourner la face Right (droite) dans le sens inverse",
    R2: "Tourner la face Right (droite) de 180°",
    F: "Tourner la face Front (avant) dans le sens des aiguilles",
    "F'": "Tourner la face Front (avant) dans le sens inverse",
    F2: "Tourner la face Front (avant) de 180°",
    B: "Tourner la face Back (arrière) dans le sens des aiguilles",
    "B'": "Tourner la face Back (arrière) dans le sens inverse",
    B2: "Tourner la face Back (arrière) de 180°",
    M: "Tourner la tranche Middle verticalement",
    "M'": "Tourner la tranche Middle (inverse)",
    M2: "Tourner la tranche Middle de 180°",
    E: "Tourner la tranche Équatoriale horizontalement",
    "E'": "Tourner la tranche Équatoriale (inverse)",
    E2: "Tourner la tranche Équatoriale de 180°",
    S: "Tourner la tranche Standing profondeur",
    "S'": "Tourner la tranche Standing (inverse)",
    S2: "Tourner la tranche Standing de 180°",
    x: "Rotation du cube autour de l'axe R",
    "x'": "Rotation du cube autours de l'axe R (inverse)",
    x2: "Rotation du cube 180° autour de l'axe R",
    y: "Rotation du cube autour de l'axe U",
    "y'": "Rotation du cube autour de l'axe U (inverse)",
    y2: "Rotation du cube 180° autour de l'axe U",
    z: "Rotation du cube autour de l'axe F",
    "z'": "Rotation du cube autour de l'axe F (inverse)",
    z2: "Rotation du cube 180° autour de l'axe F",
  };

  return descriptions[move] || `Mouvement: ${move}`;
}
