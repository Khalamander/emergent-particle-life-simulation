
import React from 'react';
import { Settings, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PanelHeaderProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const PanelHeader: React.FC<PanelHeaderProps> = ({
  isExpanded,
  onToggleExpand
}) => {
  return (
    <div className="panel-header flex items-center justify-between mb-4 cursor-move bg-muted/30 -m-4 mb-2 p-3 rounded-t-lg">
      <div className="flex items-center gap-2">
        <Settings className="h-4 w-4" />
        <h3 className="font-medium text-sm">Simulation Controls</h3>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={onToggleExpand}
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default PanelHeader;
