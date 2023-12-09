import format from '../format';

/**
 * 序列化配置
 * @param {object} config 配置
 * @param {object} comments 注释
 * @param {string} [indentString = '  '] 缩进字符串
 * @param {number} [indentLevel = 1] 缩进级别，用于递归，外部调用时不可传入
 */
const serialize = (config: object, comments: { [x: string]: any }, indentString: string = '  ', indentLevel: number = 1) => {
  const indent = indentString.repeat(indentLevel);
  let serializedConfig = '{\n';
  const entries = Object.entries(config);

  entries.forEach(([key, value], index) => {
    // 获取当前属性的注释
    const comment = comments[key] ? format(comments[key], indent) : '';

    let valueString: string;

    // 是否数组
    if (Array.isArray(value)) {
      // 处理数组类型的值
      const arrayValues = value.map((v) => JSON.stringify(v)).join(', ');
      valueString = `[${arrayValues}]`;
    }
    // 是否对象
    else if (typeof value === 'object' && value !== null) {
      // 如果值是对象，则递归地调用 serialize 函数
      const nestedComments = Object.fromEntries(
        Object.entries(comments)
          .filter(([nestedKey]) => nestedKey.startsWith(`${key}.`))
          .map(([nestedKey, nestedComment]) => [nestedKey.slice(key.length + 1), nestedComment])
      );

      valueString = serialize(value, nestedComments, indentString, indentLevel + 1);
    }
    // 其他
    else {
      // 对非对象非数组的值进行JSON序列化
      valueString = JSON.stringify(value);
    }

    // 检查是否是最后一个元素来决定是否添加逗号
    const isLastElement = index === entries.length - 1;
    serializedConfig += `${comment}${indent}${JSON.stringify(key)}: ${valueString}${isLastElement ? '' : ','}\n`;
  });

  const closingBraceIndent = indentString.repeat(indentLevel - 1);
  serializedConfig += `${closingBraceIndent}}`;
  return serializedConfig.trimStart();
};

export default serialize;
