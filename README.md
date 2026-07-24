# STAND ROAD

STAND ROAD は、スタンド使いたちと出会い、カードを集めながら一本道を旅する AI ストーリーカード RPG です。

このリポジトリでは Phaser 3 と Vite を使ってブラウザゲームとして開発し、GitHub Pages で公開します。

## 開発方針

このプロジェクトは「人間はできるだけコードを書かない」ことを目的とした実験です。AI がプロジェクト構成、実装、README 更新、ドキュメント更新、テスト、GitHub Actions、リファクタリングを積極的に担当します。

## 現在遊べる内容

RoadScene の最小プロトタイプを実装しています。

- 「進む」ボタンで一本道を進行
- `Space`、`Enter`、右矢印キーでも進行
- 距離に応じたステージ更新
- 30m ごとの遭遇とカード獲得
- 150m のゴール到達とリスタート

カードの詳細表示、CollectionScene、AI バトルは今後の Issue で実装します。

## セットアップ

```bash
npm install
```

## ローカル起動

```bash
npm run dev
```

## ビルド

```bash
npm run build
```

## テスト

```bash
npm test
```

## プレビュー

```bash
npm run preview
```

Vite の `base` は GitHub Pages のリポジトリ公開に合わせて `/stand-road/` に設定しています。

`main` ブランチへの push 時に、GitHub Actions がテストとビルドを実行し、成功した `dist` を GitHub Pages へデプロイします。
