/**
 * 格式化注释
 * @param {string | string[]} comment 注释，可以是单行或多行
 * @param {string} indent 缩进
 * @returns {string} 格式化后的注释
 */
const format = (comment: string | string[], indent: string): string => {
  if (!comment) {
    return '';
  }

  let commentLines: string[];

  // 判断comment是字符串还是字符串数组，并据此拆分或直接使用
  if (typeof comment === 'string') {
    commentLines = comment.split('\n');
  } else {
    commentLines = comment;
  }

  // 单行注释
  if (commentLines.length === 1) {
    return `${indent}// ${commentLines[0]}\n`;
  }

  // 多行注释
  const formattedComment = commentLines.map((line) => `${indent} * ${line}`).join('\n');
  return `${indent}/**\n${formattedComment}\n${indent} */\n`;
};

export default format;
