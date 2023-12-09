import get from '../get';

/**
 * 获取多个命令行参数
 * @description 从提供的键数组中获取对应的命令行参数值
 * @param {string[]} keys 参数名数组
 * @returns {Record<string, string>} 参数键值对
 */
const gets = (keys: string[]): Record<string, string> => {
  const param: Record<string, string> = {};

  keys.forEach((key) => {
    param[key] = get(key);
  });

  return param;
};

export default gets;
