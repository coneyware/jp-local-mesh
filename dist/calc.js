/* eslint-disable @typescript-eslint/no-extra-parens */
// JIS X 0410
// [参考](http://www.npli.jp/get_mesh/mesh.pdf)
import * as angleCalc from "./angleCalc.js";
const kind1 = /^\d{4}$/u;
const kind2 = /^\d{4}[0-7][0-7]$/u;
const kind22 = /^\d{4}[0-7][0-7][0,2,4,6,8][0,2,4,6,8]5$/u;
const kind25 = /^\d{4}[0-7][0-7][1-4]$/u;
const kind3 = /^\d{4}[0-7][0-7]\d{2}$/u;
const kind3p2 = /^\d{4}[0-7][0-7]\d{2}[1-4]$/u;
const kind3p4 = /^\d{4}[0-7][0-7]\d{2}[1-4][1-4]$/u;
const kind3p8 = /^\d{4}[0-7][0-7]\d{2}[1-4][1-4][1-4]$/u;
const kind3p10 = /^\d{4}[0-7][0-7]\d{4}$/u;
const kind3p20 = /^\d{4}[0-7][0-7]\d{4}[1-4]$/u;
export const MESH_INFO = [
    {
        "name": "一次メッシュ",
        "kind": 1,
        "width": "80km",
        "converter": (mesh) => mesh.substring(0, 4),
        "check": (mesh) => kind1.test(mesh)
    },
    {
        "name": "二次メッシュ",
        "kind": 2,
        "width": "10km",
        "converter": (mesh) => {
            if (mesh.length < 6) {
                throw new Error(`Mesh Code convert ng: ${mesh} to 10km mesh.`);
            }
            return mesh.substring(0, 6);
        },
        "check": (mesh) => kind2.test(mesh)
    },
    {
        "name": "５倍地域メッシュ",
        "kind": 2.5,
        "width": "5km",
        "converter": (mesh) => {
            if (mesh.length < 8) {
                throw new Error(`Mesh Code convert ng: ${mesh} to 5km mesh.`);
            }
            const mesh3lat = Number(mesh.substring(6, 7));
            const mesh3lng = Number(mesh.substring(7, 8));
            let num = 2;
            if (mesh3lat <= 4) {
                if (mesh3lng <= 4) {
                    num = 1;
                    // } else {
                    // 	num = 2;
                }
            }
            else if (mesh3lng <= 4) {
                num = 3;
            }
            else {
                num = 4;
            }
            return `${mesh.substring(0, 6)}${num}`;
        },
        "check": (mesh) => kind25.test(mesh)
    },
    {
        "name": "２倍地域メッシュ",
        "kind": 2.2,
        "width": "2km",
        "converter": (mesh) => {
            if (mesh.length < 8) {
                throw new Error(`Mesh Code convert ng: ${mesh} to 2km mesh.`);
            }
            const mesh3lat = Number(mesh.substring(6, 7));
            const mesh3lng = Number(mesh.substring(7, 8));
            return `${mesh.substring(0, 6)}${mesh3lat & 0xfe}${mesh3lng & 0xfe}5`;
        },
        "check": (mesh) => kind22.test(mesh)
    },
    {
        "name": "三次メッシュ",
        "kind": 3,
        "width": "1km",
        "converter": (mesh) => {
            if (mesh.length < 9) {
                throw new Error(`Mesh Code convert ng: ${mesh} to 1km mesh.`);
            }
            return mesh.substring(0, 8);
        },
        "check": (mesh) => kind3.test(mesh)
    },
    {
        "name": "2分の1地域メッシュ",
        "kind": 3.5,
        "width": "500m",
        "converter": (mesh) => {
            if (mesh.length < 10) {
                throw new Error(`Mesh Code convert ng: ${mesh} to 500m mesh.`);
            }
            return mesh.substring(0, 9);
        },
        "check": (mesh) => kind3p2.test(mesh)
    },
    {
        "name": "4分の1地域メッシュ",
        "kind": 3.25,
        "width": "250m",
        "converter": (mesh) => {
            if (mesh.length < 11) {
                throw new Error(`Mesh Code convert ng: ${mesh} to 250m mesh.`);
            }
            return mesh.substring(0, 10);
        },
        "check": (mesh) => kind3p4.test(mesh)
    },
    {
        "name": "8分の1地域メッシュ",
        "kind": 3.125,
        "width": "125m",
        "converter": (_mesh) => {
            throw new Error("Minimam mesh. convert ng");
        },
        "check": (mesh) => kind3p8.test(mesh)
    },
    {
        "name": "10分の1地域メッシュ",
        "kind": 3.1,
        "extend": true,
        "width": "100m",
        "converter": (mesh) => {
            if (mesh.length < 10) {
                throw new Error(`Mesh Code convert ng: ${mesh} to 100m mesh.`);
            }
            return mesh.substring(0, 10);
        },
        "check": (mesh) => kind3p10.test(mesh)
    },
    {
        "name": "20分の1地域メッシュ",
        "kind": 3.05,
        "extend": true,
        "width": "50m",
        "converter": (_mesh) => {
            throw new Error("Minimam mesh. convert ng");
        },
        "check": (mesh) => kind3p20.test(mesh)
    }
];
/**
 * メッシュコードからメッシュ情報を検索する
 * @param {string} mesh メッシュコード
 * @param {boolean} [isExtend=false] 非規程の仕様（1/10細分（１００ｍ）、1/20細分（５０ｍ））
 * @returns {MeshInfo|null} メッシュ情報
 */
