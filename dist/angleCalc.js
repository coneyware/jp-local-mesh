/* eslint-disable @typescript-eslint/no-extra-parens */
const toSecond = (source) => {
    return (source.degree * 3600) + (source.minute * 60) + source.second;
};
const secondToAngle = (second) => {
    const minus = second < 0;
    const wsec = second * (minus ? -1 : 1);
    return {
        "degree": Math.floor(wsec / 3600),
        "minute": Math.floor((wsec % 3600) / 60),
        "second": wsec % 60
    };
};
/**
 * ６０進角度を文字列にする(度°分′秒″)
 * @param {Angle} source ６０進角度
 * @returns {string} フォーマット済み文字列
 */
export const toString = (source) => {
    return `${source.degree}°${source.minute}′${source.second}″`;
};
/**
 * ６０進度分秒を１０進に変換
 * @param source ６０進度分秒
 * @returns {number} １０進の角度
 */
export const toDigit = (source) => {
    return toSecond(source) / 3600;
};
/**
 * １０進角度を６０進度分秒に変換
 * @param digit １０進角度
 * @returns {Angle} ６０進度分秒
 */
export const toAngle = (digit) => {
    return secondToAngle(digit * 3600);
};
/**
 * ６０進度分秒どうしの加算
 * @param {Angle} source 加算される角度
 * @param {Angle} operand 加算する角度
 * @returns {Angle} 加算結果の角度
 */
export const sum = (source, operand) => {
    return secondToAngle(toSecond(source) + toSecond(operand));
};
/**
 * ６０進度分秒どうしの減算
 * @param {Angle} source 減算される角度
 * @param {Angle} operand 減算する角度
 * @returns {Angle} 減算結果の角度
 */
export const sub = (source, operand) => {
    return secondToAngle(toSecond(source) - toSecond(operand));
};
/**
 * ６０進度分秒の乗算
 * @param {Angle} source 乗算される角度
 * @param {number} operand 乗算する数
 * @returns {Angle} 乗算結果の角度
 */
export const mul = (source, operand) => {
    return secondToAngle(toSecond(source) * operand);
};
/**
 * ６０進度分秒の除算
 * @param {Angle} source 除算される角度
 * @param {number} operand 除算する数
 * @returns {Angle} 除算結果の角度
 */
export const div = (source, operand) => {
    return secondToAngle(toSecond(source) / operand);
};
