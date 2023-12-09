import cs from '../../console';

/**
 * 检查命令行参数是否存在
 * @description 检查提供的参数对（简写和完整写法）是否在命令行参数中存在
 * @param {string[]} keys 参数对数组，包含简写和完整写法
 * @returns {boolean} 参数是否存在
 */
const exists = (keys: string[]): boolean => {
  if (keys.length !== 2) {
    cs.error('参数错误：keys 数组必须恰好包含两个元素。', 'Invalid argument: keys array must contain exactly two elements. ');
    return false;
  }

  const [shortKey, fullKey] = keys;
  return process.argv.includes(`-${shortKey}`) || process.argv.includes(`--${fullKey}`);
};

export default exists;
