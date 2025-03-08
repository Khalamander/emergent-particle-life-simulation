
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Palette, Sparkles, Atom, Paintbrush } from 'lucide-react';
import { SimulationSettings } from '../ControlPanel';
import ParticleTypeSelector from '../ParticleTypeSelector';
import { COLOR_PALETTES, TRAIL_STYLES } from '@/lib/particleTypes';

interface AppearanceTabProps {
  settings: SimulationSettings;
  onSettingsChange: <K extends keyof SimulationSettings>(
    key: K,
    value: SimulationSettings[K]
  ) => void;
  onColorPaletteChange: (paletteId: string) => void;
}

const AppearanceTab: React.FC<AppearanceTabProps> = ({ 
  settings, 
  onSettingsChange,
  onColorPaletteChange
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-muted/30 p-3 rounded-md">
        <h4 className="text-sm font-medium mb-3 flex items-center">
          <Palette className="h-4 w-4 mr-2" />
          Color Schemes
        </h4>
        
        <div className="space-y-3">
          <label className="text-sm text-muted-foreground block">Select a color palette</label>
          <div className="grid grid-cols-2 gap-2">
            {COLOR_PALETTES.map(palette => (
              <Button
                key={palette.id}
                variant={settings.currentPalette === palette.id ? "default" : "outline"}
                size="sm"
                className="flex items-center justify-start h-auto py-2"
                onClick={() => onColorPaletteChange(palette.id)}
              >
                <div className="flex mr-2">
                  {palette.colors.map((color, i) => (
                    <div 
                      key={i} 
                      className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600" 
                      style={{ 
                        backgroundColor: color,
                        marginLeft: i > 0 ? '-3px' : '0'
                      }} 
                    />
                  ))}
                </div>
                <span className="text-xs">{palette.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-muted/30 p-3 rounded-md">
        <h4 className="text-sm font-medium mb-3 flex items-center">
          <Sparkles className="h-4 w-4 mr-2" />
          Particle Trails
        </h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Show Trails</label>
            <Switch
              checked={settings.showTrails}
              onCheckedChange={(checked) => onSettingsChange('showTrails', checked)}
            />
          </div>
          
          {settings.showTrails && (
            <>
              <div className="space-y-2 mt-4">
                <label className="text-sm font-medium block">
                  Trail Length: {settings.trailLength}
                </label>
                <Slider
                  min={3}
                  max={20}
                  step={1}
                  value={[settings.trailLength || 10]}
                  onValueChange={([value]) => onSettingsChange('trailLength', value)}
                />
              </div>
              
              <div className="space-y-2 mt-4">
                <label className="text-sm font-medium block mb-2">Trail Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {TRAIL_STYLES.map(style => (
                    <Button
                      key={style.id}
                      variant={settings.trailStyle === style.id ? "default" : "outline"}
                      size="sm"
                      className="h-auto py-2"
                      onClick={() => onSettingsChange('trailStyle', style.id)}
                    >
                      <Paintbrush className="h-4 w-4 mr-1" />
                      <span className="text-xs">{style.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="bg-muted/30 p-3 rounded-md">
        <h4 className="text-sm font-medium mb-3 flex items-center">
          <Atom className="h-4 w-4 mr-2" />
          Particle Types
        </h4>
        
        <ParticleTypeSelector
          particleTypes={settings.particleTypes}
          onChange={(types) => onSettingsChange('particleTypes', types)}
        />
      </div>
    </div>
  );
};

export default AppearanceTab;
