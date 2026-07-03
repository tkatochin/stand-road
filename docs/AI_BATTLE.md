# AI BATTLE

## 目的

AI バトルは、STAND ROAD の将来拡張における中核機能です。

このゲームのバトルは、攻撃力や防御力などの数値比較ではありません。スタンド能力の文章、状況、対戦相手との相性を AI が読み取り、物語として勝敗と理由を返すことを目指します。

## 基本方針

- MVP では本番 AI API に接続しない
- MVP では mock 判定で体験の形だけを確認する
- カードの `ability` を判定材料の中心にする
- 勝敗だけでなく、理由文をゲーム体験として重視する
- 将来の API 接続を前提に、入力と出力の型を分離する

## バトル入力

AI バトルは、最低限以下の情報を受け取ります。

```ts
type AiBattleInput = {
  playerCardId: string;
  opponentCardId: string;
  situation: string;
  roadContext?: {
    stage: number;
    distance: number;
  };
};
```

カード ID からカード定義を参照し、`standUser`, `standName`, `ability`, `rarity` を AI 判定の材料にします。

## バトル出力

AI バトルは、最低限以下の情報を返します。

```ts
type AiBattleResult = {
  winner: 'player' | 'opponent' | 'draw';
  reason: string;
  story: string;
};
```

`reason` は勝敗の説明、`story` は画面に表示する短い物語文です。

## mock 判定

本番 AI 接続前の MVP では、mock 判定を使います。

mock 判定は完全なゲームバランスを目的にしません。目的は、数値なしのバトル画面が成立するか、能力文章を読ませる体験が楽しいかを検証することです。

## 禁止事項

MVP の AI バトル設計では、以下を避けます。

- 攻撃力と防御力だけで勝敗を決める
- ability を単なるフレーバーテキストにする
- Scene に AI 判定ロジックを直接埋め込む
- API キーをブラウザに置く

## 本番 AI 接続の方針

本番 AI 接続を行う場合、ブラウザから直接 LLM API を呼ばない方針とします。

API キーを安全に扱うため、必要に応じてサーバーまたはサーバーレス関数を経由します。GitHub Pages は静的ホスティングであるため、本番 AI 接続には別の実行環境が必要です。

## 将来拡張

- AI による勝敗判定
- AI によるバトル演出文生成
- 状況文の自動生成
- カード同士の相性解釈
- プレイヤー選択肢による判定補正
- バトルログ保存
