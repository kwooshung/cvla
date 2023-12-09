import { TCheckboxChoices } from '@/interface';
import { translate, command } from '@/utils';
import { get } from '../..';

/**
 * 选择语言（多选）
 * @param {string} key 询问的文本
 * @param {string|string[]} defs 默认值
 * @param {string|string[]} excludes 排除的语言
 * @returns {Promise<string|string[]>} 语言对象
 */
const checkbox = async (key: string, defs: string | string[], excludes: string | string[] = []): Promise<string | string[]> => {
  // 确保defs和excludes都是数组形式
  const defaultValues = Array.isArray(defs) ? defs : [defs];
  const excludedValues = Array.isArray(excludes) ? excludes : [excludes];

  // 罗列出所有语言，为 excludes 指定的语言添加 disabled 属性
  const choices: TCheckboxChoices<unknown>[] = Object.keys(translate.lang).map((langKey: string) => ({
    name: `${translate.lang[langKey].name}（${langKey} | ${translate.lang[langKey].code}）`,
    value: translate.lang[langKey].code,
    checked: defaultValues.includes(translate.lang[langKey].code), // 根据 defs 设置默认选中
    disabled: excludedValues.includes(translate.lang[langKey].code) // 禁用特定语言
  }));

  choices.push(command.prompt.separator());

  const message = get(key);

  // 询问想翻译到什么语言
  return await command.prompt.checkbox({
    message,
    choices,
    instructions: get('checkbox.instructions')
  });
};

export default checkbox;
