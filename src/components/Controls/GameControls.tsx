"use client";

import { useGameStore } from '@/store/game';
import { Eye, RotateCcw, RotateCw, RefreshCw, ArrowLeftRight } from 'lucide-react';

interface GameControlsProps {
  onReset: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onFlip: () => void;
  canRedo: boolean;
}

export default function GameControls({ onReset, onUndo, onRedo, onFlip, canRedo }: GameControlsProps) {
  const { vizMode, setVizMode, setFocusedSquare } = useGameStore();

  // Board Scope トグル: none ↔ board
  const toggleBoardScope = () => {
    setVizMode(vizMode === 'board' ? 'none' : 'board');
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-800 rounded-lg text-white">
      <h3 className="text-lg font-bold">Controls</h3>

      {/* 可視化モードボタン */}
      <div className="flex flex-col gap-2">
        <p className="text-xs text-gray-400 uppercase tracking-wide">Visualization</p>
        <button
          onClick={toggleBoardScope}
          title="盤面全体の攻撃範囲を表示"
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
            vizMode === 'board'
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
          }`}
        >
          <Eye size={16} />
          {vizMode === 'board' ? 'Board Scope ON' : 'Board Scope OFF'}
        </button>
        {vizMode === 'board' && (
          <p className="text-xs text-blue-300">
            💡 盤面全体の支配範囲を青・赤・紫で表示中
          </p>
        )}
      </div>

      {/* ゲームコントロールボタン */}
      <div className="flex flex-col gap-2">
        <p className="text-xs text-gray-400 uppercase tracking-wide">Game</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onFlip}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
          >
            <ArrowLeftRight size={16} />
            Flip Board
          </button>

          <button
            onClick={onUndo}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
          >
            <RotateCcw size={16} />
            Undo
          </button>

          <button
            onClick={onRedo}
            disabled={!canRedo}
            title={canRedo ? '1手進める' : 'Redo できる手がありません'}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
              canRedo
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            <RotateCw size={16} />
            Redo
          </button>

          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

