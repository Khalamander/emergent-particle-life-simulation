
import { Particle, SimulationOptions } from '../types';
import { ParticleType } from '../particleTypes';

/**
 * Draws a trail as a series of connected line segments with opacity gradient
 */
export function drawLineTrail(
  ctx: CanvasRenderingContext2D, 
  trail: Array<{x: number, y: number, age: number}>,
  r: number, g: number, b: number,
  radius: number
) {
  // Draw each trail segment separately to ensure proper opacity gradient
  for (let i = 0; i < trail.length - 1; i++) {
    const current = trail[i];
    const next = trail[i+1];
    
    // Skip drawing segments where points are too far apart
    const dx = next.x - current.x;
    const dy = next.y - current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Skip if the distance is too large (likely due to wrapping around edges)
    if (distance > 50) continue;
    
    // Create gradient for this specific segment
    const gradient = ctx.createLinearGradient(current.x, current.y, next.x, next.y);
    
    // Calculate opacity based on age
    const startOpacity = Math.max(0, 0.6 - (current.age / 15) * 0.6);
    const endOpacity = Math.max(0, 0.6 - (next.age / 15) * 0.6);
    
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${startOpacity})`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${endOpacity})`);
    
    ctx.beginPath();
    ctx.moveTo(current.x, current.y);
    ctx.lineTo(next.x, next.y);
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = radius / 2 * (1 - current.age / 15); // Thinner as age increases
    ctx.stroke();
  }
}

/**
 * Draws a trail as a series of dots with decreasing size and opacity
 */
export function drawDotTrail(
  ctx: CanvasRenderingContext2D, 
  trail: Array<{x: number, y: number, age: number}>,
  r: number, g: number, b: number,
  radius: number
) {
  // Draw separate dots for each trail point
  for (let i = 0; i < trail.length; i++) {
    const point = trail[i];
    
    // Calculate opacity based on age
    const opacity = Math.max(0, 0.7 - (point.age / 15) * 0.7);
    
    // Calculate dot size based on age (smaller as age increases)
    const dotSize = radius * 0.8 * (1 - point.age / 15);
    
    ctx.beginPath();
    ctx.arc(point.x, point.y, dotSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    ctx.fill();
  }
}

/**
 * Draws a trail as a comet with bright head and fading tail
 */
export function drawCometTrail(
  ctx: CanvasRenderingContext2D, 
  trail: Array<{x: number, y: number, age: number}>,
  r: number, g: number, b: number,
  radius: number
) {
  if (trail.length < 2) return;
  
  // Draw a path connecting all points
  ctx.beginPath();
  ctx.moveTo(trail[0].x, trail[0].y);
  
  // Create a gradient covering the entire trail length
  const startPoint = trail[0];
  const endPoint = trail[trail.length - 1];
  const gradient = ctx.createLinearGradient(
    startPoint.x, startPoint.y, 
    endPoint.x, endPoint.y
  );
  
  // Head of comet is brighter, tail fades out
  gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.8)`);
  gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
  
  // Connect all points
  for (let i = 1; i < trail.length; i++) {
    const current = trail[i];
    const prev = trail[i-1];
    
    // Skip if the distance is too large (wrapping edge case)
    const dx = current.x - prev.x;
    const dy = current.y - prev.y;
    if (Math.sqrt(dx*dx + dy*dy) > 50) {
      // Start a new path if we detect a wrap
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(current.x, current.y);
      continue;
    }
    
    ctx.lineTo(current.x, current.y);
  }
  
  // Style and draw the comet
  ctx.strokeStyle = gradient;
  ctx.lineWidth = radius * 1.5; // Thicker than regular trail
  ctx.stroke();
  
  // Add a glow to the head
  ctx.beginPath();
  ctx.arc(trail[0].x, trail[0].y, radius * 1.2, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.7)`;
  ctx.fill();
}
