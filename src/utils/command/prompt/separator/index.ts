import pc from 'picocolors';
import { Separator } from '@inquirer/prompts';

/**
 * 函数：分隔符
 * @param {string} [str = '────────────────────────────'] 分隔符
 * @param {boolean} [descriptionDim = true] 描述是否变暗
 * @returns {Separator} 分隔符
 */
const separator = (str: string = '────────────────────────────', descriptionDim: boolean = true): Separator => new Separator(descriptionDim ? pc.dim(str) : str);

export default separator;
