# 開発ロードマップ (Roadmap)

## Phase 1: MVP (Minimum Viable Product)
基本機能と可視化ロジックの実装完了を目指す。

- [ ] **Project Init**:
    - [ ] Next.js + TypeScript 環境構築
    - [ ] Tailwind CSS 設定
    - [ ] Component設計 (Board, Cell)
- [ ] **Basic Chess Logic**:
    - [ ] `chess.js` 導入
    - [ ] 盤面の表示 (`react-chessboard` or custom)
    - [ ] 駒の移動実装
- [ ] **Visualization Feature**:
    - [ ] 攻撃範囲算出ロジックの実装 (`analyze.ts`)
    - [ ] Board Scope モードの実装（盤面へのオーバーレイ）
    - [ ] Piece Scope モードの実装（クリックイベント連携）
- [ ] **UI Refine**:
    - [ ] サイドパネル、設定トグルの実装
    - [ ] レスポンシブ対応

## Phase 2: Game Experience
対局体験を向上させる機能の追加。

- [ ] **Game Control**:
    - [ ] 棋譜（History）表示
    - [ ] Undo / Redo 機能
    - [ ] リセット機能
- [ ] **Sound & Animation**:
    - [ ] 駒音の実装
    - [ ] 移動アニメーションの調整

## Phase 3: Advanced Features (Future)
より高度な学習機能。

- [ ] **AI Opponent**: `stockfish.js` の組み込み
- [ ] **Puzzle Mode**: 次の一手問題の実装
- [ ] **Advanced Guide**:
    - [ ] 「ピン」や「フォーク」の警告アラート
    - [ ] "Best Move" の示唆

## タスクリスト (直近)
1. Next.js プロジェクトの作成 (`npx create-next-app`)
2. ディレクトリ構造の整理
3. ライブラリ (`chess.js`, `react-chessboard`, `zustand`) のインストール
4. Boardコンポーネントのモックアップ作成
