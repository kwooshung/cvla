import regex from '../regex';

/**
 * 验证版本号输入内容
 * @description 验证版本号输入内容是否符合语义版本规范
 * @param {string} input 输入内容
 * @returns {boolean} 验证结果
 */
const validate = (input: string): boolean | string => regex.test(input);

export default validate;
