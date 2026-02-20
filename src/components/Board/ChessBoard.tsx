"use client";

import { useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import { Square } from 'chess.js';
import { useGameStore } from '@/store/game';
import { analyzeBoard, analyzePiece } from '@/lib/chess-analyzer';

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
  const { fen, vizMode, focusedSquare } = useGameStore();

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

    // ② Piece Scope: 選択した駒の利きを黄色でハイライト
    if (vizMode === 'piece' && focusedSquare) {
      const attackedSquares = analyzePiece(fen, focusedSquare);
      attackedSquares.forEach(sq => {
        styles[sq] = {
          backgroundColor: 'rgba(234, 179, 8, 0.5)',
          boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.4)',
        };
      });
      // 選択中の駒自身を強調表示
      styles[focusedSquare] = {
        backgroundColor: 'rgba(234, 179, 8, 0.9)',
        boxShadow: 'inset 0 0 0 3px rgba(255, 255, 255, 0.8)',
      };
    }

    // ③ 選択中の駒のマス（クリック&クリック移動用）
    if (selectedSquare) {
      styles[selectedSquare] = {
        ...(styles[selectedSquare] || {}),
        backgroundColor: 'rgba(255, 215, 0, 0.65)',
        boxShadow: 'inset 0 0 0 3px rgba(255, 215, 0, 1)',
      };
    }

    // ④ 合法手マス: 緑の円（ドット）で表示
    legalMoves.forEach(sq => {
      styles[sq] = {
        ...(styles[sq] || {}),
        // radial-gradient で中央に小さな黒い丸を描く
        background: 'radial-gradient(circle, rgba(0,0,0,0.3) 26%, transparent 27%)',
        boxShadow: 'none',
      };
    });

    return styles;
  }, [fen, vizMode, focusedSquare, selectedSquare, legalMoves]);

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

