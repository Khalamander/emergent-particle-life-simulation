
import React, { useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { ParticleType } from '@/lib/particleTypes';

interface ParticleTypeSelectorProps {
  particleTypes: ParticleType[];
  onChange: (types: ParticleType[]) => void;
}

const ParticleTypeSelector: React.FC<ParticleTypeSelectorProps> = ({
  particleTypes,
  onChange
}) => {
  const handleColorChange = (id: string, color: string) => {
    const newTypes = particleTypes.map(type => 
      type.id === id ? { ...type, color } : type
    );
    onChange(newTypes);
  };
  
  const handleRadiusChange = (id: string, radius: number) => {
    const newTypes = particleTypes.map(type => 
      type.id === id ? { ...type, radius } : type
    );
    onChange(newTypes);
  };
  
  // This effect ensures the color inputs are updated when the particleTypes prop changes
  // (like when a new color palette is applied)
  useEffect(() => {
    // This is just to force re-render when particleTypes change from outside
    // (like when a color palette is applied)
  }, [particleTypes]);
  
  return (
    <div className="space-y-4 overflow-auto max-h-[300px] pr-2">
      <div className="text-sm font-medium text-muted-foreground mb-2">
        Customize particle appearances:
      </div>
      
      {particleTypes.map(type => (
        <div key={type.id} className="space-y-3">
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: type.color }}
            />
            <span className="font-medium">{type.name}</span>
          </div>
          
          <div className="pl-5 space-y-2">
            <div className="flex flex-col space-y-1">
              <label htmlFor={`color-${type.id}`} className="text-sm">
                Color
              </label>
              <Input
                id={`color-${type.id}`}
                type="color"
                value={type.color}
                onChange={e => handleColorChange(type.id, e.target.value)}
                className="w-full h-8"
              />
            </div>
            
            <div className="flex flex-col space-y-1">
              <div className="flex justify-between">
                <label htmlFor={`radius-${type.id}`} className="text-sm">
                  Size
                </label>
                <span className="text-xs font-medium">{type.radius}px</span>
              </div>
              <Slider
                id={`radius-${type.id}`}
                min={1}
                max={10}
                step={0.5}
                value={[type.radius]}
                onValueChange={values => handleRadiusChange(type.id, values[0])}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ParticleTypeSelector;
