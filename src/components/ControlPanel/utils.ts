
import { ParticleType } from "@/lib/particleTypes";
import { SimulationSettings } from "../ControlPanel";

export const createDefaultInteractions = (types: ParticleType[]) => {
  const matrix: Record<string, Record<string, number>> = {};
  
  types.forEach(sourceType => {
    matrix[sourceType.id] = {};
    
    types.forEach(targetType => {
      // Generate a random interaction value between -1 and 1
      const value = (Math.random() * 2 - 1) * (Math.random() > 0.5 ? 1 : 0.5);
      matrix[sourceType.id][targetType.id] = parseFloat(value.toFixed(1));
    });
  });
  
  return matrix;
};

export const DEFAULT_SETTINGS: SimulationSettings = {
  particleCount: 300,
  particleTypes: [],  // This will be set in the component
  interactions: {},  // This will be initialized in the component
  friction: 0.05,
  maxSpeed: 3,
  interactionRadius: 50,
  wrapEdges: true,
  showTrails: false,
  trailStyle: 'line',
  trailLength: 10,
  currentPalette: 'default'
};
