import ora from 'ora';
import pc from 'picocolors';
import semver from 'semver';
import { range as _range, clone as _clone, isUndefined as _isUn, isPlainObject as _isObj, isBoolean as _isBool, isArray as _isArr, isString as _isStr } from 'lodash-es';
import { ICommitScope, ICommitType, IConfig, IGitCommitData, IPackageJson, IPackageJsonData, TGitCustomField, TPushTagMessage } from '@/interface';
import { command, convert, console as cs, git, package as _package, version as V, translate } from '@/utils';
import changelog from '../changelog';
import menuState from '../_state';

/**
 * 类：包管理器
 */
class gitControl {
  /**
   * 私有属性：单例对象
   */
  private static instance: gitControl;

  /**
   * 私有属性：配置信息
   */
  private CONF: IConfig;

  /**
   * 私有属性：版本菜单状态
   */
  private VersionState: 'upgrade' | 'specify' | 'downgrade' | 'prerelease' | '..' = 'upgrade';

  /**
   * 私有属性：package.json
   */
  private PACK: IPackageJson;

  /**
   * 私有属性：提交对象
   */
  private COMMIT;

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
   * 日志对象
   */
  private changeLog: changelog;

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
    this.changeLog = changelog.getInstance(this.CONF, this.addBack, this.parentCmd);
  }

  /**
   * 提供一个静态方法用于获取类的实例
   * @param {IConfig} conf 配置信息
   * @param {Function} addBack 添加返回菜单
   * @param {Function} cmd 命令
   * @returns {gitControl} 包管理器
   */
  public static getInstance(conf: IConfig, addBack: (choices: any[], sep?: string) => void, cmd: (type: string, args: string[], commandPrint?: string) => Promise<void>): gitControl {
    return gitControl.instance ?? new gitControl(conf, addBack, cmd);
  }

  /**
   * 停留时间
   * @param {number} [ms = 10] 停留时间
   */
  private delay(ms: number = 10) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * 对字符串数组进行对齐。
   * 计算数组中字符串的最大长度，并为每个字符串添加足够的空格以对齐。
   * @param {string[]} arr 字符串数组。
   * @returns {string[]} 对齐后的字符串数组。
   */
  private alignStrings(arr: string[]): string[] {
    const maxLength = Math.max(...arr.map((str) => str.length));
    return arr.map((str) => str + ' '.repeat(maxLength - str.length));
  }

  /**
   * 解析点分隔的路径并返回对应的对象值
   * @param {Object} obj 要搜索的对象
   * @param {string} path 点分隔的路径
   * @returns {any} 路径对应的值
   */
  private getValueByPath(obj: object, path: string): any {
    return path.split('.').reduce((current, key) => (current ? current[key] : undefined), obj);
  }

  /**
   * 私有函数：git > 提交 > 转换函数
   * @param {string} key 转换函数所在对象中的Key
   * @returns {Function} 转换函数
   */
  private transformer(key: string): (value: string, { isFinal }: { isFinal: boolean }) => string {
    const obj = this.getValueByPath(this.CONF.i18n.git.commit, key);
    return obj?.transformer ? obj?.transformer : (val: string) => val;
  }

  /**
   * 私有函数：release 是否能连接上
   * @param {boolean} [isTranslate = false] 是否启用翻译
   * @returns {Promise<boolean>} 是否能连接上
   */
  private async checkTranslateConnect(isTranslate: boolean): Promise<boolean> {
    let result = false;

    // 如果已启用翻译，那么就检查是否能连接到翻译服务
    if (isTranslate) {
      let retry = false;
      let inx = 0;

      do {
        if (inx > 0) {
          cs.clear.lastLine(2);
        }

        inx++;

        const spinner = ora(pc.cyan(this.CONF.i18n.git.version.translate.check.message));
        spinner.start();
        const resultCheck = await translate.check();

        if (resultCheck) {
          spinner.succeed(pc.bold(pc.green(this.CONF.i18n.git.version.translate.check.success)));
          result = true;
        } else {
          spinner.fail(pc.bold(pc.red(this.CONF.i18n.git.version.translate.check.fail)));
          result = false;
        }
        spinner.stop();

        if (!result) {
          retry = await command.prompt.select({
            message: this.CONF.i18n.git.version.translate.check.retry,
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
   * 私有函数：git > 提交 > 验证函数
   * @param {string} key 验证函数所在对象中的Key，支持层级选择，如：a.b.c
   * @returns {Promise<void>} 无返回值
   */
  private validate(key: string): (val: string) => boolean | string {
    const obj = this.getValueByPath(this.CONF.i18n.git.commit, key);
    return obj?.validate
      ? obj?.validate
      : (val: string) => {
          if (obj?.required === true) {
            if (_isUn(val) || val === '') {
              return obj?.requiredMessage;
            }
          }
          return true;
        };
  }

  /**
   * 私有函数：git > 读取 package.json 数据
   * @param {boolean} [focus = false] 是否强制读取
   * @returns {boolean} 是否读取成功
   */
  private loadPackageJson(focus: boolean = false): boolean {
    // 首先判断是否已经读取过 package.json 数据
    let isExistsData = !_isBool(this.PACK?.data) && !_isStr(this.PACK?.data) && _isObj(this.PACK?.data);

    // 如果没有读取过，或者需要强制读取，则读取 package.json 数据
    if (!isExistsData || focus) {
      this.PACK = _package.read();
      isExistsData = !_isBool(this.PACK?.data) && !_isStr(this.PACK?.data) && _isObj(this.PACK?.data);
    }

    // 如果读取成功，则返回 true
    return isExistsData;
  }

  /**
   * 私有函数：git > 选择
   * @returns {Promise<void>} 无返回值
   */
  public async select(): Promise<void> {
    cs.clear.all();

    const choices = [
      {
        name: this.CONF.i18n.git.commit.message,
        value: 'commit',
        description: this.CONF.i18n.git.commit.description
      },
      {
        name: this.CONF.i18n.git.version.message,
        value: 'version',
        description: this.CONF.i18n.git.version.description
      }
    ];

    this.addBack(choices);

    const select = await command.prompt.select({
      message: this.CONF.i18n.git.commit.select.message,
      choices
    });

    select === '..' ? menuState.set('main') : await this.run(select);
  }

  /**
   * 私有函数：git > 运行
   * @param {string} key 菜单键
   * @returns {Promise<void>} 无返回值
   */
  private async run(key: string): Promise<void> {
    switch (key) {
      case 'commit':
        await this.commit();
        break;
      case 'version':
        await this.version();
        break;
      default:
        break;
    }

    console.log('\n\n\n');
  }

  /**
   * 私有函数：git > commit
   */
  private async commit(): Promise<void> {
    const datas: IGitCommitData = {
      type: '',
      scope: '',
      subject: '',
      body: '',
      breaking: '',
      issues: [],
      custom: []
    };

    await this.commitTypes(datas);

    // 只要不是不是返回上一级，则直接进行后续操作
    if (datas.type === '..') {
      menuState.set('git');
    } else {
      await this.commitScope(datas);
      await this.commitSubject(datas);
      await this.commitBody(datas);
      await this.commitBreaking(datas);
      await this.commitCustom(datas);
      await this.commitIssues(datas);
      await this.commitConfirm(datas);
    }
  }

  /**
   * 私有函数：git > version
   */
  private async version(): Promise<void> {
    let inx = 0;
    do {
      ++inx > 1 && cs.clear.lastLine();
      this.loadPackageJson(true);

      const choices = [
        {
          name: this.CONF.i18n.git.version.upgrade.message,
          value: 'upgrade',
          description: this.CONF.i18n.git.version.upgrade.description
        },
        {
          name: this.CONF.i18n.git.version.specify.message,
          value: 'specify',
          description: this.CONF.i18n.git.version.specify.description
        },
        {
          name: this.CONF.i18n.git.version.downgrade.message,
          value: 'downgrade',
          description: this.CONF.i18n.git.version.downgrade.description
        }
      ];

      this.addBack(choices);

      this.VersionState = await command.prompt.select({
        message: this.CONF.i18n.git.version.select.message,
        choices
      });

      switch (this.VersionState) {
        case 'upgrade':
          await this.versionUpgrade();
          break;
        case 'specify':
          await this.versionSpecify();
          break;
        case 'downgrade':
          await this.versionDowngrade();
          break;
      }
    } while (this.VersionState !== '..');

    menuState.set('git');
  }

  /**
   * 私有函数：git > commit > types
   * @param {IGitCommitData} datas 数据.
   * @returns {Promise<void>} 无返回值
   */
  private async commitTypes(datas: IGitCommitData): Promise<void> {
    if (_isArr(this.CONF.commit['types'])) {
      const choices = [];

      let aligns: string[] = [];
      for (const val of this.CONF.commit['types'] as ICommitType[]) {
        const align = [];
        align.push(val.name);
        aligns.push(align.join(''));
      }

      aligns = this.alignStrings(aligns);

      for (const [index, val] of aligns.entries()) {
        const item = this.CONF.commit['types'][index];
        const select = {
          name: `${pc.bold(val)}     ${pc.dim(item.description)}`,
          value: `${!_isUn(item.emoji) ? item.emoji : ''}${item.name}`,
          description: pc.green(`${item.emoji}  ${pc.bold(item.name)} ${item.description}`),
          descriptionDim: false
        };

        choices.push(select);
      }

      this.addBack(choices);

      datas.type = await command.prompt.select({
        message: this.CONF.i18n.git.commit.type.message,
        choices,
        pageSize: this.CONF.i18n.choicesLimit ?? 15
      });
    }
  }

  /**
   * 私有函数：git > commit > scope
   * @param {IGitCommitData} datas 数据
   * @returns {Promise<void>} 无返回值
   */
  private async commitScope(datas: IGitCommitData): Promise<void> {
    const choices = [];

    let aligns: string[] = [];

    if (_isArr(this.CONF.commit['scopes'])) {
      for (const val of this.CONF.commit['scopes'] as ICommitScope[]) {
        const align = [];
        align.push(val.name);
        aligns.push(align.join(''));
      }

      aligns = this.alignStrings(aligns);

      for (const [index, val] of aligns.entries()) {
        const item = this.CONF.commit['scopes'][index];
        const select = {
          name: `${pc.bold(val)}     ${pc.dim(item.description)}`,
          value: item.name,
          description: pc.green(`${pc.dim(datas.type)}(${item.name})`),
          descriptionDim: false
        };

        choices.push(select);
      }

      choices.push(command.prompt.separator());

      datas.scope = await command.prompt.select({
        message: this.CONF.i18n.git.commit.scope.message,
        choices,
        pageSize: this.CONF.i18n.choicesLimit ?? 15
      });
    }
  }

  /**
   * 私有函数：git > commit > 获得推送标签的提交信息
   * @param {string} tag 标签
   * @param {boolean} isTranslate 是否启用翻译
   * @returns {string} 提交信息
   */
  private async getPushTagWithLogUpdatesMessage(tag: string, isTranslate: boolean): Promise<string> {
    const pushTagMessage = this.CONF.release['pushTagMessage'] as TPushTagMessage;
    const types = this.CONF.commit['types'] as ICommitType[];
    const scopes = this.CONF.commit['scopes'] as ICommitScope[];
    const type = _isArr(types) ? types.find((type) => type.name.toLowerCase() === pushTagMessage.type.toLowerCase()) : types[0];
    const scope = _isArr(scopes) ? scopes.find((scope) => scope.name.toLowerCase() === pushTagMessage.scope.toLowerCase()) : '';
    const subjectTemplate = pushTagMessage.subject as string;
    let subject = convert.replaceTemplate(subjectTemplate, { tag });
    isTranslate && (subject = await translate.text(subject, this.CONF.commit['submit']['target'], this.CONF.commit['submit']['origin']));
    const message = `${type.emoji}${type.name.trim()}${scope ? `(${scope.name})` : ''}: ${subject.toLowerCase()}`;
    return message;
  }

  /**
   * 私有函数：git > commit > 获得推送标签的提交信息
   * @param {string} tag 标签
   * @param {string} code 命令代码
   * @param {string[]} args 命令参数
   * @returns {Promise<boolean>} 提交信息
   */
  private async pushTagWithLogUpdates(tag: string, code: string, args: string[]): Promise<boolean> {
    try {
      const isTranslate = this.CONF.commit['submit'] !== false && this.CONF.commit['submit']['origin'] && this.CONF.commit['submit']['target'];

      // 如果翻译功能已启用，那么就检测是否能链接到翻译；如果翻译功能没启用，则直接返回 true
      if (await this.checkTranslateConnect(isTranslate)) {
        // 首先生成提交信息
        const message = await this.getPushTagWithLogUpdatesMessage(tag, isTranslate);

        // 创建标签
        await this.parentCmd(code, args);

        // 生成日志
        await this.changeLog.build();

        // 暂存日志
        await this.parentCmd('git', git.add.current);

        // 创建提交信息
        await this.parentCmd('git', ['commit', '-m', `"${message}"`]);

        // 撤销标签
        await this.parentCmd('git', ['tag', '-d', tag]);

        // 重新创建标签
        await this.parentCmd(code, args);

        // 删除临时的提交信息文件
        this.COMMIT && (await this.COMMIT.deleteTempCommitMessageFile());

        // 推送本地仓库到远程仓库
        await this.parentCmd('git', git.push());

        return true;
      }
    } catch (e) {
      console.log('');
      cs.error('推送标签失败', 'Push tag failed');
      console.log(pc.red(e));
      return false;
    }
  }

  /**
   * 私有函数：git > commit > subject
   * @param {IGitCommitData} datas 数据
   * @returns {Promise<void>} 无返回值
   */
  private async commitSubject(datas: IGitCommitData): Promise<void> {
    datas.subject = await command.prompt.input({
      message: this.CONF.i18n.git.commit.subject.message,
      default: datas.subject,
      transformer: this.transformer('subject'),
      validate: this.validate('subject')
    });
  }

  /**
   * 私有函数：git > commit > body
   * @param {IGitCommitData} datas 数据
   * @returns {Promise<void>} 无返回值
   */
  private async commitBody(datas: IGitCommitData): Promise<void> {
    datas.body = await command.prompt.input({
      message: this.CONF.i18n.git.commit.body.message,
      default: datas.body,
      transformer: this.transformer('body'),
      validate: this.validate('body')
    });
  }

  /**
   * 私有函数：git > commit > breaking
   * @param {IGitCommitData} datas 数据
   * @returns {Promise<void>} 无返回值
   */
  private async commitBreaking(datas: IGitCommitData): Promise<void> {
    datas.breaking = await command.prompt.input({
      message: this.CONF.i18n.git.commit.breaking.message,
      default: datas.breaking,
      transformer: this.transformer('breaking'),
      validate: this.validate('breaking')
    });
  }

  /**
   * 私有函数：git > commit > issues
   * @param {IGitCommitData} datas 数据
   * @returns {Promise<void>} 无返回值
   */
  private async commitIssues(datas: IGitCommitData): Promise<void> {
    const isClose = await command.prompt.select({
      message: this.CONF.i18n.git.commit.issues.message,
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
      default: this.CONF.i18n.git.commit.issues.default === true
    });

    if (isClose) {
      // 如果需要关闭Issue，先输出空行，因为每次输出选项的时候，都会删除最后一行
      console.log('');

      let closeKeyworlds = [];
      do {
        cs.clear.lastLine();

        closeKeyworlds = await command.prompt.checkbox({
          message: this.CONF.i18n.git.commit.issues.close.message,
          choices: this.CONF.i18n.git.commit.issues.close.choices,
          instructions: this.CONF.i18n.checkbox.instructions
        });
      } while (closeKeyworlds.length <= 0);

      if (_isArr(closeKeyworlds) && closeKeyworlds.length > 0) {
        datas.issues = [];

        for (const val of closeKeyworlds) {
          const issues = await command.prompt.input({
            message: convert.replacePlaceholders(this.CONF.i18n.git.commit.issues.close.number.message, val),
            transformer(val, { isFinal }) {
              if (isFinal) {
                const regex = /(\d+)/g;
                let match: string[];
                const numbers: string[] = [];

                while ((match = regex.exec(val)) !== null) {
                  numbers.push(`#${match[1]}`);
                }

                return numbers.join(', ');
              } else {
                return val;
              }
            }
          });

          if (issues) {
            datas.issues.push({
              close: val,
              ids: issues
            });
          }
        }
      }
    }
  }

  /**
   * 私有函数：git > commit > 自定义字段
   * @param {IGitCommitData} datas 数据
   * @returns {Promise<void>} 无返回值
   */
  private async commitCustom(datas: IGitCommitData): Promise<void> {
    datas.custom = [];

    const customs = this.CONF.i18n.git.commit['custom'];

    if (customs) {
      for (const [inx, val] of customs.entries()) {
        const custom: TGitCustomField = {
          type: val.type,
          field: val.field,
          value: ''
        };

        if (val.type === 'input') {
          custom.value = await command.prompt.input({
            message: val.message,
            transformer: this.transformer(`custom.${inx}`),
            validate: this.validate(`custom.${inx}`),
            default: val.default ?? ''
          });
        } else {
          const message = val.message;
          const choices = val.choices;
          const pageSize = this.CONF.i18n.git.commit.custom[inx]?.choicesLimit ?? this.CONF.i18n.choicesLimit ?? 15;
          const loop = _isUn(this.CONF.i18n.git.commit.custom[inx]?.loop) ? true : this.CONF.i18n.git.commit.custom[inx]?.loop;

          // 如果是循环选择，则添加分隔符
          loop && choices.push(command.prompt.separator());

          if (val.type === 'select') {
            custom.value = await command.prompt.select({
              message,
              choices,
              pageSize,
              loop,
              default: val.default ?? val.choices[0].value
            });
          } else if (val.type === 'checkbox') {
            custom.value = await command.prompt.checkbox({
              message,
              choices,
              instructions: this.CONF.i18n.checkbox.instructions,
              pageSize,
              loop
            });
          } else {
            cs.error(`未知的自定义字段类型：${val.type}`, `Unknown custom field type: ${val.type}`);
            break;
          }
        }

        datas.custom.push(custom);
      }
    }
  }

  /**
   * 私有函数：git > commit > 提交确认
   * @param {IGitCommitData} datas 数据
   */
  private async commitConfirm(datas: IGitCommitData): Promise<void> {
    this.COMMIT = new git.commit(datas, this.CONF);
    let translateStatus = true;
    if (!_isUn(this.CONF.commit['submit']) && _isObj(this.CONF.commit['submit'])) {
      translateStatus = await this.COMMIT.translate();
    }
    const message = await this.COMMIT.generate();
    const complateFn =
      this.CONF.i18n?.git?.commit?.complate ||
      function (val: string) {
        return { fail: false, val };
      };
    const { fail, val } = complateFn(message);

    const line = _range(0, 80)
      .map(() => '=')
      .join('');

    console.log(`\n${line}`);
    if (fail) {
      console.log(pc.red(`x ${val}`));
      console.log(line);
    } else {
      console.log(pc.green(val));
      console.log(line);

      const confirm = await command.prompt.select({
        message: this.CONF.i18n.git.commit.confirm.message,
        choices: [
          {
            name: this.CONF.i18n.git.commit.confirm.yes,
            value: true
          },
          {
            name: this.CONF.i18n.git.commit.confirm.no,
            value: false
          }
        ],
        default: translateStatus
      });

      // 最终提交命令
      let code = val;

      if (confirm === false) {
        code = await command.prompt.editor({
          message: this.CONF.i18n.git.commit.confirm.editor.message,
          default: code
        });
      }

      if (code.trim()) {
        let isCreate = false;
        try {
          await this.parentCmd('git', git.add.current);
          isCreate = await this.COMMIT.saveTempCommitMessageFile(code);
          await this.parentCmd('git', ['commit', '-F', `${await this.COMMIT.getTempCommitMessageFile()}`], `git commit -m "${code}"`);

          if (
            await command.prompt.select({
              message: this.CONF.i18n.git.commit.push.message,
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
              default: this.CONF.i18n.git.commit.push.default
            })
          ) {
            await this.parentCmd('git', git.push());
          }
        } catch (e) {
          console.log(pc.red(`x ${e.message}`));
        } finally {
          isCreate && (await this.COMMIT.deleteTempCommitMessageFile());
        }
      }
    }
  }

  /**
   * 私有函数：git > version > 更新 package.json 中的版本号
   * @param {string} newVersion 新版本号
   * @returns {void} 无返回值
   */
  private async versionUpdatePackageJson(newVersion: string): Promise<void> {
    if (
      await command.prompt.select({
        message: this.CONF.i18n.git.version.file.message,
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
        default: this.CONF.i18n.git.version.file.default
      })
    ) {
      this.PACK.data['version'] = V.normalize(newVersion, true);
      _package.write(this.PACK);
    }
  }

  /**
   * 私有函数：git > version > 获取前一个版本号
   * @param {string[]} tags 所有版本号
   * @param {string} value 当前版本号
   * @returns {string} 前一个版本号
   */
  private versionGetPrevTag(tags: string[], value: string): string {
    const index = tags.indexOf(value);
    if (index === -1 || index === tags.length - 1) {
      return 'v0.0.0';
    } else {
      return tags[index + 1];
    }
  }

  /**
   * 私有函数：git > version > 输入指定版本号
   * @returns {Promise<string>} 指定版本号
   */
  private async versionSpecifyInput(): Promise<string> {
    const errorMessage = this.CONF.i18n.git.version.error.format;
    const result = await command.prompt.input({
      message: this.CONF.i18n.git.version.specify.input.message,
      transformer(val: string) {
        return V.normalize(val, true);
      },
      validate(val: string) {
        if (semver.valid(val)) {
          return true;
        }
        return errorMessage;
      }
    });

    return result;
  }

  /**
   * 私有函数：git > version > 推送版本号
   * @returns {Promise<void>} 无返回值
   */
  private async versionPushTag(version: string): Promise<void> {
    let annotate = '';
    let select = '';
    let inx = 0;

    do {
      ++inx > 1 && cs.clear.lastLine();

      select = await command.prompt.select({
        message: this.CONF.i18n.git.version.annotate.message,
        choices: [
          {
            name: this.CONF.i18n.git.version.annotate.no,
            value: 'no'
          },
          {
            name: this.CONF.i18n.git.version.annotate.short,
            value: 'short'
          },
          {
            name: this.CONF.i18n.git.version.annotate.long,
            value: 'long'
          }
        ],
        default: this.CONF.i18n.git.version.annotate.default.toString().toLowerCase()
      });

      if (select === 'short') {
        annotate = await command.prompt.input({ message: this.CONF.i18n.git.version.annotate.short });
      } else if (select === 'long') {
        annotate = await command.prompt.editor({ message: this.CONF.i18n.git.version.annotate.long });
      }
      annotate = annotate.trim();
    } while (select !== 'no' && annotate === '');

    // 如果版本号有效，则添加 tag
    if (semver.valid(version)) {
      let result = false;
      await this.versionUpdatePackageJson(version);

      if (annotate.trim() === '') {
        result = await this.pushTagWithLogUpdates(version, 'git', ['tag', version]);
      } else {
        result = await this.pushTagWithLogUpdates(version, 'git', ['tag', '-a', `"${version}"`, '-m', `"${annotate}"`]);
      }

      if (
        result &&
        (await command.prompt.select({
          message: this.CONF.i18n.git.version.push.message,
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
          default: this.CONF.i18n.git.version.push.default
        }))
      ) {
        await this.parentCmd('git', git.push(true));
      }
    }
  }

  /**
   * 私有函数：git > version > 版本类型
   * @returns {Promise<string>} 指定类型的版本号
   */
  private async versionType(): Promise<string> {
    if (this.loadPackageJson()) {
      const packageJson: IPackageJsonData = this.PACK.data as IPackageJsonData;
      const currentVersion = packageJson.version ?? '0.0.0';
      const nextMajorVersion = semver.inc(currentVersion, 'major');
      const nextMinorVersion = semver.inc(currentVersion, 'minor');
      const nextPatchVersion = semver.inc(currentVersion, 'patch');

      const choices = [
        {
          name: `${this.CONF.i18n.git.version.upgrade.type.major.message} ${pc.green(V.normalize(currentVersion))} ${V.arrow} ${pc.bold(pc.green(V.normalize(nextMajorVersion)))}`,
          value: V.normalize(nextMajorVersion, true),
          description: this.CONF.i18n.git.version.upgrade.type.major.description
        },
        {
          name: `${this.CONF.i18n.git.version.upgrade.type.minor.message} ${pc.green(V.normalize(currentVersion))} ${V.arrow} ${pc.bold(pc.green(V.normalize(nextMinorVersion)))}`,
          value: V.normalize(nextMinorVersion, true),
          description: this.CONF.i18n.git.version.upgrade.type.minor.description
        },
        {
          name: `${this.CONF.i18n.git.version.upgrade.type.patch.message} ${pc.green(V.normalize(currentVersion))} ${V.arrow} ${pc.bold(pc.green(V.normalize(nextPatchVersion)))}`,
          value: V.normalize(nextPatchVersion, true),
          description: this.CONF.i18n.git.version.upgrade.type.patch.description
        }
      ];

      this.addBack(choices);

      return await command.prompt.select({
        message: this.CONF.i18n.git.version.upgrade.type.message,
        choices
      });
    }

    return '';
  }

  /**
   * 私有函数：git > version > 版本号标识符
   * @param {string} version 版本号，不带有预发布之类的标记，如 x.y.z
   * @returns {Promise<string>} 版本号标识符
   */
  private async versionFlag(version: string): Promise<string> {
    const isAdd = await command.prompt.select({
      message: this.CONF.i18n.git.version.flag.message,
      choices: [
        {
          name: this.CONF.i18n.yes,
          value: true
        },
        {
          name: this.CONF.i18n.no,
          value: false
        }
      ]
    });

    if (isAdd && this.loadPackageJson()) {
      const packageJson: IPackageJsonData = this.PACK.data as IPackageJsonData;
      const currentVersion = packageJson.version;
      const newV = semver.parse(version);
      const currentV = semver.parse(currentVersion);
      const newName = `${newV.major}.${newV.minor}.${newV.patch}`;
      const currentName = `${currentV.major}.${currentV.minor}.${currentV.patch}`;

      let suffixId: string | number = 1;
      let suffixIdNew: string | number = suffixId;
      let suffixIdMessage = '';

      // 选择预发布类型
      const choices = _clone(this.CONF.i18n.git.version.flag.select.choices);

      for (const val of choices) {
        if (newName === currentName) {
          val.description = convert.replacePlaceholders(val.description, `${currentName}-${val.value}.n`);
        } else {
          val.description = convert.replacePlaceholders(val.description, `${newName}-${val.value}.n`);
        }
      }

      this.addBack(choices);

      const type = await command.prompt.select({
        message: this.CONF.i18n.git.version.flag.select.message,
        choices
      });

      if (type !== '..') {
        // 如果当前版本号中已经包含了预发布类型
        if (currentV.prerelease.length > 0) {
          if (newName === currentName && currentVersion.includes(`-${type}.`)) {
            // 再获取当前预发布版本的的迭代号
            const regex = new RegExp(`-${type}.(\\d+)$`);
            const match = regex.exec(currentVersion);
            if (match && match[1]) {
              suffixId = Number(match[1]);
              suffixIdNew = Number(match[1]) + 1;
            }
          } else {
            suffixId = 0;
          }

          // 如果升级的版本号和当前版本号相同，那么就询问是否添加迭代号
          if (newName === currentName) {
            suffixIdMessage = convert.replacePlaceholders(
              this.CONF.i18n.git.version.flag.iterations.message.add,
              pc.dim(pc.green(currentVersion)),
              pc.green(`${type}`),
              pc.green(suffixId),
              `${pc.green(type)}.${pc.bold(pc.cyan(suffixIdNew))}`
            );
          }
          // 如果升级的版本号和当前版本号不同，那么就询问是否新添加迭代号
          else {
            suffixIdMessage = convert.replacePlaceholders(
              this.CONF.i18n.git.version.flag.iterations.message.newno,
              pc.dim(pc.green(currentVersion)),
              pc.green(version),
              `${pc.green(type)}.${pc.bold(pc.cyan(suffixIdNew))}`
            );
          }

          // 获取迭代号
          const suffixInputId = await command.prompt.input({
            message: suffixIdMessage,
            default: suffixIdNew,
            validate: this.CONF.i18n.git.version.flag.iterations.vaidate
          });

          return `-${type}.${suffixInputId}`;
        }

        suffixIdMessage = convert.replacePlaceholders(this.CONF.i18n.git.version.flag.iterations.message.no, pc.dim(pc.green(currentVersion)), pc.green(`${type}`));

        const useFlag = await command.prompt.select({
          message: suffixIdMessage,
          choices: [
            {
              name: this.CONF.i18n.yes,
              value: true
            },
            {
              name: this.CONF.i18n.no,
              value: false
            }
          ]
        });

        if (useFlag) {
          return `-${type}`;
        }
      }
    }

    return '';
  }

  /**
   * 私有函数：git > version > 升级
   */
  private async versionUpgrade(): Promise<void> {
    let isExists = false;

    do {
      const version = await this.versionType();

      if (version && version !== '..') {
        const versionFlag = await this.versionFlag(version);
        if (versionFlag) {
          const newVersion = V.normalize(`${version}${versionFlag}`, true);
          isExists = await git.tag.exists(newVersion);

          if (isExists) {
            console.log(pc.red(`x ${convert.replacePlaceholders(this.CONF.i18n.git.version.error.exists, pc.green(newVersion))}`));
            await this.delay(1500);
            cs.clear.lastLine(5);
          } else {
            await this.versionPushTag(newVersion);
            console.log('\n\n\n');
          }
        } else {
          cs.clear.lastLine(4);
          await this.versionPushTag(version);
          console.log('\n\n\n');
        }
      } else {
        cs.clear.lastLine();
        break;
      }
    } while (isExists); // 如果版本号已经存在，则重新选择版本号
  }

  /**
   * 私有函数：git > version > 指定
   */
  private async versionSpecify(): Promise<void> {
    let version = await this.versionSpecifyInput();

    if (version) {
      version = V.normalize(version, true);
      const isExists = await git.tag.exists(version);

      if (isExists) {
        console.log(pc.red(`x ${convert.replacePlaceholders(this.CONF.i18n.git.version.error.exists, pc.green(version))}`));
        await this.delay(1500);
        cs.clear.lastLine();
      } else {
        await this.versionPushTag(version);
      }
    }

    console.log('\n\n\n');
  }

  /**
   * 私有函数：git > version > 降级
   */
  private async versionDowngrade(): Promise<void> {
    let error: boolean = true;
    const tags = await git.tag.get.all();

    if (tags.length) {
      error = false;

      let choices = [];

      for (const val of tags) {
        const select = {
          name: val,
          value: val
        };

        choices.push(select);
      }

      // 添加返回上一级
      this.addBack(choices);

      // 列出所有版本号，表示git要撤回的版本号
      const revokeVersion = await command.prompt.select({
        message: this.CONF.i18n.git.version.downgrade.select.message,
        choices
      });

      if (revokeVersion) {
        // 如果选择了版本号，则进行降级操作
        if (revokeVersion === '..') {
          cs.clear.lastLine();
        } else {
          // 询问是否修改 package.json 中的版本号
          const changePackageJson = await command.prompt.select({
            message: this.CONF.i18n.git.version.downgrade.select.confirm.message,
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
            default: this.CONF.i18n.git.version.downgrade.select.confirm.default
          });

          // 如果需要修改 package.json 中的版本号
          if (changePackageJson) {
            // 获取前一个Tag版本号
            const prevTagVersion = this.versionGetPrevTag(tags, revokeVersion);

            // 自动计算上一个版本的版本号
            const autoVersion = V.decrement(revokeVersion);

            const choicePrev = `${V.normalize(revokeVersion)} ${V.arrow} ${pc.bold(pc.green(V.normalize(prevTagVersion)))}`;
            const choiceAuto = `${V.normalize(revokeVersion)} ${V.arrow} ${pc.bold(pc.green(V.normalize(autoVersion)))}`;

            choices = [
              {
                name: choicePrev,
                value: prevTagVersion,
                description: this.CONF.i18n.git.version.downgrade.select.confirm.change.descriptions.prevtag
              }
            ];

            if (V.normalize(autoVersion, true) !== V.normalize(prevTagVersion, true)) {
              choices.push({
                name: choiceAuto,
                value: autoVersion,
                description: this.CONF.i18n.git.version.downgrade.select.confirm.change.descriptions.auto
              });
            }

            choices.push({
              name: this.CONF.i18n.git.version.downgrade.select.confirm.change.specify.message,
              value: 'specify',
              description: this.CONF.i18n.git.version.specify.description
            });

            // 添加返回上一级
            this.addBack(choices);

            // 获取选择的版本号
            let packageJsonVersion = await command.prompt.select({
              message: this.CONF.i18n.git.version.downgrade.select.confirm.change.message,
              choices
            });

            if (packageJsonVersion === '..') {
              cs.clear.lastLine(3);
              await this.versionDowngrade();
            } else if (packageJsonVersion === 'specify') {
              packageJsonVersion = await this.versionSpecifyInput();
            }

            this.PACK.data['version'] = V.normalize(packageJsonVersion, true);
            _package.write(this.PACK);
          }

          // 开始撤销 git 版本号，首先是删除本地版本号
          await this.parentCmd('git', ['tag', '-d', revokeVersion]);
          await this.changeLog.deleteHistory(revokeVersion);
          await this.changeLog.build();

          // 询问是否删除远程版本号
          const deleteRemote = await command.prompt.select({
            message: this.CONF.i18n.git.version.downgrade.select.confirm.remote.message,
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
            default: this.CONF.i18n.git.version.downgrade.select.confirm.remote.default
          });

          if (deleteRemote) {
            //await this.parentCmd('git', ['push', 'origin', '--delete', revokeVersion]);// git push origin --delete v1.0.0，但是这个命令，如果标签和分支重名的情况下，可能会误删分支，因此，还是使用下面的命令
            await this.parentCmd('git', ['push', 'origin', `:refs/tags/${revokeVersion}`]);
          }

          console.log('\n\n\n');
        }
      }
    }

    if (error) {
      console.log(pc.red(`x ${this.CONF.i18n.git.version.downgrade.select.error.no}`));
      await this.delay(1500);
      cs.clear.lastLine();
    }
  }
}

export default gitControl;
