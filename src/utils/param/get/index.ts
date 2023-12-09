/**
 * 获取命令行参数
 * @description 从提供的键或键数组中获取第一个匹配的命令行参数
 * @param {string | string[]} keys 单个参数名、参数名数组、或带有单破折号 `-` 或双破折号 `--` 的参数名
 * @returns {string} 参数值
 */
const get = (keys: string | string[]): string => {
  // 确保 keys 总是一个数组
  const keyArray = Array.isArray(keys) ? keys : [keys];

  for (const key of keyArray) {
    const argIndex = process.argv.indexOf(`-${key}`);

    if (argIndex === -1) {
      // 如果以单破折号无法匹配，尝试以双破折号匹配
      const argIndexWithDoubleDash = process.argv.indexOf(`--${key}`);
      if (argIndexWithDoubleDash !== -1 && argIndexWithDoubleDash < process.argv.length - 1) {
        const value = process.argv[argIndexWithDoubleDash + 1];
        return value;
      }
    } else if (argIndex < process.argv.length - 1) {
      const args = process.argv.slice(argIndex + 1);
      let endOfValueIndex = args.findIndex((arg) => arg.startsWith('-'));

      if (endOfValueIndex === -1) {
        endOfValueIndex = args.length;
      }

      const value = args.slice(0, endOfValueIndex).join(' ');
      return value;
    }
  }

  return '';
};

export default get;
