
import React from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SimulationControlsProps } from './types';

const SimulationControls: React.FC<SimulationControlsProps> = ({
  handleZoomIn,
  handleZoomOut,
  handleResetView,
  fps,
  introduceParticleMode,
  selectedParticleType,
  particleTypes,
  isAddingParticles
}) => {
  return (
    <>
      {/* FPS counter centered at the top */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/20 dark:bg-white/20 text-white dark:text-black px-2 py-1 rounded-md text-xs font-medium">
        {fps} FPS
      </div>
      
      {/* Indicate the active introduce particle mode */}
      {introduceParticleMode && selectedParticleType && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-black/20 dark:bg-white/20 text-white dark:text-black px-2 py-1 rounded-md text-xs font-medium flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" 
               style={{ backgroundColor: particleTypes.find(t => t.id === selectedParticleType)?.color || '#FFFFFF' }} />
          {isAddingParticles ? 'Adding' : 'Click to add'} {particleTypes.find(t => t.id === selectedParticleType)?.name || 'particle'}
        </div>
      )}
      
      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 rounded-full bg-white/80 dark:bg-gray-800/80 dark:text-white"
          onClick={handleZoomIn}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 rounded-full bg-white/80 dark:bg-gray-800/80 dark:text-white"
          onClick={handleZoomOut}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs bg-white/80 dark:bg-gray-800/80 dark:text-white px-2"
          onClick={handleResetView}
        >
          Reset View
        </Button>
      </div>
    </>
  );
};

export default SimulationControls;
