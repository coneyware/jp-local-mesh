# jp-local-mesh
地域メッシュの計算・GeoJSON生成

* インストール方法
	```
	npm install jp-local-mesh
	```

* 使い方（コンソール）
	```
	$ npx meshGeoJsonMake -h
	Usage: meshGeoJsonMake [options]

	Options:
	-w, --workDir <string>         作業フォルダ (default: systemのtempフォルダ/mesh)
	-o, --outDir <string>          出力先フォルダ (default: systemのtempフォルダ/mesh)
	-p, --prefecture <string>      都道府県番号 (default: 番号リストの出力)
	-j, --municipalities <string>  市区町村（カンマ区切り） (default: 自治体。番号リストの出力（都道府県指定時）)
	-m, --meshWidths <string>      メッシュ幅（カンマ区切り） (default: "1km")
	-e, --envfile <string>         環境変数ファイル (default: "../.env")
	-h, --help                     display help for command
	```

## 地域メッシュのGeoJSON生成
自治体別の地域メッシュを生成できます

### 対象メッシュコードの取得先
[総務省統計局の市区町村別メッシュ・コード一覧](https://www.stat.go.jp/data/mesh/m_itiran.html)

## メッシュコード計算
