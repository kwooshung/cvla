import { isNumber as _isNumber } from 'lodash-es';
import cs from '../../console';

/**
 * 函数：格式化数字，每三位加一个逗号
 * @param {number} number 数字
 * @returns {string} 格式化后的数字
 */
const formatNumberWithCommas = (number: number | string): string => {
  number = Number(number);
  // 验证输入是否为有效数字
  if (!isNaN(number) && _isNumber(number)) {
    // 格式化数字
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  const msg = 'Invalid input: input must be a number or a numeric string';
  cs.error('无效输入：输入必须为数字或数字字符串', msg);
  throw new Error(msg);
};

export default formatNumberWithCommas;
