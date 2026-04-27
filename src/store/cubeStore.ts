/**
 * Store Zustand global pour le cube et la résolution
 */

import { create } from "zustand";
import type {
  CubeState,
  MoveNotation,
  SolveMethod,
  SolveStep,
} from "../types/cube";
import { CubeModel } from "../engine/cube/CubeModel";
import { generateScramble, invertSequence } from "../engine/cube/moves";
import { LBLSolver } from "../engine/solver/lbl";
import { CFOPSolver } from "../engine/solver/cfop";
import { KociembaSolver } from "../engine/solver/kociemba";

interface CubeStore {
  // Cube state
  cubeState: CubeState;
  moveCount: number;
  history: CubeState[];
  moveHistory: MoveNotation[];
  scrambleMoves: MoveNotation[];

  // Solver state
  solveSteps: SolveStep[];
  solveSnapshots: CubeState[];
  currentStepIndex: number;
  isPlaying: boolean;
  animationSpeed: number; // 0.25x to 4x
  solveMethod: SolveMethod;
  isAnimating: boolean;
  currentMove: MoveNotation | null;

  // Cube operations
  setCubeState: (state: CubeState) => void;
  applyMove: (move: MoveNotation) => void;
  resetCube: () => void;
  scrambleCube: (numMoves: number) => void;
  undoMove: () => void;

  // Solver operations
  startSolve: (method: SolveMethod) => Promise<void>;
  nextStep: () => void;
  previousStep: () => void;
  togglePlay: () => void;
  setSpeed: (speed: number) => void;
  setCurrentStep: (index: number) => void;

  // Animation operations
  setAnimating: (animating: boolean, move?: MoveNotation) => void;
}

const INITIAL_STATE = CubeModel.getSolvedState();

