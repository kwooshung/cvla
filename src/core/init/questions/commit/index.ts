import path from 'path';
import pc from 'picocolors';
import progress from 'cli-progress';
import { ICommitType, ICommitScope, IResultConfigBase, IResultConfigCommit, TCommitScope } from '@/interface';
import { config as GlobalConfig, translate, command, package as _package, io } from '@/utils';
import { get, choices } from '../../locales';

/**
 * 翻译 commit type 和 commit scope，更新进度条
 * @param {progress.SingleBar} processBar 进度条
 * @param {(ICommitType | ICommitScope)[]} vals 数据
 * @param {string} commitLintLang commitlint 语言
 * @param {boolean} commitLintEmoji 是否启用 commitlint emoji
 * @returns {Promise<(ICommitType | ICommitScope)[]>} 翻译后的数据
 */
const translateLang = async (processBar: progress.SingleBar, vals: (ICommitType | ICommitScope)[], commitLintLang: string, commitLintEmoji: boolean): Promise<(ICommitType | ICommitScope)[]> => {
  const datas: (ICommitType | ICommitScope)[] = [];

  for (const val of vals) {
    processBar.increment(1);
    val.name = await translate.text(val.name, commitLintLang);
    val.description = await translate.text(val.description, commitLintLang);
    if (commitLintEmoji) {
      datas.push(val);
    } else {
      datas.push({ name: val.name, description: val.description });
    }
    await translate.delay();
  }

  return datas;
};

/**
 * 保存配置文件
 * @param {string} saveDir 保存目录
 * @param {ICommitType[] | TCommitScope} datas 数据
 * @param {boolean} standard 是否使用 ES Modules 规范
 * @param {string} extension 扩展名
 * @param {string} fileName 文件名
 * @param {string} indentation 缩进
 * @returns {Promise<boolean>} 是否保存成功
 */
const saveConfig = async (saveDir: string, datas: ICommitType[] | TCommitScope, standard: boolean, extension: string, fileName: string, indentation: string): Promise<boolean> => {
  let configTypes = JSON.stringify(datas, null, indentation);

  // 根据标准生成配置字符串
  configTypes = `${standard ? `export default ${configTypes}` : `module.exports = ${configTypes}`};`;

  let success = false;
  let retry = true;
  const savePath = path.join(saveDir, `${fileName}.${extension}`);

  do {
    // 写入文件
    success = await io.write(savePath, configTypes, false, true);

    if (success) {
      retry = false;
    } else {
      retry = await command.prompt.select({
        message: get('commit.save.fail.message', savePath),
        choices: [
          {
            name: get('yes'),
            value: true
          },
          {
            name: get('no'),
            value: false
          }
        ]
      });
    }
  } while (retry);

  if (success) {
    console.log(pc.green(get('commit.save.success.message', savePath)));
  }

  return success;
};

/**
 * 初始化 commit
 * @param {IResultConfigBase} configBase 基础配置
 * @returns {Promise<IResultConfigCommit>} commit 配置
 */
