/**
 * Aperçu 3D compact du cube pour l'éditeur 2D
 */

import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import type { CubeState } from "../../types/cube";
import CubeMesh from "./CubeMesh";

interface CubePreview3DProps {
  cubeState: CubeState;
}

const CubePreview3D: React.FC<CubePreview3DProps> = ({ cubeState }) => {
  const sceneRotation: [number, number, number] = [-Math.PI / 2, 0, 0];

  return (
    <div className="h-72 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-inner sm:h-80">
      <Canvas className="h-full w-full" gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[4.8, 4.8, 4.8]} fov={55} />

        <ambientLight intensity={0.85} />
        <directionalLight position={[8, 10, 8]} intensity={0.9} />
        <directionalLight position={[-6, -6, -6]} intensity={0.25} />

        <group rotation={sceneRotation}>
          <CubeMesh
            cubeState={cubeState}
            move={null}
            isAnimating={false}
            animationSpeed={1}
          />
        </group>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate={false}
          enableDamping
          dampingFactor={0.08}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
};

export default CubePreview3D;
