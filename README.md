# jp-local-mesh
日本の地域メッシュの計算・GeoJSON生成

* インストール方法
	```
	npm install jp-local-mesh
	```

* 使い方（コンソール）
	```
	$ node ./node_modules/jp-local-mesh/bin/meshGeoJsonMake -h
	Usage: meshGeoJsonMake [options]

	Options:
	  -w, --workDir <string>         作業フォルダ (default: systemのtempフォルダ/mesh)
	  -o, --outDir <string>          出力先フォルダ (default: systemのtempフォルダ/mesh)
	  -p, --prefecture <string>      都道府県番号 (default: 番号リストの出力)
	  -j, --municipalities <string>  市区町村コード（カンマ区切り） (default: 自治体。番号リストの出力（都道府県指定時）)
	  -m, --meshWidths <string>      メッシュ幅（カンマ区切り） (default: "1km")
	  -h, --help                     display help for command
	対応するメッシュ幅:
			80km  (一次メッシュ)
			10km  (二次メッシュ)
			2km   (２倍地域メッシュ)
			5km   (５倍地域メッシュ)
			1km   (三次メッシュ)
			500m  (2分の1地域メッシュ)
			250m  (4分の1地域メッシュ)
			125m  (8分の1地域メッシュ)
			100m  (10分の1地域メッシュ)
			50m   (20分の1地域メッシュ)
	Option指定例: 青森県の自治体コード出力
			meshGeoJsonMake -p 02
	Option指定例: 青森県全県の１・２・３次メッシュ生成
			meshGeoJsonMake -o ./ -p 02 -j 02 -m 80km,10km,1km
	```

## 地域メッシュのGeoJSON生成
自治体別の地域メッシュを生成できます

### 対象メッシュコードの取得先
[総務省統計局の市区町村別メッシュ・コード一覧](https://www.stat.go.jp/data/mesh/m_itiran.html)
* 都道府県別CSV
	+ `https://www.stat.go.jp/data/mesh/csv/${都道府県番号}.csv`
* 三次メッシュ（1km）

## メッシュコード計算
* メッシュコードの北西端・南東端の緯度経度取得
	```
	import {calc} from "jp-local-mesh";
	const result = calc.("533911");
	console.log("二次メッシュ")
	console.log(`北端緯度${result[0][0]}`);
	console.log(`西端経度${result[0][1]}`);
	console.log(`南端緯度${result[1][0]}`);
	console.log(`東端経度${result[1][1]}`);
	const meshInfo = calc.MESH_INFO.find((info) => info.width === "80km");
	const result = calc.("533911", meshInfo);
	console.log("一次メッシュ換算")
	console.log(`北端緯度${result[0][0]}`);
	console.log(`西端経度${result[0][1]}`);
	console.log(`南端緯度${result[1][0]}`);
	console.log(`東端経度${result[1][1]}`);
	
	```