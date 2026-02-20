# カラーパレット & デザインシステム

## 1. 配色 (Color Palette)

### テーマカラー
ダークモードを基調とし、長時間の思考でも目が疲れない配色を採用する。
*将来的にはライトモード/ダークモードの切り替え機能にも対応予定。*

| Role | Color Code | Description |
| :--- | :--- | :--- |
| **Background** | `#1a1a1a` (Dark Gray) | アプリ全体の背景色 |
| **Board Light**| `#eeeed2` (Beige) | チェス盤の白マス |
| **Board Dark** | `#769656` (Green) | チェス盤の黒マス (Chess.com風) |
| **Text Main**  | `#ffffff` | メインテキスト |
| **Text Muted** | `#a1a1a1` | サブテキスト、ラベル |
| **Primary**    | `#81b64c` | アクションボタン、アクセント |

### 可視化ガイドカラー (Viz Colors)
盤面に重ねるオーバーレイの色定義。視認性を確保するため、半透明度 (`alpha`) の調整が重要。

> **Piece Scope 時の強調表現**: 
> 特定の駒を選択した際、**選択した駒とその攻撃範囲以外を暗くする (Dimming)** ことで、情報の優先順位を整理する。

| Meaning | Color (RGBA) | Usage |
| :--- | :--- | :--- |
| **My Attack** (自軍の利き) | `rgba(59, 130, 246, 0.5)` | Tailwind `blue-500` based. 自分が支配している安全なエリア。 |
| **Opponent Attack** (敵軍の利き) | `rgba(239, 68, 68, 0.5)` | Tailwind `red-500` based. 入ると取られる危険なエリア。 |
| **Contested** (激戦区) | `rgba(168, 85, 247, 0.6)` | Tailwind `purple-500` based. お互いの利きが重なるマス。 |
| **Dimmed Overlay** (暗転) | `rgba(0, 0, 0, 0.6)` | **Piece Scope** 用。選択外のエリアを暗くして目立たなくするマスク色。 |
| **Last Move** (直前の手) | `rgba(255, 255, 0, 0.3)` | 直前に動かした駒の移動元・移動先。 |

## 2. タイポグラフィ
- **Font Family**: `Inter`, `Roboto`, or System UI fonts. 可読性重視。
- **Chess Font**: 棋譜表記には等幅フォント (`Monospace`) または専用のチェスフォントアイコンを使用してもよい。
