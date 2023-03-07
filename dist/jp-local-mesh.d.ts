export * as angleCalc from "./angleCalc.js";
export * as calc from "./calc.js";
export * as geoJsonMake from "./geoJsonMake.js";
export type MeshInfo = {
    name: string;
    kind: number;
    extend?: boolean;
    width: string;
    converter: (_mesh: string) => string;
    check: (_mesh: string) => boolean;
};
/** @type {[number, number]} 緯度,経度 */
export type LatLng = [number, number];
export type MeshMakeOptions = {
    prefecture: string;
    municipalities: string[];
    outDir: string | null;
    workDir: string | null;
    meshWidths: string[];
};
export type MeshFileInfo = {
    "municipality": string;
    "meshWidth": string;
    "filename": string;
};