const commit = async (configBase: IResultConfigBase): Promise<IResultConfigCommit> => {
  // 标题
  command.prompt.title(get('commit.title'));

  let commitLintEmoji: boolean = false; // 是否启用 commitlint emoji
  let commitLintLangCode: string = translate.lang.chineseSimplified.code; // commitlint 语言
  let translateCheck: boolean = false; // 是否检查连接状态
  let translateConnectd: boolean = false; // 是否连接成功
  let commitScope: boolean = false; // 是否启用 commit scope

  // 结果
  const result: IResultConfigCommit = {
    standalone: false,
    contentEnglish: false,
    messageLangCode: translate.lang.chineseSimplified.code,
    saveDir: '',
    config: false
  };

  // 是否启用 commit 功能
  if (
    await command.prompt.select({
      message: get('commit.message'),
      choices: [
        {
          name: get('enabled'),
          value: true
        },
        {
          name: get('disabled'),
          value: false
        }
      ]
    })
  ) {
    // 读取 package.json
    const packjson = _package.read();

    // 是否启用 commitlint 规范
    if (
      await command.prompt.select({
        message: get('commit.lint.message'),
        choices: [
          {
            name: get('enabled'),
            value: true
          },
          {
            name: get('disabled'),
            value: false
          }
        ]
      })
    ) {
      // 检测是否已安装 commitlint
      if (
        packjson.data !== false &&
        packjson.data !== 'default' &&
        (packjson.data?.dependencies?.commitlint || packjson.data?.devDependencies?.commitlint || packjson.data?.peerDependencies?.commitlint)
      ) {
        // 如果已安装 commitlint，则询问是否独立
        result.standalone = await command.prompt.select({
          message: get('commit.lint.standalone.message'),
          choices: [
            {
              name: get('yes'),
              value: true
            },
            {
              name: get('no'),
              value: false
            }
          ]
        });
      }
    }

    // 是否启用 commitlint emoji
    commitLintEmoji = await command.prompt.select({
      message: get('commit.lint.emoji.message'),
      choices: [
        {
          name: get('enabled'),
          value: true
        },
        {
          name: get('disabled'),
          value: false
        }
      ]
    });

    // 询问 commit type 和 commit scope 的说明，打算使用什么语言
    commitLintLangCode = await command.prompt.select({
      message: get('commit.lint.lang.message'),
      choices: [
        {
          name: translate.lang.chineseSimplified.name,
          value: translate.lang.chineseSimplified.code
        },
        {
          name: translate.lang.english.name,
          value: translate.lang.english.code
        },
        {
          name: get('commit.lint.lang.other.message'),
          value: 'other'
        }
      ],
      default: [translate.lang.chineseSimplified.code, translate.lang.english.code].includes(configBase.lang.code) ? configBase.lang.code : 'other'
    });

    // 如果选择的语言不是中文简体或英文，即选择了其他语言，则罗列出所有语言，从而让谷歌翻译对应的语言
    if (commitLintLangCode === 'other') {
      translateCheck = await command.prompt.select({
        message: get('commit.lint.lang.other.check.message'),
        choices: [
          {
            name: get('yes'),
            value: true
          },
          {
            name: get('no'),
            value: false
          }
        ]
      });

      // 如果同意测试链接
      if (translateCheck) {
        // 检查连接状态
        translateConnectd = await translate.check();
      }

      // 如果连接成功
      if (translateConnectd) {
        // 询问想翻译到什么语言
        commitLintLangCode = await choices.select('commit.lint.lang.other.check.success', translate.lang.english.code, configBase.lang.code);
      }
      // 如果连接失败
      else {
        // 强制使用简体中文或英文
        commitLintLangCode = await command.prompt.select({
          message: get('commit.lint.lang.other.check.fail.message'),
          choices: [
            {
              name: translate.lang.chineseSimplified.name,
              value: translate.lang.chineseSimplified.code,
              description: get('commit.lint.lang.other.check.fail.description')
            },
            {
              name: translate.lang.english.name,
              value: translate.lang.english.code,
              description: get('commit.lint.lang.other.check.fail.description')
            }
          ]
        });
      }
    }

    // commit scope 是否启用
    commitScope = await command.prompt.select({
      message: get('commit.lint.lang.scope.message'),
      choices: [
        {
          name: get('enabled'),
          value: true
        },
        {
          name: get('disabled'),
          value: false
        }
      ]
    });

    // 只要不是 zh-CN 或 en，就需要翻译
    if (commitLintLangCode === 'zh-CN') {
      result.config = {
        types: GlobalConfig.def.types['zh-CN'],
        scopes: GlobalConfig.def.scopes['zh-CN'],
        submit: false
      };
      result.messageLangCode = translate.lang.chineseSimplified.code;
    } else if (commitLintLangCode === 'en') {
      result.config = {
        types: GlobalConfig.def.types.en,
        scopes: GlobalConfig.def.scopes.en,
        submit: false
      };
      result.messageLangCode = translate.lang.english.code;
    } else {
      const processBar = new progress.SingleBar(
        {
          format: `${pc.green(get('commit.lint.lang.other.translateing'))} ${pc.cyan('{bar}')} {percentage}% | {value}/{total}`
        },
        progress.Presets.shades_classic
      );
      processBar.start(GlobalConfig.def.types['zh-CN'].length + GlobalConfig.def.scopes['zh-CN'].length, 0);

      result.config = {
        types: (await translateLang(processBar, GlobalConfig.def.types['zh-CN'], commitLintLangCode, commitLintEmoji)) as unknown as ICommitType[],
        scopes: commitScope ? ((await translateLang(processBar, GlobalConfig.def.scopes['zh-CN'], commitLintLangCode, commitLintEmoji)) as unknown as ICommitScope[]) : false,
        submit: false
      };

      processBar.stop();
    }

    // 如果选择的是 英文 以外的语言，则再次提示
    if (commitLintLangCode !== 'en') {
      result.contentEnglish = await command.prompt.select({
        message: get('commit.content.message'),
        choices: [
          {
            name: get('yes'),
            value: true,
            description: get('commit.content.discription')
          },
          {
            name: get('no'),
            value: false
          }
        ]
      });

      // 如果使用自动翻译 提交信息（commit message），那么就直接将提交的语言，设置为喜好的语言
      if (result.contentEnglish) {
        if (
          await command.prompt.select({
            message: get('commit.content.confirm.message', translate.getNameByCode(commitLintLangCode)),
            choices: [
              {
                name: get('yes'),
                value: true,
                description: get('commit.content.confirm.description')
              },
              {
                name: get('no'),
                value: false
              }
            ]
          })
        ) {
          result.messageLangCode = commitLintLangCode;
        }
        // 询问想把什么语言翻译到英文
        else {
          // 得排除掉 英文
          result.messageLangCode = await choices.select('commit.content.confirm.other.message', translate.lang.chineseSimplified.code, translate.lang.english.code);
        }

        /**
         * 设置完成，就需要把 commit type 中的名称，进行处理
         * 例如，把中文的 “特性” 直接 改为 英文的 “feature”，说明还是使用之前喜好的语言
         */
        result.config.types = result.config.types.map((item, index) => {
          const englishName = GlobalConfig.def.types.en[index].name || item.name; // 使用英文名，如果不存在则回退到中文名
          return { ...item, name: englishName };
        });

        // 如果使用自动翻译 提交信息（commit message），那么就要配置此项了
        result.config.submit = {
          origin: result.messageLangCode,
          target: translate.lang.english.code
        };
      } else {
        result.messageLangCode = commitLintLangCode;
      }
    }

    // 询问想把 commit type 和 commit scope 保存到哪里
    if (result.standalone) {
      result.saveDir = await command.prompt.directory.select(get('commit.save.message'));

      // 设置 ture 为默认值的目的是，如果文件不存在，则不会询问是否覆盖
      let typesOverwrite = true;
      let scopesOverwrite = true;

      // 如果文件 commit type 存在，则询问是否覆盖
      if (await io.exists(path.join(result.saveDir, `ks-cvlar.types.${configBase.extension}`))) {
        typesOverwrite = await command.prompt.select({
          message: get('fileExists', `ks-cvlar.types.${configBase.extension}`),
          choices: [
            {
              name: get('yes'),
              value: true
            },
            {
              name: get('no'),
              value: false
            }
          ],
          default: false
        });
      }

      // 如果 如果开启scope
      if (commitScope) {
        // 文件 commit scope 存在，则询问是否覆盖
        if (await io.exists(path.join(result.saveDir, `ks-cvlar.scopes.${configBase.extension}`))) {
          scopesOverwrite = await command.prompt.select({
            message: get('fileExists', `ks-cvlar.scopes.${configBase.extension}`),
            choices: [
              {
                name: get('yes'),
                value: true
              },
              {
                name: get('no'),
                value: false
              }
            ],
            default: false
          });
        }
      } else {
        scopesOverwrite = false;
      }

      // 如果为真，则写入文件
      if (typesOverwrite) {
        await saveConfig(result.saveDir, result.config.types, configBase.standard, configBase.extension, 'ks-cvlar.types', packjson.indentation);
      }

      // 如果为真，则写入文件
      if (scopesOverwrite) {
        await saveConfig(result.saveDir, result.config.scopes, configBase.standard, configBase.extension, 'ks-cvlar.scopes', packjson.indentation);
      }
    }
  }

  return result;
};

export default commit;
