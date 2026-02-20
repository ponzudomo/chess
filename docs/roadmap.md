# 開発ロードマップ (Roadmap)

> 最終更新: 2026-02-20

## 🟢 Phase 1: MVP (Minimum Viable Product)
基本機能と可視化ロジックの実装完了を目指す。

- [x] **Project Init**:
    - [x] Next.js + TypeScript 環境構築
    - [x] Tailwind CSS 設定
    - [x] Component設計 (`Board/`, `Controls/`, `UI/`)
- [x] **Basic Chess Logic**:
    - [x] `chess.js` 導入
    - [x] 盤面の表示 (`react-chessboard` 採用)
    - [ ] 駒の移動実装（クリック&クリック、合法手チェック）
    - [x] チェック / チェックメイト / 引き分け判定
    - [x] 取った駒 (Captured Pieces) の記録・表示
- [x] **Visualization Feature (Board Scope)**:
    - [x] 攻撃範囲算出ロジックの実装 (`lib/chess-analyzer.ts`)
    - [x] Board Scope モードの実装（青・赤・紫のオーバーレイ）
    - [x] `Zustand` による可視化状態管理 (`vizMode`, `focusedSquare`)
- [ ] **Visualization Feature (Piece Scope)**:
    - [ ] 駒クリックで `focusedSquare` を更新するUIの実装 ← **次のステップ**
    - [ ] `focusedSquare` に基づいた個別駒の利き表示
- [x] **UI Refine**:
    - [x] サイドパネル（GameInfo + GameControls）の実装
    - [x] リセット・Undo・Flip ボタン
    - [x] レスポンシブ対応（モバイル / デスクトップ）

## 🔵 Phase 2: Game Experience
対局体験を向上させる機能の追加。

- [ ] **Game Control**:
    - [ ] 棋譜（Move History）の表示 UI ← **store には `history` があるが表示未実装**
    - [ ] Redo 機能
- [ ] **Sound & Animation**:
    - [ ] 駒音の実装
    - [ ] 移動アニメーションの調整

## ⚪ Phase 3: Advanced Features (Future)
より高度な学習機能。

- [ ] **AI Opponent**: `stockfish.js` の組み込み
- [ ] **Puzzle Mode**: 次の一手問題の実装
- [ ] **Advanced Guide**:
    - [ ] 「ピン」や「フォーク」の警告アラート
    - [ ] "Best Move" の示唆

---

## 📋 直近のタスク（優先順）
1. 駒の移動方法をクリック&クリックに変更
2. 盤面が大きすぎて画面に収まりきっていない　縦横ともに画面内に収まり切るようにサイズを調整
3. **Piece Scope モードの実装**
   - `ChessBoard.tsx` に駒クリックイベント (`onPieceClick`) を追加
   - `focusedSquare` をストアで更新し、`chess-analyzer.ts` で個別利きを計算・表示
4. **棋譜（Move History）表示の実装**
   - `GameInfo.tsx` に `history` （SAN記法）のリスト表示を追加
5. UI/UX のブラッシュアップ（カラー調整・アイコン改善など）
