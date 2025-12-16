import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const Snow: React.FC = () => {
  const count = 300;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Initialize random positions
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 50,
        y: (Math.random() - 0.5) * 40,
        z: (Math.random() - 0.5) * 50,
        speed: 0.05 + Math.random() * 0.1,
        factor: 0.2 + Math.random() * 0.8 // Random swirl factor
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();

    particles.forEach((p, i) => {
      // Move down
      p.y -= p.speed;
      
      // Reset to top if too low
      if (p.y < -20) {
        p.y = 20;
      }

      // Add gentle swirl
      const x = p.x + Math.sin(time * p.factor + i) * 0.5;
      const z = p.z + Math.cos(time * p.factor + i) * 0.5;

      dummy.position.set(x, p.y, z);
      dummy.scale.setScalar(0.05 + p.speed); // Faster flakes look slightly elongated/bigger
      dummy.rotation.set(time, time, time);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.2, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
    </instancedMesh>
  );
};
