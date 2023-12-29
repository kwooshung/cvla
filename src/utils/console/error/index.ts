import pc from 'picocolors';

/**
 * 打印错误信息
 * @param {string} cn 中文错误信息
 * @param {string} en 英文错误信息
 */
const error = (cn: string, en: string) => {
  console.log(pc.red(`✖ ${cn}`));
  console.log(pc.red(`✖ ${en}`));
};

export default error;
