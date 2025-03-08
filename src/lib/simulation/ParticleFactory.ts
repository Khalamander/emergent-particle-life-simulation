
import { Particle, NewParticleOptions, SimulationOptions } from '../types';

export class ParticleFactory {
  constructor() {}
  
  public createRandomParticle(
    options: SimulationOptions, 
    nextId: number
  ): Particle {
    const randomType = options.particleTypes[
      Math.floor(Math.random() * options.particleTypes.length)
    ];
    
    const particle: Particle = {
      id: nextId,
      x: Math.random() * options.width,
      y: Math.random() * options.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      type: randomType?.id || 'type1',
      trail: []
    };
    
    return particle;
  }
  
  public createParticle(
    options: NewParticleOptions,
    nextId: number
  ): Particle {
    // Create new particle
    const particle: Particle = {
      id: nextId,
      x: options.x,
      y: options.y,
      vx: options.vx || 0,
      vy: options.vy || 0,
      type: options.type,
      trail: []
    };
    
    return particle;
  }
}
