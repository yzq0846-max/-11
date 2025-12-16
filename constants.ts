import * as THREE from 'three';
import { TreeConfig } from './types';

export const COLORS = {
  EMERALD_DEEP: new THREE.Color('#002411'),
  EMERALD_LIGHT: new THREE.Color('#005c2f'),
  GOLD_METALLIC: new THREE.Color('#FFD700'),
  GOLD_ROSE: new THREE.Color('#E0BFB8'),
  BG_DARK: '#010502',
  // New Luxury Colors for Gifts
  RED_VELVET: new THREE.Color('#8a0000'),
  ROYAL_BLUE: new THREE.Color('#001a4d'),
  SILVER: new THREE.Color('#C0C0C0')
};

export const TREE_CONFIG: TreeConfig = {
  needleCount: 3500,
  ornamentCount: 150,
  giftCount: 50, // New gifts
  starCount: 100, // New small stars
  treeHeight: 12,
  baseRadius: 4.5,
  scatterRadius: 25,
};

// Animation settings
export const TRANSITION_SPEED = 1.5; // Seconds to damp
export const ROTATION_SPEED = 0.1;
