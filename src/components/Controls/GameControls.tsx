"use client";

import { useRef, useEffect, useState } from 'react';
import { useGameStore } from '@/store/game';
import { RotateCcw, RotateCw, RefreshCw, ArrowLeftRight } from 'lucide-react';

/**
 * ラベル要素の高さをリアルタイムで計測し、
 * トグルの高さ・幅・丸のサイズをすべてそこから比例計算するコンポーネント。
 *
 * ポイント: 丸を position:absolute にすることで
 * flex レイアウトとの競合なしに left 値でスライドできる。
 */
function ToggleRow({
  icon, label, badge, checked, onToggle, activeColor, title,
}: {
  icon: string;
  label: string;
  badge?: { text: string; colorClass: string };
  checked: boolean;
  onToggle: () => void;
  /** ON 時のトラック色 (CSS カラー文字列, e.g. '#3b82f6') */
  activeColor: string;
  title: string;
}) {
  const labelRef = useRef<HTMLSpanElement>(null);
  const [rowH, setRowH] = useState(24);

  useEffect(() => {
    const el = labelRef.current;
    if (!el) return;
    const update = () => setRowH(el.getBoundingClientRect().height);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const toggleH    = rowH;
  const toggleW    = Math.round(rowH * 2.0);
  const circleSize = Math.round(rowH * 0.72);
  const pad        = Math.round((rowH - circleSize) / 2);
  // OFF: 丸が左端、ON: 丸が右端
  const circleLeft = checked ? toggleW - circleSize - pad : pad;

  return (
    <div className="flex items-center justify-between px-1">
      <span ref={labelRef} className="text-sm flex items-center gap-2">
        <span>{icon}</span>
        <span>{label}</span>
        {badge && (
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${badge.colorClass}`}>
            {badge.text}
          </span>
        )}
      </span>
      {/* トラック */}
      <button
        onClick={onToggle}
        title={title}
        style={{
          position: 'relative',
          flexShrink: 0,
          height: toggleH,
          width: toggleW,
          borderRadius: toggleH / 2,
          backgroundColor: checked ? activeColor : '#4B5563',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.45)',
          transition: 'background-color 0.2s',
          border: 'none',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        {/* 丸（サム） */}
        <span
          style={{
            position: 'absolute',
            top: pad,
            left: circleLeft,
            width: circleSize,
            height: circleSize,
            borderRadius: '50%',
            backgroundColor: 'white',
            boxShadow: '0 1px 4px rgba(0,0,0,0.45)',
            transition: 'left 0.2s',
          }}
        />
      </button>
    </div>
  );
}

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

  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-800 rounded-lg text-white">
      <h3 className="text-lg font-bold">Controls</h3>

      {/* 可視化モードボタン */}
      <div className="flex flex-col gap-2">
        <p className="text-xs text-gray-400 uppercase tracking-wide">Visualization</p>

        <ToggleRow
          icon="♙" label="White"
          badge={boardScopeWhite ? {
            text: whiteIsBottom ? '青' : '赤',
            colorClass: whiteIsBottom ? 'bg-blue-600 text-white' : 'bg-red-600 text-white',
          } : undefined}
          checked={boardScopeWhite}
          onToggle={() => setBoardScopeWhite(!boardScopeWhite)}
          activeColor={whiteIsBottom ? '#3b82f6' : '#ef4444'}
          title={`白の支配範囲を${boardScopeWhite ? '非表示' : '表示'}`}
        />

        <ToggleRow
          icon="♟" label="Black"
          badge={boardScopeBlack ? {
            text: whiteIsBottom ? '赤' : '青',
            colorClass: whiteIsBottom ? 'bg-red-600 text-white' : 'bg-blue-600 text-white',
          } : undefined}
          checked={boardScopeBlack}
          onToggle={() => setBoardScopeBlack(!boardScopeBlack)}
          activeColor={whiteIsBottom ? '#ef4444' : '#3b82f6'}
          title={`黒の支配範囲を${boardScopeBlack ? '非表示' : '表示'}`}
        />

        <p className="text-xs text-gray-500">
          {boardScopeWhite && boardScopeBlack && '紫 = 両者が争うマス'}
          {!boardScopeWhite && !boardScopeBlack && '両方 OFF — 支配範囲を非表示'}
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

