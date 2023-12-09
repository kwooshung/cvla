/**
 * 清空最后一行
 */
const lastLine = () => {
  process.stdout.write('\x1b[1A\x1b[K');
};

export default lastLine;
