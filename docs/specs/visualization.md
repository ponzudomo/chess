# 可視化ロジック (Visualization Specs)

## 1. 基本概念
チェスにおける「利き (Control / Attack)」を計算し、初心者にとっての「安全地帯」と「危険地帯」を可視化する。

## 2. アルゴリズム詳細

### 入力
- `fen`: 現在の盤面情報

### 処理プロセス
1. **初期化**: 8x8 (64マス) の数値を格納する配列 `attackMap` を作成。初期値 `0`。
2. **白駒の利き計算**:
   - 盤上のすべての白駒をループ。
   - 各駒の「疑似法的手 (Pseudo-legal moves)」または「攻撃範囲」を取得。
   - ※ ポーンの場合: 前進は含めず、**斜め前の攻撃マスのみ**を対象とする。
   - 対象となるマス `sq` に対し、`attackMap[sq] += 1` (またはビットフラグ設定)。
3. **黒駒の利き計算**:
   - 盤上のすべての黒駒をループ。
   - 同様に攻撃範囲を取得。
   - 対象となるマス `sq` に対し、`attackMap[sq] -= 1` (または別プロパティに記録)。
4. **分類 (Classification)**:
   - 各マスの最終的な状態を判定する。

### 判定ロジック
現状は単純な「利きがあるかないか」で判定する (個数は考慮しない簡易モデルからスタート)。

```typescript
type SquareStatus = 'none' | 'white-control' | 'black-control' | 'contested';

function classifySquare(whiteAttacks: boolean, blackAttacks: boolean): SquareStatus {
  if (whiteAttacks && blackAttacks) return 'contested';
  if (whiteAttacks) return 'white-control';
  if (blackAttacks) return 'black-control';
  return 'none';
}
```

## 3. 特殊ルール
- **キングの扱い**: キング周辺の「逃げ道」可視化のため、キング自体の移動範囲も含める。
- **レントゲン (X-Ray)**: 将来的には、味方の駒越しに効いているラインも考慮するか検討するが、初期リリースでは実装しない。
- **絶対ピン**: ピンされて動けない駒であっても、その駒は「マスを支配している」とみなす（キングを守る役割などは有効なため）。`chess.js` の仕様に従う。
