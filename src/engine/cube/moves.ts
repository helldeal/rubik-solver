/**
 * Générateur de mélanges aléatoires valides
 */

import type { MoveNotation } from "../../types/cube";

// Tous les mouvements valides pour un cube
const ALL_MOVES: MoveNotation[] = [
  "U",
  "U'",
  "U2",
  "D",
  "D'",
  "D2",
  "L",
  "L'",
  "L2",
  "R",
  "R'",
  "R2",
  "F",
  "F'",
  "F2",
  "B",
  "B'",
  "B2",
];

// Groupes de mouvements opposés (pour éviter les consécutifs redondants)
const MOVE_GROUPS: Record<string, string[]> = {
  U: ["U", "U'", "U2"],
  D: ["D", "D'", "D2"],
  L: ["L", "L'", "L2"],
  R: ["R", "R'", "R2"],
  F: ["F", "F'", "F2"],
  B: ["B", "B'", "B2"],
};

/**
 * Retourne le groupe d'un mouvement
 */
function getMoveGroup(move: MoveNotation): string {
  for (const [group, moves] of Object.entries(MOVE_GROUPS)) {
    if (moves.includes(move)) return group;
  }
  return move;
}

/**
 * Génère une séquence aléatoire de N mouvements valides
 * Assure que deux mouvements consécutifs ne sont pas du même groupe
 * (pour éviter les réductions inutiles)
 */
export function generateScramble(numMoves: number = 20): MoveNotation[] {
  const scramble: MoveNotation[] = [];
  let lastGroup = "";

  for (let i = 0; i < numMoves; i++) {
    let availableMoves = ALL_MOVES.filter(
      (move) => getMoveGroup(move) !== lastGroup,
    );

    if (availableMoves.length === 0) {
      availableMoves = ALL_MOVES;
    }

    const randomMove =
      availableMoves[Math.floor(Math.random() * availableMoves.length)];
    scramble.push(randomMove);
    lastGroup = getMoveGroup(randomMove);
  }

  return scramble;
}

/**
 * Génère une séquence de mouvements aléatoire sans restriction de groupe
 * (Moins réaliste mais compatible avec tous les générateurs)
 */
export function generateRandomSequence(numMoves: number = 20): MoveNotation[] {
  const sequence: MoveNotation[] = [];
  for (let i = 0; i < numMoves; i++) {
    sequence.push(ALL_MOVES[Math.floor(Math.random() * ALL_MOVES.length)]);
  }
  return sequence;
}

/**
 * Retourne l'inverse d'un move
 */
export function invertMove(move: MoveNotation): MoveNotation {
  const inverseMap: Record<string, MoveNotation> = {
    U: "U'",
    "U'": "U",
    U2: "U2",
    D: "D'",
    "D'": "D",
    D2: "D2",
    L: "L'",
    "L'": "L",
    L2: "L2",
    R: "R'",
    "R'": "R",
    R2: "R2",
    F: "F'",
    "F'": "F",
    F2: "F2",
    B: "B'",
    "B'": "B",
    B2: "B2",
  };
  return inverseMap[move] || move;
}

/**
 * Retourne la séquence inverse d'une suite de mouvements
 */
export function invertSequence(moves: MoveNotation[]): MoveNotation[] {
  return [...moves].reverse().map(invertMove);
}
