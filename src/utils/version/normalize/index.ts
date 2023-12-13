import { isUndefined as _isUn, isNull as _isNull } from 'lodash-es';

/**
 * 标准化版本号
 * @param {string} version 版本号
 * @param {boolean} tag 是否为标准的标签版本号，如果为 true，则不会在前面添加 v
 * @returns {string} 标准化后的版本号
 */
const normalize = (version: string, tag: boolean = false): string => {
  if (_isUn(version) || _isNull(version)) {
    return 'v';
  }

  if (tag) {
    return version.replace(/^v/, '');
  } else {
    if (!version.startsWith('v')) {
      return 'v' + version;
    }
  }
  return version;
};

export default normalize;
