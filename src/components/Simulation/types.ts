
import { ParticleLifeSimulation, InteractionMatrix } from '@/lib/simulationEngine';
import { ParticleType } from '@/lib/particleTypes';

export interface ParticleSimulationProps {
  particleCount?: number;
  particleTypes?: ParticleType[];
  interactions?: InteractionMatrix;
  friction?: number;
  maxSpeed?: number;
  interactionRadius?: number;
  wrapEdges?: boolean;
  showTrails?: boolean;
  trailStyle?: string;
  trailLength?: number;
  onSimulationCreated?: (simulation: ParticleLifeSimulation) => void;
  introduceParticleMode?: boolean;
  selectedParticleType?: string;
}

export interface SimulationControlsProps {
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetView: () => void;
  fps: number;
  introduceParticleMode: boolean;
  selectedParticleType?: string;
  particleTypes: ParticleType[];
  isAddingParticles: boolean;
}
