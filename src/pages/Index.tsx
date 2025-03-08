
import React, { useState, useRef, useEffect } from 'react';
import ParticleSimulation from '@/components/ParticleSimulation';
import ControlPanel, { SimulationSettings } from '@/components/ControlPanel';
import { ParticleLifeSimulation } from '@/lib/simulationEngine';
import { DEFAULT_PARTICLE_TYPES, applyColorPalette } from '@/lib/particleTypes';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { ChevronRight, Info, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import AmbientBackground from '@/components/AmbientBackground';
import IntroduceParticlesPanel from '@/components/IntroduceParticlesPanel';

const createDefaultInteractions = (types = DEFAULT_PARTICLE_TYPES) => {
  const matrix: Record<string, Record<string, number>> = {};
  
  types.forEach(sourceType => {
    matrix[sourceType.id] = {};
    
    types.forEach(targetType => {
      const value = (Math.random() * 2 - 1) * (Math.random() > 0.5 ? 1 : 0.5);
      matrix[sourceType.id][targetType.id] = parseFloat(value.toFixed(1));
    });
  });
  
  return matrix;
};

const DEFAULT_SETTINGS: SimulationSettings = {
  particleCount: 300,
  particleTypes: DEFAULT_PARTICLE_TYPES,
  interactions: createDefaultInteractions(),
  friction: 0.05,
  maxSpeed: 3,
  interactionRadius: 50,
  wrapEdges: true,
  showTrails: false,
  trailStyle: 'line',
  trailLength: 10,
  currentPalette: 'default'
};

const Index = () => {
  const { toast } = useToast();
  const [showIntro, setShowIntro] = useState(true);
  const [settings, setSettings] = useState<SimulationSettings>(DEFAULT_SETTINGS);
  const [simulation, setSimulation] = useState<ParticleLifeSimulation | null>(null);
  const { theme, toggleTheme } = useTheme();
  
  // State for introduce particles feature
  const [introduceParticleMode, setIntroduceParticleMode] = useState(false);
  const [selectedParticleType, setSelectedParticleType] = useState<string | undefined>(undefined);
  
  const handleSimulationCreated = (sim: ParticleLifeSimulation) => {
    setSimulation(sim);
  };
  
  const handleSettingsChange = (newSettings: SimulationSettings) => {
    // Check if we need to apply a color palette
    if (newSettings.currentPalette !== settings.currentPalette) {
      // Make sure we're using the freshly palette-applied particle types 
      // if they were just updated in ControlPanel
      setSettings(newSettings);
    } else {
      setSettings(newSettings);
    }
  };
  
  useEffect(() => {
    setTimeout(() => {
      setShowIntro(false);
    }, 4000);
  }, []);
  
  // Update the simulation with new settings
  useEffect(() => {
    if (simulation) {
      simulation.updateOptions(settings);
    }
  }, [settings, simulation]);
  
  return (
    <div className={`
      relative w-full h-full flex flex-col overflow-hidden
      ${theme === 'light' 
        ? 'bg-gradient-to-br from-background via-blue-50/20 to-secondary/20' 
        : 'bg-gradient-to-br from-gray-900 via-blue-950/10 to-purple-950/5'}
    `}>
      {/* Ambient background */}
      <AmbientBackground />
      
      {/* Intro screen with fade out */}
      {showIntro && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background dark:bg-gray-900 animate-fade-out">
          <div className="text-center max-w-xl px-4 animate-slide-up">
            <h1 className="text-4xl font-bold mb-4 tracking-tight dark:text-white">Particle Life</h1>
            <p className="text-muted-foreground dark:text-gray-300 mb-6">
              Explore emergent behaviors from simple interactions between particles.
            </p>
          </div>
        </div>
      )}
      
      {/* Main simulation */}
      <main className="flex-1 relative overflow-hidden z-10">
        <ParticleSimulation
          particleCount={settings.particleCount}
          particleTypes={settings.particleTypes}
          interactions={settings.interactions}
          friction={settings.friction}
          maxSpeed={settings.maxSpeed}
          interactionRadius={settings.interactionRadius}
          wrapEdges={settings.wrapEdges}
          showTrails={settings.showTrails}
          trailStyle={settings.trailStyle}
          trailLength={settings.trailLength}
          onSimulationCreated={handleSimulationCreated}
          introduceParticleMode={introduceParticleMode}
          selectedParticleType={selectedParticleType}
        />
        
        <ControlPanel 
          simulation={simulation}
          onSettingsChange={handleSettingsChange}
        />
        
        {/* Introduce Particles Controls */}
        <div className="absolute bottom-24 left-4 w-60 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-3 rounded-lg shadow-md">
          <IntroduceParticlesPanel
            particleTypes={settings.particleTypes}
            introduceParticleMode={introduceParticleMode}
            selectedParticleType={selectedParticleType || ''}
            onIntroduceParticleModeChange={setIntroduceParticleMode}
            onSelectedParticleTypeChange={setSelectedParticleType}
          />
        </div>
        
        {/* Theme toggle button */}
        <Button
          variant="outline"
          size="sm"
          className="absolute top-4 right-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-md"
          onClick={toggleTheme}
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4 mr-1" />
          ) : (
            <Sun className="h-4 w-4 mr-1" />
          )}
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </Button>
        
        {/* Info button */}
        <Button
          variant="outline"
          size="sm"
          className="absolute bottom-4 left-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-md"
          onClick={() => {
            toast({
              title: "About Particle Life",
              description: "This simulation demonstrates how complex behaviors can emerge from simple rules. Adjust the interactions between particle types to discover fascinating patterns resembling living systems.",
              duration: 5000,
            });
          }}
        >
          <Info className="h-4 w-4 mr-1" />
          About
        </Button>
      </main>
    </div>
  );
};

export default Index;
