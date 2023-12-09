import prompt from '@inquirer/editor';
import { IEditorOptions } from '@/interface';

/**
 * 默认参数
 */
const defaultOptions: IEditorOptions = {
  message: '',
  default: '',
  validate: () => true,
  postfix: 'txt',
  waitForUseInput: false
};

/**
 * 选择
 * @param {IEditorOptions} options 参数
 * @returns {Promise<any>} 选择结果
 */
const editor = async (options: IEditorOptions): Promise<any> => {
  options = { ...defaultOptions, ...options };
  options.postfix && !options.postfix.startsWith('.') && (options.postfix = `.${options.postfix}`);
  return await prompt(options);
};

export default editor;
