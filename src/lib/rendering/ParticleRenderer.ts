
import { Particle } from '../types';
import { ParticleType } from '../particleTypes';

/**
 * Renders all particles to the canvas with appropriate styling
 */
export function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  particleTypes: ParticleType[],
  glowEffect: boolean
): void {
  // Group particles by type for more efficient drawing
  const particlesByType: Record<string, Particle[]> = {};
  
  for (const particle of particles) {
    if (!particlesByType[particle.type]) {
      particlesByType[particle.type] = [];
    }
    particlesByType[particle.type].push(particle);
  }
  
  // Draw each type with its own style
  for (const type of particleTypes) {
    const particles = particlesByType[type.id] || [];
    if (particles.length === 0) continue;
    
    const color = type.color;
    
    // Add glow effect if enabled
    if (glowEffect) {
      ctx.shadowBlur = type.radius * 2.5;
      ctx.shadowColor = color;
    } else {
      ctx.shadowBlur = 0;
    }
    
    ctx.fillStyle = color;
    ctx.beginPath();
    
    for (const particle of particles) {
      ctx.moveTo(particle.x, particle.y);
      ctx.arc(particle.x, particle.y, type.radius, 0, Math.PI * 2);
    }
    
    ctx.fill();
  }
  
  // Reset shadow for performance
  ctx.shadowBlur = 0;
}
