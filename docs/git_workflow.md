# Git ワークフロー (Git Workflow)

> このドキュメントは VizChess プロジェクトにおけるブランチ運用とコミットメッセージのルールをまとめたものです。

---

## ブランチ戦略：GitHub Flow

**ルールは2種類のブランチだけ。** シンプルに保つことが大事。

```
main
  └── feature/xxx  （または fix/ refactor/ docs/）
```

| ブランチ | 役割 |
|---|---|
| `main` | 常に動く状態を保つ。直接コミットしない。 |
| `feature/xxx` 等 | 機能・修正・作業ごとに作る。終わったら main にマージして削除。 |

---

## ブランチ命名ルール

| プレフィックス | 用途 | 例 |
|---|---|---|
| `feature/` | 新機能の追加 | `feature/redo` |
| `fix/` | バグ修正 | `fix/board-scroll` |
| `refactor/` | 動作を変えずコードを整理 | `refactor/chess-analyzer` |
| `docs/` | ドキュメントのみの変更 | `docs/update-roadmap` |

> 名前は英語・ハイフン区切り・短く具体的に。

---

## コミットメッセージのルール

種類がひと目でわかるよう、先頭にプレフィックスをつける。

| プレフィックス | 用途 | 例 |
|---|---|---|
| `feat:` | 新機能 | `feat: 再クリックで駒の選択を解除できるようにした` |
| `fix:` | バグ修正 | `fix: Board Scope中に合法手ドットで色が消えるバグを修正` |
| `refactor:` | リファクタリング | `refactor: useChessからfocusedSquare操作を分離` |
| `style:` | 見た目・整形のみ（動作変化なし） | `style: GameControlsのボタン余白を調整` |
| `docs:` | ドキュメントのみ | `docs: roadmap.mdを更新` |
| `chore:` | 設定・依存関係など | `chore: tailwind.config.tsにカスタムカラーを追加` |

---

## 作業の流れ（テンプレート）

```bash
# 1. main を最新にしてから作業ブランチを作る
git checkout main
git pull
git checkout -b feature/xxx

# 2. 実装しながらこまめにコミット
git add .
git commit -m "feat: ○○を実装した"

# 3. 完成したら main にマージ
git checkout main
git merge feature/xxx

# 4. 不要になったブランチを削除
git branch -d feature/xxx
```

---

## ロードマップと対応ブランチの例

[roadmap.md](roadmap.md) の直近タスクに対応するブランチ名の例：

| タスク | ブランチ名 |
|---|---|
| 選択駒以外のマスを暗くする | `feature/dim-inactive-squares` |
| Redo 機能 | `feature/redo` |
| Piece Scope 再設計・実装 | `feature/piece-scope` |
| 駒音 | `feature/sound` |
| UI ブラッシュアップ | `feature/ui-polish` |
