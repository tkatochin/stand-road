# ARCHITECTURE

## 目的

このドキュメントは、STAND ROAD の実装方針をまとめます。

AI が自律的な開発メンバーとして実装を進める際、Scene、状態、データ、ロジックの分離方針を判断する基準にします。

## 技術スタック

- Vite
- TypeScript
- Phaser 3
- GitHub Pages

## 基本方針

- Scene は描画と入力を中心にする
- ゲーム状態は Scene から分離する
- カード、イベント、敵などのデータは後から JSON または data module に分離できる形にする
- AI バトルやランキングのような外部連携は境界を明確にする
- MVP では体験を早く触れることを優先し、過度な抽象化は避ける

## 推奨ディレクトリ構成

```text
src/
  main.ts
  scenes/
    BootScene.ts
    TitleScene.ts
    RoadScene.ts
    CollectionScene.ts
    EncounterScene.ts
    ResultScene.ts
  data/
    cards.ts
  game/
    state.ts
    road.ts
    collection.ts
  ai/
    battleTypes.ts
    mockBattle.ts
  styles.css
```

この構成は必要になった時点で段階的に導入します。Issue 0 の時点で全ファイルを作る必要はありません。

## Scene の責務

### BootScene

初期化と最初の Scene への遷移を担当します。

### TitleScene

タイトル表示とゲーム開始導線を担当します。

### RoadScene

一本道の表示、進む操作、進行度表示、遭遇の入口を担当します。

### CollectionScene

取得済みカード、未取得カード、カード詳細、NEW 表示を担当します。

### EncounterScene

スタンド使いとの出会い演出とカード獲得の入口を担当します。

### ResultScene

旅の結果表示と再プレイ導線を担当します。

## 状態管理

MVP では、軽量な TypeScript object でゲーム状態を管理します。

```ts
type GameState = {
  road: {
    distance: number;
    stage: number;
    goalDistance: number;
  };
  collection: {
    acquiredCardIds: string[];
    newCardIds: string[];
    acquisitions: CardAcquisition[];
  };
};
```

複雑な状態管理ライブラリは MVP では導入しません。

## データ管理

MVP のカードデータは TypeScript module として始めます。

カード数やイベント数が増えた段階で JSON 化を検討します。最初からデータ読み込み層を重くしすぎない方針です。

## テスト方針

Phaser Scene の表示テストより、まず純粋なゲームロジックをテスト対象にします。

優先するテストは以下です。

- 進行度更新
- カード獲得
- NEW 状態
- 取得履歴
- AI バトル mock 判定

## GitHub Pages 方針

Vite の `base` は `/stand-road/` とします。

GitHub Pages へのデプロイは GitHub Actions で自動化します。

## 外部 API 方針

GitHub Pages は静的ホスティングなので、ブラウザに API キーを置く実装は禁止します。

本番 AI バトルやランキングなどの外部連携は、サーバーまたはサーバーレス関数を経由する設計にします。

## 自律開発メンバーとしての AI の責務

AI は承認済み Issue の範囲内で、次を主体的に行います。

- 実装方針の決定
- 必要なファイル追加と変更
- README と docs の更新
- テスト追加の判断
- ビルド確認
- エラー修正
- 小規模なリファクタリング
- 残課題と次 Issue の提案

一方で、承認されていない Issue には着手しません。
