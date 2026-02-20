"use client";

import { useGameStore } from '@/store/game';

const WHITE_ICONS: Record<string, string> = { p: '♙', n: '♘', b: '♗', r: '♖', q: '♕', k: '♔' };
const BLACK_ICONS: Record<string, string> = { p: '♟', n: '♞', b: '♝', r: '♜', q: '♛', k: '♚' };

export default function GameInfo() {
  const { turn, status, captured } = useGameStore();

  const getStatusText = () => {
    switch (status) {
      case 'checkmate': return 'Checkmate!';
      case 'check': return 'Check!';
      case 'draw': return 'Draw';
      case 'stalemate': return 'Stalemate';
      default: return turn === 'w' ? "White's Turn" : "Black's Turn";
    }
  };

  const statusColor = 
    status === 'checkmate' ? 'text-red-500 font-bold' :
    status === 'check' ? 'text-orange-500 font-bold' :
    'text-white font-bold';

  return (
    <div className="bg-gray-800 p-4 rounded-lg text-white mb-4 shadow-lg border border-gray-700">
      <h2 className={`text-xl ${statusColor} mb-4 text-center p-2 rounded bg-gray-900`}>
        {getStatusText()}
      </h2>
      
      <div className="flex flex-col gap-3">
        {/* Captures by White (Black pieces lost) */}
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Captured by White:</span>
          <div className="flex gap-1 text-2xl h-8 items-center bg-gray-900 px-2 rounded min-w-[3rem] justify-end">
            {captured.w.map((p, i) => (
              <span key={i} className="text-gray-400 leading-none" title={`Black ${p}`}>
                {BLACK_ICONS[p] || p}
              </span>
            ))}
          </div>
        </div>

        {/* Captures by Black (White pieces lost) */}
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Captured by Black:</span>
          <div className="flex gap-1 text-2xl h-8 items-center bg-gray-900 px-2 rounded min-w-[3rem] justify-end">
            {captured.b.map((p, i) => (
              <span key={i} className="text-white leading-none" title={`White ${p}`}>
                {WHITE_ICONS[p] || p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
