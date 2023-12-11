import pc from 'picocolors';
import { select as prompt } from '@inquirer/prompts';
import { ISelectOptions, TSelectChoice } from '@/interface';

/**
 * 默认参数
 */
const defaultOptions: ISelectOptions = {
  message: '',
  choices: [],
  pageSize: 10,
  loop: true,
  default: '',
  descriptionDim: true
};

/**
 * 选择
 * @param {ISelectOptions} options 参数
 * @returns {Promise<any>} 选择结果
 */
const select = async (options: ISelectOptions): Promise<any> => {
  options.choices = options.choices.map((choice: TSelectChoice<unknown>) => {
    if (choice.description) {
      if (choice.description && !choice.description.startsWith(`${pc.blue('!')} `)) {
        choice.description = `${pc.blue('!')} ${defaultOptions.descriptionDim ? pc.dim(choice.description) : choice.description}`;
      }
    }
    return choice;
  });
  return await prompt({ ...defaultOptions, ...options });
};

export default select;
