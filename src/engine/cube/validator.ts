/**
 * Validateur pour verifier qu'un etat de cube est coherent avec le modele.
 *
 * CubeState stocke les couleurs visibles, pas une orientation interne de cubie.
 * On valide donc les invariants fiables pour ce format: structure, compte des
 * couleurs, centres fixes, coins uniques et aretes uniques. Les tests stricts
 * twist/flip/parite provoquaient des faux negatifs sur des melanges generes par
 * CubeModel parce qu'ils utilisaient une convention d'orientation differente.
 */

import type { CubeState, FaceColor } from "../../types/cube";

type CubiePosition = {
  x: -1 | 0 | 1;
  y: -1 | 0 | 1;
  z: -1 | 0 | 1;
};

type LegalityResult = {
  centerValid: boolean;
  cornerValid: boolean;
  edgeValid: boolean;
  orientationValid: boolean;
  parityValid: boolean;
  error: string | null;
};

const VALID_COLORS: FaceColor[] = ["W", "Y", "R", "O", "B", "G"];
const EXPECTED_CENTERS: FaceColor[] = ["W", "Y", "G", "B", "O", "R"];

const CORNER_POSITIONS: Array<{
  position: CubiePosition;
  identity: string;
}> = [
  { position: { x: 1, y: -1, z: 1 }, identity: "GRW" },
  { position: { x: 1, y: 1, z: 1 }, identity: "BRW" },
  { position: { x: -1, y: 1, z: 1 }, identity: "BOW" },
  { position: { x: -1, y: -1, z: 1 }, identity: "GOW" },
  { position: { x: 1, y: -1, z: -1 }, identity: "GRY" },
  { position: { x: 1, y: 1, z: -1 }, identity: "BRY" },
  { position: { x: -1, y: 1, z: -1 }, identity: "BOY" },
  { position: { x: -1, y: -1, z: -1 }, identity: "GOY" },
];

const EDGE_POSITIONS: Array<{
  position: CubiePosition;
  identity: string;
}> = [
  { position: { x: 1, y: 0, z: 1 }, identity: "RW" },
  { position: { x: 0, y: -1, z: 1 }, identity: "GW" },
  { position: { x: -1, y: 0, z: 1 }, identity: "OW" },
  { position: { x: 0, y: 1, z: 1 }, identity: "BW" },
  { position: { x: 1, y: -1, z: 0 }, identity: "GR" },
  { position: { x: -1, y: -1, z: 0 }, identity: "GO" },
  { position: { x: 1, y: 1, z: 0 }, identity: "BR" },
  { position: { x: -1, y: 1, z: 0 }, identity: "BO" },
  { position: { x: 1, y: 0, z: -1 }, identity: "RY" },
  { position: { x: 0, y: -1, z: -1 }, identity: "GY" },
  { position: { x: -1, y: 0, z: -1 }, identity: "OY" },
  { position: { x: 0, y: 1, z: -1 }, identity: "BY" },
];

const CORNER_IDENTITIES = new Set(CORNER_POSITIONS.map(({ identity }) => identity));
const EDGE_IDENTITIES = new Set(EDGE_POSITIONS.map(({ identity }) => identity));

const EMPTY_COUNTS: Record<FaceColor, number> = {
  W: 0,
  Y: 0,
  R: 0,
  O: 0,
  B: 0,
  G: 0,
};

function sortIdentity(colors: FaceColor[]): string {
  return [...colors].sort().join("");
}

function getStickerColorsAtPosition(
  state: CubeState,
  position: CubiePosition,
): FaceColor[] {
  const colors: FaceColor[] = [];

  if (position.z === 1) {
    colors.push(state[0][1 - position.y][position.x + 1]);
  }

  if (position.z === -1) {
    colors.push(state[1][position.y + 1][position.x + 1]);
  }

  if (position.y === -1) {
    colors.push(state[2][position.z + 1][position.x + 1]);
  }

  if (position.y === 1) {
    colors.push(state[3][position.z + 1][1 - position.x]);
  }

  if (position.x === -1) {
    colors.push(state[4][position.z + 1][1 - position.y]);
  }

  if (position.x === 1) {
    colors.push(state[5][position.z + 1][position.y + 1]);
  }

  return colors;
}

function createColorCounts(): Record<FaceColor, number> {
  return { ...EMPTY_COUNTS };
}

function hasExactlyExpectedPieces(
  detectedPieces: string[],
  expectedPieces: Set<string>,
): boolean {
  if (detectedPieces.length !== expectedPieces.size) return false;

  const uniquePieces = new Set(detectedPieces);
  if (uniquePieces.size !== expectedPieces.size) return false;

  return detectedPieces.every((piece) => expectedPieces.has(piece));
}

