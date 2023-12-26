import { isNumber as _isNum, capitalize as _capitalize } from 'lodash-es';

/**
 * 根据变量名的大小写格式化值
 * @param {string} key 变量名
 * @param {any} value 值
 * @returns {string} 格式化后的值
 */
const formatValueByKey = (key: string, value: string): string => {
  if (key === key.toUpperCase()) {
    // 全大写
    return value.toUpperCase();
  } else if (key[0] === key[0].toUpperCase()) {
    // 首字母大写
    return _capitalize(value);
  }
  return value;
};

/**
 * 截取字符串
 * @param {any} value 值
 * @param {string[]} args 参数数组
 * @returns {any} 处理后的值
 */
const substr = (value: any, args: string[]): string => {
  let start = 0;
  let length = parseInt(args[0], 10);

  if (args.length === 1) {
    // 只有一个参数时，它表示截取的长度
    if (_isNum(length) && length > 0) {
      return value.substring(0, length);
    }
  } else if (args.length === 2) {
    // 两个参数时，第一个是起始位置，第二个是截取长度
    start = parseInt(args[0], 10);
    length = parseInt(args[1], 10);
    if (_isNum(start) && start >= 0 && _isNum(length) && length > 0) {
      return value.substring(start, start + length);
    }
  }

  return value;
};

/**
 * 应用函数到模板变量
 * @param {string} functionName 函数名
 * @param {string} value 值
 * @param {string[]} args 参数数组
 * @returns {string} 处理后的值
 */
const applyFunction = (functionName: string, value: string, args: string[]): string => {
  switch (functionName) {
    case 'substr':
      return substr(value, args);
    default:
      return value;
  }
};

/**
 * 替换模板字符串
 * @param {string} template 模板字符串
 * @param {any} data 数据
 * @returns {string} 替换后的字符串
 */
const replaceTemplate = (template: string, data: any): string =>
  template.replace(/\{\{(.+?)\}\}/g, (match, expression) => {
    const [key, functionCall] = expression.split('[');
    const dataKey = Object.keys(data).find((k) => k.toLowerCase() === key.toLowerCase());

    if (dataKey !== undefined) {
      let value = data[dataKey].toString();

      // 应用函数
      if (functionCall) {
        const functionName = functionCall.split(':')[0];
        const args = functionCall.split(':')[1]?.replace(']', '').split(',') || [];
        value = applyFunction(functionName, value, args);
      }

      // 根据模板中的键的大小写格式化值
      return formatValueByKey(key, value);
    }
    return match;
  });

export default replaceTemplate;
