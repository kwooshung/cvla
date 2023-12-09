import pc from 'picocolors';
import { checkbox as prompt } from '@inquirer/prompts';
import { ICheckboxOptions } from '@/interface';

/**
 * 默认参数
 */
const defaultOptions: ICheckboxOptions = {
  message: '',
  choices: [],
  pageSize: 10,
  loop: true,
  instructions: '',
  validate: () => true
};

/**
 * 格式化提示信息
 * @param {string | boolean} instructions 提示信息
 * @returns {string | boolean} 格式化后的提示信息
 * @example
 * formatInstructions('按<space>进行选择，按<a>切换全部，按<i>反转选择，按<enter>确认选择');
 * // => '按 <空格> 进行选择，按 <a> 切换全部，按 <i> 反转选择，按 <回车> 确认选择'
 */
const formatInstructions = (instructions: string): string => {
  if (typeof instructions === 'boolean') return instructions;

  return ` ${pc.dim(
    instructions.replace(/<([^>]+)>/g, (_, match) => {
      return `${pc.cyan(` <${match}> `)}`;
    })
  )}`;
};

/**
 * 多选
 * @param {ICheckboxOptions} options 参数
 * @returns {Promise<string[]>} 选择结果
 */
const checkbox = async (options: ICheckboxOptions): Promise<any> => {
  options = { ...defaultOptions, ...options };
  options.instructions && (options.instructions = formatInstructions(options.instructions));
  return await prompt(options);
};

export default checkbox;