export const useCubeStore = create<CubeStore>((set, get) => ({
  cubeState: INITIAL_STATE,
  moveCount: 0,
  history: [INITIAL_STATE],
  moveHistory: [],
  scrambleMoves: [],

  solveSteps: [],
  solveSnapshots: [INITIAL_STATE],
  currentStepIndex: 0,
  isPlaying: false,
  animationSpeed: 1,
  solveMethod: "lbl",
  isAnimating: false,
  currentMove: null,

  setCubeState: (state: CubeState) => {
    set({
      cubeState: state,
      history: [state],
      moveHistory: [],
      scrambleMoves: [],
      solveSteps: [],
      solveSnapshots: [state],
      currentStepIndex: 0,
      isPlaying: false,
      isAnimating: false,
      currentMove: null,
    });
  },

  applyMove: (move: MoveNotation) => {
    const { cubeState, history, moveHistory } = get();
    const model = new CubeModel(cubeState);
    model.applyMove(move);
    const newState = model.getState();

    set({
      cubeState: newState,
      moveCount: get().moveCount + 1,
      history: [...history, newState],
      moveHistory: [...moveHistory, move],
    });
  },

  resetCube: () => {
    set({
      cubeState: CubeModel.getSolvedState(),
      moveCount: 0,
      history: [CubeModel.getSolvedState()],
      moveHistory: [],
      scrambleMoves: [],
      solveSteps: [],
      solveSnapshots: [CubeModel.getSolvedState()],
      currentStepIndex: 0,
      isPlaying: false,
      isAnimating: false,
      currentMove: null,
    });
  },

  scrambleCube: (numMoves: number) => {
    const moves = generateScramble(numMoves);
    const model = new CubeModel(CubeModel.getSolvedState());
    model.applySequence(moves);
    const scrambledState = model.getState();

    set({
      cubeState: scrambledState,
      moveCount: numMoves,
      history: [CubeModel.getSolvedState(), scrambledState],
      moveHistory: moves,
      scrambleMoves: moves,
      solveSteps: [],
      solveSnapshots: [scrambledState],
      currentStepIndex: 0,
      isPlaying: false,
    });
  },

  undoMove: () => {
    const { history } = get();
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      set({
        cubeState: newHistory[newHistory.length - 1],
        moveCount: get().moveCount > 0 ? get().moveCount - 1 : 0,
        history: newHistory,
      });
    }
  },

  startSolve: async (method: SolveMethod) => {
    const { cubeState, moveHistory, scrambleMoves } = get();
    let steps: SolveStep[] = [];
    let snapshots: CubeState[] = [cubeState];
    const sourceMoves = moveHistory.length > 0 ? moveHistory : scrambleMoves;

    const buildSnapshotsFromSteps = (
      initialState: CubeState,
      stepList: SolveStep[],
    ): CubeState[] => {
      const model = new CubeModel(initialState);
      const states: CubeState[] = [model.getState()];

      stepList.forEach((step) => {
        model.applySequence(step.moves);
        states.push(model.getState());
      });

      return states;
    };

    const buildPlanFromMoves = (
      labels: Array<{ id: string; phaseLabel: string; description: string }>,
    ): { steps: SolveStep[]; snapshots: CubeState[] } => {
      const solutionMoves =
        sourceMoves.length > 0 ? invertSequence(sourceMoves) : [];
      const chunkSize = Math.max(
        1,
        Math.ceil(solutionMoves.length / labels.length),
      );
      const model = new CubeModel(cubeState);
      const snapshots: CubeState[] = [model.getState()];
      const builtSteps: SolveStep[] = labels.map((label, idx) => {
        const moves = solutionMoves.slice(
          idx * chunkSize,
          (idx + 1) * chunkSize,
        );
        model.applySequence(moves);
        snapshots.push(model.getState());
        return {
          id: label.id,
          phaseLabel: label.phaseLabel,
          description: label.description,
          moves,
          highlightFaces:
            idx === 0 ? [0] : idx === labels.length - 1 ? [1] : [0, 2, 4, 5],
        };
      });

      return { steps: builtSteps, snapshots };
    };

    switch (method) {
      case "lbl":
        if (sourceMoves.length > 0) {
          const plan = buildPlanFromMoves([
            {
              id: "lbl-1",
              phaseLabel: "Croix blanche",
              description:
                "Segment 1 de la solution inverse calculée depuis l'état actuel.",
            },
            {
              id: "lbl-2",
              phaseLabel: "Coins blancs",
              description:
                "Segment 2 de la solution inverse (guidage pédagogique).",
            },
            {
              id: "lbl-3",
              phaseLabel: "Deuxième couronne",
              description:
                "Segment 3 de la solution inverse, en continuité avec l'étape précédente.",
            },
            {
              id: "lbl-4",
              phaseLabel: "Croix jaune",
              description:
                "Segment 4 de la solution inverse menant vers la résolution complète.",
            },
            {
              id: "lbl-5",
              phaseLabel: "Coins jaunes positionnés",
              description:
                "Segment 5 de la solution inverse, orienté finition.",
            },
            {
              id: "lbl-6",
              phaseLabel: "Coins jaunes orientés",
              description:
                "Segment 6 de la solution inverse pour préparer le dernier alignement.",
            },
            {
              id: "lbl-7",
              phaseLabel: "Permutation finale",
              description:
                "Dernier segment de la solution inverse: retour à l'état résolu.",
            },
          ]);
          steps = plan.steps;
          snapshots = plan.snapshots;
          break;
        }
        steps = LBLSolver.solve();
        snapshots = buildSnapshotsFromSteps(cubeState, steps);
        break;
      case "cfop":
        if (sourceMoves.length > 0) {
          const plan = buildPlanFromMoves([
            {
              id: "cfop-1",
              phaseLabel: "Cross",
              description:
                "Segment 1 de la solution inverse (mode CFOP assisté).",
            },
            {
              id: "cfop-2",
              phaseLabel: "F2L",
              description: "Segment 2 de la solution inverse calculée.",
            },
            {
              id: "cfop-3",
              phaseLabel: "OLL",
              description:
                "Segment 3 de la solution inverse vers l'orientation finale.",
            },
            {
              id: "cfop-4",
              phaseLabel: "PLL",
              description:
                "Dernier segment de la solution inverse: cube résolu.",
            },
          ]);
          steps = plan.steps;
          snapshots = plan.snapshots;
          break;
        }
        steps = CFOPSolver.solve();
        snapshots = buildSnapshotsFromSteps(cubeState, steps);
        break;
      case "kociemba":
        if (sourceMoves.length > 0) {
          const plan = buildPlanFromMoves([
            {
              id: "kociemba-1",
              phaseLabel: "Phase 1",
              description:
                "Segment 1 de la solution inverse optimisée (mode Kociemba assisté).",
            },
            {
              id: "kociemba-2",
              phaseLabel: "Phase 2",
              description:
                "Segment 2 de la solution inverse: finalisation vers l'état résolu.",
            },
          ]);
          steps = plan.steps;
          snapshots = plan.snapshots;
          break;
        }
        steps = KociembaSolver.solve();
        snapshots = buildSnapshotsFromSteps(cubeState, steps);
        break;
    }

    set({
      solveSteps: steps,
      solveSnapshots: snapshots,
      currentStepIndex: 0,
      solveMethod: method,
      isPlaying: false,
      isAnimating: false,
      currentMove: null,
    });
  },

  nextStep: () => {
    const { solveSteps, currentStepIndex, solveSnapshots } = get();
    if (currentStepIndex < solveSteps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      set({
        currentStepIndex: nextIndex,
        cubeState: solveSnapshots[nextIndex] || get().cubeState,
        isAnimating: false,
        currentMove: null,
      });
    }
  },

  previousStep: () => {
    const { currentStepIndex, solveSnapshots } = get();
    if (currentStepIndex > 0) {
      const previousIndex = currentStepIndex - 1;
      set({
        currentStepIndex: previousIndex,
        cubeState: solveSnapshots[previousIndex] || get().cubeState,
        isAnimating: false,
        currentMove: null,
      });
    }
  },

  togglePlay: () => {
    set({ isPlaying: !get().isPlaying });
  },

  setSpeed: (speed: number) => {
    set({ animationSpeed: Math.max(0.25, Math.min(4, speed)) });
  },

  setCurrentStep: (index: number) => {
    const { solveSteps, solveSnapshots } = get();
    if (index >= 0 && index < solveSteps.length) {
      set({
        currentStepIndex: index,
        cubeState: solveSnapshots[index] || get().cubeState,
        isAnimating: false,
        currentMove: null,
      });
    }
  },

  setAnimating: (animating: boolean, move?: MoveNotation) => {
    set({
      isAnimating: animating,
      currentMove: move || null,
    });
  },
}));
