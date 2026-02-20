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
  const { fen, boardScopeWhite, boardScopeBlack } = useGameStore();

  const customSquareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    // ① Board Scope: 盤面全体の攻撃範囲を色分け表示
    //
    // 色の基準は「向き」で決まる:
    //   手前(bottom)プレイヤーの支配マス → 青
    //   奥(top)プレイヤーの支配マス     → 赤
    //   争奪マス（両方ONの時のみ）       → 紫
    if (boardScopeWhite || boardScopeBlack) {
      const whiteIsBottom = boardOrientation === 'white';
      const whiteColor = whiteIsBottom ? 'rgba(59, 130, 246, 0.6)' : 'rgba(239, 68, 68, 0.6)';
      const blackColor = whiteIsBottom ? 'rgba(239, 68, 68, 0.6)' : 'rgba(59, 130, 246, 0.6)';
      const showContested = boardScopeWhite && boardScopeBlack;

      const { status } = analyzeBoard(fen);
      Object.entries(status).forEach(([sq, st]) => {
        let backgroundColor = '';
        if      (st === 'white-control' && boardScopeWhite) backgroundColor = whiteColor;
        else if (st === 'black-control' && boardScopeBlack) backgroundColor = blackColor;
        else if (st === 'contested'     && showContested)   backgroundColor = 'rgba(168, 85, 247, 0.6)';
        else return;
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
          const existing = styles[sq] || {};
          styles[sq] = {
            ...existing,
            // ─── 背景の暗化 ───────────────────────────────────────────
            // マス本来の色（緑・ベージュ）は react-chessboard の「外側 div」に
            // あるため、filter は届かない。
            // backgroundImage のグラデーションで内側 div を黒く塗りつぶすことで
            // 外側の色を視覚的に隠す。
            // Board Scope の backgroundColor（赤・青・紫）はすでに内側 div にある
            // ので、重ねて暗くする効果も得られる。
            backgroundImage: [
              existing.backgroundImage,
              'linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45))',
            ].filter(Boolean).join(', '),
            // ─── 駒の暗化 ─────────────────────────────────────────────
            // filter は内側 div 配下のすべて（駒の画像を含む）に作用する。
            filter: 'brightness(0.55)',
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
  }, [fen, boardScopeWhite, boardScopeBlack, boardOrientation, selectedSquare, legalMoves]);

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
