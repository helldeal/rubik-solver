/**
 * Maillage 3D du Rubik's Cube
 * Génère les 26 cubies avec les bonnes couleurs
 */

import React, { useMemo, useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { CubeState, MoveNotation } from "../../types/cube";

// Mapping des index d'une face en position (x, y, z) relative
// Face 0 (Up): z=1, Face 1 (Down): z=-1
// Face 2 (Front): y=-1, Face 3 (Back): y=1
// Face 4 (Left): x=-1, Face 5 (Right): x=1

interface CubiePosition {
  x: -1 | 0 | 1;
  y: -1 | 0 | 1;
  z: -1 | 0 | 1;
}

interface CubieFaces {
  top?: string;
  bottom?: string;
  front?: string;
  back?: string;
  left?: string;
  right?: string;
}

const COLOR_MAP: Record<string, THREE.Color> = {
  W: new THREE.Color(0xffffff), // Blanc
  Y: new THREE.Color(0xffff00), // Jaune
  R: new THREE.Color(0xff0000), // Rouge
  O: new THREE.Color(0xffa500), // Orange
  B: new THREE.Color(0x0000ff), // Bleu
  G: new THREE.Color(0x00aa00), // Vert
};

interface CubeMeshProps {
  cubeState: CubeState;
  move: MoveNotation | null;
  isAnimating: boolean;
  animationSpeed: number;
}

const CubeMesh: React.FC<CubeMeshProps> = ({
  cubeState,
  move,
  isAnimating,
  animationSpeed,
}) => {
  const [frameProgress, setFrameProgress] = useState(0);
  const animationRef = useRef({
    progress: 0,
    startTime: 0,
    duration: 450,
  });

  useEffect(() => {
    if (!isAnimating || !move) {
      animationRef.current.progress = 0;
      return;
    }

    animationRef.current = {
      progress: 0,
      startTime: performance.now(),
      duration: Math.max(120, 450 / animationSpeed),
    };
    setFrameProgress(0);
  }, [isAnimating, move, animationSpeed]);

  useFrame(() => {
    if (!isAnimating || !move) {
      setFrameProgress((prev) => (prev === 0 ? prev : 0));
      return;
    }

    const elapsed = performance.now() - animationRef.current.startTime;
    const nextProgress = Math.min(elapsed / animationRef.current.duration, 1);

    animationRef.current.progress = nextProgress;
    setFrameProgress((prev) =>
      Math.abs(prev - nextProgress) < 0.001 ? prev : nextProgress,
    );
  });

  const getActiveLayerInfo = () => {
    if (!isAnimating || !move) return null;

    const moveKey = move[0] as "U" | "D" | "R" | "L" | "F" | "B";
    const direction = move.includes("'") ? -1 : 1;
    const turns = move.includes("2") ? 2 : 1;
    const angle = (Math.PI / 2) * frameProgress * direction * turns;

    switch (moveKey) {
      case "U":
        return {
          axis: "z" as const,
          angle,
          matches: (position: CubiePosition) => position.z === 1,
        };
      case "D":
        return {
          axis: "z" as const,
          angle: -angle,
          matches: (position: CubiePosition) => position.z === -1,
        };
      case "R":
        return {
          axis: "x" as const,
          angle,
          matches: (position: CubiePosition) => position.x === 1,
        };
      case "L":
        return {
          axis: "x" as const,
          angle: -angle,
          matches: (position: CubiePosition) => position.x === -1,
        };
      case "F":
        return {
          axis: "y" as const,
          angle,
          matches: (position: CubiePosition) => position.y === -1,
        };
      case "B":
        return {
          axis: "y" as const,
          angle: -angle,
          matches: (position: CubiePosition) => position.y === 1,
        };
    }
  };

  // Générer tous les cubies
  const cubies = useMemo(() => {
    const result: Array<{
      position: CubiePosition;
      faces: CubieFaces;
    }> = [];

    // Pour chaque position du cube (3x3x3 - 1 (centre))
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          // Ignorer le cube central inexistant
          if (x === 0 && y === 0 && z === 0) continue;

          const faces: CubieFaces = {};

          // Déterminer les faces colorées de ce cubie
          // Face Up (z = 1)
          if (z === 1) {
            const faceIdx = x + 1;
            const rowIdx = 1 - y;
            faces.top = cubeState[0][rowIdx][faceIdx];
          }

          // Face Down (z = -1)
          if (z === -1) {
            const faceIdx = x + 1;
            const rowIdx = y + 1;
            faces.bottom = cubeState[1][rowIdx][faceIdx];
          }

          // Face Front (y = -1)
          if (y === -1) {
            const faceIdx = x + 1;
            const rowIdx = z + 1;
            faces.front = cubeState[2][rowIdx][faceIdx];
          }

          // Face Back (y = 1)
          if (y === 1) {
            const faceIdx = 2 - (x + 1);
            const rowIdx = z + 1;
            faces.back = cubeState[3][rowIdx][faceIdx];
          }

          // Face Left (x = -1)
          if (x === -1) {
            const faceIdx = 2 - (y + 1);
            const rowIdx = z + 1;
            faces.left = cubeState[4][rowIdx][faceIdx];
          }

          // Face Right (x = 1)
          if (x === 1) {
            const faceIdx = y + 1;
            const rowIdx = z + 1;
            faces.right = cubeState[5][rowIdx][faceIdx];
          }

          result.push({
            position: {
              x: x as -1 | 0 | 1,
              y: y as -1 | 0 | 1,
              z: z as -1 | 0 | 1,
            },
            faces,
          });
        }
      }
    }

    return result;
  }, [cubeState]);

  const activeLayer = getActiveLayerInfo();
  const staticCubies = activeLayer
    ? cubies.filter((cubie) => !activeLayer.matches(cubie.position))
    : cubies;
  const movingCubies = activeLayer
    ? cubies.filter((cubie) => activeLayer.matches(cubie.position))
    : [];

  const layerRotation: [number, number, number] = activeLayer
    ? activeLayer.axis === "x"
      ? [activeLayer.angle, 0, 0]
      : activeLayer.axis === "y"
        ? [0, activeLayer.angle, 0]
        : [0, 0, activeLayer.angle]
    : [0, 0, 0];

  return (
    <group>
      {staticCubies.map((cubie, idx) => (
        <Cubie
          key={`static-${idx}`}
          position={[cubie.position.x, cubie.position.y, cubie.position.z]}
          faces={cubie.faces}
          rotation={[0, 0, 0]}
        />
      ))}

      {activeLayer && movingCubies.length > 0 && (
        <group rotation={layerRotation}>
          {movingCubies.map((cubie, idx) => (
            <Cubie
              key={`moving-${idx}`}
              position={[cubie.position.x, cubie.position.y, cubie.position.z]}
              faces={cubie.faces}
              rotation={[0, 0, 0]}
            />
          ))}
        </group>
      )}
    </group>
  );
};