export const searchMeshInfo = (mesh, isExtend = false) => {
    if (isExtend) {
        const ret = MESH_INFO.filter((info) => info.extend)
            .find((info) => info.check(mesh));
        if (ret) {
            return ret;
        }
        if (10 <= mesh.length) {
            return null;
        }
    }
    const ret = MESH_INFO.find((info) => info.check(mesh));
    return ret ?? null;
};
const calcAngle = (parentAngle, addAngle, angleNum) => {
    const angle = angleCalc.sum(parentAngle, angleCalc.mul(addAngle, angleNum));
    const digit = angleCalc.toDigit(angle);
    const opposite = angleCalc.sum(angle, addAngle);
    const oppositeDigit = angleCalc.toDigit(opposite);
    return { angle, digit, oppositeDigit };
};
/**
 * メッシュコードから、対象メッシュの北西、南東の緯度経度を求める
 * @param {string|number} code メッシュコード
 * @param {MeshInfo|null} [meshInfo=null] メッシュ情報（nullの時はメッシュコードから検索する）
 * @param {boolean} [isExtend=false] 非規程の仕様（1/10細分（１００ｍ）、1/20細分（５０ｍ））
 * @returns {LatLng[]} メッシュの緯度経度[[北端緯度,西端経度],[南端緯度,東端経度]]
 */
