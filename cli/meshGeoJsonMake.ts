#!/usr/bin/env node
/**
 * メッシュデータのGeoJSON生成
 * @file
 * @requires csv-parse
 * @see [csv-parse](https://csv.js.org/parse/)
 */
/**
 * メッシュコード情報
 * * [メッシュの範囲](https://www.stat.go.jp/data/mesh/m_itiran.html)
 * 	+ https://www.stat.go.jp/data/mesh/csv/01.csv 
 * * メッシュデータの[GeoJSON](https://www.rfc-editor.org/rfc/rfc7946)生成
 * 	+ 測地系はWGS84。１０進緯度経度
 * 		- CRS(測定系の指定)はGeoJSONの仕様から削除された
 * ```
 * {
 * 	"type": "FeatureCollection"
 * 	, "features": [
 * 		"type": "Feature"
 * 		, "properties": {
 * 			"Mesh": メッシュコード
 * 		}
 * 		, "geometry": {
 * 			"type": "Polygon"
 * 			, "coordinates": [[[経度東,緯度南], [経度西,緯度南], [経度西,緯度北], [経度東,緯度北]]]
 * 		}
 * 	]
 * }
 * ```
 * @namespace meshGeoJsonMake
 */

import {Command, Option, OptionValues} from "commander";

import * as geoJsonMake from "../dist/geoJsonMake.js";
import * as calc from "../dist/calc.js";

const optionsMakeAsync = async(commandlineOptions: OptionValues): Promise<geoJsonMake.MeshMakeOptions> => {
	console.log(commandlineOptions);
	const prefecture = commandlineOptions.prefecture as string | null | undefined;
	const workMunicipalities = commandlineOptions.municipalities as string | null | undefined;
	const workMeshWidths = commandlineOptions.meshWidths as string | string[];
	const meshWidths = Array.isArray(workMeshWidths) ? workMeshWidths : workMeshWidths.split(",");
	const workDir = commandlineOptions.workDir as string | null | undefined ?? null;
	const outDir = commandlineOptions.outDir as string | null | undefined ?? workDir;
	const prefectures = geoJsonMake.getPrefectures();
	if (prefecture === null
		|| typeof prefecture === "undefined"
		|| !prefectures.find((info) => info[0] === prefecture)) {
		// || typeof geoJsonMake.PREFECTURE_CODE_NAMES[prefecture] === "undefined") {
		prefectures.forEach((preftuple:string[]) => {
			console.log(`${preftuple[0]} : ${preftuple[1]}`);
		});
		// Object.keys(geoJsonMake.PREFECTURE_CODE_NAMES)
		// 	.sort()
		// 	.forEach((num: string) => {
		// 		console.log(`${num} : ${geoJsonMake.PREFECTURE_CODE_NAMES[num]}`);
		// 	});
		process.exit();
	}
	if (workMunicipalities === null
		|| typeof workMunicipalities === "undefined") {
		const municipalitiesList = await geoJsonMake.getMunicipalitiesAsync(prefecture, workDir);
		municipalitiesList.forEach((cn) => {
			console.log(`${cn[0]} : ${cn[1]}`);
		});
		process.exit();
	}
	const municipalities = Array.isArray(workMunicipalities) ? workMunicipalities : workMunicipalities.split(",");
	return {prefecture, municipalities, outDir, workDir, meshWidths};
};

const mainAsync = async() => {
	const res = calc.searchMeshInfo("5339221");
	console.log(res);
	const commander = new Command();

	commander
		// .requiredOption("-o, --outDir <string><required>", "出力先")
		// fs.mkdtemp
		.addOption(new Option("-w, --workDir <string>", "作業フォルダ").default(null, "systemのtempフォルダ/mesh"))
		.addOption(new Option("-o, --outDir <string>", "出力先フォルダ").default(null, "systemのtempフォルダ/mesh"))
		.addOption(new Option("-p, --prefecture <string>", "都道府県番号").default(null, "番号リストの出力"))
		.addOption(new Option("-j, --municipalities <string>", "市区町村コード（カンマ区切り）").default(null, "自治体。番号リストの出力（都道府県指定時）"))
		.addOption(new Option("-m, --meshWidths <string>", "メッシュ幅（カンマ区切り）").default("1km"))
		.on("--help", () => {
			console.log("対応するメッシュ幅:");
			calc.MESH_INFO.forEach((info) => {
				console.log(`	${info.width.padEnd(6, " ")}(${info.name})`);
			});
			console.log("Option指定例: 青森県の自治体コード出力");
			console.log("	meshGeoJsonMake -p 02");
			console.log("Option指定例: 青森県全県の１・２・３次メッシュをカレントフォルダに生成");
			console.log("	meshGeoJsonMake -o ./ -p 02 -j 02 -m 80km,10km,1km");
		});

	commander.parse(process.argv);
	const commandlieOptions = commander.opts();

	const options = await optionsMakeAsync(commandlieOptions);
	const result = await geoJsonMake.makeAsync(options);
	console.log(result);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async() => {
	await mainAsync();
})();
