import { console as cs, convert } from '@/utils';
import langs from '../langs';
import { get as getLang } from '../_state';

/**
 * 国际化
 * @param {string} key 键
 * @param {string[]} params 参数
 * @returns {string} 值
 */
const get = (key: string, ...params: string[]): string => {
  const keys = key.split('.');
  let value = langs[getLang().code];
  for (const k of keys) {
    value = value[k];
    if (value === undefined) {
      return key;
    }
  }

  if (typeof value === 'string') {
    return convert.replacePlaceholders(value, ...params);
  } else {
    cs.error(`警告: "${key}" 不是一个有效的字符串值。`, `Warning: "${key}" is not a valid string value.`);
    return key;
  }
};

export default get;
