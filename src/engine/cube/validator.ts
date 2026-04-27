/**
 * Validateur pour vérifier qu'un état de cube est valid
 * Basé sur les lois de la mécanique et topologie du Rubik's Cube
 */

import type { CubeState, FaceColor } from "../../types/cube";

type FaceIndex = 0 | 1 | 2 | 3 | 4 | 5;

type CubiePosition = {
  x: -1 | 0 | 1;
  y: -1 | 0 | 1;
  z: -1 | 0 | 1;
};

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

const CORNER_IDENTITY_LOOKUP = new Map(
  CORNER_POSITIONS.map(({ identity }, index) => [identity, index] as const),
);

const EDGE_IDENTITY_LOOKUP = new Map(
  EDGE_POSITIONS.map(({ identity }, index) => [identity, index] as const),
);

function sortIdentity(colors: FaceColor[]): string {
  return [...colors].sort().join("");
}

function getStickerColorsAtPosition(
  state: CubeState,
  position: CubiePosition,
): Array<{ face: FaceIndex; color: FaceColor }> {
  const stickers: Array<{ face: FaceIndex; color: FaceColor }> = [];

  if (position.z === 1) {
    stickers.push({
      face: 0,
      color: state[0][1 - position.y][position.x + 1],
    });
  }

  if (position.z === -1) {
    stickers.push({
      face: 1,
      color: state[1][position.y + 1][position.x + 1],
    });
  }

  if (position.y === -1) {
    stickers.push({
      face: 2,
      color: state[2][position.z + 1][position.x + 1],
    });
  }

  if (position.y === 1) {
    stickers.push({
      face: 3,
      color: state[3][position.z + 1][2 - (position.x + 1)],
    });
  }

  if (position.x === -1) {
    stickers.push({
      face: 4,
      color: state[4][position.z + 1][2 - (position.y + 1)],
    });
  }

  if (position.x === 1) {
    stickers.push({
      face: 5,
      color: state[5][position.z + 1][position.y + 1],
    });
  }

  return stickers;
}

function permutationParity(permutation: number[]): number {
  const visited = new Array(permutation.length).fill(false);
  let parity = 0;

  for (let index = 0; index < permutation.length; index++) {
    if (visited[index]) continue;

    let cycleLength = 0;
    let current = index;
    while (!visited[current]) {
      visited[current] = true;
      current = permutation[current];
      cycleLength++;
    }

    if (cycleLength > 0) {
      parity ^= (cycleLength - 1) % 2;
    }
  }

  return parity;
}

