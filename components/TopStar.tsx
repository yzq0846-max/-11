import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { TreeState } from '../types';
import { TREE_CONFIG, TRANSITION_SPEED, COLORS } from '../constants';

interface TopStarProps {
  state: TreeState;
}

export const TopStar: React.FC<TopStarProps> = ({ state }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Define positions
  const treePos = useMemo(() => new THREE.Vector3(0, TREE_CONFIG.treeHeight / 2 + 0.5, 0), []);
  const scatterPos = useMemo(() => new THREE.Vector3(15, 15, -10), []); // Fixed scatter pos or random

  useFrame((stateThree, delta) => {
    if (!groupRef.current) return;

    // Morph logic similar to TreeParticles but simplified for single object
    const targetMorph = state === TreeState.TREE_SHAPE ? 1 : 0;
    
    if (groupRef.current.userData.morph === undefined) groupRef.current.userData.morph = 0;

    easing.damp(
        groupRef.current.userData, 
        'morph', 
        targetMorph, 
        TRANSITION_SPEED, 
        delta
    );

    const morph = groupRef.current.userData.morph;
    
    // Position interpolation
    groupRef.current.position.lerpVectors(scatterPos, treePos, morph);
    
    // Rotation: Spin faster when assembled
    groupRef.current.rotation.y += delta * (0.5 + morph * 1.5);
    groupRef.current.rotation.z = Math.sin(stateThree.clock.getElapsedTime()) * 0.1 * morph;

    // Scale pulsing
    const scale = 1 + Math.sin(stateThree.clock.getElapsedTime() * 2) * 0.1 * morph;
    groupRef.current.scale.setScalar(scale);
  });

  return (
    <group ref={groupRef}>
        {/* Main Star Body */}
        <mesh castShadow>
            <icosahedronGeometry args={[0.8, 0]} />
            <meshStandardMaterial 
                color={COLORS.GOLD_METALLIC} 
                emissive={COLORS.GOLD_METALLIC}
                emissiveIntensity={2} // Very bright
                roughness={0}
                metalness={1}
                toneMapped={false}
            />
        </mesh>
        
        {/* Inner Halo */}
        <pointLight intensity={5} color="#ffd700" distance={5} decay={2} />
    </group>
  );
};
