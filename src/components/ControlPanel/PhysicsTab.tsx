
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Gauge, Sliders, Maximize } from 'lucide-react';
import { SimulationSettings } from '../ControlPanel';

interface PhysicsTabProps {
  settings: SimulationSettings;
  onSettingsChange: <K extends keyof SimulationSettings>(
    key: K,
    value: SimulationSettings[K]
  ) => void;
}

const PhysicsTab: React.FC<PhysicsTabProps> = ({ settings, onSettingsChange }) => {
  return (
    <div className="space-y-4">
      <div className="bg-muted/30 p-3 rounded-md">
        <h4 className="text-sm font-medium mb-3 flex items-center">
          <Sliders className="h-4 w-4 mr-2" />
          Simulation Parameters
        </h4>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">
                Particle Count: {settings.particleCount}
              </label>
            </div>
            <Slider
              min={10}
              max={1000}
              step={10}
              value={[settings.particleCount]}
              onValueChange={([value]) => onSettingsChange('particleCount', value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">
                Friction: {settings.friction.toFixed(2)}
              </label>
            </div>
            <Slider
              min={0}
              max={0.2}
              step={0.01}
              value={[settings.friction]}
              onValueChange={([value]) => onSettingsChange('friction', value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">
                Max Speed: {settings.maxSpeed.toFixed(1)}
              </label>
            </div>
            <Slider
              min={0.5}
              max={10}
              step={0.5}
              value={[settings.maxSpeed]}
              onValueChange={([value]) => onSettingsChange('maxSpeed', value)}
            />
          </div>
        </div>
      </div>
      
      <div className="bg-muted/30 p-3 rounded-md">
        <h4 className="text-sm font-medium mb-3 flex items-center">
          <Maximize className="h-4 w-4 mr-2" />
          Interaction Settings
        </h4>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">
                Interaction Radius: {settings.interactionRadius}
              </label>
            </div>
            <Slider
              min={10}
              max={200}
              step={5}
              value={[settings.interactionRadius]}
              onValueChange={([value]) => onSettingsChange('interactionRadius', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Wrap Edges</label>
            <Switch
              checked={settings.wrapEdges}
              onCheckedChange={(checked) => onSettingsChange('wrapEdges', checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicsTab;
