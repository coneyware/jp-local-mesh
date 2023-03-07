/**
 * ６０進角度（度分秒）
 */
export type Angle = {
    degree: number;
    minute: number;
    second: number;
};
/**
 * ６０進角度を文字列にする(度°分′秒″)
 * @param {Angle} source ６０進角度
 * @returns {string} フォーマット済み文字列
 */
export declare const toString: (source: Angle) => string;
/**
 * ６０進度分秒を１０進に変換
 * @param source ６０進度分秒
 * @returns {number} １０進の角度
 */
export declare const toDigit: (source: Angle) => number;
/**
 * １０進角度を６０進度分秒に変換
 * @param digit １０進角度
 * @returns {Angle} ６０進度分秒
 */
export declare const toAngle: (digit: number) => Angle;
/**
 * ６０進度分秒どうしの加算
 * @param {Angle} source 加算される角度
 * @param {Angle} operand 加算する角度
 * @returns {Angle} 加算結果の角度
 */
export declare const sum: (source: Angle, operand: Angle) => Angle;
/**
 * ６０進度分秒どうしの減算
 * @param {Angle} source 減算される角度
 * @param {Angle} operand 減算する角度
 * @returns {Angle} 減算結果の角度
 */
export declare const sub: (source: Angle, operand: Angle) => Angle;
/**
 * ６０進度分秒の乗算
 * @param {Angle} source 乗算される角度
 * @param {number} operand 乗算する数
 * @returns {Angle} 乗算結果の角度
 */
export declare const mul: (source: Angle, operand: number) => Angle;
/**
 * ６０進度分秒の除算
 * @param {Angle} source 除算される角度
 * @param {number} operand 除算する数
 * @returns {Angle} 除算結果の角度
 */
export declare const div: (source: Angle, operand: number) => Angle;
