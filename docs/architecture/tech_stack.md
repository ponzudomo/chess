# 技術選定 & アーキテクチャ

## 1. 技術スタック詳細
| カテゴリ | 技術 | 選定理由 |
| --- | --- | --- |
| **Frontend Framework** | **Next.js (App Router)** | Reactの標準。Vercelへのデプロイが容易。将来的なバックエンド機能（AI対戦APIなど）の拡張性。 |
| **Language** | **TypeScript** | 盤面情報やゲームロジックの複雑な型管理のため必須。 |
| **Styling** | **Tailwind CSS** | 素早いプロトタイピング、カスタマイズのしやすさ。 |
| **State Management** | **Zustand** | Reduxより軽量で、Context APIよりパフォーマンスが良い（再レンダリング抑制）。チェスの盤面状態管理に最適。 |
| **Chess Logic** | **chess.js** | デファクトスタンダード。FEN文字列の解析、正当な移動の判定、勝敗判定などのロジックを一任できる。 |
| **Board UI** | **react-chessboard** | 軽量でカスタマイズ可能なReact用チェス盤コンポーネント。自作も可能だが、スタートダッシュのために採用。必要なら後で自作SVGに置き換え。 |

## 2. ディレクトリ構造 (Project Structure)
```
/
├── public/             # 静的ファイル (画像、アイコン)
├── src/
│   ├── app/            # Next.js App Router Pages
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/     # React Components
│   │   ├── Board/      # チェス盤関連
│   │   ├── Controls/   # 設定パネル、ボタン
│   │   └── UI/         # 汎用UIパーツ
│   ├── hooks/          # Custom Hooks
│   ├── store/          # Zustand State
│   ├── lib/            # Utilities (Game Logic)
│   └── styles/         # Global Styles
├── docs/               # ドキュメント
└── ...config files
```
