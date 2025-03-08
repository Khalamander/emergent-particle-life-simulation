
import { Particle, SimulationOptions } from '../types';

export class SimulationState {
  private particles: Particle[] = [];
  private nextParticleId: number = 0;
  private fps: number = 0;
  private frameCount: number = 0;
  private lastFpsUpdate: number = 0;
  private running: boolean = false;
  private scale: number = 1;
  private translateX: number = 0;
  private translateY: number = 0;
  
  constructor() {}
  
  public getParticles(): Particle[] {
    return [...this.particles];
  }
  
  public setParticles(particles: Particle[]): void {
    this.particles = particles;
  }
  
  public addParticle(particle: Particle): void {
    this.particles.push(particle);
  }
  
  public getNextParticleId(): number {
    return this.nextParticleId++;
  }
  
  public getFPS(): number {
    return this.fps;
  }
  
  public updateFPS(timestamp: number): void {
    this.frameCount++;
    if (timestamp - this.lastFpsUpdate >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (timestamp - this.lastFpsUpdate));
      this.frameCount = 0;
      this.lastFpsUpdate = timestamp;
    }
  }
  
  public isRunning(): boolean {
    return this.running;
  }
  
  public setRunning(running: boolean): void {
    this.running = running;
  }
  
  public getTransform(): { scale: number; translateX: number; translateY: number } {
    return {
      scale: this.scale,
      translateX: this.translateX,
      translateY: this.translateY
    };
  }
  
  public setTransform(scale: number, translateX: number, translateY: number): void {
    this.scale = scale;
    this.translateX = translateX;
    this.translateY = translateY;
  }
  
  public clearParticles(): void {
    this.particles = [];
    this.nextParticleId = 0;
  }
}
