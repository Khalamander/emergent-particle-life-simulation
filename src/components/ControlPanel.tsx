import React, { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gauge, Palette, Atom, Grid3X3 } from 'lucide-react';
import { ParticleLifeSimulation } from '@/lib/simulationEngine';
import { DEFAULT_PARTICLE_TYPES, applyColorPalette, COLOR_PALETTES } from '@/lib/particleTypes';
import { useToast } from '@/components/ui/use-toast';
import { InteractionMatrix as InteractionMatrixType } from '@/lib/types';
import { ParticleType } from '@/lib/particleTypes';

// Import the new component parts
import PanelHeader from './ControlPanel/PanelHeader';
import ActionButtons from './ControlPanel/ActionButtons';
import PhysicsTab from './ControlPanel/PhysicsTab';
import AppearanceTab from './ControlPanel/AppearanceTab';
import InteractionsTab from './ControlPanel/InteractionsTab';
import VisualizerTab from './ControlPanel/VisualizerTab';
import { createDefaultInteractions, DEFAULT_SETTINGS } from './ControlPanel/utils';

interface ControlPanelProps {
  simulation: ParticleLifeSimulation | null;
  onSettingsChange: (settings: SimulationSettings) => void;
}

export interface SimulationSettings {
  particleCount: number;
  particleTypes: ParticleType[];
  interactions: InteractionMatrixType;
  friction: number;
  maxSpeed: number;
  interactionRadius: number;
  wrapEdges: boolean;
  showTrails: boolean;
  trailStyle?: string;
  trailLength?: number;
  currentPalette?: string;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  simulation,
  onSettingsChange,
}) => {
  // Initialize DEFAULT_SETTINGS with particle types
  const initialSettings = {
    ...DEFAULT_SETTINGS,
    particleTypes: DEFAULT_PARTICLE_TYPES,
    interactions: createDefaultInteractions(DEFAULT_PARTICLE_TYPES)
  };

  const [settings, setSettings] = useState<SimulationSettings>(initialSettings);
  const [isRunning, setIsRunning] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const panelRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const handleSettingsChange = <K extends keyof SimulationSettings>(
    key: K,
    value: SimulationSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
    
    if (simulation) {
      simulation.updateOptions({ [key]: value });
    }
  };
  
  const handleColorPaletteChange = (paletteId: string) => {
    // Get the color palette and apply it to particleTypes
    const newParticleTypes = applyColorPalette([...settings.particleTypes], paletteId);
    
    // First update the local state
    const newSettings = { 
      ...settings, 
      particleTypes: newParticleTypes,
      currentPalette: paletteId 
    };
    setSettings(newSettings);
    
    // Then notify parent component
    onSettingsChange(newSettings);
    
    // If simulation exists, update it directly
    if (simulation) {
      simulation.updateOptions({ particleTypes: newParticleTypes });
    }
    
    // Show a toast notification
    toast({
      title: "Color Palette Applied",
      description: `Applied the ${COLOR_PALETTES.find(p => p.id === paletteId)?.name || paletteId} color palette.`,
      duration: 2000,
    });
  };
  
  const handleReset = () => {
    if (simulation) {
      simulation.reset();
    }
  };
  
  const handlePlayPause = () => {
    if (!simulation) return;
    
    if (isRunning) {
      simulation.stop();
    } else {
      simulation.start();
    }
    
    setIsRunning(!isRunning);
  };
  
  const handleRandomize = () => {
    const newInteractions = createDefaultInteractions(settings.particleTypes);
    handleSettingsChange('interactions', newInteractions);
  };
  
  const exportSettings = () => {
    const data = JSON.stringify(settings, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'particle-life-settings.json';
    a.click();
    
    URL.revokeObjectURL(url);
  };
  
  const importSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedSettings = JSON.parse(event.target?.result as string) as SimulationSettings;
        setSettings(importedSettings);
        onSettingsChange(importedSettings);
      } catch (err) {
        console.error('Failed to parse settings file:', err);
      }
    };
    reader.readAsText(file);
    
    // Reset input value to allow reimporting the same file
    e.target.value = '';
  };
  
  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!panelRef.current) return;
    
    // Only start dragging when clicking on the header
    if ((e.target as HTMLElement).closest('.panel-header')) {
      e.preventDefault();
      dragStartRef.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!dragStartRef.current) return;
    
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;
    
    // Boundary checks to keep panel on screen
    const maxX = window.innerWidth - (panelRef.current?.offsetWidth || 0);
    const maxY = window.innerHeight - (panelRef.current?.offsetHeight || 0);
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };
  
  const handleMouseUp = () => {
    dragStartRef.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  
  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div
      ref={panelRef}
      className={`absolute panel shadow-xl transition-all duration-300 w-80 z-10 ${isExpanded ? '' : 'h-10 overflow-hidden'}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      <PanelHeader 
        isExpanded={isExpanded} 
        onToggleExpand={() => setIsExpanded(!isExpanded)} 
      />
      
      {isExpanded && (
        <>
          <ActionButtons 
            isRunning={isRunning}
            onPlayPause={handlePlayPause}
            onReset={handleReset}
            onRandomize={handleRandomize}
            onExportSettings={exportSettings}
            onImportClick={handleImportClick}
          />
          
          <input
            ref={fileInputRef}
            id="import-settings"
            type="file"
            accept=".json"
            className="hidden"
            onChange={importSettings}
          />
          
          <Tabs defaultValue="physics">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="physics">
                <Gauge className="h-3.5 w-3.5 mr-1" />
                Physics
              </TabsTrigger>
              <TabsTrigger value="appearance">
                <Palette className="h-3.5 w-3.5 mr-1" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="interactions">
                <Atom className="h-3.5 w-3.5 mr-1" />
                Rules
              </TabsTrigger>
              <TabsTrigger value="visualizer">
                <Grid3X3 className="h-3.5 w-3.5 mr-1" />
                Visualize
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="physics">
              <PhysicsTab 
                settings={settings} 
                onSettingsChange={handleSettingsChange} 
              />
            </TabsContent>
            
            <TabsContent value="appearance">
              <AppearanceTab 
                settings={settings} 
                onSettingsChange={handleSettingsChange}
                onColorPaletteChange={handleColorPaletteChange}
              />
            </TabsContent>
            
            <TabsContent value="interactions">
              <InteractionsTab 
                settings={settings} 
                onSettingsChange={handleSettingsChange}
                onRandomize={handleRandomize}
              />
            </TabsContent>
            
            <TabsContent value="visualizer">
              <VisualizerTab settings={settings} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default ControlPanel;
