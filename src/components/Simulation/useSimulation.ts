import { useEffect, useRef, useState } from 'react';
import { ParticleLifeSimulation } from '@/lib/simulationEngine';
import { ParticleType } from '@/lib/particleTypes';

interface UseSimulationParams {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  particleCount: number;
  particleTypes: ParticleType[];
  interactions: Record<string, Record<string, number>>;
  friction: number;
  maxSpeed: number;
  interactionRadius: number;
  wrapEdges: boolean;
  showTrails: boolean;
  trailStyle?: string;
  trailLength?: number;
  onSimulationCreated?: (simulation: ParticleLifeSimulation) => void;
  theme: string;
}

export const useSimulation = ({
  canvasRef,
  particleCount,
  particleTypes,
  interactions,
  friction,
  maxSpeed,
  interactionRadius,
  wrapEdges,
  showTrails,
  trailStyle,
  trailLength,
  onSimulationCreated,
  theme
}: UseSimulationParams) => {
  const simulationRef = useRef<ParticleLifeSimulation | null>(null);
  const [fps, setFps] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Initialize simulation
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const simulation = new ParticleLifeSimulation(canvas, {
      particleCount,
      particleTypes,
      interactions,
      friction,
      maxSpeed,
      interactionRadius,
      wrapEdges,
      glowEffect: theme === 'dark',
      showTrails,
      trailStyle,
      trailLength
    });
    
    simulation.initialize();
    simulation.start();
    
    simulationRef.current = simulation;
    
    if (onSimulationCreated) {
      onSimulationCreated(simulation);
    }
    
    // FPS counter
    const fpsInterval = setInterval(() => {
      if (simulationRef.current) {
        setFps(simulationRef.current.getFPS());
      }
    }, 500);
    
    return () => {
      simulation.stop();
      clearInterval(fpsInterval);
    };
  }, []);
  
  // Update simulation options when props change
  useEffect(() => {
    if (simulationRef.current) {
      simulationRef.current.updateOptions({
        particleCount,
        particleTypes,
        interactions,
        friction,
        maxSpeed,
        interactionRadius,
        wrapEdges,
        glowEffect: theme === 'dark',
        showTrails,
        trailStyle,
        trailLength
      });
    }
  }, [
    particleCount,
    particleTypes,
    interactions,
    friction,
    maxSpeed,
    interactionRadius,
    wrapEdges,
    theme,
    showTrails,
    trailStyle,
    trailLength
  ]);

  // Update transform when position or scale changes
  useEffect(() => {
    if (simulationRef.current) {
      simulationRef.current.setTransform(scale, position.x, position.y);
    }
  }, [scale, position]);

  // Zoom buttons handlers
  const handleZoomIn = () => {
    const newScale = Math.min(5, scale * 1.2);
    setScale(newScale);
  };
  
  const handleZoomOut = () => {
    const newScale = Math.max(0.5, scale * 0.8);
    setScale(newScale);
  };
  
  const handleResetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const addParticle = (typeId: string, x: number, y: number) => {
    if (!simulationRef.current) return;
    
    simulationRef.current.addParticle({
      type: typeId,
      x,
      y,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5
    });
  };

  return {
    simulationRef,
    fps,
    scale,
    position,
    setPosition,
    handleZoomIn,
    handleZoomOut,
    handleResetView,
    addParticle
  };
};
