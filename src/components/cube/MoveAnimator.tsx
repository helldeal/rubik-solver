/**
 * Composant pour animer les rotations de cube
 * Utilise useFrame pour animer les mouvements
 */

import React, { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MoveNotation } from "../../types/cube";

interface MoveAnimatorProps {
  move: MoveNotation | null;
  isAnimating: boolean;
  cubeGroupRef?: React.RefObject<THREE.Group | null>;
}

const MoveAnimator: React.FC<MoveAnimatorProps> = ({
  move,
  isAnimating,
  cubeGroupRef,
}) => {
  const animationRef = useRef({
    isActive: false,
    progress: 0,
    startTime: 0,
    duration: 300, // 300ms par défaut
    startRotation: { x: 0, y: 0, z: 0 },
  });

  useEffect(() => {
    if (move && isAnimating && cubeGroupRef?.current) {
      // Sauvegarder la rotation actuelle
      const current = cubeGroupRef.current;
      animationRef.current = {
        isActive: true,
        progress: 0,
        startTime: performance.now(),
        duration: 300,
        startRotation: {
          x: current.rotation.x,
          y: current.rotation.y,
          z: current.rotation.z,
        },
      };
    }
  }, [move, isAnimating, cubeGroupRef]);

  useFrame(() => {
    if (!cubeGroupRef?.current || !animationRef.current.isActive) return;

    const elapsed = performance.now() - animationRef.current.startTime;
    const progress = Math.min(elapsed / animationRef.current.duration, 1);
    const group = cubeGroupRef.current;

    // Calculer l'angle de rotation basé sur le move
    if (move) {
      const anglePerMove = Math.PI / 2; // 90 degrés
      const totalAngle = anglePerMove * progress;

      // Réinitialiser la rotation à la position de départ
      group.rotation.x = animationRef.current.startRotation.x;
      group.rotation.y = animationRef.current.startRotation.y;
      group.rotation.z = animationRef.current.startRotation.z;

      // Appliquer la rotation selon le move
      const moveStr = move.toString();
      const direction = moveStr.includes("'") ? -1 : 1;
      const isDouble = moveStr.includes("2") ? 2 : 1;

      switch (moveStr[0]) {
        case "U":
          group.rotation.z += totalAngle * direction * isDouble;
          break;
        case "D":
          group.rotation.z -= totalAngle * direction * isDouble;
          break;
        case "R":
          group.rotation.x += totalAngle * direction * isDouble;
          break;
        case "L":
          group.rotation.x -= totalAngle * direction * isDouble;
          break;
        case "F":
          group.rotation.y += totalAngle * direction * isDouble;
          break;
        case "B":
          group.rotation.y -= totalAngle * direction * isDouble;
          break;
      }
    }

    // Animation terminée?
    if (progress >= 1) {
      animationRef.current.isActive = false;
      // Réinitialiser à la position de départ
      if (group) {
        group.rotation.x = animationRef.current.startRotation.x;
        group.rotation.y = animationRef.current.startRotation.y;
        group.rotation.z = animationRef.current.startRotation.z;
      }
    }

    animationRef.current.progress = progress;
  });

  // Ce composant n'a besoin de rien rendre
  return null;
};

export default MoveAnimator;
