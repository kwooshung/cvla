/**
 * 停留时间
 * @param {number} [ms = 10] 停留时间
 */
const delay = (ms: number = 10) => new Promise((resolve) => setTimeout(resolve, ms));

export default delay;
