
export * as angleCalc from "./angleCalc.js";
export * as calc from "./calc.js";
export * as geoJsonMake from "./geoJsonMake.js";

export type MeshInfo = {
	name: string; // メッシュ名称
	kind: number; // 種別（一次メッシュ:1、二次メッシュ:2、。。。）
	extend?: boolean; // 拡張（1/10細分メッシュ、1/20細分メッシュ）
	width: string; // メッシュの間隔（約...）（１次メッシュ:80kmとか1/2メッシュ：500m）
	converter: (_mesh:string) => string; // 細かいメッシュを大きいメッシュに変換
	check: (_mesh:string) => boolean; // メッシュコードのフォーマットチェック
}

/** @type {[number, number]} 緯度,経度 */
export type LatLng = [number, number];

export type MeshMakeOptions = {
	prefecture: string; // 都道府県コード
	municipalities: string[]; // 自治体コード
	outDir: string | null;
	workDir: string | null;
	meshWidths: string[];
};

export type MeshFileInfo = {
	"municipality": string
	, "meshWidth": string
	, "filename": string
};
