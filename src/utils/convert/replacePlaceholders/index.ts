/**
 * 通过参数替换字符串中的占位符
 * @param {string} str 带有占位符的字符串
 * @param {string[]} params 替换占位符的参数
 * @returns {string} 替换后的字符串
 */
const replacePlaceholders = (str: string, ...params: (string | number)[]): string => str.replace(/\{(\d+)\}/g, (_, index: number): string => (params[index] || '').toString());

export default replacePlaceholders;
