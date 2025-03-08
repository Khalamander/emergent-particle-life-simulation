
import { ParticleType } from './particleTypes';

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: string;
  trail: Array<{x: number, y: number, age: number}>;
}

export interface NewParticleOptions {
  type: string;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
}

export interface InteractionRule {
  sourceType: string;
  targetType: string;
  strength: number; // Positive for attraction, negative for repulsion
}

export type InteractionMatrix = Record<string, Record<string, number>>;

export interface SimulationOptions {
  width: number;
  height: number;
  particleCount: number;
  particleTypes: ParticleType[];
  interactions: InteractionMatrix;
  friction: number;
  repelStrength: number;
  attractStrength: number;
  maxSpeed: number;
  wrapEdges: boolean;
  interactionRadius: number;
  glowEffect?: boolean;
  showTrails?: boolean;
  trailStyle?: string;
  trailLength?: number;
}