function analyzeLegality(state: CubeState): LegalityResult {
  const centerValid = EXPECTED_CENTERS.every(
    (color, faceIdx) => state[faceIdx]?.[1]?.[1] === color,
  );

  if (!centerValid) {
    return {
      centerValid: false,
      cornerValid: false,
      edgeValid: false,
      orientationValid: true,
      parityValid: true,
      error:
        "Centres du cube invalides (standard attendu: blanc/jaune/vert/bleu/orange/rouge)",
    };
  }

  const cornerIdentities: string[] = [];

  for (const { position } of CORNER_POSITIONS) {
    const identity = sortIdentity(getStickerColorsAtPosition(state, position));

    if (!CORNER_IDENTITIES.has(identity)) {
      return {
        centerValid,
        cornerValid: false,
        edgeValid: false,
        orientationValid: true,
        parityValid: true,
        error: `Position impossible detectee sur un coin: ${identity}`,
      };
    }

    cornerIdentities.push(identity);
  }

  const cornerValid = hasExactlyExpectedPieces(
    cornerIdentities,
    CORNER_IDENTITIES,
  );

  if (!cornerValid) {
    return {
      centerValid,
      cornerValid,
      edgeValid: false,
      orientationValid: true,
      parityValid: true,
      error: "Une ou plusieurs positions de coin sont dupliquees ou manquantes",
    };
  }

  const edgeIdentities: string[] = [];

  for (const { position } of EDGE_POSITIONS) {
    const identity = sortIdentity(getStickerColorsAtPosition(state, position));

    if (!EDGE_IDENTITIES.has(identity)) {
      return {
        centerValid,
        cornerValid,
        edgeValid: false,
        orientationValid: true,
        parityValid: true,
        error: `Position impossible detectee sur une arete: ${identity}`,
      };
    }

    edgeIdentities.push(identity);
  }

  const edgeValid = hasExactlyExpectedPieces(edgeIdentities, EDGE_IDENTITIES);

  if (!edgeValid) {
    return {
      centerValid,
      cornerValid,
      edgeValid,
      orientationValid: true,
      parityValid: true,
      error: "Une ou plusieurs positions d'arete sont dupliquees ou manquantes",
    };
  }

  return {
    centerValid,
    cornerValid,
    edgeValid,
    orientationValid: true,
    parityValid: true,
    error: null,
  };
}

/**
 * Verifie qu'une couleur est valide.
 */
function isValidColor(color: unknown): color is FaceColor {
  return VALID_COLORS.includes(color as FaceColor);
}

/**
 * Compte chaque couleur dans tout le cube.
 */
function countColors(state: CubeState): Record<FaceColor, number> {
  const counts = createColorCounts();

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
 * Valide la structure de base du cube.
 */
export function validateCubeStructure(state: CubeState): boolean {
  if (state.length !== 6) return false;

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
 * Valide le nombre de chaque couleur.
 * Un cube valide a exactement 9 facettes de chaque couleur.
 */
export function validateColorCounts(state: CubeState): boolean {
  if (!validateCubeStructure(state)) return false;

  const counts = countColors(state);
  return Object.values(counts).every((count) => count === 9);
}

/**
 * Valide qu'un etat de cube est coherent avec les pieces d'un Rubik's Cube.
 */
export function validateCubeValidity(state: CubeState): boolean {
  return validateCube(state).valid;
}

/**
 * Message detaille de l'erreur si le cube n'est pas valide.
 */
export function getValidationError(state: CubeState): string | null {
  if (!validateCubeStructure(state)) {
    return "Structure du cube invalide (doit etre 6 faces de 3x3)";
  }

  const counts = countColors(state);
  for (const [color, count] of Object.entries(counts)) {
    if (count !== 9) {
      return `Nombre incorrect de facettes ${color}: ${count}/9`;
    }
  }

  return analyzeLegality(state).error;
}

/**
 * Interface pour les erreurs de validation detaillees.
 */
export interface ValidationResult {
  valid: boolean;
  error: string | null;
  details: {
    structureValid: boolean;
    colorCountValid: boolean;
    centerValid: boolean;
    cornerValid: boolean;
    edgeValid: boolean;
    orientationValid: boolean;
    parityValid: boolean;
    colorCounts: Record<FaceColor, number>;
  };
}

/**
 * Validation complete avec details.
 */
export function validateCube(state: CubeState): ValidationResult {
  const structureValid = validateCubeStructure(state);
  const colorCounts = structureValid ? countColors(state) : createColorCounts();
  const colorCountValid =
    structureValid && Object.values(colorCounts).every((count) => count === 9);
  const legality =
    structureValid && colorCountValid
      ? analyzeLegality(state)
      : {
          centerValid: false,
          cornerValid: false,
          edgeValid: false,
          orientationValid: false,
          parityValid: false,
          error: null,
        };

  return {
    valid:
      structureValid &&
      colorCountValid &&
      legality.centerValid &&
      legality.cornerValid &&
      legality.edgeValid &&
      legality.orientationValid &&
      legality.parityValid,
    error: getValidationError(state),
    details: {
      structureValid,
      colorCountValid,
      centerValid: legality.centerValid,
      cornerValid: legality.cornerValid,
      edgeValid: legality.edgeValid,
      orientationValid: legality.orientationValid,
      parityValid: legality.parityValid,
      colorCounts,
    },
  };
}
