"use client";

import { useMemo } from 'react';
import { Chess, Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { useGameStore } from '@/store/game';
import { analyzeBoard } from '@/lib/chess-analyzer';

// 全64マスのリスト（暗くする対象を列挙するために使用）
const ALL_SQUARES = Array.from({ length: 8 }, (_, r) =>
  Array.from({ length: 8 }, (_, f) =>
    String.fromCharCode(97 + f) + (r + 1)
  )
).flat() as Square[];

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

    // ② 駒選択中: 「注目マス以外」を暗くするオーバーレイ
    //
    // 仕組み:
    //   - 選択駒マス・合法手マス = 通常表示（明るい）
    //   - それ以外の全マス = 半透明の黒で暗くする
    //
    // ポイント: React の key を使って全マスに個別スタイルを当てられる
    //   ので、「暗くしたい＝注目マス以外」を対象に塗る
    if (selectedSquare) {
      // 注目すべきマスのセット（選択駒 + 移動先候補）
      const highlightedSquares = new Set<string>([selectedSquare, ...legalMoves]);

      ALL_SQUARES.forEach(sq => {
        if (!highlightedSquares.has(sq)) {
          // filter: brightness() はマス要素全体（駒の画像を含む子要素）に作用するため、
          // backgroundImage で背景だけを暗くする方法と違い、駒自体も一緒に暗くなる
          styles[sq] = {
            ...(styles[sq] || {}),
            filter: 'brightness(0.45)',
          };
        }
      });

      // 選択中の駒マスをゴールドでハイライト
      styles[selectedSquare] = {
        ...(styles[selectedSquare] || {}),
        backgroundColor: 'rgba(255, 215, 0, 0.75)',
        boxShadow: 'inset 0 0 0 3px rgba(255, 215, 0, 1)',
      };
    }

    // ③ 合法手マス: 中央に小さな黒い丸を表示
    // ⚠️ background ショートハンドは backgroundColor を上書きしてしまうため、
    //    backgroundImage を使って Board Scope の色・暗くする色と重ねて表示する
    legalMoves.forEach(sq => {
      styles[sq] = {
        ...(styles[sq] || {}),
        backgroundImage: [
          'radial-gradient(circle, rgba(0,0,0,0.5) 26%, transparent 27%)',
          styles[sq]?.backgroundImage,
        ].filter(Boolean).join(', '),
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
