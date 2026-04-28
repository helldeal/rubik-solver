declare module "cubejs" {
  import type { MoveNotation } from "./cube";

  type CubeAlgorithm = string | MoveNotation[] | MoveNotation;

  class Cube {
    constructor(state?: unknown);
    static initSolver(): void;
    static fromString(state: string): Cube;
    static inverse(algorithm: CubeAlgorithm): string;
    asString(): string;
    isSolved(): boolean;
    move(algorithm: CubeAlgorithm): Cube;
    solve(maxDepth?: number): string;
  }

  export = Cube;
}

declare module "cubejs/lib/*.js?raw" {
  const source: string;
  export default source;
}
