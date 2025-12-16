import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, Stars, Float } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { TreeParticles } from './TreeParticles';
import { TopStar } from './TopStar';
import { Snow } from './Snow';
import { TreeState } from '../types';

interface ExperienceProps {
  treeState: TreeState;
}

const CameraRig: React.FC<{ state: TreeState }> = ({ state }) => {
    // Subtle camera movement
    useFrame((stateThree) => {
        // Gently pan camera based on mouse
        stateThree.camera.position.y = THREE.MathUtils.lerp(stateThree.camera.position.y, state === TreeState.TREE_SHAPE ? 2 : 5, 0.02);
        stateThree.camera.position.z = THREE.MathUtils.lerp(stateThree.camera.position.z, state === TreeState.TREE_SHAPE ? 18 : 25, 0.02);
        stateThree.camera.lookAt(0, 0, 0);
    });
    return null;
}

export const Experience: React.FC<ExperienceProps> = ({ treeState }) => {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ 
        antialias: false, 
        toneMapping: THREE.ReinhardToneMapping, 
        toneMappingExposure: 1.5,
        alpha: false 
      }}
      shadows
    >
      <color attach="background" args={['#010502']} />
      
      <PerspectiveCamera makeDefault position={[0, 2, 20]} fov={45} />
      <CameraRig state={treeState} />
      
      <OrbitControls 
        enablePan={false} 
        enableZoom={true} 
        minDistance={10} 
        maxDistance={40} 
        maxPolarAngle={Math.PI / 1.5}
        autoRotate={treeState === TreeState.TREE_SHAPE}
        autoRotateSpeed={0.5}
      />

      {/* Lighting */}
      <ambientLight intensity={0.2} color="#002411" />
      
      <spotLight 
        position={[10, 20, 10]} 
        angle={0.5} 
        penumbra={1} 
        intensity={200} 
        color="#fff5e0" 
        castShadow 
      />
      
      <spotLight 
        position={[-10, 10, -10]} 
        angle={0.5} 
        penumbra={1} 
        intensity={100} 
        color="#4a9c6d" 
      />

      <pointLight position={[0, 0, 0]} intensity={10} color="#FFD700" distance={15} decay={2} />
      <pointLight position={[0, 5, 0]} intensity={10} color="#FFD700" distance={15} decay={2} />
      <pointLight position={[0, -5, 0]} intensity={10} color="#FFD700" distance={15} decay={2} />

      <Environment preset="city" />

      {/* Atmospheric Particles */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Snow />

      {/* The Morphing Tree Group */}
      <group position={[0, -2, 0]}>
        <Float speed={treeState === TreeState.SCATTERED ? 2 : 0} rotationIntensity={treeState === TreeState.SCATTERED ? 0.5 : 0} floatIntensity={treeState === TreeState.SCATTERED ? 1 : 0}>
             <TreeParticles state={treeState} type="NEEDLE" />
             <TreeParticles state={treeState} type="ORNAMENT" />
             <TreeParticles state={treeState} type="STAR" />
             <TreeParticles state={treeState} type="GIFT" />
             <TopStar state={treeState} />
        </Float>
      </group>

      {/* Post Processing */}
      <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={1.1} 
          mipmapBlur 
          intensity={0.8} 
          radius={0.6} 
        />
        <Noise opacity={0.05} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </Canvas>
  );
};
