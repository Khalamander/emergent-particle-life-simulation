
import { Particle, SimulationOptions } from './types';

export function getInteractionStrength(
  sourceType: string, 
  targetType: string, 
  interactions: SimulationOptions['interactions']
): number {
  // Get the interaction strength from the matrix
  if (
    interactions[sourceType] &&
    typeof interactions[sourceType][targetType] === 'number'
  ) {
    return interactions[sourceType][targetType];
  }
  return 0; // No interaction if not defined
}

export function updateParticlePosition(
  particle: Particle, 
  options: SimulationOptions,
  timeStep: number
): void {
  // Update position
  particle.x += particle.vx * timeStep;
  particle.y += particle.vy * timeStep;
  
  // Handle edge behavior
  if (options.wrapEdges) {
    // Wrap around edges
    if (particle.x < 0) particle.x += options.width;
    if (particle.x >= options.width) particle.x -= options.width;
    if (particle.y < 0) particle.y += options.height;
    if (particle.y >= options.height) particle.y -= options.height;
  } else {
    // Bounce off edges
    if (particle.x < 0) {
      particle.x = 0;
      particle.vx = -particle.vx * 0.8;
    }
    if (particle.x >= options.width) {
      particle.x = options.width - 1;
      particle.vx = -particle.vx * 0.8;
    }
    if (particle.y < 0) {
      particle.y = 0;
      particle.vy = -particle.vy * 0.8;
    }
    if (particle.y >= options.height) {
      particle.y = options.height - 1;
      particle.vy = -particle.vy * 0.8;
    }
  }
}

export function calculateParticleInteraction(
  p1: Particle, 
  p2: Particle, 
  options: SimulationOptions,
  timeStep: number
): void {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  
  // Handle wrapped distance calculation if needed
  let wrappedDx = dx;
  let wrappedDy = dy;
  
  if (options.wrapEdges) {
    if (Math.abs(dx) > options.width / 2) {
      wrappedDx = dx - Math.sign(dx) * options.width;
    }
    if (Math.abs(dy) > options.height / 2) {
      wrappedDy = dy - Math.sign(dy) * options.height;
    }
  }
  
  const distSq = wrappedDx * wrappedDx + wrappedDy * wrappedDy;
  const dist = Math.sqrt(distSq);
  
  if (dist < options.interactionRadius && dist > 0) {
    const interactionStrength = getInteractionStrength(p1.type, p2.type, options.interactions);
    const force = interactionStrength * (1 - dist / options.interactionRadius);
    
    // Normalize direction
    const nx = wrappedDx / dist;
    const ny = wrappedDy / dist;
    
    // Apply force
    p1.vx += nx * force * timeStep;
    p1.vy += ny * force * timeStep;
  }
}

export function applyFrictionAndLimitSpeed(
  particle: Particle, 
  options: SimulationOptions,
  timeStep: number
): void {
  // Apply friction
  particle.vx *= (1 - options.friction * timeStep);
  particle.vy *= (1 - options.friction * timeStep);
  
  // Limit speed
  const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
  if (speed > options.maxSpeed) {
    particle.vx = (particle.vx / speed) * options.maxSpeed;
    particle.vy = (particle.vy / speed) * options.maxSpeed;
  }
}
