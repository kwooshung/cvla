import boxen from 'boxen';
import semver from 'semver';
import pc from 'picocolors';
import Table from 'cli-table3';
import fetch from 'node-fetch';
import ora, { Ora } from 'ora';
import packageJson from 'package-json';
import { Separator } from '@inquirer/prompts';
import { forEach as _forEach, range as _range, isUndefined as _isUn, remove as _remove, isPlainObject as _isObj, isArray as _isArr, isString as _isStr, isNumber as _isNumber } from 'lodash-es';
import {
  IConfig,
  IPackageJson,
  IPackageJsonData,
  IPackageVersionSemverStandard,
  IPackagesCategoryUpdate,
  IPackagesListUpdate,
  IPackagesUpdateInfos,
  IPackagesVersions,
  TCheckboxChoice,
  TPackageVersionType
} from '@/interface';
import { command, convert, console as cs, package as pack, version as V } from '@/utils';
import menuState from '../_state';

/**
 * 类：包管理器
 */
class pm {
  /**
   * 私有属性：单例对象
   */
  private static instance: pm;

  /**
   * 私有属性：配置信息
   */
  private CONF: IConfig;

  /**
   * 私有属性：搜索 > 关键词
   */
  private searchKeyword: string = '';

  /**
   * 私有属性：搜索 > 结果 > 计数（用作结果序号）
   */
  private searchResultsCount: number = 0;

  /**
   * 私有属性：搜索 > 结果 > 总数
   */
  private searchResultsTotal: number = 0;

  /**
   * 私有属性：搜索 > 分页 > 总页码
   */
  private searchPageTotal: number = 0;

  /**
   * 私有属性：搜索 > 分页 > 每页显示数量
   */
  private searchPageSize: number = 10;

