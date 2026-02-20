import { useRef, useEffect, useCallback } from 'react';
import { Chess, Square, Move } from 'chess.js';
import { useGameStore, GameStatus } from '@/store/game';

interface CapturedPieces {
  w: string[];
  b: string[];
}

export const useChess = () => {
  const chessRef = useRef(new Chess());

  const {
    fen,
    setFen,
    setTurn,
    setHistory,
    setCaptured,
    setStatus,
  } = useGameStore();

  // Sync chess instance with store FEN only if they differ significantly
  // or on mount.
  useEffect(() => {
    try {
      if (chessRef.current.fen() !== fen) {
        chessRef.current.load(fen);
      }
    } catch (e) {
      console.error("Invalid FEN:", fen);
    }
  }, [fen]);

  const updateGameState = useCallback(() => {
    const game = chessRef.current;
    
    setFen(game.fen());
    setTurn(game.turn());
    setHistory(game.history());

    let status: GameStatus = 'active';
    if (game.isCheckmate()) status = 'checkmate';
    else if (game.isDraw()) status = 'draw';
    else if (game.isStalemate()) status = 'stalemate';
    else if (game.isCheck()) status = 'check';
    setStatus(status);

    // Calculate captured pieces
    const history = game.history({ verbose: true }) as Move[];
    const w: string[] = [];
    const b: string[] = [];
    
    history.forEach(move => {
      if (move.captured) {
        if (move.color === 'w') {
          w.push(move.captured); // White captured Black's piece
        } else {
          b.push(move.captured); // Black captured White's piece
        }
      }
    });
    setCaptured({ w, b });

  }, [setFen, setTurn, setHistory, setStatus, setCaptured]);

  const onDrop = useCallback((sourceSquare: Square, targetSquare: Square): boolean => {
    const game = chessRef.current;

    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', 
      });

      if (move === null) return false;
      updateGameState();
      return true;
    } catch (e) {
      return false;
    }
  }, [updateGameState]);

  const resetGame = useCallback(() => {
    chessRef.current.reset();
    updateGameState();
  }, [updateGameState]);

  const undo = useCallback(() => {
    chessRef.current.undo();
    updateGameState();
  }, [updateGameState]);

  return { onDrop, resetGame, undo, chess: chessRef.current };
};
