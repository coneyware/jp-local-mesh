# コーディング規約（ESLint）

backend・frontend ともに `eslint.configs.all` を適用しているため制約が多い。
コードを書く際は以下に従うこと。

---

## 基本フォーマット

- **インデント**: タブ（スペース不可）
- **クォート**: ダブルクォート
- **最大行長**: 120 文字
- **1関数あたりの最大行数**: 100 行

---

## カンマスタイル（`comma-style: first`）

複数行のオブジェクト・配列ではカンマを**次の行の先頭**に置く（行頭カンマ）。

```ts
// NG
res.render("view", {
  title: "タイトル",
  catalog: CATALOG,
  activeId: "1",
});

// OK
res.render("view", {
  title: "タイトル"
  ,catalog: CATALOG
  ,activeId: "1",
});
```

---

## 関数スタイル（`func-style`）

`function` 宣言は禁止。アロー関数式を使う。

```ts
// NG
function buildList(): string[] { ... }

// OK
const buildList = (): string[] => { ... };
```

---

## 識別子の長さ（`id-length`）

2文字未満の識別子は禁止。`d`、`n`、`r`、`p`、`t`、`c`、`i` などの単一文字変数名は使わない。

```ts
// NG
const pad = (n: number) => ...
rows.reduce((acc, r) => ...)

// OK
const pad = (num: number) => ...
rows.reduce((acc, row) => ...)
```

分割代入でも同様。

```ts
// NG
aprilRaw.map(([d, p, t, i, c]) => ...)

// OK
aprilRaw.map(([day, pending, transit, invoice, completed]) => ...)
```

---

## 配列・オブジェクトの改行（`array-element-newline` / `object-property-newline`）

複数要素の配列・オブジェクトリテラルは要素ごとに改行する（全要素を1行に収める場合はそのままでも可）。

```ts
// NG（複数行にまたがっているのに一部だけ改行）
const ids = [1, 2,
  3];

// OK
const ids = [1, 2, 3];        // 1行に収まる場合
const ids = [                  // 複数行にする場合
  1
  ,2
  ,3,
];
```

---

## 自動修正について

以下は `source.fixAll.eslint`（保存時）で自動修正される：

- `comma-style`：行頭カンマスタイルへ変換
- `array-element-newline`・`object-property-newline`：上記の改行ルール
- その他フォーマット系

`func-style` の fix は「関数式」への変換にとどまる場合があるため、アロー関数への変換は手動で行う。
`id-length` は自動修正されないので手動で修正すること。
