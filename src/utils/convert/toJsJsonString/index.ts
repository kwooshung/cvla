/**
 * 将对象转换为JSON字符串
 * @param {object | string} obj 对象
 * @param {string | number} indent 缩进字符串或缩进级别
 * @param {number} level 缩进级别
 * @returns {string} JSON字符串
 */
const toJsJsonString = (obj: object | string, indent: string | number = 2, level: number = 0): string => {
  if (typeof obj !== 'object' || obj === null) {
    // 如果不是对象或为null，直接返回其字符串形式
    return JSON.stringify(obj); // 修改这里，直接使用 JSON.stringify
  }

  const entries = [];

  let currentIndent: string; // 修改这里，声明为字符串类型

  if (typeof indent === 'string') {
    currentIndent = indent.repeat(level);
  } else {
    currentIndent = ' '.repeat(level * Number(indent)); // 修改这里，将 indent 转换为数字
  }

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      const serializedKey = toJsJsonString(key, indent, level + 1); // 递归处理键
      const serializedValue = toJsJsonString(value, indent, level + 1); // 递归处理值
      entries.push(`${serializedKey}:${serializedValue}`);
    }
  }

  const separator = level === 0 ? ',' : `,\n${currentIndent}`;
  const result = `{\n${currentIndent}${entries.join(separator)}\n${' '.repeat((level - 1) * Number(indent))}${level === 0 ? '' : ' '}}`;

  return result;
};

export default toJsJsonString;
