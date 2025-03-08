
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Grid3X3 } from 'lucide-react';
import { SimulationSettings } from '../ControlPanel';
import InteractionMatrixControl from '../InteractionMatrix';

interface InteractionsTabProps {
  settings: SimulationSettings;
  onSettingsChange: <K extends keyof SimulationSettings>(
    key: K,
    value: SimulationSettings[K]
  ) => void;
  onRandomize: () => void;
}

const InteractionsTab: React.FC<InteractionsTabProps> = ({ 
  settings, 
  onSettingsChange,
  onRandomize
}) => {
  return (
    <>
      <div className="bg-muted/30 p-3 rounded-md mb-3">
        <h4 className="text-sm font-medium mb-3 flex items-center">
          <Grid3X3 className="h-4 w-4 mr-2" />
          Interaction Matrix
        </h4>
        
        <InteractionMatrixControl
          particleTypes={settings.particleTypes}
          interactions={settings.interactions}
          onChange={(interactions) => onSettingsChange('interactions', interactions)}
        />
      </div>
      
      <div className="flex gap-2 justify-end">
        <Button
          size="sm"
          variant="outline"
          className="h-8 px-3"
          onClick={onRandomize}
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Randomize All
        </Button>
      </div>
    </>
  );
};

export default InteractionsTab;
