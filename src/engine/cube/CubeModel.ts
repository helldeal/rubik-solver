/**
 * Modèle de données pour le Rubik's Cube
 * État représenté comme une matrice 6×3×3 où chaque face a 9 facettes
 *
 * Indexation des faces:
 * 0 = Up (blanc)
 * 1 = Down (jaune)
 * 2 = Front (rouge)
 * 3 = Back (orange)
 * 4 = Left (vert)
 * 5 = Right (bleu)
 */

import type { FaceColor, CubeState, MoveNotation } from "../../types/cube";

// Mapping des index d'une face en matrice 3x3
// [0][1][2]
// [3][4][5]
// [6][7][8]

const SOLVED_STATE: CubeState = [
  [
    ["W", "W", "W"],
    ["W", "W", "W"],
    ["W", "W", "W"],
  ], // Up (blanc)
  [
    ["Y", "Y", "Y"],
    ["Y", "Y", "Y"],
    ["Y", "Y", "Y"],
  ], // Down (jaune)
  [
    ["R", "R", "R"],
    ["R", "R", "R"],
    ["R", "R", "R"],
  ], // Front (rouge)
  [
    ["O", "O", "O"],
    ["O", "O", "O"],
    ["O", "O", "O"],
  ], // Back (orange)
  [
    ["G", "G", "G"],
    ["G", "G", "G"],
    ["G", "G", "G"],
  ], // Left (vert)
  [
    ["B", "B", "B"],
    ["B", "B", "B"],
    ["B", "B", "B"],
  ], // Right (bleu)
];

export class CubeModel {
  private state: CubeState;

  private static readonly FACE_U = 0;
  private static readonly FACE_D = 1;
  private static readonly FACE_F = 2;
  private static readonly FACE_B = 3;
  private static readonly FACE_L = 4;
  private static readonly FACE_R = 5;

  constructor(initialState?: CubeState) {
    this.state = initialState
      ? this.deepClone(initialState)
      : this.deepClone(SOLVED_STATE);
  }

  /**
   * Retourne une copie du state actuel
   */
  getState(): CubeState {
    return this.deepClone(this.state);
  }

  /**
   * Restaure l'état du cube à l'état résolu
   */
  reset(): void {
    this.state = this.deepClone(SOLVED_STATE);
  }

  /**
   * Clone profond d'un état de cube
   */
  private deepClone(state: CubeState): CubeState {
    return state.map((face) => face.map((row) => [...row]));
  }

  /**
   * Définit un nouvel état du cube
   */
  setState(newState: CubeState): void {
    this.state = this.deepClone(newState);
  }

  /**
   * Vérifie si le cube est résolu
   */
  isSolved(): boolean {
    return SOLVED_STATE.every((face, faceIdx: number) =>
      face.every((row, rowIdx: number) =>
        row.every(
          (color, colIdx: number) =>
            color === this.state[faceIdx][rowIdx][colIdx],
        ),
      ),
    );
  }

  /**
   * Sérialise l'état en string pour sauvegarde/comparaison
   */
  serialize(): string {
    return JSON.stringify(this.state);
  }

  /**
   * Désérialise un état depuis une string
   */
  static deserialize(data: string): CubeModel {
    try {
      const state = JSON.parse(data) as CubeState;
      return new CubeModel(state);
    } catch {
      return new CubeModel();
    }
  }

  /**
   * Retourne l'état résolu de référence
   */
  static getSolvedState(): CubeState {
    return SOLVED_STATE.map((face) => face.map((row) => [...row]));
  }

  private createEmptyState(): CubeState {
    return [0, 1, 2, 3, 4, 5].map(() =>
      [0, 1, 2].map(() => ["W", "W", "W"] as FaceColor[]),
    ) as CubeState;
  }

