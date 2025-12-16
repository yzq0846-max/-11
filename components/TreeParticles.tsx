import React, { useMemo, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { TreeState, ParticleData } from '../types';
import { TREE_CONFIG, COLORS, TRANSITION_SPEED } from '../constants';

interface TreeParticlesProps {
  state: TreeState;
  type: 'NEEDLE' | 'ORNAMENT' | 'GIFT' | 'STAR';
}

export const TreeParticles: React.FC<TreeParticlesProps> = ({ state, type }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  let count = 0;
  if (type === 'NEEDLE') count = TREE_CONFIG.needleCount;
  if (type === 'ORNAMENT') count = TREE_CONFIG.ornamentCount;
  if (type === 'GIFT') count = TREE_CONFIG.giftCount;
  if (type === 'STAR') count = TREE_CONFIG.starCount;

  // Dummy object for matrix calculations
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Pre-calculate positions
  const particles = useMemo(() => {
    const data: ParticleData[] = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const angleIncrement = Math.PI * 2 * goldenRatio;

    // Palette for gifts
    const giftPalette = [COLORS.RED_VELVET, COLORS.ROYAL_BLUE, COLORS.GOLD_METALLIC, COLORS.SILVER, COLORS.EMERALD_DEEP];

    for (let i = 0; i < count; i++) {
      // 1. Calculate Tree Position
      let t, y, radius, angle, x, z;
      const noise = 0.2;

      if (type === 'GIFT') {
        // Gifts are clustered at the bottom, slightly wider radius
        t = Math.random() * 0.15; // Bottom 15% of the tree
        y = -TREE_CONFIG.treeHeight / 2 + t * 4; // Near the floor
        // Spread gifts out a bit more around the base
        radius = TREE_CONFIG.baseRadius * (1.2 + Math.random() * 0.5); 
        angle = Math.random() * Math.PI * 2;
        x = Math.cos(angle) * radius;
        z = Math.sin(angle) * radius;
      } else {
        // Standard distribution for needles, ornaments, stars
        t = i / count; 
        y = -TREE_CONFIG.treeHeight / 2 + t * TREE_CONFIG.treeHeight;
        radius = TREE_CONFIG.baseRadius * (1 - t);
        angle = i * angleIncrement;
        x = Math.cos(angle) * radius;
        z = Math.sin(angle) * radius;
      }
      
      const treePos = new THREE.Vector3(
        x + (Math.random() - 0.5) * noise,
        y,
        z + (Math.random() - 0.5) * noise
      );

      // 2. Calculate Scatter Position (Random Sphere)
      const r = TREE_CONFIG.scatterRadius * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const scatterPos = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );

      // 3. Attributes
      const rotation = new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      let scale = 1;
      let color = new THREE.Color();

      if (type === 'NEEDLE') {
        scale = 0.5 + Math.random() * 0.5;
        color = COLORS.EMERALD_DEEP.clone().lerp(COLORS.EMERALD_LIGHT, Math.random());
      } else if (type === 'ORNAMENT') {
        scale = 0.8 + Math.random() * 1.2;
        color = COLORS.GOLD_METALLIC.clone().lerp(COLORS.GOLD_ROSE, Math.random() * 0.3);
      } else if (type === 'GIFT') {
        scale = 1.5 + Math.random() * 1.5; // Larger gifts
        // Pick random luxury color
        const baseColor = giftPalette[Math.floor(Math.random() * giftPalette.length)];
        color = baseColor.clone();
      } else if (type === 'STAR') {
        scale = 0.6 + Math.random() * 0.6;
        color = COLORS.GOLD_METALLIC.clone();
      }

      data.push({
        treePosition: treePos,
        scatterPosition: scatterPos,
        rotation,
        scale,
        color
      });
    }
    return data;
  }, [count, type]);

  // Set initial colors
  useLayoutEffect(() => {
    if (!meshRef.current) return;
    particles.forEach((p, i) => {
      meshRef.current!.setColorAt(i, p.color);
    });
    meshRef.current.instanceColor!.needsUpdate = true;
  }, [particles]);

  useFrame((stateThree, delta) => {
    if (!meshRef.current) return;

    const targetMorph = state === TreeState.TREE_SHAPE ? 1 : 0;
    
    if (meshRef.current.userData.morph === undefined) meshRef.current.userData.morph = 0;
    
    easing.damp(
      meshRef.current.userData, 
      'morph', 
      targetMorph, 
      TRANSITION_SPEED, 
      delta
    );

    const currentMorph = meshRef.current.userData.morph;
    const time = stateThree.clock.getElapsedTime();

    particles.forEach((particle, i) => {
      // Lerp position
      dummy.position.lerpVectors(particle.scatterPosition, particle.treePosition, currentMorph);

      // Floating motion
      if (currentMorph < 0.95) {
        const floatFactor = (1 - currentMorph) * 2;
        dummy.position.y += Math.sin(time + i) * 0.02 * floatFactor;
        dummy.position.x += Math.cos(time * 0.5 + i) * 0.02 * floatFactor;
      }

      // Rotate tree
      if (currentMorph > 0.1) {
          const rotationAngle = time * 0.1 * currentMorph;
          const x = dummy.position.x;
          const z = dummy.position.z;
          dummy.position.x = x * Math.cos(rotationAngle) - z * Math.sin(rotationAngle);
          dummy.position.z = x * Math.sin(rotationAngle) + z * Math.cos(rotationAngle);
      }
      
      // Orientation
      dummy.rotation.copy(particle.rotation);
      
      // Dynamic rotation for specific items
      if (type === 'ORNAMENT' || type === 'STAR') {
          dummy.rotation.y += time * 0.5;
      }
      
      dummy.scale.setScalar(particle.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  // Geometry selection
  let geometry;
  if (type === 'NEEDLE') geometry = <tetrahedronGeometry args={[0.2, 0]} />;
  else if (type === 'ORNAMENT') geometry = <sphereGeometry args={[0.25, 16, 16]} />;
  else if (type === 'GIFT') geometry = <boxGeometry args={[0.3, 0.3, 0.3]} />;
  else if (type === 'STAR') geometry = <octahedronGeometry args={[0.2, 0]} />;

  // Material selection
  let material;
  if (type === 'NEEDLE') {
    material = <meshStandardMaterial roughness={0.4} metalness={0.6} color={COLORS.EMERALD_DEEP} emissive={COLORS.EMERALD_DEEP} emissiveIntensity={0.2} />;
  } else if (type === 'GIFT') {
    // Gifts are shiny but less emissive
    material = <meshStandardMaterial roughness={0.2} metalness={0.8} />;
  } else {
    // Stars and Ornaments are super shiny/glowy
    material = <meshStandardMaterial roughness={0.1} metalness={1.0} emissiveIntensity={0.5} toneMapped={false} />;
  }

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      castShadow
      receiveShadow
    >
      {geometry}
      {material}
    </instancedMesh>
  );
};
