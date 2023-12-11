import pc from 'picocolors';
import semver from 'semver';
import { range as _range, isUndefined as _isUn, isPlainObject as _isObj, isBoolean as _isBool, isArray as _isArr, isString as _isStr } from 'lodash-es';
import { IConfig, IGitCommitData, IPackageJson, IPackageJsonData, TGitCustomField } from '@/interface';
import { command, convert, console as cs, git, package as _package, version as V } from '@/utils';
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
   * @returns {gitControl} 包管理器
   */
  public static getInstance(conf: IConfig, addBack: (choices: any[], sep?: string) => void, cmd: (type: string, args: string[], commandPrint?: string) => Promise<void>): gitControl {
    return gitControl.instance ?? new gitControl(conf, addBack, cmd);
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
      for (const val of this.CONF.commit['types']) {
        const align = [];
        align.push(val.name);
        aligns.push(align.join(''));
      }

      aligns = this.alignStrings(aligns);

      for (const [index, val] of aligns.entries()) {
        const item = this.CONF.commit['types'][index];
        const select = {
          name: `${pc.bold(val)}     ${pc.dim(item.description)}`,
          value: `${item.emoji}${item.name}`,
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
      for (const val of this.CONF.commit['scopes']) {
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

  /**
   * 私有函数：git > commit > 提交确认
   */
  private async commitConfirm(datas: IGitCommitData): Promise<void> {
    try {
      const g = new git.commit(datas, this.CONF);
      let translateStatus = true;
      if (!_isUn(this.CONF.commit['submit']) && _isObj(this.CONF.commit['submit'])) {
        translateStatus = await g.translate();
      }
      const message = await g.generate();
      const { fail, val } = this.CONF.i18n.git.commit.complate(message);

      const line = _range(0, 80)
        .map(() => '=')
        .join('');

      console.log(`\n${line}`);
      if (fail) {
        console.log(pc.red(val));
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
            isCreate = await g.saveTempCommitMessageFile(code);
            await this.parentCmd('git', ['commit', '-F', `${await g.getTempCommitMessageFile()}`], `git commit -m "${code}"`);

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
            console.log(pc.red(e.message));
          } finally {
            isCreate && (await g.deleteTempCommitMessageFile());
          }
        }
      }
    } catch (e) {
      console.log(pc.red(e.message));
      console.log('\n\n\n');
    }
  }

  /**
   * 私有函数：git > version > 版本类型通用菜单
   */
  private async versionTypesMenu(): Promise<string> {
    if (this.loadPackageJson()) {
      const packageJson: IPackageJsonData = this.PACK.data as IPackageJsonData;
      const currentVersion = packageJson.version;
      const nextMajorVersion = semver.inc(currentVersion, 'major');
      const nextMinorVersion = semver.inc(currentVersion, 'minor');
      const nextPatchVersion = semver.inc(currentVersion, 'patch');

      const choices = [
        {
          name: convert.replacePlaceholders(this.CONF.i18n.git.version.upgrade.type.major.message, pc.green(currentVersion), pc.bold(pc.green(nextMajorVersion))),
          value: nextMajorVersion,
          description: this.CONF.i18n.git.version.upgrade.type.major.description
        },
        {
          name: convert.replacePlaceholders(this.CONF.i18n.git.version.upgrade.type.minor.message, pc.green(currentVersion), pc.bold(pc.green(nextMinorVersion))),
          value: nextMinorVersion,
          description: this.CONF.i18n.git.version.upgrade.type.minor.description
        },
        {
          name: convert.replacePlaceholders(this.CONF.i18n.git.version.upgrade.type.patch.message, pc.green(currentVersion), pc.bold(pc.green(nextPatchVersion))),
          value: nextPatchVersion,
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
   * @returns {Promise<string>} 版本号标识符
   */
  private async versionFlag(): Promise<string> {
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

    if (isAdd) {
      if (this.loadPackageJson()) {
        const packageJson: IPackageJsonData = this.PACK.data as IPackageJsonData;
        const currentVersion = packageJson.version;

        let suffixId = 1;
        let suffixIdMessage = convert.replacePlaceholders(this.CONF.i18n.git.version.flag.iterations.message.no, pc.green(currentVersion), pc.cyan(1));

        // 选择预发布类型
        const choices = this.CONF.i18n.git.version.flag.select.choices;

        for (const val of choices) {
          val.description = convert.replacePlaceholders(val.description, `${currentVersion}-${val.value}`);
        }

        this.addBack(choices);

        const type = await command.prompt.select({
          message: this.CONF.i18n.git.version.flag.select.message,
          choices
        });

        if (type !== '..') {
          // 如果当前版本号中已经包含了预发布类型
          if (currentVersion.includes(`-${type}.`)) {
            // 再获取当前预发布版本的的迭代号
            const regex = new RegExp(`-${type}.(\\d+)$`);
            const match = regex.exec(currentVersion);
            if (match && match[1]) {
              suffixId = Number(match[1]);
              suffixIdMessage = convert.replacePlaceholders(
                this.CONF.i18n.git.version.flag.iterations.message.add,
                pc.dim(pc.green(currentVersion)),
                pc.green(`${type}.${suffixId}`),
                pc.cyan(`${type}.${Number(match[1]) + 1}`)
              );
            }
          }

          // 获取迭代号
          const suffixInputId = await command.prompt.input({
            message: suffixIdMessage,
            default: suffixId,
            validate: this.CONF.i18n.git.version.flag.iterations.vaidate
          });

          return `-${type}.${suffixInputId}`;
        }
      }
    }

    return '';
  }

  /**
   * 私有函数：git > version > 升级
   */
  private async versionUpgrade(): Promise<void> {
    const versionType = await this.versionTypesMenu();

    if (versionType && versionType !== '..') {
      const versionFlag = await this.versionFlag();
      const newVersion = V.normalize(`${versionType}${versionFlag}`);

      let annotate = '';
      let select = '';
      let inx = 0;

      do {
        ++inx > 1 && cs.clear.lastLine();

        select = await command.prompt.select({
          message: this.CONF.i18n.git.version.flag.annotate.message,
          choices: [
            {
              name: this.CONF.i18n.git.version.flag.annotate.no,
              value: 'no'
            },
            {
              name: this.CONF.i18n.git.version.flag.annotate.short,
              value: 'short'
            },
            {
              name: this.CONF.i18n.git.version.flag.annotate.long,
              value: 'long'
            }
          ],
          default: this.CONF.i18n.git.version.flag.annotate.default.toString().toLowerCase()
        });

        if (select === 'short') {
          annotate = await command.prompt.input({ message: this.CONF.i18n.git.version.flag.annotate.short });
        } else if (select === 'long') {
          annotate = await command.prompt.editor({ message: this.CONF.i18n.git.version.flag.annotate.long });
        }
        annotate = annotate.trim();
      } while (select !== 'no' && annotate === '');

      // 如果版本号有效，则添加 tag
      if (semver.valid(newVersion)) {
        await this.parentCmd('git', git.add.current);

        if (annotate.trim() === '') {
          await this.parentCmd('git', ['tag', newVersion]);
        } else {
          await this.parentCmd('git', ['tag', '-a', `${newVersion}`, '-m', `${annotate}`]);
        }

        if (
          await command.prompt.select({
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
          })
        ) {
          await this.parentCmd('git', git.push(true));
        }
      }
    }
  }

  /**
   * 私有函数：git > version > 指定
   */
  private async versionSpecify(): Promise<void> {}

  /**
   * 私有函数：git > version > 降级
   */
  private async versionDowngrade(): Promise<void> {}
}

export default gitControl;
