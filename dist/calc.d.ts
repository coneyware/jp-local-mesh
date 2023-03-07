import { MeshInfo, LatLng } from "./jp-local-mesh.js";
export declare const MESH_INFO: MeshInfo[];
/**
 * メッシュコードからメッシュ情報を検索する
 * @param {string} mesh メッシュコード
 * @param {boolean} [isExtend=false] 非規程の仕様（1/10細分（１００ｍ）、1/20細分（５０ｍ））
 * @returns {MeshInfo|null} メッシュ情報
 */
export declare const searchMeshInfo: (mesh: string, isExtend?: boolean) => MeshInfo | null;
/**
 * メッシュコードから、対象メッシュの北西、南東の緯度経度を求める
 * @param {string|number} code メッシュコード
 * @param {MeshInfo|null} meshInfo メッシュ情報（nullの時はメッシュコードから検索する）
 * @param {boolean} [isExtend=false] 非規程の仕様（1/10細分（１００ｍ）、1/20細分（５０ｍ））
 * @returns {LatLng[]} メッシュの緯度経度[[北端緯度,西端経度],[南端緯度,東端経度]]
 */
export declare const meshToLatLng: (code: string | number, meshInfo: MeshInfo | null, isExtend?: boolean) => LatLng[];
