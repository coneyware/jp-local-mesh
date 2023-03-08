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
 * @namespace geoJsonMake
 */
import path from "path";
import os from "os";
import fs from "fs/promises";
import { parse } from "csv-parse/sync";
import fetch from "node-fetch";
import * as meshCalc from "./calc.js";
const URL_MESH_CSV_BASE = "https://www.stat.go.jp/data/mesh/csv/";
const PREFECTURE_CODE_NAMES = {
    "01": "北海道",
    "02": "青森県",
    "03": "岩手県",
    "04": "宮城県",
    "05": "秋田県",
    "06": "山形県",
    "07": "福島県",
    "08": "茨城県",
    "09": "栃木県",
    "10": "群馬県",
    "11": "埼玉県",
    "12": "千葉県",
    "13": "東京都",
    "14": "神奈川県",
    "15": "新潟県",
    "16": "富山県",
    "17": "石川県",
    "18": "福井県",
    "19": "山梨県",
    "20": "長野県",
    "21": "岐阜県",
    "22": "静岡県",
    "23": "愛知県",
    "24": "三重県",
    "25": "滋賀県",
    "26": "京都府",
    "27": "大阪府",
    "28": "兵庫県",
    "29": "奈良県",
    "30": "和歌山県",
    "31": "鳥取県",
    "32": "島根県",
    "33": "岡山県",
    "34": "広島県",
    "35": "山口県",
    "36": "徳島県",
    "37": "香川県",
    "38": "愛媛県",
    "39": "高知県",
    "40": "福岡県",
    "41": "佐賀県",
    "42": "長崎県",
    "43": "熊本県",
    "44": "大分県",
    "45": "宮崎県",
    "46": "鹿児島県",
    "47": "沖縄県"
};
export const fetchTextAsync = async (url, option = {}, encoding = "utf-8") => {
    const td = new TextDecoder(encoding);
    const res = await fetch(url, option);
    if (!res.ok) {
        throw new Error(`${res.status}:${res.statusText}(${res.url})`);
    }
    const ab = await res.arrayBuffer();
    return td.decode(ab);
};
/**
 * CSVファイル読み込みオプション
 * @memberof meshToGeojson
 * @see https://csv.js.org/parse/options/
 */
const parserOptions = {
    "delimiter": ",",
    "columns": true,
    "skip_empty_lines": true,
    "relax_column_count": true
};
const meshcodeToGeojsonAsync = async (baseDir, outputPath, codes, meshInfo) => {
    try {
        let nlat = 0;
        let slat = 9999999;
        let wlng = 9999999;
        let elng = 0;
        const features = codes.map((code) => {
            const latlng = meshCalc.meshToLatLng(code, meshInfo);
            if (nlat < latlng[0][0]) {
                nlat = latlng[0][0];
            }
            if (latlng[1][0] < slat) {
                slat = latlng[1][0];
            }
            if (elng < latlng[1][1]) {
                elng = latlng[1][1];
            }
            if (latlng[0][1] < wlng) {
                wlng = latlng[0][1];
            }
            return {
                "type": "Feature",
                "properties": { "Mesh": code },
                "geometry": {
                    "type": "Polygon"
                    // e,s . w,s,  w,n . e,n
                    ,
                    "coordinates": [
                        [
                            [latlng[1][1], latlng[1][0]],
                            [latlng[0][1], latlng[1][0]],
                            [latlng[0][1], latlng[0][0]],
                            [latlng[1][1], latlng[0][0]]
                        ]
                    ]
                }
            };
        });
        const toJson = {
            "type": "FeatureCollection",
            features,
            "bbox": [wlng, slat, elng, nlat]
        };
        await fs.writeFile(outputPath, JSON.stringify(toJson));
        return outputPath;
    }
    catch (err) {
        console.error(`mesh5kmToGeojsonAsync(${baseDir}, [${codes.join(",")}])`);
        throw err;
    }
};
/**
 * メッシュのGeoJson生成処理
 * @memberof meshToGeojson
 */
