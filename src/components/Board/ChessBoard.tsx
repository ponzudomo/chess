"use client";

import { useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import { Square } from 'chess.js';
import { useGameStore } from '@/store/game';
import { analyzeBoard, SquareStatus } from '@/lib/chess-analyzer';

interface ChessBoardProps {
  onPieceDrop: (sourceSquare: Square, targetSquare: Square) => boolean;
  boardOrientation?: 'white' | 'black';
}

export default function ChessBoard({ onPieceDrop, boardOrientation = 'white' }: ChessBoardProps) {
  const { fen, vizMode } = useGameStore();

  const customSquareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};
    
    if (vizMode === 'board') {
      const { status } = analyzeBoard(fen);
      
      // Analyze board returns status for each square
      Object.entries(status).forEach(([sq, st]) => {
        let backgroundColor = '';
        
        switch (st) {
          case 'white-control':
            backgroundColor = 'rgba(59, 130, 246, 0.5)'; // Blue 500
            break;
          case 'black-control':
            backgroundColor = 'rgba(239, 68, 68, 0.5)'; // Red 500
            break;
          case 'contested':
            backgroundColor = 'rgba(168, 85, 247, 0.6)'; // Purple 500
            break;
          default:
            return;
        }

        styles[sq] = {
            backgroundColor,
             // Optional: Add a border or something else
        };
      });
    }

    // Piece Scope logic would go here (requires selected piece state)
    // For now implementing Board Scope only.

    return styles;
  }, [fen, vizMode]);

  return (
    <div className="w-full max-w-[600px] aspect-square">
      <Chessboard 
        position={fen} 
        onPieceDrop={onPieceDrop}
        customSquareStyles={customSquareStyles}
        boardOrientation={boardOrientation}
        customDarkSquareStyle={{ backgroundColor: '#769656' }}
        customLightSquareStyle={{ backgroundColor: '#eeeed2' }}
      />
    </div>
  );
}