interface CubieProps {
  position: [number, number, number];
  faces: CubieFaces;
  rotation: [number, number, number];
}

const Cubie: React.FC<CubieProps> = ({ position, faces, rotation }) => {
  const meshRef = React.useRef<THREE.Group>(null);

  const CUBIE_SIZE = 0.88;
  const STICKER_SIZE = 0.78;
  const STICKER_OFFSET = CUBIE_SIZE / 2 + 0.01;

  return (
    <group ref={meshRef} position={position} rotation={rotation}>
      {/* Face Top */}
      {faces.top && (
        <mesh position={[0, 0, STICKER_OFFSET]} rotation={[0, 0, 0]}>
          <planeGeometry args={[STICKER_SIZE, STICKER_SIZE]} />
          <meshStandardMaterial
            color={COLOR_MAP[faces.top] || COLOR_MAP["W"]}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Face Bottom */}
      {faces.bottom && (
        <mesh position={[0, 0, -STICKER_OFFSET]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[STICKER_SIZE, STICKER_SIZE]} />
          <meshStandardMaterial
            color={COLOR_MAP[faces.bottom] || COLOR_MAP["W"]}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Face Front */}
      {faces.front && (
        <mesh position={[0, -STICKER_OFFSET, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[STICKER_SIZE, STICKER_SIZE]} />
          <meshStandardMaterial
            color={COLOR_MAP[faces.front] || COLOR_MAP["W"]}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Face Back */}
      {faces.back && (
        <mesh position={[0, STICKER_OFFSET, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[STICKER_SIZE, STICKER_SIZE]} />
          <meshStandardMaterial
            color={COLOR_MAP[faces.back] || COLOR_MAP["W"]}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Face Left */}
      {faces.left && (
        <mesh position={[-STICKER_OFFSET, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[STICKER_SIZE, STICKER_SIZE]} />
          <meshStandardMaterial
            color={COLOR_MAP[faces.left] || COLOR_MAP["W"]}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Face Right */}
      {faces.right && (
        <mesh position={[STICKER_OFFSET, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[STICKER_SIZE, STICKER_SIZE]} />
          <meshStandardMaterial
            color={COLOR_MAP[faces.right] || COLOR_MAP["W"]}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Corps noir du cubie */}
      <mesh>
        <boxGeometry args={[CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE]} />
        <meshStandardMaterial color={0x000000} />
      </mesh>
    </group>
  );
};

export default CubeMesh;
