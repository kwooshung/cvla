import pc from 'picocolors';
import ora, { Ora } from 'ora';
import progress from 'cli-progress';
import { isUndefined as _isUn, concat as _concat, slice as _slice, isPlainObject as _isObj, isArray as _isArr, isString as _isStr } from 'lodash-es';
import { IConfig, IPackageJson, TChangeLog, TGitMessageToChangeLog, ILanguage, TChangeLogResult } from '@/interface';
import { command, convert, console as cs, git, io, translate } from '@/utils';

import menuState from '../_state';

/**
 * 类：日志记录
 */
class changelog {
  /**
   * 私有属性：单例对象
   */
  private static instance: changelog;

  /**
   * 私有属性：配置信息
   */
  private CONF: IConfig;

  /**
   * 私有属性：package.json
   */
  private PACK: IPackageJson;

  /**
   * 私有属性：历史记录文件名
   */
  private HistoryFilename = '.history';

  /**
   * 私有属性：Markdown & HTML 正则表达式
   */
  private TranslateRegexs = [
    /^#{1,6} [^\n]+/gm, // Markdown 标题
    /^> [^\n]+/gm, // Markdown 引用
    /!\[([^\]]*)\]\(([^)]+)\)/g, // Markdown 图片
    /\[([^\]]+)\]\(([^)]+)\)/g, // Markdown 链接
    /^(\*|\+|-|\d+\.)\s+/gm, // Markdown 列表
    /^\|(.+)\|$/gm, // Markdown 表格
    /^\|([:-]+)\|$/gm, // Markdown 表格分隔符行
    /<a [^>]+>[^<]*<\/a>/g, // HTML 链接
    /<img [^>]+>/g, // HTML 图片
    /<[^>]+>/g // HTML 标签
  ];

  /**
   * 私有属性：占位符
   */
  private TranslatePlaceholder = '@@@';

  /**
   * 私有属性：是否启用翻译
   */
  private IsTranslate = false;

  /**
   * 私有属性：翻译原始语言
   */
  private translateOrigin: string = '';

  /**
   * 私有属性：翻译目标语言
   */
  private translateTargets: string[] = [];

  /**
   * 私有属性：翻译语言列表
   */
  private translateLangs: string[] = [];

  /**
   * 私有函数：返回
   * @param {any[]} choices 选项
   * @param {string} [sep = ''] 分隔符
   */
  private addBack: (choices: any[], sep?: string) => void;

  /**
   * 私有函数：父级命令
   * @param {string} code 命令代码
   * @param {string[]} args 命令参数
   * @param {string} commandPrint 命令输出替代代码
   */
  private parentCmd: (code: string, args: string[]) => Promise<void>;

  /**
   * 构造函数
   * @param {IConfig} conf 配置信息
   * @param {Function} addBack 添加返回菜单
   * @param {Function} cmd 命令
   */
  private constructor(conf: IConfig, addBack: (choices: any[], sep?: string) => void, cmd: (type: string, args: string[]) => Promise<void>) {
    this.CONF = conf;
    this.addBack = addBack;
    this.parentCmd = cmd;

    this.IsTranslate =
      _isObj(this.CONF.changelog['translate']) &&
      _isStr(this.CONF.changelog['translate'].origin) &&
      (_isStr(this.CONF.changelog['translate'].target) || _isArr(this.CONF.changelog['translate'].target)) &&
      [this.CONF.changelog['translate'].origin, this.CONF.changelog['translate'].target].flat().length > 0;

    if (this.IsTranslate) {
      this.translateOrigin = this.CONF.changelog['translate'].origin;
      this.translateTargets = [this.CONF.changelog['translate'].target].flat();
      this.translateLangs = [this.translateOrigin, this.translateTargets].flat();
    }
  }

  /**
   * 提供一个静态方法用于获取类的实例，
   * @param {IConfig} conf 配置信息
   * @param {Function} addBack 添加返回菜单
   * @param {Function} cmd 命令
   * @returns {changelog} 包管理器
   */
  public static getInstance(conf: IConfig, addBack: (choices: any[], sep?: string) => void, cmd: (type: string, args: string[]) => Promise<void>): changelog {
    return changelog.instance ?? new changelog(conf, addBack, cmd);
  }

  /**
   * 停留时间
   * @param {number} [ms = 10] 停留时间
   */
  private delay(ms: number = 10) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * 删除数组中指定索引范围的元素。
   * @param {Array} array 原始数组。
   * @param {number} start 开始索引（包含）。
   * @param {number} end 结束索引（不包含）。
   * @returns {Array} 修改后的数组。
   */
  private removeRange(array: Array<any>, start: number, end: number): Array<any> {
    return _concat(_slice(array, 0, start), _slice(array, end));
  }

  /**
   * 私有函数：changelog > 检查翻译是否能连接上
   * @returns {Promise<boolean>} 是否能连接上
   */
  private async checkTranslateConnect(): Promise<boolean> {
    let result = false;

    // 如果已启用翻译，那么就检查是否能连接到翻译服务
    if (this.IsTranslate) {
      let retry = false;
      let inx = 0;

      do {
        if (inx > 0) {
          cs.clear.lastLine(2);
        }

        inx++;

        const spinner = ora(pc.cyan(this.CONF.i18n.changelog.build.translate.check.message));
        spinner.start();
        const resultCheck = await translate.check();

        if (resultCheck) {
          spinner.succeed(pc.bold(pc.green(this.CONF.i18n.changelog.build.translate.check.success)));
          result = true;
        } else {
          spinner.fail(pc.bold(pc.red(this.CONF.i18n.changelog.build.translate.check.fail)));
          result = false;
        }
        spinner.stop();

        if (!result) {
          retry = await command.prompt.select({
            message: this.CONF.i18n.changelog.build.translate.check.retry,
            choices: [
              {
                name: this.CONF.i18n.yes,
                value: true
              },
              {
                name: this.CONF.i18n.no,
                value: false
              }
            ],
            default: true
          });
        }
        // 如果连接失败，那么就提示是否重新检查
      } while (retry);
    }
    // 如果未启用翻译，那么就直接返回 true
    else {
      result = true;
    }

    return result;
  }

  /**
   * 私有函数：changelog > IO > 获得历史记录文件名
   * @returns {string} 历史记录文件名
   */
  private getHistoryFilename(): string {
    const save = this.CONF.changelog['file'].save ?? '';
    const filename = `${save}/${this.HistoryFilename}`;
    return filename;
  }

  /**
   * 私有函数：changelog > IO > 读取历史
   * @returns {Promise<string[]>} 已存在的标签列表
   */
  private async readHistory(): Promise<string[]> {
    const filename = this.getHistoryFilename();
    let historyList: string[] = [];

    if (await io.exists(filename)) {
      const history = await io.read(filename);
      historyList = history.split('\n');
      historyList = historyList.filter((tag: string) => tag.trim() !== '');
    }

    return historyList;
  }

  /**
   * 私有函数：changelog > IO > 写入历史
   * @param {string[]} historyUpdated 历史记录列表
   * @returns {Promise<boolean>} 是否成功
   */
  private async writeHistory(historyUpdated: string[]): Promise<boolean> {
    const filename = this.getHistoryFilename();
    const content = historyUpdated.join('\n');
    return io.write(filename, content, true);
  }

  /**
   * 私有函数：changelog > 删除某个版本的历史
   * @param {string} tag 标签
   * @returns {Promise<boolean>} 是否成功
   */
  public async deleteHistory(tag: string): Promise<boolean> {
    const historyList = await this.readHistory();
    const index = historyList.indexOf(tag);
    const historyUpdated = this.removeRange(historyList, index, index + 1);
    return await this.writeHistory(historyUpdated);
  }

  /**
   * 私有函数：changelog > IO > 读取翻译
   * @param {string} langcode 语言代码
   * @returns {Promise<string>} 日志内容
   */
  private async readLog(langcode: string = ''): Promise<string> {
    langcode = langcode.toLowerCase().trim();
    langcode ? `.${langcode}` : '';
    const save = this.CONF.changelog['file'].save ?? '';
    const filename = `${save}/CHANGELOG${langcode}.md`;

    if (await io.exists(filename)) {
      const content = await io.read(filename);

      if (content) {
        return content.trim();
      }
    }

    return '';
  }

  /**
   * 私有函数：changelog > IO > 写入翻译
   * @param {string} content 日志内容
   * @param {string} [langcode = ''] 语言代码
   * @param {boolean} [append = true] 是否追加
   * @returns {Promise<boolean>} 是否成功
   */
  private async writeLog(content: string, langcode: string = '', append: boolean = true): Promise<boolean> {
    langcode = langcode.toLowerCase().trim();
    langcode = langcode ? `.${langcode}` : '';
    const save = this.CONF.changelog['file'].save ?? '';
    const filename = `${save}/CHANGELOG${langcode}.md`;

    let result = false;
    let retry = false;

    do {
      result = await io.write(filename, content.trimStart(), append);

      if (result) {
        retry = false;
      } else {
        retry = await command.prompt.select({
          message: this.CONF.i18n.changelog.loading.write.retry,
          choices: [
            {
              name: this.CONF.i18n.yes,
              value: true
            },
            {
              name: this.CONF.i18n.no,
              value: false
            }
          ],
          default: true
        });
      }
    } while (retry);

    return result;
  }

  /**
   * 私有函数：changelog > 读取标签
   * @param {Ora} spinner 加载动画
   * @returns {Promise<string[]>} 标签列表
   */
  private async readtags(spinner: Ora): Promise<string[]> {
    let tags: string[] = [];
    let reloadTags = false;

    do {
      spinner.start();

      tags = await git.tag.get.all();

      if (tags.length > 0) {
        spinner.succeed(pc.bold(pc.green(this.CONF.i18n.changelog.loading.git.tag.success)));
        spinner.stop();
      } else {
        spinner.stop();
        reloadTags = await command.prompt.select({
          message: this.CONF.i18n.changelog.loading.git.tag.retry.message,
          choices: [
            {
              name: this.CONF.i18n.yes,
              value: true
            },
            {
              name: this.CONF.i18n.no,
              value: false
            }
          ],
          default: this.CONF.i18n.changelog.loading.git.tag.default
        });
      }
    } while (tags.length <= 0 && reloadTags);

    return tags;
  }

  /**
   * 私有函数：changelog > history > 读取生成历史列表
   * @param {Ora} spinner 加载动画
   * @param {string[]} tags 标签列表
   * @returns {Promise<string[]>} 缺少的标签列表
   */
  private async readHistoryBuildList(spinner: Ora, tags: string[]): Promise<string[]> {
    const historyList = await this.readHistory();
    let list: string[] = [];

    if (historyList.length > 0) {
      const historySet = new Set(historyList);
      list = tags.filter((tag: string) => !historySet.has(tag.trim()));
      spinner.succeed(pc.bold(list.length > 0 ? pc.green(this.CONF.i18n.changelog.loading.history.done.success.build) : pc.cyan(this.CONF.i18n.changelog.loading.history.done.success.no)));
      spinner.stop();
    } else {
      spinner.stop();

      const rebuild = await command.prompt.select({
        message: convert.replacePlaceholders(this.CONF.i18n.changelog.loading.history.done.fail.message, pc.cyan(this.getHistoryFilename())),
        choices: [
          {
            name: this.CONF.i18n.yes,
            value: true,
            description: this.CONF.i18n.changelog.loading.history.done.fail.description
          },
          {
            name: this.CONF.i18n.no,
            value: false
          }
        ],
        default: this.CONF.i18n.changelog.loading.history.done.fail.default
      });

      if (rebuild) {
        list = tags;
      }
    }

    return list;
  }

  /**
   * 私有函数：changelog > git > 读取提交信息列表
   * @param {Ora} spinner 加载动画
   * @param {string[]} tags 标签列表
   * @returns {Promise<TGitMessageToChangeLog[]>} 提交信息列表
   */
  private async readGitMessage(spinner: Ora, tags: string[]): Promise<TGitMessageToChangeLog[]> {
    let messageList: TGitMessageToChangeLog[] = [];
    let reloadMessage = false;

    do {
      spinner.start();

      messageList = await git.message.toChangeLog(tags);

      if (messageList.length > 0) {
        spinner.succeed(pc.bold(pc.green(this.CONF.i18n.changelog.loading.git.messages.success)));
        spinner.stop();
      } else {
        spinner.stop();
        cs.clear.lastLine();
        reloadMessage = await command.prompt.select({
          message: this.CONF.i18n.changelog.loading.git.messages.retry.message,
          choices: [
            {
              name: this.CONF.i18n.yes,
              value: true
            },
            {
              name: this.CONF.i18n.no,
              value: false
            }
          ],
          default: this.CONF.i18n.changelog.loading.git.messages.default
        });
      }
    } while (tags.length <= 0 && reloadMessage);

    return messageList;
  }

  /**
   * 私有函数：changelog > 翻译并替换链接占位符
   * @param {string} content 日志内容
   * @param {string} [from] 原始语言
   * @param {string} [to] 目标语言
   * @returns {Promise<string>} 日志内容
   */
  private async translateAndReplace(content: string, from?: string | ILanguage, to?: string | ILanguage): Promise<string> {
    const placeholders = [];

    // 使用正则表达式替换内容
    this.TranslateRegexs.forEach((regex) => {
      content = content.replace(regex, (match) => {
        placeholders.push(match);
        return this.TranslatePlaceholder;
      });
    });

    // 翻译文本
    let translatedContent = await translate.text(content, to, from);

    // 恢复原来的结构
    placeholders.forEach((placeholder) => {
      translatedContent = translatedContent.replace(this.TranslatePlaceholder, placeholder);
    });

    await this.delay(10);

    return translatedContent;
  }

  /**
   * 私有函数：changelog > 翻译，若是翻译失败，那么就提示是否重试
   * @param {string} content 日志内容
   * @param {string} [from] 原始语言
   * @param {string} [to] 目标语言
   * @returns {Promise<string>} 日志内容
   */
  private async translateRetry(content: string, from?: string | ILanguage, to?: string | ILanguage): Promise<string> {
    //如果原始语言不为空，那么就翻译
    if (content !== '') {
      do {
        // 开始翻译
        const contentTranslated = await this.translateAndReplace(content, from, to);

        // 如果翻译后的内容不为空，并且翻译后的内容与原始内容不一致，那么就返回翻译后的内容
        if (contentTranslated !== '' && contentTranslated !== content) {
          return contentTranslated;
        }
      } while (
        await command.prompt.select({
          message: this.CONF.i18n.changelog.build.translate.fail.retry,
          choices: [
            {
              name: this.CONF.i18n.yes,
              value: true
            },
            {
              name: this.CONF.i18n.no,
              value: false
            }
          ],
          default: true
        })
      );
    }

    return content;
  }

  /**
   * 私有函数：changelog > 选择
   * @returns {Promise<void>} 无返回值
   */
  public async select(): Promise<void> {
    cs.clear.all();

    const choices = [
      {
        name: this.CONF.i18n.changelog.build.message,
        value: 'build',
        description: this.CONF.i18n.changelog.build.description
      },
      {
        name: this.CONF.i18n.changelog.rebuild.message,
        value: 'rebuild',
        description: this.CONF.i18n.changelog.rebuild.description
      },
      {
        name: this.CONF.i18n.changelog.clean.message,
        value: 'clean',
        description: this.CONF.i18n.changelog.clean.description
      }
    ];

    this.addBack(choices);

    const select = await command.prompt.select({
      message: this.CONF.i18n.changelog.title,
      choices
    });

    select === '..' ? menuState.set('main') : await this.run(select);
  }

  /**
   * 私有函数：changelog > 运行
   * @param {string} key 菜单键
   * @returns {Promise<void>} 无返回值
   */
  private async run(key: string): Promise<void> {
    cs.clear.all();

    switch (key) {
      case 'build':
        await this.build();
        break;
      case 'rebuild':
        await this.rebuild();
        break;
      case 'clean':
        await this.clean();
        break;
      default:
        break;
    }

    console.log('\n\n\n');
  }

  /**
   * 公开函数：changelog > 生成
   * @returns {Promise<void>} 无返回值
   */
  public async build(): Promise<void> {
    const spinner = ora(pc.cyan(this.CONF.i18n.changelog.loading.git.tag.reading));
    const tags = await this.readtags(spinner);

    if (tags.length > 0) {
      const buildTags = await this.readHistoryBuildList(spinner, tags);
      if (buildTags.length > 0) {
        const contents: TChangeLogResult[] = await this.readMessages(spinner, buildTags);
        await this.writeLogFiles(spinner, contents);
        await this.writeHistory(buildTags);
      }
    }
  }

  /**
   * 公开函数：changelog > 读取
   * @param {Ora} spinner 加载动画
   * @param {string[]} tags 需要生成日志的版本标签列表
   * @returns {Promise<TChangeLogResult[]>} 无返回值
   */
  public async readMessages(spinner: Ora, tags: string[]): Promise<TChangeLogResult[]> {
    let result: TChangeLogResult[] = [];
    const itemTemplate = this.CONF.changelog['template']?.logs?.item;
    const titleStandardTemplate = this.CONF.changelog['template']?.logs?.title?.standard;
    const titleOtherTemplate = this.CONF.changelog['template']?.logs?.title?.other;
    const commitlinkTextTemplate = this.CONF.changelog['template']?.logs?.commitlink?.text;
    const commitlinkUrlTemplate = this.CONF.changelog['template']?.logs?.commitlink?.url;

    let total = 0;

    const list: TGitMessageToChangeLog[] = await this.readGitMessage(spinner, tags);

    // 计算，消息总数
    for (const val of list) {
      total += val.list.length;
    }

    // 首先使用默认 进度条提示
    let processMsgI18n = this.CONF.i18n.changelog.loading.build;

    // 如果是翻译，那么就乘以翻译语言的数量
    if (this.IsTranslate) {
      processMsgI18n = this.CONF.i18n.changelog.loading.translate.process;
      total *= this.translateLangs.length;

      if (!(await this.checkTranslateConnect())) {
        cs.clear.lastLine(2);
        console.log(pc.bold(pc.red(`✖ ${this.CONF.i18n.changelog.translate.check.error}`)));
        await this.delay(3000);
      }
    }

    // 进度条对象
    const processBar = new progress.SingleBar(
      {
        format: `${pc.green(processMsgI18n.message)} ${pc.cyan('{bar}')} {percentage}% | {value}/{total}`
      },
      progress.Presets.shades_classic
    );

    processBar.start(total, 0);

    const changelogs: TChangeLog[] = [];

    for (const val of list) {
      const changelog: TChangeLog = {
        tag: val.tag,
        date: val.date,
        time: val.time,
        list: {}
      };

      if (_isArr(val.list)) {
        for (const log of val.list) {
          // 解析日志内容
          const { emojiOrType, emoji, type, scope, message } = git.message.parse(log.message);

          let key = '';
          // 如果存在，下方的key，是为了让其能够按照type分类
          if (emojiOrType) {
            const vars = { emoji, type, scope, date: log.date, time: log.time };
            key = convert.replaceTemplate(titleStandardTemplate, vars);
          } else {
            key = titleOtherTemplate;
          }

          // 如果启用了翻译，那么就翻译
          if (this.IsTranslate) {
            for (const lang of this.translateLangs) {
              // 翻译，如果原始语言与目标语言相同，那么就不翻译
              const messageTranslated = this.translateOrigin === lang ? message : await this.translateRetry(message, this.translateOrigin, lang);

              // 生成日志内容
              const msg = convert.replaceTemplate(itemTemplate, {
                message: messageTranslated,
                date: log.date,
                time: log.time,
                commitlink: `[${convert.replaceTemplate(commitlinkTextTemplate, { id: log.id })}](${convert.replaceTemplate(commitlinkUrlTemplate, { id: log.id })})`
              });

              // 如果对应的语言不存在，那么就创建
              _isUn(changelog.list[lang]) && (changelog.list[lang] = {});

              // 如果对应的 key 不存在，那么就创建
              _isUn(changelog.list[lang][key]) && (changelog.list[lang][key] = []);

              changelog.list[lang][key].push(msg);

              processBar.increment(1);
            }
          } else {
            // 生成日志内容
            const msg = convert.replaceTemplate(itemTemplate, {
              message,
              date: log.date,
              time: log.time,
              commitlink: `[${convert.replaceTemplate(commitlinkTextTemplate, { id: log.id })}](${convert.replaceTemplate(commitlinkUrlTemplate, { id: log.id })})`
            });

            _isUn(changelog.list[key]) && (changelog.list[key] = []);
            (changelog.list[key] as string[]).push(msg);

            processBar.increment(1);
          }
        }
      }

      changelogs.push(changelog);
    }

    processBar.stop();

    // 如果changelogs长度大于0，也就表示有内容，那么就生成changelog
    if (changelogs.length > 0) {
      console.log(pc.bold(pc.green(`✔ ${processMsgI18n.success}`)));
      result = await this.buildData(changelogs);
    } else {
      console.log(pc.red(`✖ ${processMsgI18n.fail}`));
    }

    return result;
  }

  /**
   * 私有函数：changelog > 生成 > 数据
   * @param {TChangeLog[]} changelogs 日志列表
   * @returns {Promise<TChangeLogResult[]>} 日志内容
   */
  private async buildData(changelogs: TChangeLog[]): Promise<TChangeLogResult[]> {
    const result: TChangeLogResult[] = [];

    for (const changelog of changelogs) {
      result.push(await this.buildContent(changelog));
    }

    return result;
  }

  /**
   * 私有函数：changelog > 生成 > 内容
   * @param {TChangeLog} changelog 日志
   * @returns {TChangeLogResult} 日志内容
   */
  private async buildContent(changelog: TChangeLog): Promise<TChangeLogResult> {
    if (this.IsTranslate) {
      const result: TChangeLogResult = {};
      for (const lang of this.translateLangs) {
        result[lang] = await this.buildContentItems(changelog, lang);
      }
      return result;
    }

    return await this.buildContentItems(changelog);
  }

  /**
   * 私有函数：changelog > 生成 > 内容
   * @param {TChangeLog} changelog 日志
   * @param {string} [lang=''] 语言，如果为空，那么就是没有翻译
   * @returns {Promise<string>} 日志内容
   */
  private async buildContentItems(changelog: TChangeLog, lang: string = ''): Promise<string> {
    const contentTemplate = this.CONF.changelog['template']?.content;

    const vars = {
      tag: changelog.tag,
      date: changelog.date,
      time: changelog.time,
      logs: ''
    };

    const list = lang ? changelog.list[lang] : changelog.list;

    if (!_isUn(list)) {
      const content = [];

      for (const key in list) {
        if (Object.prototype.hasOwnProperty.call(list, key)) {
          const items = list[key];

          if (!_isUn(items) && _isArr(items)) {
            content.push(key);
            content.push(items.join('\n'));
          }
        }
      }

      vars.logs = content.join('\n');
    }

    return convert.replaceTemplate(contentTemplate, vars);
  }

  /**
   * 私有函数：changelog > 写入文件
   * @param {Ora} spinner 加载动画
   * @param {TChangeLogResult[]} contents 日志内容
   * @returns {Promise<boolean>} 是否成功
   */
  private async writeLogFiles(spinner: Ora, contents: TChangeLogResult[]): Promise<boolean> {
    spinner.start(pc.cyan(this.CONF.i18n.changelog.loading.write.message));

    let result = false;

    for (const content of contents) {
      if (this.IsTranslate && _isObj(content)) {
        for (const lang in content as Record<string, string>) {
          if (Object.prototype.hasOwnProperty.call(content, lang)) {
            const contentTranslated = content[lang];

            result = await this.writeLog(contentTranslated, lang);
          }
        }
      } else {
        result = await this.writeLog(content as string);
      }
    }

    if (result) {
      spinner.succeed(pc.bold(pc.green(this.CONF.i18n.changelog.loading.write.success)));
    } else {
      spinner.fail(pc.bold(pc.red(this.CONF.i18n.changelog.loading.write.fail)));
    }

    spinner.stop();

    return result;
  }

  /**
   * 公开函数：changelog > 重新生成
   */
  public async rebuild(): Promise<void> {
    if (
      await command.prompt.select({
        message: this.CONF.i18n.changelog.rebuild.confirm.message,
        choices: [
          {
            name: this.CONF.i18n.yes,
            value: true,
            description: this.CONF.i18n.changelog.rebuild.confirm.description
          },
          {
            name: this.CONF.i18n.no,
            value: false
          }
        ],
        default: false
      })
    ) {
      await this.clean();
      await this.build();
    }
  }

  /**
   * 公开函数：changelog > 清理日志
   * @param {Ora} spinner 加载动画
   */
  public async clean(spinner?: Ora): Promise<void> {
    if (spinner) {
      spinner.text = pc.cyan(this.CONF.i18n.changelog.loading.clean.message);
    } else {
      spinner = ora(pc.cyan(this.CONF.i18n.changelog.loading.clean.message));
    }

    spinner.start();

    let result = false;
    do {
      const dir = this.CONF.changelog['file'].save;

      if (await io.exists(dir)) {
        const isClean = await io.remove(dir, true);

        if (isClean) {
          spinner.succeed(pc.bold(pc.green(this.CONF.i18n.changelog.loading.clean.success)));
        } else {
          result = await command.prompt.select({
            message: this.CONF.i18n.changelog.loading.clean.retry.message,
            choices: [
              {
                name: this.CONF.i18n.yes,
                value: true
              },
              {
                name: this.CONF.i18n.no,
                value: false
              }
            ],
            default: this.CONF.i18n.changelog.loading.clean.retry.default
          });
        }
      }
    } while (result);

    spinner.stop();
  }
}

export default changelog;
