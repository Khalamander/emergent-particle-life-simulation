
import React from 'react';
import { Atom } from 'lucide-react';
import { SimulationSettings } from '../ControlPanel';
import RuleVisualizer from '../RuleVisualizer';

interface VisualizerTabProps {
  settings: SimulationSettings;
}

const VisualizerTab: React.FC<VisualizerTabProps> = ({ settings }) => {
  return (
    <div className="bg-muted/30 p-3 rounded-md">
      <h4 className="text-sm font-medium mb-3 flex items-center">
        <Atom className="h-4 w-4 mr-2" />
        Rule Visualization
      </h4>
      
      <RuleVisualizer
        particleTypes={settings.particleTypes}
        interactions={settings.interactions}
      />
    </div>
  );
};

export default VisualizerTab;