  /**
   * 私有属性：搜索 > 分页 > 当前页码
   */
  private searchPageCurrent: number = 1;

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
    this.searchPageSize = Number(conf?.i18n?.package?.commands?.search?.page?.size ?? 10);
  }

  /**
   * 提供一个静态方法用于获取类的实例
   * @param {IConfig} conf 配置信息
   * @param {Function} addBack 添加返回菜单
   * @param {Function} cmd 命令
   * @returns {pm} 包管理器
   */
  public static getInstance(conf: IConfig, addBack: (choices: any[], sep?: string) => void, cmd: (type: string, args: string[], commandPrint?: string) => Promise<void>): pm {
    return pm.instance ?? new pm(conf, addBack, cmd);
  }

  /**
   * 私有函数：包管理 > 命令
   * @param {string} type 包管理器类型
   * @param {string[]} args 命令参数
   * @returns {Promise<void>} 无返回值
   */
  private async cmd(type: string, args: string[]): Promise<void> {
    // 如果 args 长度大于 0
    if (args.length > 0) {
      _remove(args, (n) => n === 'cvlar-all');

      if (this.CONF.package['manager']['registry']) {
        if (this.CONF.package['manager']['registry'] !== 'auto') {
          if (!args.includes('--registry')) {
            args.push(`--registry=${this.CONF.package['manager']['registry']}`);
          }
        }
      }

      await this.parentCmd(type, args);
    }
  }

  /**
   * 私有函数：确认选择
   * @param {string} message 提示信息
   * @param {boolean} [def = false] 默认值
   * @returns {Promise<boolean>} 确认结果
   */
  private async confirm(message: string, def: boolean = false): Promise<boolean> {
    return await command.prompt.select({
      message: message,
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
      default: def
    });
  }

  /**
   * 私有函数：包管理 > 依赖包 > 选择项生成
   * @param {Record<string, string>} dependencies 依赖项
   * @param {any[]} choices 选项
   * @param {boolean} isDev 是否是开发依赖
   * @returns {void} 无返回值
   */
  private addDependenciesToChoices(dependencies: Record<string, string>, choices: any[], isDev: boolean = false): void {
    choices.push(command.prompt.separator(this.CONF.i18n.package[isDev ? 'devDependencies' : 'dependencies']));

    for (const key in dependencies) {
      if (Object.prototype.hasOwnProperty.call(dependencies, key)) {
        const val = dependencies[key];
        const item = {
          name: `${key} (${val})`,
          value: key
        };
        choices.push(item);
      }
    }
  }

  /**
   * 私有函数：包管理 > 依赖包 > 选择
   * @param {string} message 提示信息
   * @param {boolean} [multi = false] 是否多选
   * @returns {Promise<string | string[]>} 选择结果
   */
  private async depsSelect(message: string, multi: boolean = false): Promise<string | string[]> {
    const PACK: IPackageJson = pack.read();

    const choices = [];
    this.addDependenciesToChoices(PACK.data['dependencies'], choices);
    this.addDependenciesToChoices(PACK.data['devDependencies'], choices, true);
    choices.push(command.prompt.separator());

    let result: string | string[] = [];

    if (multi) {
      result = await command.prompt.checkbox({
        message,
        choices,
        pageSize: this.CONF.i18n.choicesLimit ?? 15,
        instructions: this.CONF.i18n.checkbox.instructions
      });

      if (result.length > 0) {
        // 之所以减 3，是因为最后 3 个选项是分隔符，剩下的如果总数一致，则表示全选
        if (result.length === choices.length - 3) {
          return ['cvlar-all'];
        }
        return result;
      }
      return [];
    }

    result = await command.prompt.select({
      message,
      choices,
      pageSize: this.CONF.i18n.choicesLimit ?? 15
    });

    return (result as string).trim();
  }

  /**
   * 私有函数：创建链接
   * @param {string} name 文本
   * @param {string} url 链接
   * @returns {string} 链接
   */
  private createLink(name: string, url: string): string {
    return `\u001B]8;;${url}\u0007${name}\u001B]8;;\u0007`;
  }

  /**
   * 私有函数：创建NPM链接
   * @param {string} name 文本
   * @param {string} path 链接路径
   * @returns {string} 链接
   */
  private createNpmLink(name: string, path: string): string {
    return this.createLink(name, `https://www.npmjs.com/${path}`);
  }

  /**
   * 私有函数：创建分数条
   * @param {number} score 分数
   * @param {(text: string) => string} colorFn 颜色函数
   * @returns {string} 分数条
   */
  private createScoreBar(score: number, colorFn: (text: string) => string): string {
    const symbol = this.CONF.i18n.package.commands.search.result.score.process.symbol ?? '▇';
    let symbolActive = symbol;
    let symbolUnactive = symbol;

    if (_isArr(symbol)) {
      symbolActive = symbol[0];
      symbolUnactive = symbol[1];
    }

    const length = this.CONF.i18n.package.commands.search.result.score.process.length ?? 50;
    const activeBold = this.CONF.i18n.package.commands.search.result.score.process.activeBold;
    const percentage = Math.round(score * 100);
    const coloredBars = Math.round((percentage / 100) * length);
    let coloredBarStr = colorFn(symbolActive.repeat(coloredBars));
    activeBold && (coloredBarStr = pc.bold(coloredBarStr));
    const grayBarStr = pc.gray(symbolUnactive.repeat(length - coloredBars));

    return `${coloredBarStr}${grayBarStr} ${percentage}%`;
  }

  /**
   * 私有函数：包管理 > 移除 ANSI 代码
   * @param {string} code 命令代码
   * @returns {string} 移除 ANSI 代码后的命令代码
   */
  private removeAnsiCodes(code: string): string {
    // eslint-disable-next-line no-control-regex
    return code.replace(/(\u001B\[\d+m|\u001B\]8;;.*?\u0007)/g, '');
  }

  /**
   * 对字符串数组进行对齐。
   * 计算数组中字符串的最大长度，并为每个字符串添加足够的空格以对齐。
   * @param {string[]} arr 字符串数组。
   * @returns {string[]} 对齐后的字符串数组。
   */
  private alignStrings(arr: string[]): string[] {
    const maxLength = Math.max(...arr.map((str) => this.removeAnsiCodes(str).length));
    return arr.map((str) => str + ' '.repeat(maxLength - this.removeAnsiCodes(str).length));
  }

  /**
   * 私有函数：格式化时间
   * @param {string} isoTimeString ISO时间字符串
   * @returns {string} 格式化后的时间
   */
  private formatTime(isoTimeString: string): string {
    const format: string = this.CONF.i18n.package.commands.search.result.date.format ?? 'YYYY-MM-DD HH:mm:ss';
    const now: Date = new Date();
    const targetTime: Date = new Date(isoTimeString);
    const timeDiff: number = now.getTime() - targetTime.getTime();
    const daysDiff: number = timeDiff / (1000 * 60 * 60 * 24);
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const secondsStr = String(targetTime.getSeconds()).padStart(2, '0');
    const minutesStr = String(targetTime.getMinutes()).padStart(2, '0');
    const hoursStr = String(targetTime.getHours()).padStart(2, '0');
    const daysStr = String(targetTime.getDate()).padStart(2, '0');
    const monthStr = String(targetTime.getMonth() + 1).padStart(2, '0');
    const yearStr = targetTime.getFullYear().toString();
    let datetime: string = '';
    let humanized: string = '';

    if (weeks > 0) {
      humanized = `${weeks} ${this.CONF.i18n.package.commands.search.result.date[`week${weeks === 1 ? '' : 's'}`]}`;
    } else if (days > 0) {
      humanized = `${days} ${this.CONF.i18n.package.commands.search.result.date[`day${days === 1 ? '' : 's'}`]}`;
    } else if (hours > 0) {
      humanized = `${hours} ${this.CONF.i18n.package.commands.search.result.date[`hour${hours === 1 ? '' : 's'}`]}`;
    } else if (minutes > 0) {
      humanized = `${minutes} ${this.CONF.i18n.package.commands.search.result.date[`minute${minutes === 1 ? '' : 's'}`]}`;
    } else {
      humanized = `${seconds} ${this.CONF.i18n.package.commands.search.result.date[`second${seconds === 1 ? '' : 's'}`]}`;
    }

    // 完整时间
    datetime = format.replace('YYYY', yearStr).replace('MM', monthStr).replace('DD', daysStr).replace('HH', hoursStr).replace('mm', minutesStr).replace('ss', secondsStr);

    // 如果天数小于 3，则显示人性化时间
    daysDiff < 3 && (datetime = `${humanized} (${datetime})`);

    return datetime;
  }

  /**
   * 私有函数：版本号类型颜色
   * @param {string} type 版本号类型
   * @returns {(text: string) => string} 颜色函数
   */
  private getVersionTypeColor(type: TPackageVersionType): (text: string) => string {
    let color: (text: string) => string;
    switch (type) {
      case 'major':
        color = pc.red;
        break;
      case 'minor':
        color = pc.yellow;
        break;
      case 'patch':
        color = pc.green;
        break;
      case 'prerelease':
        color = pc.magenta;
        break;
      default:
        color = pc.blue;
        break;
    }
    return color;
  }

  /**
   * 更新包版本信息
   * @param {any} data 包信息
   * @param {string} version 当前包中的版本号
   * @returns {IPackagesVersions} 更新后的包信息
   */
  private updateVersionInfo(data: any, version: string): IPackagesVersions {
    let versions = data['versions'];
    let info: IPackagesVersions;

    if (_isObj(versions)) {
      versions = Object.keys(versions);
      let latest = data['dist-tags']['latest'];
      latest || (latest = versions[versions.length - 1]);

      info = V.findHighestUpgradable(version, latest, versions);
    }

    return info;
  }

  /**
   * 私有函数：获得包版本号信息
   * @param {string} type 包管理器类型
   * @param {string} name 包名称
   * @param {string} version 当前包中的版本号
   * @returns {Promise<IPackagesVersions>} 包信息
   */
  private async getPackageVersionInfo(type: string, name: string, version: string): Promise<IPackagesVersions> {
    let info: IPackagesVersions = {
      missing: false,
      current: {
        version: version,
        standard: false
      },
      patch: {
        version: '',
        standard: false
      },
      minor: {
        version: '',
        standard: false
      },
      major: {
        version: '',
        standard: false
      },
      prerelease: {
        version: '',
        standard: false
      },
      no: true
    };

    try {
      // 尝试通过 HTTPS 获取包信息
      const data = await packageJson(name, { allVersions: true });
      info = this.updateVersionInfo(data, version);
    } catch (e) {
      try {
        // 如果 HTTPS 请求失败，则尝试使用命令行方式获取包信息
        const { stdout, stderr } = await command.execute(`${type} info ${name} --json`);
        if (!stderr && !stdout.includes('npm ERR!')) {
          const data = JSON.parse(stdout);
          info = this.updateVersionInfo(data, version);
        } else {
          info.missing = true;
        }
      } catch (error) {
        info.missing = true;
      }
    }

    return info;
  }

  /**
   * 私有函数：获得需要更新的包信息
   * @param {string} type 包管理器类型
   * @param {IPackageJsonData} packs 包名称
   * @param {Ora} spinner 加载动画
   */
  private async getPackageVersionInfos(type: string, packs: IPackageJsonData, spinner: Ora): Promise<IPackagesListUpdate[]> {
    const deps: IPackagesListUpdate[] = [];

    for (const key in packs) {
      if (Object.prototype.hasOwnProperty.call(packs, key)) {
        const name = key;
        const version = packs[key];

        spinner.text = convert.replacePlaceholders(this.CONF.i18n.package.commands.update.loadings.analysing, name);

        const info: IPackagesVersions = await this.getPackageVersionInfo(type, name, version);

        // 表示需要更新
        if (!info.no) {
          deps.push({
            name,
            version: info
          });
        }
      }
    }

    return deps;
  }

  /**
   * 私有函数：去除重复的版本号并整理包信息
   * @param {IPackagesListUpdate} infos 包信息
   * @param {boolean} [devDep = false] 是否为开发依赖
   * @returns {Promise<IPackagesUpdateInfos[]>} 包的更新信息数组
   */
  private async packageDepsVersionsRemoveDuplicates(infos: IPackagesListUpdate, devDep: boolean = false): Promise<IPackagesUpdateInfos[]> {
    const updates: IPackagesUpdateInfos[] = [];
    const { current, major, minor, patch, prerelease } = infos.version;

    const createUpdateInfo = (newVersion: IPackageVersionSemverStandard, type: TPackageVersionType): IPackagesUpdateInfos | boolean =>
      current.version !== newVersion.version && { package: infos.name, type, current: current.version, version: newVersion.version, devDep };

    const vMajor = createUpdateInfo(major, 'major');
    const vMinor = createUpdateInfo(minor, 'minor');
    const vPatch = createUpdateInfo(patch, 'patch');
    const vPrerelease = createUpdateInfo(prerelease, 'prerelease');

    // 过滤，去除 false，形成新的数组，并遍历
    [vMajor, vMinor, vPatch, vPrerelease].filter(Boolean).forEach((version: IPackagesUpdateInfos) => {
      const existingUpdate = updates.find((update) => update.version === version.version);

      if (!existingUpdate) {
        updates.push(version);
      } else if (existingUpdate.type === 'major' && version.type !== 'major') {
        existingUpdate.type = version.type;
      } else if (existingUpdate.type === 'minor' && version.type === 'patch') {
        existingUpdate.type = version.type;
      }
    });

    // 循环判断是否为预发布版本
    updates.forEach((update) => {
      // 如果符合标准的版本号，则判断是否为预发布版本
      if (!semver.valid(update.version)) {
        update.type = 'nonsemver';
      }
    });

    return updates;
  }

  /**
   * 私有函数：包管理 > 获得包更新信息
   * @param {IPackagesCategoryUpdate} deps 依赖包
   * @returns {Promise<IPackagesUpdateInfos[]>} 包更新信息
   */
  private async getPackageUpdateInfos(deps: IPackagesCategoryUpdate): Promise<IPackagesUpdateInfos[]> {
    const infos: IPackagesUpdateInfos[] = [];

    for (const key in deps) {
      if (Object.prototype.hasOwnProperty.call(deps, key)) {
        const items = deps[key];

        for (const item of items) {
          infos.push(...(await this.packageDepsVersionsRemoveDuplicates(item, key === 'dev')));
        }
      }
    }

    return infos;
  }

  /**
   * 私有函数：脚本 > 选择
   * @returns {Promise<void>} 无返回值
   */
  public async select(): Promise<void> {
    cs.clear.lastLine();

    const choices = [];

    // 遍历
    const commands = this.CONF.package['manager'].commands;
    for (const key in commands) {
      if (Object.prototype.hasOwnProperty.call(commands, key)) {
        const val = commands[key];

        const item = {
          name: key,
          value: key
        };

        if (val && _isStr(val) && val !== key) {
          item.name = `${val} (${key})`;
        }

        choices.push(item);
      }
    }

    this.addBack(choices);

    const select = await command.prompt.select({
      message: this.CONF.i18n.package.commands.message,
      choices
    });

    select === '..' ? menuState.set('main') : await this.run(select);
  }

  /**
   * 私有函数：脚本 > 运行
   * @param {string} code 脚本代码
   * @returns {Promise<void>} 无返回值
   */
  private async run(code: string): Promise<void> {
    cs.clear.lastLine();

    const pmType = this.CONF.package['manager'].type.trim().toLowerCase();

    code = code.trim().toLowerCase();

    if (['i', 'add', 'install'].includes(code)) {
      let devDepCmd = '-D';
      if (pmType === 'yarn') {
        code = 'add';
      } else if (pmType === 'pnpm') {
        code = 'add';
      } else {
        code = 'install';
        devDepCmd = '--save-dev';
      }
      await this.install(pmType, code, devDepCmd);
      if (['i', 'add', 'install', 'r', 'un', 'rm', 'remove', 'uninstall'].includes(code)) {
        console.log('应该重新读取 package.json');
      }
    } else if (['r', 'un', 'rm', 'remove', 'uninstall'].includes(code)) {
      if (pmType === 'yarn') {
        code = 'remove';
      } else if (pmType === 'pnpm') {
        code = 'remove';
      } else {
        code = 'uninstall';
      }
      await this.uninstall(pmType, code);
    } else if (['up', 'update', 'upgrade'].includes(code)) {
      let devDepCmd = '-D';
      if (pmType === 'yarn') {
        code = 'add';
      } else if (pmType === 'pnpm') {
        code = 'add';
      } else {
        code = 'install';
        devDepCmd = '--save-dev';
      }
      await this.update(pmType, code, devDepCmd);
    } else if (code === 'outdated') {
      code = 'outdated';
      await this.outdated(pmType, code);
    } else if (['la', 'ls', 'll', 'list'].includes(code)) {
      code = 'list';
      await this.list();
    } else if (['view', 'info'].includes(code)) {
      code = 'info';
      await this.info(pmType, code);
    } else if (code === 'search') {
      code = 'search';
      await this.search();
    } else if (code === 'login') {
      code = 'login';
      await this.login(pmType, code);
    } else if (code === 'publish') {
      code = 'publish';
      await this.publish(pmType, code);
    }
  }

  /**
   * 私有函数：包管理 > 安装
   * @param {string} type 包管理器类型
   * @param {string} code 命令代码
   * @param {string} devDepCmd 开发依赖命令
   * @returns {Promise<void>} 无返回值
   */
  private async install(type: string, code: string, devDepCmd: string): Promise<void> {
    console.log(pc.dim(this.CONF.i18n.package.commands.install.description));

    let errorFormat: boolean = false;
    do {
      const packages = await command.prompt.input({
        message: this.CONF.i18n.package.commands.install.message
      });

      errorFormat = await this.installRun(type, code, devDepCmd, packages);
    } while (errorFormat);
  }

  /**
   * 私有函数：包管理 > 安装 > 运行
   * @param {string} type 包管理器类型
   * @param {string} code 命令代码
   * @param {string} devDepCmd 开发依赖命令
   * @param {string} packages 依赖包
   * @returns {Promise<boolean>} 是否格式错误
   */
  private async installRun(type: string, code: string, devDepCmd: string, packages: string): Promise<boolean> {
    const packsTypes: string[] = packages.trim().split('|');
    const packsLen = packsTypes.length;
    let errorFormat: boolean = false;

    // 如果输入的内容为空 或者 依赖包数组，不是 1 或 2 个，则提示错误
    if (packages === '' || packsLen <= 0 || packsLen > 2) {
      errorFormat = true;
      cs.clear.lastLine();

      if (packages !== '') {
        console.log(`x ${pc.red(this.CONF.i18n.package.commands.install.error.format)}`);
      }
    } else {
      errorFormat = false;
      if (packsLen === 1) {
        const deps = packsTypes[0].trim();
        await this.cmd(type, [code, deps]);
      } else if (packsLen === 2) {
        const depsProd = packsTypes[0].trim();
        const depsDev = packsTypes[1].trim();

        depsProd && (await this.cmd(type, [code, depsProd]));
        depsDev && (await this.cmd(type, [code, depsDev, devDepCmd]));
      }
    }

    return errorFormat;
  }

  /**
   * 私有函数：包管理 > 卸载
   * @param {string} type 包管理器类型
   * @param {string} code 命令代码
   * @returns {Promise<void>} 无返回值
   */
  private async uninstall(type: string, code: string): Promise<void> {
    const select = await this.depsSelect(this.CONF.i18n.package.commands.uninstall.message, true);

    if (select.length) {
      select === '..' ? menuState.set('package') : await this.cmd(type, [code, ...select]);
    }
  }

  /**
   * 私有函数：包管理 > 更新
   * @param {string} type 包管理器类型
   * @param {string} code 命令代码
   * @param {string} devDepCmd 开发依赖命令
   * @returns {Promise<void>} 无返回值
   */
  private async update(type: string, code: string, devDepCmd: string): Promise<void> {
    let recheck: boolean = false;

    do {
      cs.clear.all();
      const spinner = ora(pc.cyan(this.CONF.i18n.package.commands.update.loadings.reading));
      spinner.start();
      const PACK: IPackageJson = pack.read();

      spinner.text = pc.cyan(this.CONF.i18n.package.commands.update.loadings.request);

      // 并发请求，提高效率
      const results = await Promise.all([this.getPackageVersionInfos(type, PACK.data['dependencies'], spinner), this.getPackageVersionInfos(type, PACK.data['devDependencies'], spinner)]);

      const deps: IPackagesCategoryUpdate = {
        prod: [],
        dev: []
      };

      if (results.length === 2) {
        deps.prod = results[0];
        deps.dev = results[1];
      }

      spinner.stop();

      if (deps.dev.length > 0 || deps.prod.length > 0) {
        await this.updateSelectsTable(type, code, devDepCmd, deps);
        // await this.updateSelectsCategory(type, code, devDepCmd, deps);
      } else {
        recheck = await command.prompt.select({
          message: this.CONF.i18n.package.commands.update.error.noUpdate,
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
      }
    } while (recheck);
  }

  /**
   * 私有函数：包管理 > 更新 > 列表 > 表格
   * @param {string} type 包管理器类型
   * @param {string} code 命令代码
   * @param {string} devDepCmd 开发依赖命令
   * @param {IPackagesCategoryUpdate} deps 依赖包
   * @returns {Promise<void>} 无返回值
   */
  private async updateSelectsTable(type: string, code: string, devDepCmd: string, deps: IPackagesCategoryUpdate): Promise<void> {
    // 版本类型
    const versionTypes: TPackageVersionType[] = ['patch', 'minor', 'major', 'prerelease', 'nonsemver'];

    // 选项
    const choices = [];

    // 类型提示
    const choicesTypeTips = {};

    const choicesItems = [];

    // 列表
    const choicesTable: Record<string, Record<TPackageVersionType, TCheckboxChoice<any>>> = {};

    const updateInfos = await this.getPackageUpdateInfos(deps);

    // 定义存储各列字符串的数组
    const packageNames: Record<string, Record<TPackageVersionType, string>> = {};
    const devOrProds: Record<string, Record<TPackageVersionType, string>> = {};
    const currentVersions: Record<string, Record<TPackageVersionType, string>> = {};
    const newVersions: Record<string, Record<TPackageVersionType, string>> = {};

    // 填充数组
    for (const info of updateInfos) {
      _isUn(packageNames[info.package]) &&
        (packageNames[info.package] = {
          patch: undefined,
          minor: undefined,
          major: undefined,
          prerelease: undefined,
          nonsemver: undefined
        });
      _isUn(devOrProds[info.package]) &&
        (devOrProds[info.package] = {
          patch: undefined,
          minor: undefined,
          major: undefined,
          prerelease: undefined,
          nonsemver: undefined
        });

      _isUn(currentVersions[info.package]) &&
        (currentVersions[info.package] = {
          patch: undefined,
          minor: undefined,
          major: undefined,
          prerelease: undefined,
          nonsemver: undefined
        });

      _isUn(newVersions[info.package]) &&
        (newVersions[info.package] = {
          patch: undefined,
          minor: undefined,
          major: undefined,
          prerelease: undefined,
          nonsemver: undefined
        });

      packageNames[info.package][info.type] = this.createNpmLink(pc.bold(pc.cyan(info.package)), `package/${info.package}`);
      if (info.devDep) {
        devOrProds[info.package][info.type] = pc.yellow(this.CONF.i18n.package.commands.update.dev);
      } else {
        devOrProds[info.package][info.type] = pc.green(this.CONF.i18n.package.commands.update.prod);
      }
      currentVersions[info.package][info.type] = pc.gray(info.current);
      newVersions[info.package][info.type] = info.version;
    }

    // 对齐各列
    const groups: Record<string, string> = {};
    const alignedCurrentVersions = this.updateChoicesAlignStrings(currentVersions) as Record<string, Record<TPackageVersionType, string>>;
    const arrow = pc.bold(`   ${pc.gray('>')}${pc.blue('>')}${pc.green('>')}   `);

    // 使用对齐后的字符串构建 choicesCategory
    for (const info of updateInfos) {
      groups[info.package] = `${packageNames[info.package][info.type]} ${pc.dim(`(${devOrProds[info.package][info.type]})`)}`;

      // 首先所有的版本号都是 `prerelease`的颜色
      let colorVersion = newVersions[info.package][info.type];
      const colorFn = this.getVersionTypeColor(info.type);
      const parsed = semver.parse(colorVersion);
      if (parsed) {
        const dot = '.';
        const major = parsed.major.toString();
        const minor = parsed.minor.toString();
        const patch = parsed.patch.toString();

        switch (info.type) {
          case 'major':
            colorVersion = `${colorFn(major)}${pc.gray(`${dot}${minor}${dot}${patch}`)}`;
            break;
          case 'minor':
            colorVersion = `${pc.gray(`${major}${dot}`)}${colorFn(minor)}${pc.gray(`${dot}${patch}`)}`;
            break;
          case 'patch':
            colorVersion = `${pc.gray(`${major}${dot}${minor}${dot}`)}${colorFn(patch)}`;
            break;
          case 'prerelease':
            colorVersion = `${pc.gray(`${major}${dot}${minor}${dot}${patch}`)}${colorFn(colorVersion.replace(`${major}${dot}${minor}${dot}${patch}`, ''))}`;
            break;
        }
      } else {
        colorVersion = this.getVersionTypeColor('nonsemver')(newVersions[info.package][info.type]);
      }

      const item: TCheckboxChoice<any> = {
        name: `${alignedCurrentVersions[info.package][info.type]}${arrow}${pc.bold(colorVersion)}`,
        value: `${info.package}@${info.version},${info.devDep ? 'dev' : 'prod'}`
      };

      _isUn(choicesTable[info.package]) &&
        (choicesTable[info.package] = {
          patch: undefined,
          minor: undefined,
          major: undefined,
          prerelease: undefined,
          nonsemver: undefined
        });
      choicesTable[info.package][info.type] = item;
    }

    // 创建分隔标题并添加到 各自的 choices 中
    for (const key in choicesTable) {
      if (Object.prototype.hasOwnProperty.call(choicesTable, key)) {
        const item = choicesTable[key];

        choicesItems.push(command.prompt.separator(groups[key]));
        versionTypes.forEach((type: TPackageVersionType) => {
          if (!_isUn(item[type])) {
            _isUn(choicesTypeTips[type]) && (choicesTypeTips[type] = this.updateSelectSeparator(type, 'all', 'table'));
            choicesItems.push(item[type]);
          }
        });
        choicesItems.push(command.prompt.separator(' '));
      }
    }

    // 添加到 choices
    for (const type of versionTypes) {
      if (!_isUn(choicesTypeTips[type])) {
        choices.push(choicesTypeTips[type]);
      }
    }

    choices.push(command.prompt.separator(' '));

    choices.push(...choicesItems);

    // 问题内容
    const question = this.CONF.i18n.package.commands.update.message;

    // 显示选择框
    const selects = await command.prompt.checkbox({
      message: question,
      choices,
      instructions: this.CONF.i18n.checkbox.instructions,
      pageSize: this.CONF.i18n.choicesLimit ?? 15,
      loop: false,
      validate: (answer) => {
        if (answer.length < 1) {
          return this.CONF.i18n.package.commands.update.error.nonSelect;
        }
        return true;
      }
    });

    if (selects.length > 0) {
      const codeProd: string[] = [];
      const codeDev: string[] = [];

      selects.forEach((select: string) => {
        const [name, devOrProd] = select.split(',');
        devOrProd === 'dev' ? codeDev.push(name) : codeProd.push(name);
      });

      // 清空控制台
      cs.clear.all();

      // 重新模拟输出问题
      console.log(`${pc.green('?')} ${pc.bold(question)} ${this.removeAnsiCodes(`${codeProd.join(' ')} ${codeDev.join(' ')}`)}`);

      if (codeProd.length > 0 || codeDev.length > 0) {
        await this.installRun(type, code, devDepCmd, `${codeProd.join(' ')}|${codeDev.join(' ')}`);
        console.log('\n\n\n');
      }
    }
  }

  /**
   * 私有函数：包管理 > 更新 > 列表 > 分类
   * @param {string} type 包管理器类型
   * @param {string} code 命令代码
   * @param {string} devDepCmd 开发依赖命令
   * @param {IPackagesCategoryUpdate} deps 依赖包
   * @returns {Promise<void>} 无返回值
   */
  private async updateSelectsCategory(type: string, code: string, devDepCmd: string, deps: IPackagesCategoryUpdate): Promise<void> {
    // 版本类型
    const versionTypes: TPackageVersionType[] = ['patch', 'minor', 'major', 'prerelease', 'nonsemver'];

    // 选项
    const choices = [];

    // 类型分类
    const choicesCategory: Record<TPackageVersionType, TCheckboxChoice<any>[]> = {
      major: [],
      minor: [],
      patch: [],
      prerelease: [],
      nonsemver: []
    };

    const updateInfos = await this.getPackageUpdateInfos(deps);

    // 定义存储各列字符串的数组
    const packageNames = [];
    const devOrProds = [];
    const currentVersions = [];
    const newVersions = [];

    // 填充数组
    for (const info of updateInfos) {
      packageNames.push(this.createNpmLink(pc.bold(pc.cyan(info.package)), `package/${info.package}`));
      if (info.devDep) {
        devOrProds.push(pc.yellow(this.CONF.i18n.package.commands.update.dev));
      } else {
        devOrProds.push(pc.green(this.CONF.i18n.package.commands.update.prod));
      }
      currentVersions.push(pc.gray(info.current));
      newVersions.push(pc.bold(pc.green(info.version)));
    }

    // 对齐各列
    const alignedPackageNames = this.updateChoicesAlignStrings(packageNames) as string[];
    const alignedDevOrProds = this.updateChoicesAlignStrings(devOrProds) as string[];
    const alignedCurrentVersions = this.updateChoicesAlignStrings(currentVersions) as string[];
    const alignedNewVersions = this.updateChoicesAlignStrings(newVersions) as string[];
    const arrow = pc.bold(`   ${pc.gray('>')}${pc.blue('>')}${pc.green('>')}   `);
    const separatorVh = pc.dim(pc.gray('   │   '));

    // 使用对齐后的字符串构建 choicesCategory
    updateInfos.forEach((info, index) => {
      const item: TCheckboxChoice<any> = {
        name: `${alignedPackageNames[index]}${separatorVh}${alignedDevOrProds[index]}${separatorVh}${alignedCurrentVersions[index]}${arrow}${alignedNewVersions[index]}`,
        value: `${info.package}@${info.version},${info.devDep ? 'dev' : 'prod'}`
      };

      choicesCategory[info.type].push(item);
    });

    // 创建分隔标题并添加到 choices
    versionTypes.forEach((key: TPackageVersionType) => {
      if (choicesCategory[key].length > 0) {
        choices.push(this.updateSelectSeparator(key));
        choices.push(...choicesCategory[key]);
        choices.push(command.prompt.separator(' '));
      }
    });

    // 问题内容
    const question = this.CONF.i18n.package.commands.update.message;

    // 显示选择框
    const selects = await command.prompt.checkbox({
      message: question,
      choices,
      instructions: this.CONF.i18n.checkbox.instructions,
      pageSize: this.CONF.i18n.choicesLimit ?? 15,
      loop: false,
      validate: (answer) => {
        if (answer.length < 1) {
          return this.CONF.i18n.package.commands.update.error.nonSelect;
        }
        return true;
      }
    });

    if (selects.length > 0) {
      const codeProd: string[] = [];
      const codeDev: string[] = [];

      selects.forEach((select: string) => {
        const [name, devOrProd] = select.split(',');
        devOrProd === 'dev' ? codeDev.push(name) : codeProd.push(name);
      });

      // 清空控制台
      cs.clear.all();

      // 重新模拟输出问题
      console.log(`${pc.green('?')} ${pc.bold(question)} ${this.removeAnsiCodes(`${codeProd.join(' ')} ${codeDev.join(' ')}`)}`);

      if (codeProd.length > 0 || codeDev.length > 0) {
        await this.installRun(type, code, devDepCmd, `${codeProd.join(' ')}|${codeDev.join(' ')}`);
        console.log('\n\n\n');
      }
    }
  }

  /**
   * 私有函数：包管理 > 更新 > 对齐字符串
   * @param {string[] | Record<string, Record<TPackageVersionType, string>>} items 字符串数组
   * @returns {string[] | Record<string, Record<TPackageVersionType, string>>} 对齐后的字符串数组
   */
  private updateChoicesAlignStrings(items: string[] | Record<string, Record<TPackageVersionType, string>>): string[] | Record<string, Record<TPackageVersionType, string>> {
    if (_isArr(items)) {
      return this.alignStrings(items);
    } else {
      for (const key in items) {
        if (Object.prototype.hasOwnProperty.call(items, key)) {
          const item = items[key];
          const values = Object.keys(item)
            .map((k) => item[k])
            .filter((val) => !_isUn(val));
          const alignedValues = this.alignStrings(values);

          let alignedIndex = 0;
          Object.keys(item).forEach((k) => {
            if (!_isUn(item[k])) {
              items[key][k] = alignedValues[alignedIndex++];
            }
          });
        }
      }
      return items;
    }
  }

  /**
   * 创建分隔标题
   * @param {TPackageVersionType} key 标题
   * @param {'all' | 'title'} data 数据结构，all：全部数据；title：标题，style参数无效
   * @param {'table' | 'category'} style 样式
   * @returns {Separator | string} 分隔标题 | 标题
   */
  private updateSelectSeparator(key: TPackageVersionType, data: 'all' | 'title' = 'all', style: 'table' | 'category' = 'category'): Separator | string {
    /**
     * 获得版本类型的颜色
     */
    const color = this.getVersionTypeColor(key);

    const title = pc.bold(color(this.CONF.i18n.package.commands.update.category[key].message));

    if (data === 'title') {
      return title;
    }

    const description = color(this.CONF.i18n.package.commands.update.category[key].description);

    const sepTitles = [];
    if (style === 'category') {
      sepTitles.push(pc.underline(title));
      sepTitles.push(pc.dim(description));
    } else {
      sepTitles.push(`★ ${title}`);
      sepTitles.push(description);
    }
    return command.prompt.separator(sepTitles.join(' '));
  }

  /**
   * 私有函数：包管理 > 过期
   * @param {string} type 包管理器类型
   * @param {string} code 命令代码
   * @returns {Promise<void>} 无返回值
   */
  private async outdated(type: string, code: string): Promise<void> {
    await this.cmd(type, [code]);
  }

  /**
   * 私有函数：包管理 > 列表
   * @returns {Promise<void>} 无返回值
   */
  private async list(): Promise<void> {
    const PACK: IPackageJson = pack.read();

    const prodDeps = [];
    const devDeps = [];

    // 处理依赖
    const processDeps = (deps: any, array: any[]) => {
      _forEach(deps, (val, key) => {
        const depName = this.createNpmLink(`${pc.green(pc.bold(key))}`, `package/${key}`);
        array.push(`${depName} ${pc.gray(val)}`);
      });
    };

    processDeps(PACK.data['dependencies'], prodDeps);
    processDeps(PACK.data['devDependencies'], devDeps);

    // 确保两列长度相同
    const maxDepsLength = Math.max(prodDeps.length, devDeps.length);

    // 创建表格并添加数据
    const table = new Table({
      head: [
        `${pc.cyan(pc.bold(this.CONF.i18n.package.commands.list.dependencies))} ${pc.gray(`(${prodDeps.length})`)}`,
        `${pc.cyan(pc.bold(this.CONF.i18n.package.commands.list.devDependencies))} ${pc.gray(`(${devDeps.length})`)}`
      ]
    });

    while (prodDeps.length < maxDepsLength) {
      prodDeps.push('');
    }
    while (devDeps.length < maxDepsLength) {
      devDeps.push('');
    }

    for (let i = 0; i < maxDepsLength; i++) {
      table.push([prodDeps[i], devDeps[i]]);
    }

    console.log(`${table.toString()}\n\n\n`);
  }

  /**
   * 私有函数：包管理 > 信息
   * @param {string} type 包管理器类型
   * @param {string} code 命令代码
   * @returns {Promise<void>} 无返回值
   */
  private async info(type: string, code: string): Promise<void> {
    const select = await this.depsSelect(this.CONF.i18n.package.commands.info.message);

    if (_isStr(select)) {
      await this.cmd(type, [code, select]);

      console.log(`${this.CONF.i18n.package.commands.info.link}${this.createNpmLink(`${pc.green(pc.bold(select))}`, `package/${select}`)}\n`);

      if (await this.confirm(this.CONF.i18n.package.commands.info.other, true)) {
        cs.clear.lastLine();
        await this.info(type, code);
      }
    }
  }

  /**
   * 私有函数：包管理 > 搜索
   * @returns {Promise<void>} 无返回值
   */
  private async search(): Promise<void> {
    cs.clear.all();
    this.searchKeyword = await command.prompt.input({
      message: this.CONF.i18n.package.commands.search.message,
      validate: (val: string) => (val.trim() === '' ? this.CONF.i18n.package.commands.search.error.input : true)
    });

    this.searchKeyword = this.searchKeyword.trim();

    if (this.searchKeyword !== '') {
      // 删除搜索的关键词
      cs.clear.lastLine();
      // 重置搜索结果计数
      this.searchResultsCount = 0;
      // 重置搜索结果当前页码
      this.searchPageCurrent = 1;
      await this.searchPackage();
    }
  }

  /**
   * 私有函数：包管理 > 搜索
   * @returns {Promise<void>} 无返回值
   */
  private async searchPackage(): Promise<void> {
    try {
      const from = (this.searchPageCurrent - 1) * this.searchPageSize;
      const url = `https://registry.npmjs.org/-/v1/search?text=${this.searchKeyword}&size=${this.searchPageSize}&from=${from}`;

      const spinner = ora(pc.cyan(this.CONF.i18n.package.commands.search.loading));
      spinner.start();
      const response = await fetch(url);
      spinner.stop();

      const data = await response.json();

      if (data && data['total'] > 0) {
        // 搜索结果总数
        this.searchResultsTotal = Number(data['total']);
        // 搜索结果总页数
        this.searchPageTotal = Math.ceil(this.searchResultsTotal / this.searchPageSize);

        cs.clear.lastLine();

        const delimiterContents = [];
        delimiterContents.push(pc.gray(this.CONF.i18n.package.commands.search.pagination.delimiter.result));
        delimiterContents.push(convert.formatNumberWithCommas(this.searchResultsTotal));
        delimiterContents.push('\n');
        delimiterContents.push(pc.gray(this.CONF.i18n.package.commands.search.pagination.delimiter.pageSize));
        delimiterContents.push(convert.formatNumberWithCommas(this.searchPageSize));
        delimiterContents.push('\n');
        delimiterContents.push(pc.gray(this.CONF.i18n.package.commands.search.pagination.delimiter.pageTotal));
        delimiterContents.push(convert.formatNumberWithCommas(this.searchPageTotal));
        delimiterContents.push('\n');
        delimiterContents.push(pc.gray(this.CONF.i18n.package.commands.search.pagination.delimiter.pageCurrent));
        delimiterContents.push(convert.formatNumberWithCommas(this.searchPageCurrent));

        console.log('\n\n');
        console.log(
          pc.cyan(
            boxen(delimiterContents.join(''), {
              title: this.createNpmLink(pc.bold(pc.green(this.searchKeyword)), `search?q=${this.searchKeyword}`),
              padding: { top: 1, right: 10, bottom: 1, left: 10 },
              titleAlignment: 'center',
              borderStyle: 'double'
            })
          )
        );
        console.log('\n');
        const infos = data['objects'];
        if (infos && _isArr(infos) && infos.length > 0) {
          for (const item of infos) {
            this.searchResultsCount++;
            await this.searchPackageResult(item);
          }
        }
        await this.searchPagination();
      } else {
        console.log(pc.yellow(this.CONF.i18n.package.commands.search.result.error.empty));
      }
    } catch (error) {
      console.log(pc.red(`${this.CONF.i18n.package.commands.search.result.error.abnormal}\n${error}`));
    }
  }

  /**
   * 私有函数：包管理 > 搜索 > 结果页
   * @param {any} info 搜索结果
   * @returns {Promise<void>} 无返回值
   */
  private async searchPackageResult(info: any): Promise<void> {
    const name = info.package.name;
    const version = info.package.version;
    let authorName = '';
    let authorLink = '';
    let authorEmail = '';

    if (_isObj(info.package.author)) {
      // 表示 authorName 不为空，则 authorName = info.package.author.name
      _isUn(info.package.author.name) || (authorName = info.package.author.name);
      // 表示 authorEmail 不为空，则 authorEmail = info.package.author.email
      _isUn(info.package.author.url) || (authorLink = info.package.author.url);
    }
    if (_isObj(info.package.publisher)) {
      // 表示 authorName 为空，且 info.package.publisher.username 不为空
      _isStr(authorName) && authorName === '' && !_isUn(info.package.publisher.username) && (authorName = info.package.publisher.username);
      // 表示 authorEmail 为空，且 info.package.publisher.email 不为空
      _isStr(authorEmail) && authorEmail === '' && !_isUn(info.package.publisher.email) && (authorEmail = info.package.publisher.email);
    }

    const date = this.formatTime(info.package.date);
    const keywords = [];
    _forEach(info.package.keywords, (val) => {
      keywords.push(this.createNpmLink(val, `search?q=keywords:${val}`));
    });
    const description = info.package.description;

    const links = {
      home: undefined,
      repository: undefined,
      npm: undefined,
      bugs: undefined
    };

    if (info.package.links) {
      if (info.package.links.homepage) {
        links.home = this.createLink(pc.cyan('home'), info.package.links.homepage);
      }

      if (info.package.links.repository) {
        links.repository = this.createLink(pc.cyan('repository'), info.package.links.repository);
      }

      if (info.package.links.npm) {
        links.npm = this.createLink(pc.cyan('npm'), info.package.links.npm);
      }

      if (info.package.links.bugs) {
        links.bugs = this.createLink(pc.cyan('bugs'), info.package.links.bugs);
      }
    }

    const scores = {
      final: `${pc.dim(this.CONF.i18n.package.commands.search.result.score.final)}${this.createScoreBar(info.score.final, pc.yellow)}`,
      quality: `${pc.dim(this.CONF.i18n.package.commands.search.result.score.quality)}${this.createScoreBar(info.score.detail.quality, pc.cyan)}`,
      popularity: `${pc.dim(this.CONF.i18n.package.commands.search.result.score.popularity)}${this.createScoreBar(info.score.detail.popularity, pc.magenta)}`,
      maintenance: `${pc.dim(this.CONF.i18n.package.commands.search.result.score.maintenance)}${this.createScoreBar(info.score.detail.maintenance, pc.red)}`
    };

    const datas = [];
    datas.push(pc.dim(`#${pc.gray(convert.formatNumberWithCommas(this.searchResultsCount))} `));
    datas.push(pc.bold(pc.cyan(this.createNpmLink(name, `package/${name}`))));
    datas.push(pc.gray(` (${version})`));
    datas.push(pc.dim(` / ${date}`));

    if (keywords.length > 0) {
      datas.push('\n');
      datas.push(pc.dim(this.CONF.i18n.package.commands.search.result.fields.keywords));
      datas.push(pc.blue(`${keywords.join(' ')}`));
    }

    if (description) {
      datas.push('\n');
      datas.push(pc.dim(this.CONF.i18n.package.commands.search.result.fields.description));
      datas.push(description);
    }

    datas.push('\n');
    datas.push(scores.final);
    datas.push('\n');
    datas.push(scores.quality);
    datas.push('\n');
    datas.push(scores.popularity);
    datas.push('\n');
    datas.push(scores.maintenance);

    if (authorName) {
      datas.push('\n');
      datas.push(pc.dim(this.CONF.i18n.package.commands.search.result.fields.author));
      datas.push(authorLink && _isStr(authorLink) ? this.createLink(authorName, authorLink) : authorName);
      authorEmail && datas.push(` (${authorEmail})`);
    }

    datas.push('\n\n');

    console.log(datas.join(''));
  }

  /**
   * 私有函数：包管理 > 搜索 > 分页 > 生成页码范围
   * @param {number} [maxPagesToShow = 10] 最大显示页码数量
   * @returns {number[]} 页码范围
   */
  private generatePageRange(maxPagesToShow: number = 10): number[] {
    let startPage: number, endPage: number;

    if (this.searchPageTotal <= maxPagesToShow) {
      startPage = 1;
      endPage = this.searchPageTotal;
    } else {
      const maxPagesBeforeCurrentPage = Math.floor(maxPagesToShow / 2);
      const maxPagesAfterCurrentPage = Math.ceil(maxPagesToShow / 2) - 1;

      if (this.searchPageCurrent <= maxPagesBeforeCurrentPage) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (this.searchPageCurrent + maxPagesAfterCurrentPage >= this.searchPageTotal) {
        startPage = this.searchPageTotal - maxPagesToShow + 1;
        endPage = this.searchPageTotal;
      } else {
        startPage = this.searchPageCurrent - maxPagesBeforeCurrentPage;
        endPage = startPage + maxPagesToShow - 1;
      }
    }

    return _range(startPage, endPage + 1);
  }

  /**
   * 私有函数：包管理 > 搜索 > 分页
   */
  private async searchPagination(): Promise<void> {
    if (this.searchPageTotal > 1) {
      let def: string | number = this.searchPageCurrent;
      const choices = [];

      /**
       * 如果当前页码大于 1，则存在 首页 和 上一页
       */
      choices.push({
        name: this.CONF.i18n.package.commands.search.pagination.first,
        value: 'first',
        disabled: this.searchPageCurrent === 1
      });

      choices.push({
        name: this.CONF.i18n.package.commands.search.pagination.prev,
        value: 'prev',
        disabled: this.searchPageCurrent === 1
      });
      choices.push(command.prompt.separator());

      /**
       * 页码
       */
      const pageRange = this.generatePageRange(this.CONF.i18n.package.commands.search.pagination.range ?? 10);
      pageRange.forEach((page: number) => {
        choices.push({
          name: convert.replacePlaceholders(this.CONF.i18n.package.commands.search.pagination.n, page),
          value: page,
          disabled: page === this.searchPageCurrent
        });
      });

      choices.push(command.prompt.separator());
      /**
       * 如果当前页码小于 总页码，则存在 下一页 和 尾页
       */
      choices.push({
        name: this.CONF.i18n.package.commands.search.pagination.next,
        value: 'next',
        disabled: this.searchPageCurrent >= this.searchPageTotal
      });

      choices.push({
        name: this.CONF.i18n.package.commands.search.pagination.last,
        value: 'last',
        disabled: this.searchPageCurrent >= this.searchPageTotal
      });
      choices.push(command.prompt.separator());

      /**
       * 跳转到指定页码
       */
      choices.push({
        name: this.CONF.i18n.package.commands.search.pagination.goto.jump,
        value: 'goto'
      });

      /**
       * 添加返回上级
       */
      this.addBack(choices, '==============');

      if (this.searchPageCurrent > 1) {
        def = 'next';
      } else if (this.searchPageCurrent < this.searchPageTotal) {
        def = 'prev';
      }

      const select = await command.prompt.select({
        message: convert.replacePlaceholders(
          this.CONF.i18n.package.commands.search.pagination.message,
          convert.formatNumberWithCommas(this.searchResultsTotal),
          this.searchPageSize,
          convert.formatNumberWithCommas(this.searchPageTotal),
          convert.formatNumberWithCommas(this.searchPageCurrent)
        ),
        choices,
        default: def
      });

      switch (select) {
        case 'prev':
          this.searchPageCurrent--;
          break;
        case 'next':
          this.searchPageCurrent++;
          break;
        case 'first':
          this.searchPageCurrent = 1;
          break;
        case 'last':
          this.searchPageCurrent = this.searchPageTotal;
          break;
        case 'goto':
          cs.clear.lastLine();
          this.searchPageCurrent = Number(
            await command.prompt.input({
              message: this.CONF.i18n.package.commands.search.pagination.goto.message,
              transformer(value: string, { isFinal }) {
                if (isFinal) {
                  return value.trim();
                }
                return value;
              },
              validate: (input: string) => {
                const pagenum = Number(input.trim());
                if (!isNaN(pagenum) && _isNumber(pagenum)) {
                  return true;
                } else {
                  return this.CONF.i18n.package.commands.search.pagination.goto.error;
                }
              }
            })
          );
          break;
        default:
          if (_isNumber(select)) {
            this.searchPageCurrent = select;
            break;
          }
      }

      select === '..' ? menuState.set('package') : await this.searchPackage();
    }
  }

  /**
   * 私有函数：包管理 > 登录
   * @param {string} type 包管理器类型
   * @param {string} code 命令代码
   * @returns {Promise<void>} 无返回值
   */
  private async login(type: string, code: string): Promise<void> {
    await this.cmd(type, [code]);
  }

  /**
   * 私有函数：包管理 > 发布
   * @param {string} type 包管理器类型
   * @param {string} code 命令代码
   * @returns {Promise<void>} 无返回值
   */
  private async publish(type: string, code: string): Promise<void> {
    await this.cmd(type, [code]);
  }
}

export default pm;
