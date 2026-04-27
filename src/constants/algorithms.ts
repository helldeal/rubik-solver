/**
 * Base d'algorithmes OLL (Orient Last Layer) et PLL (Permute Last Layer)
 * Reference de la méthode CFOP/Fridrich
 */

import type { MoveNotation } from "../types/cube";

export interface Algorithm {
  id: string;
  name: string;
  description: string;
  moves: MoveNotation[];
}

/**
 * Quelques algorithmes OLL (57 cas total)
 * Ici on inclut seulement les plus courants
 */
export const OLL_ALGORITHMS: Algorithm[] = [
  {
    id: "oll-1",
    name: "T-block OLL",
    description: "Configuration en forme de T sur le dessus",
    moves: ["F", "R", "U", "R'", "U'", "F'"],
  },
  {
    id: "oll-2",
    name: "Oops (Sune)",
    description: "Sune standard - 1/3 du cube résolu",
    moves: ["R", "U", "R'", "U", "R", "U2", "R'"],
  },
  {
    id: "oll-3",
    name: "Antisune",
    description: "Inverse de Sune",
    moves: ["R", "U2", "R'", "U'", "R", "U'", "R'"],
  },
];

/**
 * Quelques algorithmes PLL (21 cas total)
 * Ici on inclut les plus courants
 */
export const PLL_ALGORITHMS: Algorithm[] = [
  {
    id: "pll-1",
    name: "T-perm",
    description: "Permutation standard T",
    moves: [
      "R",
      "U",
      "R'",
      "U",
      "R'",
      "F",
      "R2",
      "U",
      "R'",
      "U",
      "R'",
      "F",
      "'",
    ],
  },
  {
    id: "pll-2",
    name: "U-perm (Ub)",
    description: "Cycles les trois coins arrière",
    moves: [
      "R2",
      "U",
      "R",
      "U'",
      "R'",
      "U'",
      "R'",
      "U'",
      "R'",
      "U",
      "R",
      "'",
    ] as any,
  },
  {
    id: "pll-3",
    name: "Y-perm",
    description: "Permutation en Y",
    moves: [
      "F",
      "R",
      "U'",
      "R'",
      "U'",
      "R'",
      "F'",
      "R",
      "U",
      "R'",
      "U'",
      "R'",
    ] as any,
  },
];

/**
 * Recherche un algorithme par ID
 */
export function findAlgorithm(id: string): Algorithm | undefined {
  return [...OLL_ALGORITHMS, ...PLL_ALGORITHMS].find((algo) => algo.id === id);
}

/**
 * Retourne tous les algorithmes
 */
export function getAllAlgorithms(): Algorithm[] {
  return [...OLL_ALGORITHMS, ...PLL_ALGORITHMS];
}
