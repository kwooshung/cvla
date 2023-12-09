import { IConfigResult } from '@/interface';

import questions from './questions';

/**
 * 初始化
 * @param {IConfigResult | false} conf 配置文件
 * @returns {void} 无返回值
 */
const run = async (conf: IConfigResult | false): Promise<void> => {
  const ask = new questions(conf);
  await ask.init();
};

export default run;
