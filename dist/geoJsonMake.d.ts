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
export declare const PREFECTURE_CODE_NAMES: {
    [key: string]: string;
};
export declare const fetchTextAsync: (url: string, option?: object, encoding?: string) => Promise<string>;
export type MeshMakeOptions = {
    prefecture: string;
    municipalities: string[];
    outDir: string | null;
    workDir: string | null;
    meshWidths: string[];
};
export declare const getMunicipalitiesAsync: (prefecture: string, workDir?: string | null) => Promise<[string, string][]>;
export type MeshFileInfo = {
    "municipality": string;
    "meshWidth": string;
    "filename": string;
};
/**
 * メッシュからGeoJSONファイルを生成する
 * @global
 * @function meshGeoJsonMake
 */
export declare const makeAsync: (commandlineOptions: MeshMakeOptions) => Promise<MeshFileInfo[]>;
