"use client";

import { useGameStore, VizMode } from '@/store/game';
import { Eye, RotateCcw, RotateCw, LayoutGrid } from 'lucide-react';

interface GameControlsProps {
  onReset: () => void;
  onUndo: () => void;
  onFlip: () => void;
}

export default function GameControls({ onReset, onUndo, onFlip }: GameControlsProps) {
  const { vizMode, setVizMode } = useGameStore();

  const toggleViz = () => {
    // Current simple toggle: None -> Board -> None
    // Or if different modes, cycle.
    // For MVP: Board Scope button
    if (vizMode === 'board') setVizMode('none');
    else setVizMode('board');
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-800 rounded-lg text-white">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Controls</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <button 
          onClick={toggleViz}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded transition-colors ${
            vizMode === 'board' 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          <Eye size={18} />
          {vizMode === 'board' ? 'Hide Scope' : 'Show Scope'}
        </button>

        <button 
          onClick={onFlip}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
        >
          <RotateCw size={18} />
          Flip Board
        </button>

        <button 
          onClick={onUndo}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
        >
          <RotateCcw size={18} />
          Undo
        </button>

        <button 
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
        >
          <RotateCcw size={18} />
          Reset
        </button>
      </div>
    </div>
  );
}
