"use client";

import { useRef, useEffect } from 'react';
import { useGameStore } from '@/store/game';

const WHITE_ICONS: Record<string, string> = { p: '♙', n: '♘', b: '♗', r: '♖', q: '♕', k: '♔' };
const BLACK_ICONS: Record<string, string> = { p: '♟', n: '♞', b: '♝', r: '♜', q: '♛', k: '♚' };

export default function GameInfo() {
  const { turn, status, captured, history } = useGameStore();
  // コンテナ要素への参照（scrollTop で内部スクロールのみを制御する）
  const historyContainerRef = useRef<HTMLDivElement>(null);

  // 棋譜が更新されたら、コンテナ内を最下部までスクロールして最新手を表示
  // ⚠️ scrollIntoView はページ全体をスクロールさせてしまうため使わない
  useEffect(() => {
    const el = historyContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [history]);

  const getStatusText = () => {
    switch (status) {
      case 'checkmate': return 'Checkmate!';
      case 'check':     return 'Check!';
      case 'draw':      return 'Draw';
      case 'stalemate': return 'Stalemate';
      default:          return turn === 'w' ? "White's Turn" : "Black's Turn";
    }
  };

  const statusColor =
    status === 'checkmate' ? 'text-red-500 font-bold' :
    status === 'check'     ? 'text-orange-500 font-bold' :
    'text-white font-bold';

  // SAN の配列を「1手目(白), 1手目(黒)」のペアに変換
  // 例: ['e4', 'e5', 'Nf3', 'Nc6'] → [{n:1, w:'e4', b:'e5'}, {n:2, w:'Nf3', b:'Nc6'}]
  const movePairs = [];
  for (let i = 0; i < history.length; i += 2) {
    movePairs.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: history[i],
      black: history[i + 1] ?? '',
    });
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg text-white shadow-lg border border-gray-700 flex flex-col gap-3">
      {/* ゲーム状態表示 */}
      <h2 className={`text-xl ${statusColor} text-center p-2 rounded bg-gray-900`}>
        {getStatusText()}
      </h2>

      {/* 取った駒 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Captured by White:</span>
          <div className="flex gap-0.5 text-xl h-7 items-center bg-gray-900 px-2 rounded min-w-[3rem] justify-end">
            {captured.w.map((p, i) => (
              <span key={i} className="text-gray-400 leading-none" title={`Black ${p}`}>
                {BLACK_ICONS[p] || p}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Captured by Black:</span>
          <div className="flex gap-0.5 text-xl h-7 items-center bg-gray-900 px-2 rounded min-w-[3rem] justify-end">
            {captured.b.map((p, i) => (
              <span key={i} className="text-white leading-none" title={`White ${p}`}>
                {WHITE_ICONS[p] || p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 棋譜（Move History） */}
      <div>
        <h3 className="text-sm text-gray-400 uppercase tracking-wide mb-1">Move History</h3>
        {/*
          棋譜の表示エリア
          - overflow-y-auto: 縦スクロール可能
          - max-h-36: 最大6行分（約9手）表示してスクロール
          - font-mono: 等幅フォントで列が揃う
        */}
        <div ref={historyContainerRef} className="bg-gray-900 rounded p-2 max-h-36 overflow-y-auto text-sm font-mono">
          {movePairs.length === 0 ? (
            <p className="text-gray-500 text-center py-2">No moves yet</p>
          ) : (
            <table className="w-full">
              <tbody>
                {movePairs.map(({ moveNumber, white, black }) => (
                  <tr
                    key={moveNumber}
                    className={moveNumber % 2 === 0 ? 'bg-gray-800' : ''}
                  >
                    {/* 手番号 */}
                    <td className="text-gray-500 pr-2 w-8 text-right select-none">
                      {moveNumber}.
                    </td>
                    {/* 白の手 */}
                    <td className="text-white pr-3 w-16">{white}</td>
                    {/* 黒の手 */}
                    <td className="text-gray-300 w-16">{black}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

