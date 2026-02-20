"use client";

import { useState } from 'react';
import ChessBoard from '@/components/Board/ChessBoard';
import GameControls from '@/components/Controls/GameControls';
import GameInfo from '@/components/UI/GameInfo';
import { useChess } from '@/hooks/useChess';

export default function Home() {
  const { onDrop, resetGame, undo } = useChess();
  const [flip, setFlip] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8 bg-[#1a1a1a] text-white">
      {/* Header */}
      <header className="w-full max-w-5xl flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          VizChess
        </h1>
        <nav className="flex gap-4 text-gray-400">
          <a href="#" className="hover:text-white transition-colors">About</a>
          <a href="#" className="hover:text-white transition-colors">GitHub</a>
        </nav>
      </header>

      {/* Game Content */}
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl flex-1">
        
        {/* Left Column: Board */}
        <div className="flex-1 flex justify-center items-start">
          <div className="w-full max-w-[600px] aspect-square shadow-2xl rounded-lg overflow-hidden border-4 border-gray-700">
             <div className="w-full h-full">
                <ChessBoard 
                  onPieceDrop={onDrop} 
                  boardOrientation={flip ? 'black' : 'white'} 
                /> 
             </div>
          </div>
        </div>

        {/* Right Column: Info & Controls */}
        <div className="w-full md:w-80 flex flex-col gap-6">
          <GameInfo />
          
          <GameControls 
            onReset={resetGame} 
            onUndo={undo} 
            onFlip={() => setFlip(!flip)} 
          />

          <div className="bg-gray-800 p-4 rounded-lg text-sm text-gray-400">
            <h3 className="text-white font-bold mb-2">How to Play</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Drag & Drop pieces to move.</li>
              <li>Toggle "Show Scope" to see attack ranges.</li>
              <li>Blue = White Control</li>
              <li>Red = Black Control</li>
              <li>Purple = Contested</li>
            </ul>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="w-full max-w-5xl mt-8 pt-4 border-t border-gray-700 text-center text-gray-500 text-sm">
        <p>© 2024 VizChess. All rights reserved.</p>
      </footer>
    </main>
  );
}
