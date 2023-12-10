import pc from 'picocolors';

import { IConfigResult, IResultConfigBase } from '@/interface';
import { command, translate } from '@/utils';
import { set, get } from '../../locales';

/**
 * 初始化 base
 * @param {IResultConfigBase | false} conf 配置文件
 */
const basic = async (conf: IConfigResult | false): Promise<IResultConfigBase | boolean> => {
  // 标题
  command.prompt.title(get('basic.title'));

  const result: IResultConfigBase = {
    // 询问初始化时，你想语言交流
    lang: await command.prompt.select({
      message: '初始化时，你想语言交流 (What language should we use to communicate)',
      choices: [
        {
          name: '简体中文',
          value: translate.lang.chineseSimplified,
          description: `只会影响 ${pc.yellow("'当前终端交流界面'")} 和 ${pc.yellow("'最终配置文件的注释'")}`
        },
        {
          name: 'English',
          value: translate.lang.english,
          description: `It will only affect the ${pc.yellow("'current terminal communication interface'")} and the ${pc.yellow("'comments in the final configuration file.'")}`
        }
      ],
      default: translate.lang.chineseSimplified
    }),
    overwrite: false,
    standard: false,
    extension: 'js'
  };

  // 设置语言
  set(result.lang);

  // 如果存在配置文件，则询问是否覆盖
  if (conf) {
    result.overwrite = await command.prompt.select({
      message: get('exits.message'),
      choices: [
        {
          name: get('yes'),
          value: true,
          description: get('exits.description.yes')
        },
        {
          name: get('no'),
          value: false,
          description: get('exits.description.no')
        }
      ],
      default: false
    });

    // 如果不覆盖，则退出
    if (!result.overwrite) {
      return false;
    }
  }

  // 选择规范，mjs（ES Modules）或 cjs（CommonJS）, 由于 commitlint 不支持 esm，所以暂时不提供选择
  // result.standard = await command.prompt.select({
  //   message: get('basic.standard.message'),
  //   choices: [
  //     {
  //       name: 'ES Modules',
  //       value: true
  //     },
  //     {
  //       name: 'CommonJS',
  //       value: false
  //     }
  //   ]
  // });

  const extensionOptions = {
    message: get('basic.extension.message'),
    choices: []
  };

  if (result.standard) {
    extensionOptions.choices.push({
      name: `mjs (${get('recommend')})`,
      value: 'mjs'
    });
  } else {
    extensionOptions.choices.push({
      name: `cjs (${get('recommend')})`,
      value: 'cjs'
    });
  }
  extensionOptions.choices.push({
    name: `js`,
    value: 'js'
  });

  // 选择扩展名，js、mjs 或 cjs
  result.extension = await command.prompt.select(extensionOptions);

  return result;
};

export default basic;
