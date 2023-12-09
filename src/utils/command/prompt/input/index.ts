import { input as prompt } from '@inquirer/prompts';
import { IInputOptions } from '@/interface';

/**
 * 默认参数
 */
const defaultOptions: IInputOptions = {
  message: '',
  default: '',
  validate: () => true
};

/**
 * 输入
 * @param {IInputOptions} options 参数
 * @returns {Promise<any>} 输入结果
 */
const input = async (options: IInputOptions): Promise<any> => {
  options = { ...defaultOptions, ...options };
  typeof options.default !== 'string' && (options.default = options.default.toString());

  return await prompt(options as any);
};

export default input;