const meshToGeojsonAsync = async (baseDir, outputDir, meshs, kind, info) => {
    let meshCodes = meshs;
    if (kind !== info.kind) {
        meshCodes = Array.from(new Set(meshs.map((code) => info.converter(code))));
    }
    let filePath = "";
    try {
        filePath = await meshcodeToGeojsonAsync(baseDir, path.resolve(outputDir, `mesh${info.width}.json`), meshCodes, info);
    }
    catch (err) {
        console.log(`mesh5kmToGeojsonAsync(${baseDir}, [${meshCodes.join(",")}]`);
        console.error(err);
    }
    return filePath;
};
const makeBaseDir = (prefecture, workDir = null) => {
    let baseDir = "";
    if (workDir === null) {
        baseDir = path.resolve(os.tmpdir(), "mesh", PREFECTURE_CODE_NAMES[prefecture]);
    }
    else {
        baseDir = path.resolve(workDir, PREFECTURE_CODE_NAMES[prefecture]);
    }
    return baseDir;
};
/**
 * 都道府県別のmesh番号csvを読み込み
 * * 保存フォルダに存在しない場合はダウンロードする
 * 	+ [URL](https://www.stat.go.jp/data/mesh/csv/)${prefecture}.csv
 * * ダウンロード済みの時はファイルから読み込み。
 * @param {string} prefecture 都道府県番号:01〜47
 * @param {string} baseDir csv保存先フォルダ
 * @returns {meshCsv[]} 読み込みデータ
 */
const meshCsvDownloadAsync = async (prefecture, baseDir) => {
    const meshlistCsvName = `${prefecture}.csv`;
    const meshfileName = path.resolve(baseDir, meshlistCsvName);
    let meshlistCsv = "";
    try {
        await fs.stat(meshfileName);
        // console.log(`mesh code csv from file:${meshfileName}`);
        meshlistCsv = await fs.readFile(meshfileName, "utf-8");
    }
    catch (_err) {
        await fs.mkdir(baseDir, { "recursive": true });
        // console.log(`mesh code csv from net:${URL_MESH_CSV_BASE}${meshlistCsvName}`);
        meshlistCsv = await fetchTextAsync(`${URL_MESH_CSV_BASE}${meshlistCsvName}`, {}, "Shift_JIS");
        await fs.writeFile(path.resolve(baseDir, meshlistCsvName), meshlistCsv);
    }
    // console.log(path.resolve(baseDir, meshlistCsvName));
    return parse(meshlistCsv, parserOptions);
};
export const getPrefectures = () => {
    return Object.keys(PREFECTURE_CODE_NAMES)
        .sort()
        .map((code) => {
        return [code, PREFECTURE_CODE_NAMES[code]];
    });
};
export const getMunicipalitiesAsync = async (prefecture, workDir = null) => {
    const baseDir = makeBaseDir(prefecture, workDir);
    const records = await meshCsvDownloadAsync(prefecture, baseDir);
    const codes = new Map();
    codes.set(prefecture, "全域");
    records.forEach((record) => {
        codes.set(record.都道府県市区町村コード, record.市区町村名);
    });
    return Array.from(codes);
};
/**
 * メッシュからGeoJSONファイルを生成する
 * @global
 * @function meshGeoJsonMake
 */
export const makeAsync = async (commandlineOptions) => {
    // let baseDir = "";
    const { prefecture, outDir, workDir } = commandlineOptions;
    let output = "";
    const baseDir = makeBaseDir(prefecture, workDir);
    output = outDir ?? baseDir;
    try {
        await fs.stat(baseDir);
    }
    catch (_err) {
        await fs.mkdir(baseDir, { "recursive": true });
    }
    const records = await meshCsvDownloadAsync(prefecture, baseDir);
    const muniResults = await Promise.all(commandlineOptions.municipalities.map(async (muni) => {
        let muniOutput = output;
        if (muni !== commandlineOptions.prefecture) {
            muniOutput = path.join(output, muni);
        }
        console.log(muniOutput);
        if (muni !== commandlineOptions.prefecture || muniOutput !== baseDir) {
            try {
                await fs.stat(muniOutput);
            }
            catch (_err) {
                await fs.mkdir(muniOutput, { "recursive": true });
            }
        }
        const mesh1kms = Array.from(new Set(records
            .filter((record) => record["都道府県市区町村コード"].startsWith(muni))
            .map((mesh) => mesh["基準メッシュ・コード"] ?? mesh["基準メッシュコード"])));
        const results = await Promise.all(commandlineOptions.meshWidths.map((width) => {
            const meshInfo = meshCalc.MESH_INFO.find((info) => info.width === width);
            if (typeof meshInfo === "undefined") {
                throw new Error(`メッシュ生成に対応してません（width[${width}]）`);
            }
            return meshToGeojsonAsync(baseDir, muniOutput, mesh1kms, 3, meshInfo);
        }));
        return { "municipality": muni, results };
    }));
    return muniResults.map((mres) => {
        return mres.results.map((filename, index) => {
            return {
                "municipality": mres.municipality,
                "meshWidth": commandlineOptions.meshWidths[index],
                filename
            };
        });
    })
        .flat();
};
