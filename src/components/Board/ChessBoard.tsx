"use client";

import { useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import { Square } from 'chess.js';
import { useGameStore } from '@/store/game';
import { analyzeBoard } from '@/lib/chess-analyzer';

interface ChessBoardProps {
  onPieceDrop: (sourceSquare: Square, targetSquare: Square) => boolean;
  onSquareClick: (square: Square) => void;
  boardOrientation?: 'white' | 'black';
  selectedSquare: Square | null;
  legalMoves: Square[];
}

export default function ChessBoard({
  onPieceDrop,
  onSquareClick,
  boardOrientation = 'white',
  selectedSquare,
  legalMoves,
}: ChessBoardProps) {
  const { fen, vizMode } = useGameStore();

  const customSquareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    // ① Board Scope: 盤面全体の攻撃範囲を色分け表示
    if (vizMode === 'board') {
      const { status } = analyzeBoard(fen);
      Object.entries(status).forEach(([sq, st]) => {
        let backgroundColor = '';
        switch (st) {
          case 'white-control': backgroundColor = 'rgba(59, 130, 246, 0.6)'; break; // 青
          case 'black-control': backgroundColor = 'rgba(239, 68, 68, 0.6)';  break; // 赤
          case 'contested':     backgroundColor = 'rgba(168, 85, 247, 0.6)'; break; // 紫
          default: return;
        }
        styles[sq] = {
          backgroundColor,
          boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.3)',
        };
      });
    }

    // ② 選択中の駒のマス（クリック&クリック移動用）
    if (selectedSquare) {
      styles[selectedSquare] = {
        ...(styles[selectedSquare] || {}),
        backgroundColor: 'rgba(255, 215, 0, 0.65)',
        boxShadow: 'inset 0 0 0 3px rgba(255, 215, 0, 1)',
      };
    }

    // ③ 合法手マス: 中央に小さな黒い丸を表示
    // ⚠️ background ショートハンドは backgroundColor を上書きしてしまうため、
    //    backgroundImage を使って Board Scope の色と重ねて表示する
    legalMoves.forEach(sq => {
      styles[sq] = {
        ...(styles[sq] || {}),
        backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.35) 26%, transparent 27%)',
      };
    });

    return styles;
  }, [fen, vizMode, selectedSquare, legalMoves]);

  return (
    <div className="w-full h-full">
      <Chessboard
        position={fen}
        onPieceDrop={onPieceDrop}
        onSquareClick={onSquareClick}
        customSquareStyles={customSquareStyles}
        boardOrientation={boardOrientation}
        customDarkSquareStyle={{ backgroundColor: '#769656' }}
        customLightSquareStyle={{ backgroundColor: '#eeeed2' }}
        animationDuration={200}
      />
    </div>
  );
}

