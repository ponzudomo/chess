import { create } from 'zustand';
import { Square } from 'chess.js';

export type VizMode = 'none' | 'board' | 'piece';
export type GameStatus = 'active' | 'checkmate' | 'draw' | 'stalemate' | 'check';

interface GameState {
  fen: string;
  turn: 'w' | 'b';
  history: string[]; // SAN history
  captured: { w: string[], b: string[] }; // Simplified captured pieces (just types)
  status: GameStatus;
  vizMode: VizMode;
  focusedSquare: Square | null;

  // Actions
  setFen: (fen: string) => void;
  setTurn: (turn: 'w' | 'b') => void;
  setHistory: (history: string[]) => void;
  setCaptured: (captured: { w: string[], b: string[] }) => void;
  setStatus: (status: GameStatus) => void;
  setVizMode: (mode: VizMode) => void;
  setFocusedSquare: (square: Square | null) => void;
  resetGame: () => void;
}

const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export const useGameStore = create<GameState>((set) => ({
  fen: INITIAL_FEN,
  turn: 'w',
  history: [],
  captured: { w: [], b: [] },
  status: 'active',
  vizMode: 'none',
  focusedSquare: null,

  setFen: (fen) => set({ fen }),
  setTurn: (turn) => set({ turn }),
  setHistory: (history) => set({ history }),
  setCaptured: (captured) => set({ captured }),
  setStatus: (status) => set({ status }),
  setVizMode: (vizMode) => set({ vizMode }),
  setFocusedSquare: (focusedSquare) => set({ focusedSquare }),
  resetGame: () => set({
    fen: INITIAL_FEN,
    turn: 'w',
    history: [],
    captured: { w: [], b: [] },
    status: 'active',
    vizMode: 'none',
    focusedSquare: null,
  }),
}));
