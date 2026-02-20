"use client";

import { useState, useEffect } from 'react';
import ChessBoard from '@/components/Board/ChessBoard';
import GameControls from '@/components/Controls/GameControls';
import GameInfo from '@/components/UI/GameInfo';
import { useChess } from '@/hooks/useChess';

// =============================================
// レイアウト設定
// サイズ感を変えたい場合は、この定数だけ編集すればOK
// =============================================
const BOARD_MAX_SIZE   = 560; // 盤面の最大サイズ (px)
const SIDE_PANEL_WIDTH = 288; // サイドパネルの幅 (px) ※横並び時のみ
const HEADER_HEIGHT    =  56; // ヘッダー高さの概算 (px)
const FOOTER_HEIGHT    =  40; // フッター高さの概算 (px)
const PAGE_PADDING_V   =  48; // 上下パディング + 各要素間ギャップの合計 (px)
const PAGE_PADDING_H   =  32; // 左右パディング合計 (px)
const PANEL_GAP        =  24; // 盤面 ↔ サイドパネル間のギャップ (px)
const DESKTOP_BP       = 768; // このpx以上で横並びレイアウト

/**
 * ウィンドウサイズを監視して盤面サイズとレイアウト方向を返すフック。
 *
 * CSS のメディアクエリではなく JavaScript で計算することで、
 * 「実際のピクセル数」をもとに厳密にサイズを決定できる。
 */
function useBoardLayout() {
  const [boardSize, setBoardSize]   = useState(360);
  const [isDesktop, setIsDesktop]   = useState(false);

  useEffect(() => {
    function calculate() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const desktop = vw >= DESKTOP_BP;
      setIsDesktop(desktop);

      // ヘッダー・フッター・余白を除いた使用可能な縦スペース
      const usableH = vh - HEADER_HEIGHT - FOOTER_HEIGHT - PAGE_PADDING_V;

      let size: number;
      if (desktop) {
        // 横並びレイアウト: 縦スペース・横スペース・上限の中で最小
        const byHeight = usableH;
        const byWidth  = vw - SIDE_PANEL_WIDTH - PANEL_GAP - PAGE_PADDING_H;
        size = Math.min(byHeight, byWidth, BOARD_MAX_SIZE);
      } else {
        // 縦並びレイアウト: 画面幅 と 縦スペースの55% の小さい方
        // (55% にするのは、下のサイドパネル分のスペースを残すため)
        const byWidth  = vw - PAGE_PADDING_H;
        const byHeight = usableH * 0.55;
        size = Math.min(byWidth, byHeight);
      }

      setBoardSize(Math.max(Math.floor(size), 200)); // 最小200px
    }

    calculate();
    window.addEventListener('resize', calculate);
    return () => window.removeEventListener('resize', calculate);
  }, []);

  return { boardSize, isDesktop };
}

export default function Home() {
  const { onDrop, onSquareClick, selectedSquare, legalMoves, resetGame, undo, redo, canRedo } = useChess();
  const [flip, setFlip] = useState(false);
  const { boardSize, isDesktop } = useBoardLayout();

  return (
    <main className="flex flex-col min-h-screen bg-[#1a1a1a] text-white px-4 py-3">

      {/* ヘッダー */}
      <header className="flex justify-between items-center pb-3 mb-3 border-b border-gray-700">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          VizChess
        </h1>
        <nav className="flex gap-4 text-gray-400">
          <a href="#" className="hover:text-white transition-colors">About</a>
          <a href="#" className="hover:text-white transition-colors">GitHub</a>
        </nav>
      </header>

      {/*
        メインコンテンツ:
        isDesktop が true  → 横並び (盤面の右にサイドパネル)
        isDesktop が false → 縦並び (盤面の下にサイドパネル)
      */}
      <div
        className="flex flex-1 gap-6"
        style={{
          flexDirection: isDesktop ? 'row' : 'column',
          alignItems:    isDesktop ? 'flex-start' : 'center',
        }}
      >
        {/* 盤面: JS で計算したサイズをインラインスタイルで適用 */}
        <div
          style={{ width: boardSize, height: boardSize, flexShrink: 0 }}
          className="shadow-2xl rounded-lg overflow-hidden border-4 border-gray-700"
        >
          <ChessBoard
            onPieceDrop={onDrop}
            onSquareClick={onSquareClick}
            selectedSquare={selectedSquare}
            legalMoves={legalMoves}
            boardOrientation={flip ? 'black' : 'white'}
          />
        </div>

        {/* サイドパネル: 横並び時は固定幅、縦並び時は全幅 */}
        <div
          style={{ width: isDesktop ? SIDE_PANEL_WIDTH : '100%', flexShrink: 0 }}
          className="flex flex-col gap-4"
        >
          <GameInfo />
          <GameControls
            onReset={resetGame}
            onUndo={undo}
            onRedo={redo}
            onFlip={() => setFlip(!flip)}
            canRedo={canRedo}
          />
          <div className="bg-gray-800 p-3 rounded-lg text-sm text-gray-400">
            <h3 className="text-white font-bold mb-2">How to Play</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>駒をクリック → 移動先をクリック</li>
              <li>ドラッグ&ドロップでも移動できます</li>
              <li>Board Scope: 全体の支配範囲を表示</li>
              <li>Piece Scope: 駒をクリックして個別の利きを表示</li>
              <li className="text-blue-400">青 = 白の支配</li>
              <li className="text-red-400">赤 = 黒の支配</li>
              <li className="text-purple-400">紫 = 争奪マス</li>
            </ul>
          </div>
        </div>

      </div>

      {/* フッター */}
      <footer className="mt-3 pt-3 border-t border-gray-700 text-center text-gray-500 text-sm">
        <p>© 2025 VizChess. All rights reserved.</p>
      </footer>

    </main>
  );
}

