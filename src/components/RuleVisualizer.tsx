
import React from 'react';
import { ParticleType } from '@/lib/particleTypes';
import { InteractionMatrix } from '@/lib/types';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RuleVisualizerProps {
  particleTypes: ParticleType[];
  interactions: InteractionMatrix;
}

const RuleVisualizer: React.FC<RuleVisualizerProps> = ({
  particleTypes,
  interactions
}) => {
  // Function to determine cell color based on interaction value
  const getCellColor = (value: number): string => {
    // Color for attraction (positive values)
    if (value > 0) {
      // Map from 0-1 to pale blue to intense blue
      const intensity = Math.min(value, 1); // Cap at 1 for normalization
      return `rgba(14, 165, 233, ${intensity.toFixed(2)})`; // Sky blue with varying opacity
    } 
    // Color for repulsion (negative values)
    else if (value < 0) {
      // Map from 0 to -1 to pale red to intense red
      const intensity = Math.min(Math.abs(value), 1); // Cap at 1 for normalization
      return `rgba(249, 115, 22, ${intensity.toFixed(2)})`; // Orange with varying opacity
    } 
    // Neutral (zero or very close to zero)
    else {
      return 'rgba(170, 173, 176, 0.3)'; // Light gray with low opacity
    }
  };
  
  // Determine text color for readability (dark on light backgrounds, light on dark)
  const getTextColor = (value: number): string => {
    const intensity = Math.abs(value);
    return intensity > 0.5 ? 'white' : 'rgba(0, 0, 0, 0.8)';
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Interaction Rules Matrix</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>This matrix shows how particle types interact with each other:</p>
              <ul className="mt-1 list-disc list-inside text-xs">
                <li>Blue: Attraction (particles move toward each other)</li>
                <li>Orange: Repulsion (particles move away from each other)</li>
                <li>Gray: Neutral (little to no interaction)</li>
              </ul>
              <p className="mt-1 text-xs">The intensity of color indicates the strength of interaction.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="relative overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {/* Empty corner cell */}
              <th className="p-1 text-xs font-medium text-muted-foreground"></th>
              
              {/* Column headers (particle types) */}
              {particleTypes.map(type => (
                <th key={`col-${type.id}`} className="p-1">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-3 h-3 rounded-full mb-1"
                      style={{ backgroundColor: type.color }}
                    />
                    <span className="text-xs">{type.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody>
            {particleTypes.map(rowType => (
              <tr key={`row-${rowType.id}`}>
                {/* Row header (particle type) */}
                <td className="p-1">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-1"
                      style={{ backgroundColor: rowType.color }}
                    />
                    <span className="text-xs">{rowType.name}</span>
                  </div>
                </td>
                
                {/* Interaction cells */}
                {particleTypes.map(colType => {
                  const value = interactions[rowType.id]?.[colType.id] || 0;
                  const bgColor = getCellColor(value);
                  const textColor = getTextColor(value);
                  
                  return (
                    <td
                      key={`${rowType.id}-${colType.id}`}
                      className="p-0 text-center border border-border/30"
                      style={{ backgroundColor: bgColor }}
                    >
                      <div className="w-12 h-10 flex items-center justify-center">
                        <span className="text-xs font-medium" style={{ color: textColor }}>
                          {value.toFixed(1)}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="flex items-center text-xs">
          <div className="w-3 h-3 mr-1 rounded-full" style={{ backgroundColor: 'rgba(14, 165, 233, 0.8)' }}></div>
          <span>Attraction</span>
        </div>
        <div className="flex items-center text-xs">
          <div className="w-3 h-3 mr-1 rounded-full" style={{ backgroundColor: 'rgba(249, 115, 22, 0.8)' }}></div>
          <span>Repulsion</span>
        </div>
      </div>
    </div>
  );
};

export default RuleVisualizer;
