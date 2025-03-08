import React, { useEffect, useRef } from 'react';
import { DEFAULT_PARTICLE_TYPES } from '@/lib/particleTypes';
import { useTheme } from '@/hooks/use-theme';
import SimulationControls from './Simulation/SimulationControls';
import { ParticleSimulationProps } from './Simulation/types';
import { useSimulation } from './Simulation/useSimulation';
import { useInteractions } from './Simulation/useInteractions';

const ParticleSimulation: React.FC<ParticleSimulationProps> = ({
  particleCount = 300,
  particleTypes = DEFAULT_PARTICLE_TYPES,
  interactions = {},
  friction = 0.05,
  maxSpeed = 3,
  interactionRadius = 50,
  wrapEdges = true,
  showTrails = false,
  trailStyle = 'line',
  trailLength = 10,
  onSimulationCreated,
  introduceParticleMode = false,
  selectedParticleType
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  
  // Use our custom hooks to handle simulation and interactions
  const {
    simulationRef,
    fps,
    scale,
    position,
    setPosition,
    handleZoomIn,
    handleZoomOut,
    handleResetView,
    addParticle
  } = useSimulation({
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
  });
  
  const {
    isDragging,
    isAddingParticles,
    currentMousePos,
    handleWheel,
    handleCanvasClick,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    startContinuousParticleAddition
  } = useInteractions({
    scale,
    position,
    setPosition,
    canvasRef,
    introduceParticleMode,
    selectedParticleType,
    addParticle
  });
  
  // Effect for continuous particle addition
  useEffect(() => {
    return startContinuousParticleAddition();
  }, [isAddingParticles, currentMousePos, introduceParticleMode, selectedParticleType]);
  
  // Update simulation transform when position or scale changes
  useEffect(() => {
    if (simulationRef.current) {
      simulationRef.current.setTransform(scale, position.x, position.y);
    }
  }, [scale, position, simulationRef]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className={`particle-canvas w-full h-full ${theme === 'dark' ? 'dark-canvas' : ''} 
          ${introduceParticleMode ? 'cursor-crosshair' : isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClick={handleCanvasClick}
      />
      
      <SimulationControls
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        handleResetView={handleResetView}
        fps={fps}
        introduceParticleMode={introduceParticleMode}
        selectedParticleType={selectedParticleType}
        particleTypes={particleTypes}
        isAddingParticles={isAddingParticles}
      />
    </div>
  );
};

export default ParticleSimulation;