  private stateToStickers(): Array<{
    x: -1 | 0 | 1;
    y: -1 | 0 | 1;
    z: -1 | 0 | 1;
    nx: -1 | 0 | 1;
    ny: -1 | 0 | 1;
    nz: -1 | 0 | 1;
    color: FaceColor;
  }> {
    const stickers: Array<{
      x: -1 | 0 | 1;
      y: -1 | 0 | 1;
      z: -1 | 0 | 1;
      nx: -1 | 0 | 1;
      ny: -1 | 0 | 1;
      nz: -1 | 0 | 1;
      color: FaceColor;
    }> = [];

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        stickers.push({
          x: (col - 1) as -1 | 0 | 1,
          y: (1 - row) as -1 | 0 | 1,
          z: 1,
          nx: 0,
          ny: 0,
          nz: 1,
          color: this.state[CubeModel.FACE_U][row][col],
        });

        stickers.push({
          x: (col - 1) as -1 | 0 | 1,
          y: (row - 1) as -1 | 0 | 1,
          z: -1,
          nx: 0,
          ny: 0,
          nz: -1,
          color: this.state[CubeModel.FACE_D][row][col],
        });

        stickers.push({
          x: (col - 1) as -1 | 0 | 1,
          y: -1,
          z: (row - 1) as -1 | 0 | 1,
          nx: 0,
          ny: -1,
          nz: 0,
          color: this.state[CubeModel.FACE_F][row][col],
        });

        stickers.push({
          x: (1 - col) as -1 | 0 | 1,
          y: 1,
          z: (row - 1) as -1 | 0 | 1,
          nx: 0,
          ny: 1,
          nz: 0,
          color: this.state[CubeModel.FACE_B][row][col],
        });

        stickers.push({
          x: -1,
          y: (1 - col) as -1 | 0 | 1,
          z: (row - 1) as -1 | 0 | 1,
          nx: -1,
          ny: 0,
          nz: 0,
          color: this.state[CubeModel.FACE_L][row][col],
        });

        stickers.push({
          x: 1,
          y: (col - 1) as -1 | 0 | 1,
          z: (row - 1) as -1 | 0 | 1,
          nx: 1,
          ny: 0,
          nz: 0,
          color: this.state[CubeModel.FACE_R][row][col],
        });
      }
    }

    return stickers;
  }

  private stickersToState(
    stickers: Array<{
      x: -1 | 0 | 1;
      y: -1 | 0 | 1;
      z: -1 | 0 | 1;
      nx: -1 | 0 | 1;
      ny: -1 | 0 | 1;
      nz: -1 | 0 | 1;
      color: FaceColor;
    }>,
  ): CubeState {
    const nextState = this.createEmptyState();

    stickers.forEach((sticker) => {
      if (sticker.nz === 1) {
        const row = 1 - sticker.y;
        const col = sticker.x + 1;
        nextState[CubeModel.FACE_U][row][col] = sticker.color;
        return;
      }

      if (sticker.nz === -1) {
        const row = sticker.y + 1;
        const col = sticker.x + 1;
        nextState[CubeModel.FACE_D][row][col] = sticker.color;
        return;
      }

      if (sticker.ny === -1) {
        const row = sticker.z + 1;
        const col = sticker.x + 1;
        nextState[CubeModel.FACE_F][row][col] = sticker.color;
        return;
      }

      if (sticker.ny === 1) {
        const row = sticker.z + 1;
        const col = 1 - sticker.x;
        nextState[CubeModel.FACE_B][row][col] = sticker.color;
        return;
      }

      if (sticker.nx === -1) {
        const row = sticker.z + 1;
        const col = 1 - sticker.y;
        nextState[CubeModel.FACE_L][row][col] = sticker.color;
        return;
      }

      if (sticker.nx === 1) {
        const row = sticker.z + 1;
        const col = sticker.y + 1;
        nextState[CubeModel.FACE_R][row][col] = sticker.color;
      }
    });

    return nextState;
  }

  private rotateVector(
    x: -1 | 0 | 1,
    y: -1 | 0 | 1,
    z: -1 | 0 | 1,
    axis: "x" | "y" | "z",
    dir: 1 | -1,
  ): [-1 | 0 | 1, -1 | 0 | 1, -1 | 0 | 1] {
    if (axis === "x") {
      return dir === 1 ? [x, -z as -1 | 0 | 1, y] : [x, z, -y as -1 | 0 | 1];
    }

    if (axis === "y") {
      return dir === 1 ? [z, y, -x as -1 | 0 | 1] : [-z as -1 | 0 | 1, y, x];
    }

    return dir === 1 ? [-y as -1 | 0 | 1, x, z] : [y, -x as -1 | 0 | 1, z];
  }

  private rotateLayer(
    axis: "x" | "y" | "z",
    layer: -1 | 0 | 1,
    dir: 1 | -1,
    quarterTurns: 1 | 2,
  ): void {
    let stickers = this.stateToStickers();

    for (let t = 0; t < quarterTurns; t++) {
      stickers = stickers.map((sticker) => {
        const coordOnAxis =
          axis === "x" ? sticker.x : axis === "y" ? sticker.y : sticker.z;

        if (coordOnAxis !== layer) return sticker;

        const [x, y, z] = this.rotateVector(
          sticker.x,
          sticker.y,
          sticker.z,
          axis,
          dir,
        );
        const [nx, ny, nz] = this.rotateVector(
          sticker.nx,
          sticker.ny,
          sticker.nz,
          axis,
          dir,
        );

        return {
          ...sticker,
          x,
          y,
          z,
          nx,
          ny,
          nz,
        };
      });
    }

    this.state = this.stickersToState(stickers);
  }

  moveU(): void {
    this.rotateLayer("z", 1, 1, 1);
  }

  moveUPrime(): void {
    this.rotateLayer("z", 1, -1, 1);
  }

  moveU2(): void {
    this.rotateLayer("z", 1, 1, 2);
  }

  moveD(): void {
    this.rotateLayer("z", -1, -1, 1);
  }

  moveDPrime(): void {
    this.rotateLayer("z", -1, 1, 1);
  }

  moveD2(): void {
    this.rotateLayer("z", -1, -1, 2);
  }

  moveL(): void {
    this.rotateLayer("x", -1, -1, 1);
  }

  moveLPrime(): void {
    this.rotateLayer("x", -1, 1, 1);
  }

  moveL2(): void {
    this.rotateLayer("x", -1, -1, 2);
  }

  moveR(): void {
    this.rotateLayer("x", 1, 1, 1);
  }

  moveRPrime(): void {
    this.rotateLayer("x", 1, -1, 1);
  }

  moveR2(): void {
    this.rotateLayer("x", 1, 1, 2);
  }

  moveF(): void {
    this.rotateLayer("y", -1, 1, 1);
  }

  moveFPrime(): void {
    this.rotateLayer("y", -1, -1, 1);
  }

  moveF2(): void {
    this.rotateLayer("y", -1, 1, 2);
  }

  moveB(): void {
    this.rotateLayer("y", 1, -1, 1);
  }

  moveBPrime(): void {
    this.rotateLayer("y", 1, 1, 1);
  }

  moveB2(): void {
    this.rotateLayer("y", 1, -1, 2);
  }

  /**
   * Applique un move notifié en notation Singmaster
   */
  applyMove(move: MoveNotation): void {
    switch (move) {
      case "U":
        this.moveU();
        break;
      case "U'":
        this.moveUPrime();
        break;
      case "U2":
        this.moveU2();
        break;
      case "D":
        this.moveD();
        break;
      case "D'":
        this.moveDPrime();
        break;
      case "D2":
        this.moveD2();
        break;
      case "L":
        this.moveL();
        break;
      case "L'":
        this.moveLPrime();
        break;
      case "L2":
        this.moveL2();
        break;
      case "R":
        this.moveR();
        break;
      case "R'":
        this.moveRPrime();
        break;
      case "R2":
        this.moveR2();
        break;
      case "F":
        this.moveF();
        break;
      case "F'":
        this.moveFPrime();
        break;
      case "F2":
        this.moveF2();
        break;
      case "B":
        this.moveB();
        break;
      case "B'":
        this.moveBPrime();
        break;
      case "B2":
        this.moveB2();
        break;
      default: // Ignorer les mouvements non reconnus
        console.warn(`Unknown move: ${move}`);
    }
  }

  /**
   * Applique une séquence de mouvements
   */
  applySequence(moves: MoveNotation[]): void {
    moves.forEach((move) => this.applyMove(move));
  }
}
