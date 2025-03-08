
import { ParticleType } from '../particleTypes';
import { Particle, SimulationOptions, NewParticleOptions } from '../types';
import { 
  calculateParticleInteraction, 
  applyFrictionAndLimitSpeed, 
  updateParticlePosition 
} from '../particlePhysics';
import { 
  updateParticleTrail
} from '../particleTrails';

import { SimulationState } from './SimulationState';
import { SimulationRenderer } from './SimulationRenderer';
import { ParticleFactory } from './ParticleFactory';

export class ParticleLifeSimulation {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationFrameId: number | null = null;
  private lastTimestamp: number = 0;
  private options: SimulationOptions;
  
  // New component classes
  private state: SimulationState;
  private renderer: SimulationRenderer;
  private particleFactory: ParticleFactory;

  constructor(canvas: HTMLCanvasElement, options: Partial<SimulationOptions> = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    
    // Initialize component classes
    this.state = new SimulationState();
    this.particleFactory = new ParticleFactory();
    
    // Default options
    this.options = {
      width: canvas.width,
      height: canvas.height,
      particleCount: 200,
      particleTypes: [],
      interactions: {},
      friction: 0.05,
      repelStrength: 0.1,
      attractStrength: 0.05,
      maxSpeed: 3,
      wrapEdges: true,
      interactionRadius: 50,
      glowEffect: false,
      showTrails: false,
      trailStyle: 'line',
      trailLength: 10,
      ...options
    };
    
    this.renderer = new SimulationRenderer(this.ctx, this.options.width, this.options.height);
    
    this.resizeCanvas();
    window.addEventListener('resize', this.resizeCanvas.bind(this));
  }

  private resizeCanvas() {
    const { width, height } = this.canvas.getBoundingClientRect();
    this.canvas.width = width;
    this.canvas.height = height;
    this.options.width = width;
    this.options.height = height;
    this.renderer.updateDimensions(width, height);
  }

  public initialize() {
    this.state.clearParticles();
    for (let i = 0; i < this.options.particleCount; i++) {
      this.addRandomParticle();
    }
  }

  public addRandomParticle(): Particle {
    const particle = this.particleFactory.createRandomParticle(
      this.options, 
      this.state.getNextParticleId()
    );
    
    this.state.addParticle(particle);
    return particle;
  }

  public addParticle(options: NewParticleOptions): Particle {
    const particle = this.particleFactory.createParticle(
      options,
      this.state.getNextParticleId()
    );
    
    this.state.addParticle(particle);
    return particle;
  }

  public updateOptions(options: Partial<SimulationOptions>) {
    const oldParticleCount = this.options.particleCount;
    
    // Update options
    this.options = {
      ...this.options,
      ...options
    };
    
    // If particle count changed, adjust the number of particles
    if (this.options.particleCount !== oldParticleCount) {
      const particles = this.state.getParticles();
      
      if (this.options.particleCount > oldParticleCount) {
        // Add more particles
        for (let i = oldParticleCount; i < this.options.particleCount; i++) {
          this.addRandomParticle();
        }
      } else {
        // Remove excess particles
        this.state.setParticles(particles.slice(0, this.options.particleCount));
      }
    }
  }

  public setTransform(scale: number, translateX: number, translateY: number) {
    this.state.setTransform(scale, translateX, translateY);
  }

  public start() {
    if (this.state.isRunning()) return;
    this.state.setRunning(true);
    this.lastTimestamp = performance.now();
    this.animationLoop();
  }

  public stop() {
    this.state.setRunning(false);
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public reset() {
    this.initialize();
  }

  public getFPS(): number {
    return this.state.getFPS();
  }

  private animationLoop() {
    if (!this.state.isRunning()) return;
    
    const timestamp = performance.now();
    const deltaTime = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;
    
    // Calculate FPS
    this.state.updateFPS(timestamp);
    
    // Update particles
    this.updateParticles(deltaTime);
    
    // Render
    this.renderer.renderFrame(
      this.state.getParticles(),
      this.options.particleTypes,
      this.options.wrapEdges,
      this.options.showTrails || false,
      this.options.trailStyle || 'line',
      this.options.trailLength || 10,
      this.options.glowEffect || false,
      this.state.getTransform()
    );
    
    this.animationFrameId = requestAnimationFrame(this.animationLoop.bind(this));
  }

  private updateParticles(deltaTime: number) {
    const timeStep = Math.min(deltaTime / 16.67, 2); // Cap at maximum of 2x normal step for stability
    const particles = this.state.getParticles();
    
    // Apply forces and update positions
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      
      // Record previous position for trail if enabled
      updateParticleTrail(
        p1, 
        !!this.options.showTrails, 
        timeStep,
        this.options.trailLength || 10
      );
      
      // Apply interaction forces from other particles
      for (let j = 0; j < particles.length; j++) {
        if (i === j) continue;
        const p2 = particles[j];
        calculateParticleInteraction(p1, p2, this.options, timeStep);
      }
      
      // Apply friction and limit speed
      applyFrictionAndLimitSpeed(p1, this.options, timeStep);
      
      // Update position and handle boundaries
      updateParticlePosition(p1, this.options, timeStep);
    }
  }

  public getParticleAt(x: number, y: number, radius: number = 5): Particle | null {
    // Adjust coordinates by transform
    const transform = this.state.getTransform();
    const adjustedX = (x - transform.translateX) / transform.scale;
    const adjustedY = (y - transform.translateY) / transform.scale;
    const particles = this.state.getParticles();
    
    for (const particle of particles) {
      const dx = particle.x - adjustedX;
      const dy = particle.y - adjustedY;
      const distSquared = dx * dx + dy * dy;
      
      if (distSquared <= radius * radius) {
        return particle;
      }
    }
    return null;
  }

  public getParticles(): Particle[] {
    return this.state.getParticles();
  }

  public getOptions(): SimulationOptions {
    return { ...this.options };
  }
}
