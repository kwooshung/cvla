/**
 * 替换模板字符串
 * @param {string} template 模板字符串
 * @param {any} data 数据
 * @returns {string} 替换后的字符串
 */
const replaceTemplate = (template: string, data: any): string => template.replace(/\{\{(.+?)\}\}/g, (match, key) => (key in data ? data[key] : match));

export default replaceTemplate;
