/**
 * Types TypeScript pour le Rubik's Cube
 */

export type FaceColor = "W" | "Y" | "R" | "O" | "B" | "G";

// État du cube : 6 faces × 3 rangées × 3 colonnes
// Faces : 0=Up 1=Down 2=Front 3=Back 4=Left 5=Right
export type CubeState = FaceColor[][][];

export type MoveNotation =
  | "U"
  | "U'"
  | "U2"
  | "D"
  | "D'"
  | "D2"
  | "R"
  | "R'"
  | "R2"
  | "L"
  | "L'"
  | "L2"
  | "F"
  | "F'"
  | "F2"
  | "B"
  | "B'"
  | "B2"
  | "M"
  | "M'"
  | "M2"
  | "E"
  | "E'"
  | "E2"
  | "S"
  | "S'"
  | "S2"
  | "x"
  | "x'"
  | "x2"
  | "y"
  | "y'"
  | "y2"
  | "z"
  | "z'"
  | "z2";

export type SolveMethod = "lbl" | "cfop" | "kociemba";

export interface SolveStep {
  id: string;
  phaseLabel: string; // ex. "Croix blanche"
  description: string; // Explication pédagogique
  moves: MoveNotation[]; // Séquence de mouvements
  tipUrl?: string; // Lien vers un schéma d'algo OLL/PLL
  highlightFaces?: number[]; // Faces à mettre en évidence dans la vue 3D
}

export interface CubeContextType {
  state: CubeState;
  isSolved: boolean;
  moveCount: number;
  applyMove: (move: MoveNotation) => void;
  reset: () => void;
  scramble: (numMoves: number) => void;
}

export interface SolverContextType {
  steps: SolveStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  animationSpeed: number;
  method: SolveMethod;
  startSolve: (method: SolveMethod, cubeState: CubeState) => Promise<void>;
  nextStep: () => void;
  previousStep: () => void;
  togglePlay: () => void;
  setSpeed: (speed: number) => void;
}

export interface AnimationState {
  currentMove: MoveNotation | null;
  progress: number;
  isAnimating: boolean;
}
