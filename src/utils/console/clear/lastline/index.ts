/**
 * 清除指定数量的最后几行
 * @param {number} lines 要清除的行数，默认为1
 */
const lastLine = (lines: number = 1) => {
  for (let i = 0; i < lines; i++) {
    process.stdout.write('\x1b[1A\x1b[K');
  }
};

export default lastLine;
