import cubeSource from "cubejs/lib/cube.js?raw";
import solveSource from "cubejs/lib/solve.js?raw";
import type { CubeState, FaceColor, MoveNotation } from "../../types/cube";

const CUBEJS_FACE_ORDER = [0, 5, 2, 1, 4, 3] as const;
const CUBEJS_FACE_ROWS: Record<(typeof CUBEJS_FACE_ORDER)[number], number[]> = {
  0: [0, 1, 2],
  1: [0, 1, 2],
  2: [2, 1, 0],
  3: [2, 1, 0],
  4: [2, 1, 0],
  5: [2, 1, 0],
};
const CUBEJS_FACE_COLS = [0, 1, 2];

const COLOR_TO_FACE: Record<FaceColor, string> = {
  W: "U",
  Y: "D",
  G: "F",
  B: "B",
  O: "L",
  R: "R",
};

const SOLVER_SUPPORTED_MOVES = new Set<MoveNotation>([
  "U",
  "U'",
  "U2",
  "D",
  "D'",
  "D2",
  "R",
  "R'",
  "R2",
  "L",
  "L'",
  "L2",
  "F",
  "F'",
  "F2",
  "B",
  "B'",
  "B2",
]);

const CUBEJS_TO_MODEL_MOVE: Record<MoveNotation, MoveNotation> = {
  U: "U'",
  "U'": "U",
  U2: "U2",
  D: "D'",
  "D'": "D",
  D2: "D2",
  R: "R'",
  "R'": "R",
  R2: "R2",
  L: "L'",
  "L'": "L",
  L2: "L2",
  F: "F",
  "F'": "F'",
  F2: "F2",
  B: "B",
  "B'": "B'",
  B2: "B2",
  M: "M",
  "M'": "M'",
  M2: "M2",
  E: "E",
  "E'": "E'",
  E2: "E2",
  S: "S",
  "S'": "S'",
  S2: "S2",
  x: "x",
  "x'": "x'",
  x2: "x2",
  y: "y",
  "y'": "y'",
  y2: "y2",
  z: "z",
  "z'": "z'",
  z2: "z2",
};

type SolverWorkerResponse =
  | { id: number; ok: true; solution: string }
  | { id: number; ok: false; error: string };

let solverWorker: Worker | null = null;
let nextRequestId = 1;

function getSolverWorker(): Worker {
  if (solverWorker) return solverWorker;

  const workerSource = `
${cubeSource}
${solveSource}
let initialized = false;
self.onmessage = function(event) {
  const id = event.data.id;
  try {
    if (!initialized) {
      self.Cube.initSolver();
      initialized = true;
    }
    const cube = self.Cube.fromString(event.data.facelets);
    self.postMessage({ id, ok: true, solution: cube.solve() });
  } catch (error) {
    self.postMessage({
      id,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
`;
  const workerUrl = URL.createObjectURL(
    new Blob([workerSource], { type: "text/javascript" }),
  );

  solverWorker = new Worker(workerUrl);
  URL.revokeObjectURL(workerUrl);
  return solverWorker;
}

function solveFacelets(facelets: string): Promise<string> {
  const worker = getSolverWorker();
  const id = nextRequestId++;

  return new Promise((resolve, reject) => {
    const handleMessage = (event: MessageEvent<SolverWorkerResponse>) => {
      if (event.data.id !== id) return;

      worker.removeEventListener("message", handleMessage);

      if (event.data.ok) {
        resolve(event.data.solution);
      } else {
        reject(new Error(event.data.error));
      }
    };

    worker.addEventListener("message", handleMessage);
    worker.postMessage({ id, facelets });
  });
}

export function cubeStateToCubeJsFacelets(state: CubeState): string {
  return CUBEJS_FACE_ORDER.flatMap((faceIndex) =>
    CUBEJS_FACE_ROWS[faceIndex].flatMap((rowIndex) =>
      CUBEJS_FACE_COLS.map(
        (colIndex) => COLOR_TO_FACE[state[faceIndex][rowIndex][colIndex]],
      ),
    ),
  ).join("");
}

export function parseSolverMoves(solution: string): MoveNotation[] {
  if (!solution.trim()) return [];

  return solution
    .trim()
    .split(/\s+/)
    .filter((move): move is MoveNotation =>
      SOLVER_SUPPORTED_MOVES.has(move as MoveNotation),
    )
    .map((move) => CUBEJS_TO_MODEL_MOVE[move]);
}

export async function solveCubeState(state: CubeState): Promise<MoveNotation[]> {
  const solution = await solveFacelets(cubeStateToCubeJsFacelets(state));
  return parseSolverMoves(solution);
}
