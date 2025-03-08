
import { Particle } from '../types';
import { ParticleType } from '../particleTypes';
import { drawLineTrail, drawDotTrail, drawCometTrail } from './TrailRenderer';

/**
 * Manages and renders particle trails based on selected style
 */
export function drawTrails(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  particleTypes: ParticleType[],
  trailStyle: string = 'line',
  trailLength: number = 10
): void {
  // Group trails by particle type for more efficient drawing
  const particlesByType: Record<string, Particle[]> = {};
  
  for (const particle of particles) {
    if (!particlesByType[particle.type]) {
      particlesByType[particle.type] = [];
    }
    particlesByType[particle.type].push(particle);
  }
  
  // Draw trails for each type with its own style
  for (const type of particleTypes) {
    const particles = particlesByType[type.id] || [];
    if (particles.length === 0) continue;
    
    const color = type.color;
    
    // Parse the color into RGB components for creating trail gradients
    let r = 0, g = 0, b = 0;
    
    if (color.startsWith('#')) {
      const hex = color.substring(1);
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    } else if (color.startsWith('rgb')) {
      const rgb = color.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        r = parseInt(rgb[0]);
        g = parseInt(rgb[1]);
        b = parseInt(rgb[2]);
      }
    }
    
    // Loop through particles to draw their trails based on selected style
    for (const particle of particles) {
      if (particle.trail.length < 2) continue; // Need at least 2 points for a line
      
      // Calculate how many points to use based on trail length setting
      const actualLength = Math.min(particle.trail.length, trailLength);
      const trailPoints = particle.trail.slice(0, actualLength);
      
      // Choose drawing method based on trail style
      switch (trailStyle) {
        case 'dots':
          drawDotTrail(ctx, trailPoints, r, g, b, type.radius);
          break;
        
        case 'comet':
          drawCometTrail(ctx, trailPoints, r, g, b, type.radius);
          break;
          
        case 'line':
        default:
          drawLineTrail(ctx, trailPoints, r, g, b, type.radius);
          break;
      }
    }
  }
}
