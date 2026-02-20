"use client";

import { useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import { Square } from 'chess.js';
import { useGameStore } from '@/store/game';
import { analyzeBoard } from '@/lib/chess-analyzer';

interface ChessBoardProps {
  onPieceDrop: (sourceSquare: Square, targetSquare: Square) => boolean;
  boardOrientation?: 'white' | 'black';
}

export default function ChessBoard({ onPieceDrop, boardOrientation = 'white' }: ChessBoardProps) {
  const { fen, vizMode } = useGameStore();

  const customSquareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};
    
    // Debug log
    if (vizMode) {
      console.log("[VizChess] Current Mode:", vizMode);
    }

    if (vizMode === 'board') {
      const { status } = analyzeBoard(fen);
      console.log("[VizChess] Analysis Status:", status);
      
      Object.entries(status).forEach(([sq, st]) => {
        let backgroundColor = '';

        // Slightly more opaque colors for better visibility
        switch (st) {
          case 'white-control':
            backgroundColor = 'rgba(59, 130, 246, 0.6)'; // Blue
            break;
          case 'black-control':
            backgroundColor = 'rgba(239, 68, 68, 0.6)'; // Red
            break;
          case 'contested':
            backgroundColor = 'rgba(168, 85, 247, 0.6)'; // Purple
            break;
          default:
            return;
        }

        styles[sq] = {
            backgroundColor: backgroundColor,
            boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.4)', // Helper to see highlight boundaries
        };
      });
    }

    return styles;
  }, [fen, vizMode]);

  return (
    <div className="w-full h-full">
      <Chessboard 
        position={fen} 
        onPieceDrop={onPieceDrop}
        customSquareStyles={customSquareStyles}
        boardOrientation={boardOrientation}
        customDarkSquareStyle={{ backgroundColor: '#769656' }}
        customLightSquareStyle={{ backgroundColor: '#eeeed2' }}
        animationDuration={200}
      />
    </div>
  );
}
