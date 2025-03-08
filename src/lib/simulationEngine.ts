
// This file now serves as the main entry point for the simulation engine
// It re-exports all the necessary components from the reorganized files

import { ParticleLifeSimulation } from './simulation/ParticleLifeSimulation';
import { Particle, InteractionMatrix } from './types';

// Re-export the main simulation class and types
export { ParticleLifeSimulation };
export type { Particle, InteractionMatrix };
