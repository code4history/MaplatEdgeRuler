# MaplatEdgebound

Maplat EdgeBoundは、[Delaunator](https://github.com/mapbox/delaunator)を基盤として、様々な制約を含んだ三角網を生成するためのライブラリです。

English README is [here](./README.md).

## 特徴

- Delaunatorの出力に対して、エッジ制約を適用
- 複数の制約タイプをサポート
  - 必須エッジ制約（v0.1.0で実装済み）
  - 不許可エッジ制約（v0.3.0で実装予定）
- 高速なアルゴリズムと効率的なメモリ使用
- TypeScriptで実装され、型定義を完備

## インストール

### npm

```sh
# メインパッケージのインストール
npm install @maplat/edgebound

# 利用に必要な前提パッケージをインストール
npm install delaunator
```

### ブラウザ

```html
<script src="https://unpkg.com/@maplat/edgebound/dist/maplat_edgebound.umd.js"></script>
```

### ブラウザ

Maplat EdgeBoundをインストールする前に、以下の前提ライブラリを読み込んでおく必要があります。

```html
<!-- 前提ライブラリ -->
<script src="https://unpkg.com/delaunator/delaunator.min.js"></script>


<!-- そしてMaplat EdgeBoundをロード -->
<script src="https://unpkg.com/@maplat/edgebound/dist/maplat_edgebound.umd.js"></script>
```

## 使い方

### 必須エッジ制約 (v0.1.0)

```typescript
import Delaunator from "delaunator";
import EdgeBound from "@maplat/edgebound";

// 点群データの定義
const points = [[150, 50], [50, 200], [150, 350], [250, 200]];

// Delaunator による初期三角網の生成
const del = Delaunator.from(points);

// 制約付き三角網の生成
const con = new EdgeBound(del);

// 必須エッジの追加（例：頂点0と頂点2を結ぶエッジ）
con.constrainOne(0, 2);

// 複数の必須エッジを一括追加
const edges = [[0, 1], [1, 2], [2, 3]];
con.constrainAll(edges);

// 制約付き三角網の結果はdelプロパティとして取得可能
const constrainedDel = con.del;
```

#### 制約条件

入力データは以下の条件を満たす必要があります:

- 点群に重複する座標が存在しないこと
- 制約エッジ同士が交差しないこと
- 制約エッジが、その端点以外の点と交差しないこと
- 三角網の外周が凸包を形成すること
- 三角網に穴が存在しないこと

最後の2つの条件はDelaunatorによって保証されますが、三角網を修正する際には注意が必要です。

#### アルゴリズム

基本的なアプローチ：

- まず通常のドロネー三角分割を構築（Delaunatorを使用）
- 指定された制約エッジの追加処理
- 制約エッジと交差する既存のエッジを検出して除去
- 制約エッジを維持しながら、可能な限りドロネー条件を満たすように最適化

このアルゴリズムは、以下の論文を参考にしています：

- [A fast algorithm for generating constrained Delaunay triangulations, 1992, S. W. Sloan](https://web.archive.org/web/20210506140628if_/https://www.newcastle.edu.au/__data/assets/pdf_file/0019/22519/23_A-fast-algortithm-for-generating-constrained-Delaunay-triangulations.pdf)

#### パフォーマンス

- 点数Nに対してほぼ線形の実行時間(O(N))を実現
- ビットセット（BitSet）を活用して効率的なメモリ使用を実現
- 制約付加による追加コストは通常10%未満

### 将来の拡張予定 (v0.3.0)

```typescript
import Delaunator from "delaunator";
import {Forbid} from "@maplat/edgebound";

const del = Delaunator.from(points);
const fbd = new Forbid(del);
fbd.forbidAll(forbidEdges);  // 不許可エッジの定義
const forbidDel = fbd.del;   // 制約結果の三角網
```

## ライセンス

MIT License

Copyright (c) 2024 Code for History

### 開発者

- Kohei Otsuka
- Code for History

### クレジット

- このライブラリは[@kninnug/constrainautor 4.0.0](https://github.com/kninnug/Constrainautor/)を基に開発されています
- 制約アルゴリズムは S. W. Sloan の論文を参考にしています
- [robust-predicates](https://github.com/mourner/robust-predicates) (Jonathan Shewchukの幾何計算アルゴリズムのポート) を使用しています

あなたの貢献をお待ちしています！[イシューやプルリクエスト](https://github.com/code4history/MaplatEdgebound/issues)は大歓迎です。



