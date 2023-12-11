/**
 * 标准化版本号
 * @param {string} version 版本号
 * @returns {string} 标准化后的版本号
 */
const normalize = (version: string): string => {
  if (!version.startsWith('v')) {
    return 'v' + version;
  }
  return version;
};

export default normalize;
