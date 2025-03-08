
import { Particle } from '../types';
import { ParticleType } from '../particleTypes';
import { drawParticles, drawTrails } from '../renderingEngine';

export class SimulationRenderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  
  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }
  
  public updateDimensions(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }
  
  public clear(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
  
  public renderFrame(
    particles: Particle[],
    particleTypes: ParticleType[],
    wrapEdges: boolean,
    showTrails: boolean,
    trailStyle: string,
    trailLength: number,
    glowEffect: boolean,
    transform: { scale: number; translateX: number; translateY: number }
  ): void {
    // Clear canvas
    this.clear();
    
    // Apply transform
    this.ctx.save();
    this.ctx.translate(transform.translateX, transform.translateY);
    this.ctx.scale(transform.scale, transform.scale);
    
    // To create the wrapping effect visually, we draw the entire simulation
    // multiple times in a 3x3 grid around the current view
    if (wrapEdges) {
      const width = this.width;
      const height = this.height;
      
      // Draw 9 copies of the simulation (3x3 grid)
      // Center tile (0,0) is drawn by default
      const offsets = [
        { x: -width, y: -height }, { x: 0, y: -height }, { x: width, y: -height },
        { x: -width, y: 0 },       { x: 0, y: 0 },       { x: width, y: 0 },
        { x: -width, y: height },  { x: 0, y: height },  { x: width, y: height }
      ];
      
      for (const offset of offsets) {
        this.ctx.save();
        this.ctx.translate(offset.x, offset.y);
        
        // Draw trails first (so they appear behind particles)
        if (showTrails) {
          drawTrails(
            this.ctx, 
            particles, 
            particleTypes,
            trailStyle || 'line',
            trailLength || 10
          );
        }
        
        // Then draw particles
        drawParticles(
          this.ctx, 
          particles, 
          particleTypes, 
          !!glowEffect
        );
        
        this.ctx.restore();
      }
    } else {
      // Standard non-wrapped rendering
      // Draw trails first (so they appear behind particles)
      if (showTrails) {
        drawTrails(
          this.ctx, 
          particles, 
          particleTypes,
          trailStyle || 'line',
          trailLength || 10
        );
      }
      
      // Then draw particles
      drawParticles(
        this.ctx, 
        particles, 
        particleTypes, 
        !!glowEffect
      );
    }
    
    // Restore transform
    this.ctx.restore();
  }
}
