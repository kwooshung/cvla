import { TSelectChoices } from '@/interface';
import { translate, command } from '@/utils';
import { get } from '../..';

/**
 * 选择语言
 * @param {string} key 询问的文本
 * @param {string} def 默认值
 * @param {string} exclude 排除的语言
 * @returns {Promise<string>} 语言对象
 */
const select = async (key: string, def: string, exclude: string = ''): Promise<string> => {
  // 罗列出所有语言，为 exclude 指定的语言添加 disabled 属性
  const choices: TSelectChoices<unknown>[] = Object.keys(translate.lang).map((langKey: string) => ({
    name: `${translate.lang[langKey].name}（${langKey} | ${translate.lang[langKey].code}）`,
    value: translate.lang[langKey].code,
    disabled: translate.lang[langKey].code === exclude // 禁用特定语言
  }));

  choices.push(command.prompt.separator());

  const message = get(key);

  return await command.prompt.select({
    message,
    choices,
    default: def // 根据 def 设置默认选中
  });
};

export default select;
