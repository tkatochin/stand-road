# CARD SPEC

## 目的

カードは STAND ROAD の収集対象であり、AI バトルの解釈材料です。

MVP のカードは文章主体で設計します。攻撃力や防御力は持たせません。スタンド使い、スタンド名、能力文章、画像、レアリティを中心にします。

## MVP のカード構造

```ts
type StandCard = {
  id: string;
  standUser: string;
  standName: string;
  ability: string;
  image: string;
  rarity: CardRarity;
};

type CardRarity = 'common' | 'rare' | 'epic' | 'legendary';
```

## フィールド

### id

カードを一意に識別する ID です。

実装では `snake-case` または `kebab-case` のどちらかに統一します。MVP では `kebab-case` を推奨します。

### standUser

スタンド使いの名前です。

### standName

スタンドの名前です。

### ability

スタンド能力の文章です。

このゲームで最も重要なフィールドです。AI バトルでは、この文章を中心に勝敗や物語を解釈します。

### image

カード画像へのパスです。

MVP では実画像が未完成でも、仮画像またはプレースホルダーを指定できるようにします。

### rarity

カードの希少度です。

MVP では演出とコレクション欲を作るために使います。バトルの勝敗を直接決めるためには使いません。

## 数値パラメータについて

MVP では攻撃力、防御力、HP のような数値パラメータはカードに持たせません。

将来的に数値パラメータを追加する可能性は残します。ただし、追加する場合も ability の文章解釈をゲームの中心に置く方針は変えません。

将来拡張する場合は、以下のような optional な領域を検討します。

```ts
type StandCardExtensions = {
  tags?: string[];
  parameters?: Record<string, number>;
};
```

## 初期カード数

MVP では最低 10 種類程度のカードを用意します。

各カードには、短くても AI が解釈できる能力文章を必ず持たせます。

## カード作成の指針

- ability は勝敗解釈に使える具体性を持たせる
- rarity は強さではなく、希少性や演出の指標にする
- standUser と standName はカードの記憶しやすさを優先する
- image は後から差し替えやすいパスで管理する

## 将来拡張

- タグ追加
- AI 生成カード
- カード画像生成
- ステージ別カードプール
- 入手条件
- 重複カード履歴