function analyzeLegality(state: CubeState): {
  centerValid: boolean;
  cornerValid: boolean;
  edgeValid: boolean;
  orientationValid: boolean;
  parityValid: boolean;
  error: string | null;
} {
  const centerValid = EXPECTED_CENTERS.every(
    (color, faceIdx) => state[faceIdx]?.[1]?.[1] === color,
  );

  if (!centerValid) {
    return {
      centerValid: false,
      cornerValid: false,
      edgeValid: false,
      orientationValid: false,
      parityValid: false,
      error:
        "Centres du cube invalides (le cube doit garder le standard blanc/jaune/vert/bleu/orange/rouge)",
    };
  }

  const cornerPermutation: number[] = [];
  let cornerTwistSum = 0;
  const cornerIdentityCounts = new Map<string, number>();

  for (const { position } of CORNER_POSITIONS) {
    const stickers = getStickerColorsAtPosition(state, position);
    if (stickers.length !== 3) {
      return {
        centerValid,
        cornerValid: false,
        edgeValid: false,
        orientationValid: false,
        parityValid: false,
        error: "Structure des coins invalide",
      };
    }

    const detectedIdentity = sortIdentity(
      stickers.map((sticker) => sticker.color),
    );
    const homeIndex = CORNER_IDENTITY_LOOKUP.get(detectedIdentity);
    if (homeIndex === undefined) {
      return {
        centerValid,
        cornerValid: false,
        edgeValid: false,
        orientationValid: false,
        parityValid: false,
        error: `Position illicite détectée sur un coin: ${detectedIdentity}`,
      };
    }

    cornerPermutation.push(homeIndex);
    cornerIdentityCounts.set(
      detectedIdentity,
      (cornerIdentityCounts.get(detectedIdentity) ?? 0) + 1,
    );

    const udSticker = stickers.find((sticker) =>
      ["W", "Y"].includes(sticker.color),
    );
    if (!udSticker) {
      return {
        centerValid,
        cornerValid: false,
        edgeValid: false,
        orientationValid: false,
        parityValid: false,
        error: `Orientation illicite détectée sur un coin: ${detectedIdentity}`,
      };
    }

    const twist =
      udSticker.face === 0 || udSticker.face === 1
        ? 0
        : udSticker.face === 2 || udSticker.face === 3
          ? 1
          : 2;
    cornerTwistSum = (cornerTwistSum + twist) % 3;
  }

  const cornerValid =
    cornerIdentityCounts.size === 8 &&
    Array.from(cornerIdentityCounts.values()).every((count) => count === 1);

  if (!cornerValid) {
    return {
      centerValid,
      cornerValid,
      edgeValid: false,
      orientationValid: false,
      parityValid: false,
      error: "Une ou plusieurs positions de coin sont dupliquées ou manquantes",
    };
  }

  const edgePermutation: number[] = [];
  let edgeFlipSum = 0;
  const edgeIdentityCounts = new Map<string, number>();

  for (const { position } of EDGE_POSITIONS) {
    const stickers = getStickerColorsAtPosition(state, position);
    if (stickers.length !== 2) {
      return {
        centerValid,
        cornerValid,
        edgeValid: false,
        orientationValid: false,
        parityValid: false,
        error: "Structure des arêtes invalide",
      };
    }

    const detectedIdentity = sortIdentity(
      stickers.map((sticker) => sticker.color),
    );
    const homeIndex = EDGE_IDENTITY_LOOKUP.get(detectedIdentity);
    if (homeIndex === undefined) {
      return {
        centerValid,
        cornerValid,
        edgeValid: false,
        orientationValid: false,
        parityValid: false,
        error: `Position illicite détectée sur une arête: ${detectedIdentity}`,
      };
    }

    edgePermutation.push(homeIndex);
    edgeIdentityCounts.set(
      detectedIdentity,
      (edgeIdentityCounts.get(detectedIdentity) ?? 0) + 1,
    );

    const referenceSticker =
      stickers.find((sticker) => ["W", "Y"].includes(sticker.color)) ??
      stickers.find((sticker) => ["G", "B"].includes(sticker.color));

    if (!referenceSticker) {
      return {
        centerValid,
        cornerValid,
        edgeValid: false,
        orientationValid: false,
        parityValid: false,
        error: `Orientation illicite détectée sur une arête: ${detectedIdentity}`,
      };
    }

    const flip = [0, 1].includes(referenceSticker.face) ? 0 : 1;
    edgeFlipSum = (edgeFlipSum + flip) % 2;
  }

  const edgeValid =
    edgeIdentityCounts.size === 12 &&
    Array.from(edgeIdentityCounts.values()).every((count) => count === 1);

  if (!edgeValid) {
    return {
      centerValid,
      cornerValid,
      edgeValid,
      orientationValid: false,
      parityValid: false,
      error: "Une ou plusieurs positions d'arête sont dupliquées ou manquantes",
    };
  }

  const parityValid =
    permutationParity(cornerPermutation) === permutationParity(edgePermutation);
  const orientationValid = cornerTwistSum === 0 && edgeFlipSum === 0;

  if (!orientationValid) {
    return {
      centerValid,
      cornerValid,
      edgeValid,
      orientationValid,
      parityValid,
      error: "Orientation illicite détectée (twist/flip impossible)",
    };
  }

  if (!parityValid) {
    return {
      centerValid,
      cornerValid,
      edgeValid,
      orientationValid,
      parityValid,
      error: "Permutation illicite détectée (parité impossible)",
    };
  }

  return {
    centerValid,
    cornerValid,
    edgeValid,
    orientationValid,
    parityValid,
    error: null,
  };
}

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
  return validateCube(state).valid;
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

  const legality = analyzeLegality(state);
  if (!legality.centerValid || !legality.cornerValid || !legality.edgeValid) {
    return legality.error;
  }

  if (!legality.orientationValid || !legality.parityValid) {
    return legality.error;
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
    centerValid: boolean;
    cornerValid: boolean;
    edgeValid: boolean;
    orientationValid: boolean;
    parityValid: boolean;
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
  const legality = structureValid
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
      colorCounts: counts,
    },
  };
}
