/**
 * Scène Three.js avec React Three Fiber
 * Affiche le cube 3D interactif
 */

import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import CubeMesh from "./CubeMesh";
import { useCubeState } from "../../hooks/useCubeState";
import { useCubeStore } from "../../store/cubeStore";

const FaceLabels: React.FC = () => {
  const labels: Array<{
    face: "U" | "D" | "F" | "B" | "L" | "R";
    position: [number, number, number];
    color: string;
  }> = [
    { face: "U", position: [0, 0, 2.05], color: "#f8f9fa" },
    { face: "D", position: [0, 0, -2.05], color: "#ffe066" },
    { face: "F", position: [0, -2.05, 0], color: "#ff6b6b" },
    { face: "B", position: [0, 2.05, 0], color: "#f4a261" },
    { face: "L", position: [-2.05, 0, 0], color: "#4dabf7" },
    { face: "R", position: [2.05, 0, 0], color: "#51cf66" },
  ];

  return (
    <group>
      {labels.map((label) => (
        <mesh key={label.face} position={label.position}>
          <sphereGeometry args={[0.09, 18, 18]} />
          <meshStandardMaterial
            color={label.color}
            emissive={label.color}
            emissiveIntensity={0.25}
          />
        </mesh>
      ))}

      <axesHelper args={[2.6]} />
    </group>
  );
};

const CubeScene: React.FC = () => {
  const { state, currentMove, isAnimating } = useCubeState();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const animationSpeed = useCubeStore((s) => s.animationSpeed);

  return (
    <Canvas
      className="w-full h-full"
      camera={{ position: [3, 3, 3], fov: 75 }}
      gl={{ antialias: true }}
    >
      <PerspectiveCamera ref={cameraRef} />

      {/* Éclairage */}
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[10, 10, 10]}
        intensity={0.8}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-10, -10, -10]} intensity={0.3} />

      {/* Cube maillage */}
      <CubeMesh
        cubeState={state}
        move={currentMove}
        isAnimating={isAnimating}
        animationSpeed={animationSpeed}
      />

      {/* Repères des faces */}
      <FaceLabels />

      {/* Contrôles d'orbite */}
      <OrbitControls
        autoRotate={false}
        enableZoom
        enableDamping
        dampingFactor={0.05}
      />
    </Canvas>
  );
};

export default CubeScene;
