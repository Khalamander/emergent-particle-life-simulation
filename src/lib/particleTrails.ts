import { Particle } from './types';

export const TRAIL_MAX_LENGTH = 20; // Maximum number of positions to keep in trail
export const TRAIL_MAX_AGE = 15;    // Maximum age of trail points before they fade out
export const MIN_TRAIL_DISTANCE = 2.0; // Minimum distance to record a new trail point

export function updateParticleTrail(
  particle: Particle, 
  showTrails: boolean,
  timeStep: number,
  trailLength: number = 10
): void {
  if (showTrails) {
    // Only add position to trail if particle moved enough
    const lastPos = particle.trail.length > 0 ? particle.trail[0] : null;
    
    // Check if we've moved enough distance to create a new trail point
    // This prevents creating too many points when movement is minimal
    if (!lastPos || 
        Math.hypot(particle.x - lastPos.x, particle.y - lastPos.y) > MIN_TRAIL_DISTANCE) {
      // Add current position to beginning of trail
      particle.trail.unshift({ 
        x: particle.x, 
        y: particle.y, 
        age: 0 
      });
      
      // Keep trail at specified length, but no more than max length
      const maxLength = Math.min(trailLength, TRAIL_MAX_LENGTH);
      if (particle.trail.length > maxLength) {
        particle.trail.splice(maxLength);
      }
    }
    
    // Age all trail points
    for (let j = 0; j < particle.trail.length; j++) {
      particle.trail[j].age += timeStep;
    }
    
    // Remove trail points that are too old
    particle.trail = particle.trail.filter(point => point.age < TRAIL_MAX_AGE);
  } else {
    // Clear trails if disabled
    particle.trail = [];
  }
}
