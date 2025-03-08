import React from 'react';
import { Slider } from '@/components/ui/slider';
import { ParticleType } from '@/lib/particleTypes';
import { InteractionMatrix as InteractionMatrixType } from '@/lib/types';

interface InteractionMatrixProps {
  particleTypes: ParticleType[];
  interactions: InteractionMatrixType;
  onChange: (interactions: InteractionMatrixType) => void;
}

const InteractionMatrix: React.FC<InteractionMatrixProps> = ({
  particleTypes,
  interactions,
  onChange
}) => {
  const handleInteractionChange = (sourceType: string, targetType: string, value: number) => {
    const newInteractions = { ...interactions };
    
    if (!newInteractions[sourceType]) {
      newInteractions[sourceType] = {};
    }
    
    newInteractions[sourceType][targetType] = value;
    
    onChange(newInteractions);
  };
  
  const getInteractionValue = (sourceType: string, targetType: string): number => {
    if (interactions[sourceType] && typeof interactions[sourceType][targetType] === 'number') {
      return interactions[sourceType][targetType];
    }
    return 0;
  };
  
  return (
    <div className="space-y-6 overflow-auto max-h-[350px] pr-2">
      <div className="text-sm font-medium text-muted-foreground mb-2">
        Adjust how particle types interact with each other:
      </div>
      
      {particleTypes.map((sourceType) => (
        <div key={sourceType.id} className="space-y-4">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: sourceType.color }}
            />
            <span className="font-medium">{sourceType.name}</span>
          </div>
          
          {particleTypes.map((targetType) => (
            <div key={`${sourceType.id}-${targetType.id}`} className="pl-5 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: targetType.color }}
                  />
                  <span className="text-sm">{targetType.name}</span>
                </div>
                <span className="text-xs font-medium">
                  {getInteractionValue(sourceType.id, targetType.id) > 0 
                    ? 'Attracts' 
                    : getInteractionValue(sourceType.id, targetType.id) < 0
                      ? 'Repels'
                      : 'Neutral'}
                </span>
              </div>
              
              <Slider
                defaultValue={[getInteractionValue(sourceType.id, targetType.id)]}
                min={-1}
                max={1}
                step={0.1}
                value={[getInteractionValue(sourceType.id, targetType.id)]}
                onValueChange={(values) => {
                  handleInteractionChange(sourceType.id, targetType.id, values[0]);
                }}
                className="py-1"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default InteractionMatrix;