// eslint-disable-next-line max-lines-per-function
export const meshToLatLng = (code, meshInfo = null, isExtend = false) => {
    const scode = code.toString();
    let checkMeshInfo = meshInfo;
    if (checkMeshInfo === null) {
        checkMeshInfo = searchMeshInfo(scode, isExtend);
        if (checkMeshInfo === null) {
            throw new Error(`メッシュコードエラー:${code}`);
        }
    }
    const latSource = Number(scode.substring(0, 2));
    const lngSource = Number(scode.substring(2, 4));
    // 一次メッシュ南西(約80km^2)
    const slatAngle = angleCalc.div({ "degree": latSource, "minute": 0, "second": 0 }, 1.5);
    const slat = angleCalc.toDigit(slatAngle);
    const wlng = lngSource + 100;
    const nlatAngle = angleCalc.sum(slatAngle, { "degree": 0, "minute": 40, "second": 0 });
    const nlat = angleCalc.toDigit(nlatAngle);
    const elng = wlng + 1;
    if (checkMeshInfo.kind === 1) {
        return [[nlat, wlng], [slat, elng]];
    }
    // 二次メッシュ南西(約10km^2)
    const lat2add = { "degree": 0, "minute": 5, "second": 0 };
    const lng2add = { "degree": 0, "minute": 7, "second": 30 };
    const lat2Source = Number(scode.substring(4, 5));
    const lng2Source = Number(scode.substring(5, 6));
    const { "angle": slat2Angle, "digit": slat2, "oppositeDigit": nlat2 } = calcAngle(slatAngle, lat2add, lat2Source);
    const { "angle": wlng2Angle, "digit": wlng2, "oppositeDigit": elng2 } = calcAngle(angleCalc.toAngle(wlng), lng2add, lng2Source);
    if (checkMeshInfo.kind === 2) {
        return [[nlat2, wlng2], [slat2, elng2]];
    }
    if (checkMeshInfo.kind === 2.2) {
        // ２倍地域メッシュ(約2km^2)
        const lat2xadd = { "degree": 0, "minute": 1, "second": 0 };
        const lng2xadd = { "degree": 0, "minute": 1, "second": 30 };
        const lat2xSource = Number(scode.substring(6, 7));
        const lng2xSource = Number(scode.substring(7, 8));
        const { "digit": slat2x, "oppositeDigit": nlat2x } = calcAngle(slat2Angle, lat2xadd, lat2xSource / 2);
        const { "digit": wlng2x, "oppositeDigit": elng2x } = calcAngle(wlng2Angle, lng2xadd, lng2xSource / 2);
        return [[nlat2x, wlng2x], [slat2x, elng2x]];
    }
    if (checkMeshInfo.kind === 2.5) {
        // ５倍地域メッシュ(約5km^2)
        // source:
        // 34
        // 12
        const lat5xadd = { "degree": 0, "minute": 2, "second": 30 };
        const lng5xadd = { "degree": 0, "minute": 3, "second": 45 };
        const source5x = Number(scode.substring(6, 7));
        const { "digit": slat5x, "oppositeDigit": nlat5x } = calcAngle(slat2Angle, lat5xadd, Math.floor(source5x / 3));
        const { "digit": wlng5x, "oppositeDigit": elng5x } = calcAngle(wlng2Angle, lng5xadd, (source5x + 1) % 2);
        return [[nlat5x, wlng5x], [slat5x, elng5x]];
    }
    // 三次メッシュ南西(約1km^2)
    const lat3add = { "degree": 0, "minute": 0, "second": 30 };
    const lng3add = { "degree": 0, "minute": 0, "second": 45 };
    const lat3Source = Number(scode.substring(6, 7));
    const lng3Source = Number(scode.substring(7, 8));
    const { "angle": slat3Angle, "digit": slat3, "oppositeDigit": nlat3 } = calcAngle(slat2Angle, lat3add, lat3Source);
    const { "angle": wlng3Angle, "digit": wlng3, "oppositeDigit": elng3 } = calcAngle(wlng2Angle, lng3add, lng3Source);
    if (checkMeshInfo.kind === 3) {
        return [[nlat3, wlng3], [slat3, elng3]];
    }
    if (isExtend) {
        // 1/10メッシュ南西(約100m^2)
        const lat1p10add = { "degree": 0, "minute": 0, "second": 3 };
        const lng1p10add = { "degree": 0, "minute": 0, "second": 4.5 };
        const lat1p10Source = Number(scode.substring(8, 9));
        const lng1p10Source = Number(scode.substring(9, 10));
        const { "angle": slat1p10Angle, "digit": slat1p10, "oppositeDigit": nlat1p10 } = calcAngle(slat3Angle, lat1p10add, lat1p10Source);
        const { "angle": wlng1p10Angle, "digit": wlng1p10, "oppositeDigit": elng1p10 } = calcAngle(wlng3Angle, lng1p10add, lng1p10Source);
        if (checkMeshInfo.kind === 3.1) {
            return [[nlat1p10, wlng1p10], [slat1p10, elng1p10]];
        }
        // 1/20メッシュ南西(約50m^2)
        // source:
        // 34
        // 12
        const lat1p20add = { "degree": 0, "minute": 0, "second": 1.5 };
        const lng1p20add = { "degree": 0, "minute": 0, "second": 2.25 };
        const source1p20 = Number(scode.substring(10, 11));
        const { 
        // "angle": slat1p20Angle
        "digit": slat1p20, "oppositeDigit": nlat1p20 } = calcAngle(slat1p10Angle, lat1p20add, Math.floor(source1p20 / 3));
        const { 
        // "angle": wlng1p20Angle
        "digit": wlng1p20, "oppositeDigit": elng1p20 } = calcAngle(wlng1p10Angle, lng1p20add, (source1p20 + 1) % 2);
        return [[nlat1p20, wlng1p20], [slat1p20, elng1p20]];
    }
    // 1/2メッシュ南西(約500m^2)
    // source:
    // 34
    // 12
    const lat1p2add = { "degree": 0, "minute": 0, "second": 15 };
    const lng1p2add = { "degree": 0, "minute": 0, "second": 22.5 };
    const source1p2 = Number(scode.substring(8, 9));
    const { "angle": slat1p2Angle, "digit": slat1p2, "oppositeDigit": nlat1p2 } = calcAngle(slat3Angle, lat1p2add, Math.floor(source1p2 / 3));
    const { "angle": wlng1p2Angle, "digit": wlng1p2, "oppositeDigit": elng1p2 } = calcAngle(wlng3Angle, lng1p2add, (source1p2 + 1) % 2);
    if (checkMeshInfo.kind === 3.5) {
        return [[nlat1p2, wlng1p2], [slat1p2, elng1p2]];
    }
    // 1/4メッシュ南西(約250m^2)
    // source:
    // 34
    // 12
    const lat1p4add = { "degree": 0, "minute": 0, "second": 7.5 };
    const lng1p4add = { "degree": 0, "minute": 0, "second": 11.25 };
    const source1p4 = Number(scode.substring(9, 10));
    const { "angle": slat1p4Angle, "digit": slat1p4, "oppositeDigit": nlat1p4 } = calcAngle(slat1p2Angle, lat1p4add, Math.floor(source1p4 / 3));
    const { "angle": wlng1p4Angle, "digit": wlng1p4, "oppositeDigit": elng1p4 } = calcAngle(wlng1p2Angle, lng1p4add, (source1p4 + 1) % 2);
    if (checkMeshInfo.kind === 3.25) {
        return [[nlat1p4, wlng1p4], [slat1p4, elng1p4]];
    }
    // 1/8メッシュ南西(約125^2)
    // source:
    // 34
    // 12
    const lat1p8add = { "degree": 0, "minute": 0, "second": 3.75 };
    const lng1p8add = { "degree": 0, "minute": 0, "second": 5.625 };
    const source1p8 = Number(scode.substring(10, 11));
    const { 
    // "angle": slat1p8Angle
    "digit": slat1p8, "oppositeDigit": nlat1p8 } = calcAngle(slat1p4Angle, lat1p8add, Math.floor(source1p8 / 3));
    const { 
    // "angle": wlng1p8Angle
    "digit": wlng1p8, "oppositeDigit": elng1p8 } = calcAngle(wlng1p4Angle, lng1p8add, (source1p8 + 1) % 2);
    return [[nlat1p8, wlng1p8], [slat1p8, elng1p8]];
};
