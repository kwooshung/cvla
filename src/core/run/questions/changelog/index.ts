/* eslint-disable @typescript-eslint/no-unused-vars */
import ora, { Ora } from 'ora';
import pc from 'picocolors';
import { range as _range, clone as _clone, isUndefined as _isUn, isPlainObject as _isObj, isBoolean as _isBool, isArray as _isArr, isString as _isStr } from 'lodash-es';
import { IConfig, IPackageJson, TGitMessageToChangeLog } from '@/interface';
import { command, convert, console as cs, git, package as _package, io } from '@/utils';

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
  private parentCmd: (code: string, args: string[], commandPrint?: string) => Promise<void>;

  /**
   * 构造函数
   * @param {IConfig} conf 配置信息
   * @param {Function} addBack 添加返回菜单
   * @param {Function} cmd 命令
   */
  private constructor(conf: IConfig, addBack: (choices: any[], sep?: string) => void, cmd: (type: string, args: string[], commandPrint?: string) => Promise<void>) {
    this.CONF = conf;
    this.addBack = addBack;
    this.parentCmd = cmd;
  }

  /**
   * 提供一个静态方法用于获取类的实例
   * @param {IConfig} conf 配置信息
   * @param {Function} addBack 添加返回菜单
   * @param {Function} cmd 命令
   * @returns {changelog} 包管理器
   */
  public static getInstance(conf: IConfig, addBack: (choices: any[], sep?: string) => void, cmd: (type: string, args: string[], commandPrint?: string) => Promise<void>): changelog {
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
        break;
      case 'clean':
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
    const limit = Number(this.CONF.changelog['file'].limit ?? 0);
    const split = limit > 0;
    const save = this.CONF.changelog['file'].save;
    const historyList = [];

    const spinner = ora(pc.cyan(this.CONF.i18n.changelog.loading.git.tag.reading));

    const tags = await this.readtags(spinner);

    if (tags.length > 0) {
      const buildVersionList = await this.readHistoryBuildList(spinner, save, tags);

      if (buildVersionList.length > 0) {
        const emojis = [];
        const types = [];

        for (const val of this.CONF.commit['types']) {
          emojis.push(val.emoji.trim());
          types.push(val.type.trim());
        }

        const list: TGitMessageToChangeLog[] = await git.message.toChangeLog(buildVersionList);

        for (const val of list) {
          const contents = [];

          const tag = val.name;
          const date = val.date;
          const time = val.time;
          const logs = val.list;
          const messages = [];
          const messagesCategory = {};
          const commiturlTemplate = this.CONF.changelog['template'].commiturl;

          for (const log of logs) {
            // 日志数组
            const msgs = [`- ${log.message}`];
            commiturlTemplate && msgs.push(` ([${log.id.substring(0, 8)}](${convert.replaceTemplate(commiturlTemplate, { id: log.id })}))`);

            // 生成日志内容
            const msg = msgs.join('');

            // 解析日志内容
            const { emojiOrType } = git.message.parse(log.message);

            // 如果存在
            if (emojiOrType) {
              _isUn(messagesCategory[emojiOrType]) && (messagesCategory[emojiOrType] = []);
              messagesCategory[emojiOrType].push(msg);
            } else {
              messages.push(msg);
            }
          }
        }
      }
    }
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
        spinner.succeed(pc.green(this.CONF.i18n.changelog.loading.git.tag.success));
      } else {
        spinner.stop();
        cs.clear.lastLine();
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
   * 私有函数：changelog > 读取生成历史列表
   * @param {Ora} spinner 加载动画
   * @param {string} dir 目录
   * @returns {Promise<string[]>} 缺少的标签列表
   */
  private async readHistoryBuildList(spinner: Ora, dir: string, tags: string[]): Promise<string[]> {
    const filename = `${dir}/.history`;
    let list: string[] = [];

    if (await io.exists(filename)) {
      const history = await io.read(filename);
      const historyList = history.split('\n');

      list = tags.filter((tag: string) => !historyList.includes(tag.trim()));
      spinner.succeed(this.CONF.i18n.changelog.loading.history.done.succeed);
    } else {
      spinner.stop();

      const rebuild = await command.prompt.select({
        message: convert.replacePlaceholders(this.CONF.i18n.changelog.loading.history.done.fail.message, pc.cyan(filename)),
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
        await this.clean(spinner);
      }
    }

    return list;
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
          spinner.succeed(pc.green(this.CONF.i18n.changelog.clean.success));
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
