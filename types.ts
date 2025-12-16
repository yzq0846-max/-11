import * as THREE from 'three';

export enum TreeState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE'
}

export interface ParticleData {
  // The position when the tree is formed
  treePosition: THREE.Vector3;
  // The position when scattered
  scatterPosition: THREE.Vector3;
  // Random rotation for variety
  rotation: THREE.Euler;
  // Scale variation
  scale: number;
  // Color variation (slightly different shades of gold/emerald)
  color: THREE.Color;
}

export interface TreeConfig {
  needleCount: number;
  ornamentCount: number;
  giftCount: number;
  starCount: number;
  treeHeight: number;
  baseRadius: number;
  scatterRadius: number;
}
