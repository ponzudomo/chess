import { Chess, Square, Color, Piece } from "chess.js";

export type SquareStatus = "none" | "white-control" | "black-control" | "contested";

export interface VisualizeData {
  status: Partial<Record<Square, SquareStatus>>;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];

const ALL_SQUARES: Square[] = [];
for (const r of RANKS) {
  for (const f of FILES) {
    ALL_SQUARES.push((f + r) as Square);
  }
}

function getSquare(fileIndex: number, rankIndex: number): Square | null {
  if (fileIndex < 0 || fileIndex > 7 || rankIndex < 0 || rankIndex > 7) return null;
  return (FILES[fileIndex] + RANKS[rankIndex]) as Square;
}

function getFileIndex(square: Square): number {
  return square.charCodeAt(0) - 'a'.charCodeAt(0);
}

function getRankIndex(square: Square): number {
  return parseInt(square[1]) - 1;
}

function computePieceAttacks(chess: Chess, square: Square, piece: Piece, attacks: Set<Square>) {
  const f = getFileIndex(square);
  const r = getRankIndex(square);

  const add = (fi: number, ri: number) => {
    const s = getSquare(fi, ri);
    if (s) attacks.add(s);
  };

  const slide = (dFiles: number[], dRanks: number[]) => {
    for (let i = 0; i < dFiles.length; i++) {
        const df = dFiles[i];
        const dr = dRanks[i];
        
        let cf = f + df;
        let cr = r + dr;

        while (true) {
            const target = getSquare(cf, cr);
            if (!target) break;

            attacks.add(target);

            // If we hit a piece, we stop (ray is blocked)
            // But we include that square as "attacked" (defended or threatened)
            if (chess.get(target)) break;

            cf += df;
            cr += dr;
        }
    }
  };

  switch (piece.type) {
    case 'p':
      // White pawn attacks (f-1, r+1), (f+1, r+1) based on rank index increasing
      // Standard chess.js: rank 1 is index 0. rank 8 is index 7.
      // White moves +1 rank index. Black moves -1 rank index.
      const dir = piece.color === 'w' ? 1 : -1;
      add(f - 1, r + dir);
      add(f + 1, r + dir);
      break;

    case 'n':
      const knightMoves = [
        [1, 2], [1, -2], [-1, 2], [-1, -2],
        [2, 1], [2, -1], [-2, 1], [-2, -1]
      ];
      knightMoves.forEach(([df, dr]) => add(f + df, r + dr));
      break;

    case 'k':
      const kingMoves = [
        [0, 1], [0, -1], [1, 0], [-1, 0],
        [1, 1], [1, -1], [-1, 1], [-1, -1]
      ];
      kingMoves.forEach(([df, dr]) => add(f + df, r + dr));
      break;

    case 'b':
        slide([1, 1, -1, -1], [1, -1, 1, -1]);
        break;

    case 'r':
        slide([0, 0, 1, -1], [1, -1, 0, 0]);
        break;

    case 'q':
        slide(
          [1, 1, -1, -1, 0, 0, 1, -1], 
          [1, -1, 1, -1, 1, -1, 0, 0]
        );
        break;
  }
}

function getAttackedSquares(chess: Chess, color: Color): Set<Square> {
  const attacks = new Set<Square>();

  // Use ALL_SQUARES to iterate and check pieces
  // This is safe and agnostic of internal board representation
  for (const sq of ALL_SQUARES) {
    const piece = chess.get(sq);
    if (piece && piece.color === color) {
        computePieceAttacks(chess, sq, piece, attacks);
    }
  }
  return attacks;
}

export function analyzeBoard(fen: string): VisualizeData {
  const chess = new Chess(fen);
  
  const whiteAttacks = getAttackedSquares(chess, 'w');
  const blackAttacks = getAttackedSquares(chess, 'b');

  const status: Partial<Record<Square, SquareStatus>> = {};

  for (const sq of ALL_SQUARES) {
    const w = whiteAttacks.has(sq);
    const b = blackAttacks.has(sq);

    let s: SquareStatus = 'none';
    if (w && b) s = 'contested';
    else if (w) s = 'white-control';
    else if (b) s = 'black-control';
    
    if (s !== 'none') {
        status[sq] = s;
    }
  }

  return { status };
}
