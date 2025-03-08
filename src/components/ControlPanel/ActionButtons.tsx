
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pause, Play, RefreshCw, Settings, Download, Upload } from 'lucide-react';

interface ActionButtonsProps {
  isRunning: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onRandomize: () => void;
  onExportSettings: () => void;
  onImportClick: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isRunning,
  onPlayPause,
  onReset,
  onRandomize,
  onExportSettings,
  onImportClick
}) => {
  return (
    <div className="flex justify-between mb-4">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          className="h-8 px-2"
          onClick={onPlayPause}
        >
          {isRunning ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
          {isRunning ? 'Pause' : 'Play'}
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          className="h-8 px-2"
          onClick={onReset}
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Settings className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onRandomize}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Randomize Interactions
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onExportSettings}>
            <Download className="h-4 w-4 mr-2" />
            Export Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onImportClick}>
            <Upload className="h-4 w-4 mr-2" />
            Import Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ActionButtons;
