# 開発ロードマップ (Roadmap)

> 最終更新: 2026-02-20（feature/redo マージ）

## 🟢 Phase 1: MVP (Minimum Viable Product)
基本機能と可視化ロジックの実装完了を目指す。

- [x] **Project Init**:
    - [x] Next.js + TypeScript 環境構築
    - [x] Tailwind CSS 設定
    - [x] Component設計 (`Board/`, `Controls/`, `UI/`)
- [x] **Basic Chess Logic**:
    - [x] `chess.js` 導入
    - [x] 盤面の表示 (`react-chessboard` 採用)
    - [x] 駒の移動実装（クリック&クリック + ドラッグ&ドロップ、合法手チェック）
    - [x] チェック / チェックメイト / 引き分け判定
    - [x] 取った駒 (Captured Pieces) の記録・表示
- [x] **Visualization Feature (Board Scope)**:
    - [x] 攻撃範囲算出ロジックの実装 (`lib/chess-analyzer.ts`)
    - [x] Board Scope モードの実装（青・赤・紫のオーバーレイ）
    - [x] `Zustand` による可視化状態管理 (`vizMode`, `focusedSquare`)
- [x] **Visualization Feature (Piece Scope)**:
    - [x] 駒クリックで `focusedSquare` を更新するUIの実装
    - [x] `focusedSquare` に基づいた個別駒の利き表示（黄色オーバーレイ）
    - [x] `lib/chess-analyzer.ts` に `analyzePiece()` 関数を追加
- [x] **UI Refine**:
    - [x] サイドパネル（GameInfo + GameControls）の実装
    - [x] リセット・Undo・Redo・Flip ボタン（Redo は手がないときグレーアウト）
    - [x] Board Scope / Piece Scope の切り替えボタン
    - [x] レスポンシブ対応（横長: 横並び / 縦長: 縦並び）
    - [x] 盤面サイズをウィンドウサイズに追従させ画面内に収める (`useBoardLayout` フック)
    - [x] 駒選択中に再クリックで選択解除
    - [x] 駒選択中に選択駒・移動先以外のマスと駒を暗くする (`brightness` + `linear-gradient`)

## 🔵 Phase 2: Game Experience
対局体験を向上させる機能の追加。

- [x] **Game Control**:
    - [x] 棋譜（Move History）の表示 UI（SAN記法、自動スクロール）
    - [x] Redo 機能（`redoStack` 管理、新手でクリア、ボタン無効化）
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
1. UI/UX のブラッシュアップ（カラー調整・アイコン改善など）
2. 駒音の実装
3. Piece Scope の再設計・実装（右クリックまたは専用モード切り替え）
