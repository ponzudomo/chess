"use client";

import { useGameStore, VizMode } from '@/store/game';
import { Eye, Target, RotateCcw, RotateCw, RefreshCw } from 'lucide-react';

interface GameControlsProps {
  onReset: () => void;
  onUndo: () => void;
  onFlip: () => void;
}

export default function GameControls({ onReset, onUndo, onFlip }: GameControlsProps) {
  const { vizMode, setVizMode, setFocusedSquare } = useGameStore();

  // Board Scope トグル: none ↔ board
  const toggleBoardScope = () => {
    if (vizMode === 'board') {
      setVizMode('none');
    } else {
      setVizMode('board');
      setFocusedSquare(null); // piece scope の選択をリセット
    }
  };

  // Piece Scope トグル: none/board ↔ piece
  const togglePieceScope = () => {
    if (vizMode === 'piece') {
      setVizMode('none');
      setFocusedSquare(null);
    } else {
      setVizMode('piece');
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-800 rounded-lg text-white">
      <h3 className="text-lg font-bold">Controls</h3>

      {/* 可視化モードボタン */}
      <div className="flex flex-col gap-2">
        <p className="text-xs text-gray-400 uppercase tracking-wide">Visualization</p>
        <div className="grid grid-cols-2 gap-2">
          {/* Board Scope ボタン */}
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
            Board Scope
          </button>

          {/* Piece Scope ボタン */}
          <button
            onClick={togglePieceScope}
            title="駒をクリックして個別の利きを表示"
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
              vizMode === 'piece'
                ? 'bg-yellow-500 hover:bg-yellow-600 text-black font-semibold'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
            }`}
          >
            <Target size={16} />
            Piece Scope
          </button>
        </div>

        {/* モード説明 */}
        {vizMode === 'board' && (
          <p className="text-xs text-blue-300">
            💡 盤面全体の支配範囲を青・赤・紫で表示中
          </p>
        )}
        {vizMode === 'piece' && (
          <p className="text-xs text-yellow-300">
            💡 駒をクリックするとその利きが黄色で表示されます
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
            <RotateCw size={16} />
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
            onClick={onReset}
            className="col-span-2 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
          >
            <RefreshCw size={16} />
            Reset Game
          </button>
        </div>
      </div>
    </div>
  );
}

