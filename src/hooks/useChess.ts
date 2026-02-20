import { useRef, useEffect, useCallback, useState } from 'react';
import { Chess, Square, Move } from 'chess.js';
import { useGameStore, GameStatus } from '@/store/game';

export const useChess = () => {
  const chessRef = useRef(new Chess());

  // クリック&クリック移動のための状態
  // selectedSquare: 現在選択している駒のマス (null = 未選択)
  // legalMoves: 選択中の駒が移動できるマスの一覧
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);

  // Redo のための状態
  // redoStack: undo した手を積んでおくスタック (新しい手を指すとクリア)
  const [redoStack, setRedoStack] = useState<Move[]>([]);

  const {
    fen,
    setFen,
    setTurn,
    history,
    setHistory,
    setCaptured,
    setStatus,
    resetGame: storeReset,
  } = useGameStore();

  // ストアのFENとchess.jsインスタンスを同期する
  useEffect(() => {
    try {
      if (chessRef.current.fen() !== fen) {
        chessRef.current.load(fen);
      }
    } catch (e) {
      console.error("Invalid FEN:", fen);
    }
  }, [fen]);

  /** chess.jsの現在状態をZustandストアに反映する */
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

    // 取った駒の計算
    const history = game.history({ verbose: true }) as Move[];
    const w: string[] = [];
    const b: string[] = [];
    history.forEach(move => {
      if (move.captured) {
        if (move.color === 'w') {
          w.push(move.captured);
        } else {
          b.push(move.captured);
        }
      }
    });
    setCaptured({ w, b });
  }, [setFen, setTurn, setHistory, setStatus, setCaptured]);

  /** 駒を動かす共通処理 */
  const makeMove = useCallback((from: Square, to: Square): boolean => {
    const game = chessRef.current;
    try {
      const move = game.move({ from, to, promotion: 'q' });
      if (move === null) return false;
      // 新しい手を指したので、Redo できる手はなくなる
      setRedoStack([]);
      updateGameState();
      return true;
    } catch (e) {
      return false;
    }
  }, [updateGameState]);

  /** ドラッグ&ドロップで駒を動かす (react-chessboard の onPieceDrop 用) */
  const onDrop = useCallback((sourceSquare: Square, targetSquare: Square): boolean => {
    const result = makeMove(sourceSquare, targetSquare);
    if (result) {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
    return result;
  }, [makeMove]);

  /**
   * マスをクリックした時の処理（クリック&クリック移動 + Piece Scope）
   *
   * ロジックの流れ:
   * 1. Piece Scope モードなら、クリックした駒を focusedSquare に設定
   * 2. 駒が選択済みの場合:
   *    a. 合法手マスをクリック → 移動実行
   *    b. 自分の別の駒をクリック → その駒を選択し直す
   *    c. その他 → 選択解除
   * 3. 駒が未選択の場合:
   *    - 自分の駒をクリック → 選択して合法手を計算
   */
  const onSquareClick = useCallback((square: Square) => {
    const game = chessRef.current;

    // ゲームが終了している場合は操作不可
    if (game.isGameOver()) return;

    // === クリック&クリック移動のロジック ===
    if (selectedSquare) {
      // 選択中の駒を再度クリック → 選択解除
      if (square === selectedSquare) {
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }

      // 合法手マスをクリック → 移動実行
      if (legalMoves.includes(square)) {
        const moved = makeMove(selectedSquare, square);
        if (moved) {
          setSelectedSquare(null);
          setLegalMoves([]);
          return;
        }
      }

      // 自分の別の駒をクリック → 選択し直す
      const clickedPiece = game.get(square);
      if (clickedPiece && clickedPiece.color === game.turn()) {
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true }) as Move[];
        setLegalMoves(moves.map(m => m.to as Square));
        return;
      }

      // その他（空マスや相手駒で移動不可）→ 選択解除
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    // 駒が未選択 → 自分の駒をクリックで選択
    const piece = game.get(square);
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true }) as Move[];
      setLegalMoves(moves.map(m => m.to as Square));
    }
  }, [selectedSquare, legalMoves, makeMove]);

  /** ゲームをリセット */
  const resetGame = useCallback(() => {
    chessRef.current.reset();
    setSelectedSquare(null);
    setLegalMoves([]);
    setRedoStack([]);
    storeReset(); // vizMode・focusedSquare も含めてストア全体をリセット
  }, [storeReset]);

  /** 一手戻す (Undo) */
  const undo = useCallback(() => {
    const undoneMove = chessRef.current.undo();
    // undo した手を redoStack に積んでおく (redo で再実行できるように)
    if (undoneMove) {
      setRedoStack(prev => [...prev, undoneMove]);
    }
    setSelectedSquare(null);
    setLegalMoves([]);
    updateGameState();
  }, [updateGameState]);

  /** 一手進める (Redo) */
  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    // スタックの末尾 (最後に undo した手) を取り出す
    const moveToRedo = redoStack[redoStack.length - 1];
    const game = chessRef.current;
    try {
      const result = game.move({
        from: moveToRedo.from,
        to: moveToRedo.to,
        promotion: moveToRedo.promotion ?? 'q',
      });
      if (result) {
        setRedoStack(prev => prev.slice(0, -1));
        setSelectedSquare(null);
        setLegalMoves([]);
        updateGameState();
      }
    } catch (e) {
      // redo に失敗した場合はスタックをクリアしてリセット
      setRedoStack([]);
    }
  }, [redoStack, updateGameState]);

  return {
    onDrop,
    onSquareClick,
    selectedSquare,
    legalMoves,
    resetGame,
    undo,
    redo,
    canUndo: history.length > 0,
    canRedo: redoStack.length > 0,
    chess: chessRef.current,
  };
};
