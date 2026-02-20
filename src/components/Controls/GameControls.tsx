"use client";

import { useGameStore } from '@/store/game';
import { RotateCcw, RotateCw, RefreshCw, ArrowLeftRight } from 'lucide-react';

interface GameControlsProps {
  onReset: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onFlip: () => void;
  canUndo: boolean;
  canRedo: boolean;
  boardOrientation: 'white' | 'black';
}

export default function GameControls({ onReset, onUndo, onRedo, onFlip, canUndo, canRedo, boardOrientation }: GameControlsProps) {
  const { boardScopeWhite, boardScopeBlack, setBoardScopeWhite, setBoardScopeBlack } = useGameStore();

  // 手前(bottom)プレイヤー → 青、奥(top)プレイヤー → 赤
  const whiteIsBottom = boardOrientation === 'white';
  const whiteActiveClass = whiteIsBottom ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700';
  const blackActiveClass = whiteIsBottom ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700';

  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-800 rounded-lg text-white">
      <h3 className="text-lg font-bold">Controls</h3>

      {/* 可視化モードボタン */}
      <div className="flex flex-col gap-2">
        <p className="text-xs text-gray-400 uppercase tracking-wide">Visualization</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setBoardScopeWhite(!boardScopeWhite)}
            title={`白の支配範囲を${boardScopeWhite ? '非表示' : '表示'}`}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
              boardScopeWhite ? whiteActiveClass : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
            }`}
          >
            ♙ White
          </button>
          <button
            onClick={() => setBoardScopeBlack(!boardScopeBlack)}
            title={`黒の支配範囲を${boardScopeBlack ? '非表示' : '表示'}`}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
              boardScopeBlack ? blackActiveClass : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
            }`}
          >
            ♟ Black
          </button>
        </div>
        <p className="text-xs text-gray-400">
          青 = {whiteIsBottom ? '白' : '黒'}の支配　赤 = {whiteIsBottom ? '黒' : '白'}の支配
          {boardScopeWhite && boardScopeBlack && '　紫 = 争奪'}
        </p>
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
            disabled={!canUndo}
            title={canUndo ? '1手戻す' : 'Undo できる手がありません'}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
              canUndo
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
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

