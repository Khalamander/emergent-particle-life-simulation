import { useState, useRef, RefObject, useEffect } from 'react';

interface UseInteractionsParams {
  scale: number;
  position: { x: number; y: number };
  setPosition: (position: { x: number; y: number }) => void;
  canvasRef: RefObject<HTMLCanvasElement>;
  introduceParticleMode: boolean;
  selectedParticleType?: string;
  addParticle: (typeId: string, x: number, y: number) => void;
}

export const useInteractions = ({
  scale,
  position,
  setPosition,
  canvasRef,
  introduceParticleMode,
  selectedParticleType,
  addParticle
}: UseInteractionsParams) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [lastMousePos, setLastMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isAddingParticles, setIsAddingParticles] = useState<boolean>(false);
  const [currentMousePos, setCurrentMousePos] = useState<{ x: number; y: number } | null>(null);
  const particleAddIntervalRef = useRef<number | null>(null);

  // Handle mouse wheel for zooming
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    
    // Calculate zoom factor
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.5, Math.min(5, scale * zoomFactor));
    
    // Get mouse position relative to canvas
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate new position to zoom toward cursor
    const newPosition = {
      x: mouseX - (mouseX - position.x) * (newScale / scale),
      y: mouseY - (mouseY - position.y) * (newScale / scale)
    };
    
    setPosition(newPosition);
  };
  
  // Handle single particle addition on click
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!introduceParticleMode || !selectedParticleType) return;
    
    // This is now handled by the mousedown handler, but we'll leave it for the initial click
    if (!isAddingParticles) {
      // Get mouse position relative to canvas
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      // Calculate position in canvas coordinates, adjusting for scale and pan position
      const mouseX = (e.clientX - rect.left - position.x) / scale;
      const mouseY = (e.clientY - rect.top - position.y) / scale;
      
      // Add a particle at the clicked position
      addParticle(selectedParticleType, mouseX, mouseY);
    }
    
    // Prevent dragging when in introduce particle mode
    e.stopPropagation();
  };
  
  // Handle mouse events for particle introduction and dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (introduceParticleMode && selectedParticleType) {
      // Start continuous particle addition
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      setIsAddingParticles(true);
      setCurrentMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      
      // Prevent dragging when in introduce particle mode
      e.stopPropagation();
      return;
    }
    
    // If not in introduce mode, handle dragging
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    // Update current mouse position for particle addition
    if (isAddingParticles && introduceParticleMode) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      setCurrentMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      return;
    }
    
    // Handle dragging
    if (!isDragging) return;
    
    const dx = e.clientX - lastMousePos.x;
    const dy = e.clientY - lastMousePos.y;
    
    // Update position directly based on mouse movement
    const newPosition = {
      x: position.x + dx,
      y: position.y + dy
    };
    
    setPosition(newPosition);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseUp = () => {
    // Stop adding particles
    setIsAddingParticles(false);
    setCurrentMousePos(null);
    
    // Stop dragging
    setIsDragging(false);
  };
  
  const handleMouseLeave = () => {
    // Stop adding particles when mouse leaves canvas
    setIsAddingParticles(false);
    setCurrentMousePos(null);
    
    // Stop dragging
    setIsDragging(false);
  };
  
  // Effect for continuous particle addition
  const startContinuousParticleAddition = () => {
    if (isAddingParticles && currentMousePos && introduceParticleMode && selectedParticleType) {
      // Start an interval to continuously add particles
      particleAddIntervalRef.current = window.setInterval(() => {
        if (!canvasRef.current || !currentMousePos) return;
        
        // Add a particle with slight position variation for a more natural spread
        const variation = 5; // pixels of random variation
        const mouseX = (currentMousePos.x - position.x) / scale;
        const mouseY = (currentMousePos.y - position.y) / scale;
        
        addParticle(
          selectedParticleType,
          mouseX + (Math.random() - 0.5) * variation,
          mouseY + (Math.random() - 0.5) * variation
        );
      }, 50); // Add a particle every 50ms (20 per second)
    }
    
    return () => {
      if (particleAddIntervalRef.current !== null) {
        clearInterval(particleAddIntervalRef.current);
        particleAddIntervalRef.current = null;
      }
    };
  };

  // Make sure the simulation updates when the position changes
  useEffect(() => {
    if (canvasRef.current && position) {
      // Force rendering update by triggering a mousemove event
      const fakeEvent = new MouseEvent('mousemove');
      canvasRef.current.dispatchEvent(fakeEvent);
    }
  }, [position]);

  return {
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
  };
};
