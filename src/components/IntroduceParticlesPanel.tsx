
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { MousePointer, Circle } from 'lucide-react';
import { ParticleType } from '@/lib/particleTypes';

interface IntroduceParticlesPanelProps {
  particleTypes: ParticleType[];
  introduceParticleMode: boolean;
  selectedParticleType: string | undefined;
  onIntroduceParticleModeChange: (active: boolean) => void;
  onSelectedParticleTypeChange: (typeId: string) => void;
}

const IntroduceParticlesPanel: React.FC<IntroduceParticlesPanelProps> = ({
  particleTypes,
  introduceParticleMode,
  selectedParticleType,
  onIntroduceParticleModeChange,
  onSelectedParticleTypeChange
}) => {
  // Function to handle toggling particle mode on/off
  const handleModeToggle = (checked: boolean) => {
    onIntroduceParticleModeChange(checked);
    // If turning on and no type selected, select the first type
    if (checked && !selectedParticleType && particleTypes.length > 0) {
      onSelectedParticleTypeChange(particleTypes[0].id);
    }
  };
  
  // Function to handle clicking on a particle type button
  const handleParticleTypeSelect = (typeId: string) => {
    onSelectedParticleTypeChange(typeId);
    // If selecting a type but mode is off, turn it on
    if (!introduceParticleMode) {
      onIntroduceParticleModeChange(true);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MousePointer className="h-4 w-4" />
          <label className="text-sm font-medium">Introduce Particles Mode</label>
        </div>
        <Switch
          checked={introduceParticleMode}
          onCheckedChange={handleModeToggle}
        />
      </div>
      
      {introduceParticleMode && (
        <>
          <div className="text-xs text-muted-foreground">
            Select a particle type, then click on the simulation to add particles.
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            {particleTypes.map((type) => (
              <Button
                key={type.id}
                variant={selectedParticleType === type.id ? "default" : "outline"}
                size="sm"
                className="flex items-center justify-start h-auto py-2"
                onClick={() => handleParticleTypeSelect(type.id)}
              >
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: type.color }}
                />
                <span className="text-xs">{type.name}</span>
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default IntroduceParticlesPanel;
