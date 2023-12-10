import { spawn } from 'child_process';
import pc from 'picocolors';

import { isBoolean as _isBool, isPlainObject as _isObj } from 'lodash-es';
import { IConfig, IConfigResult, IPackageJson, TMenuType } from '@/interface';
import { config, command, console as cs } from '@/utils';

import header from '@/core/header';
import menuState from './_state';
import scripts from './scripts';
import pm from './pm';
import gitControl from './gitControl';
import help from '@/core/help';

/**
 * 类：提问
 */
class questions {
  /**
   * 私有属性：配置信息
   */
  private CONF: IConfig;

  /**
   * 私有属性：package.json
   */
  private PACK: IPackageJson;

  /**
   * 构造函数
   * @param {IConfigResult | false} conf 配置文件
   */
  constructor(conf: IConfigResult | false) {
    // 如果传入配置
    if (!_isBool(conf) && _isObj(conf)) {
      this.CONF = config.merge(config.def.user, conf.config);
    }
    // 否则，表示没有传入配置，使用默认配置
    else {
      this.CONF = config.def.user;
    }
  }

  /**
   * 公开函数：初始化
   * @returns {Promise<void>} 无返回值
   */
  public async init(): Promise<void> {
    await this.menu();
  }

  /**
   * 私有函数：菜单
   * @returns {Promise<void>} 无返回值
   */
  private async menu(): Promise<void> {
    const choices = [];

    // 如果 配置中 存在 package.scripts，并且是对象，则显示脚本执行
    if (_isObj(this.CONF.package) && _isObj(this.CONF.package['scripts'])) {
      choices.push({
        name: this.CONF.i18n.scripts.message,
        value: 'scripts',
        description: this.CONF.i18n.scripts.description
      });
    }

    // 如果 配置中 存在 commit，并且是对象，则显示版本控制
    if (_isObj(this.CONF.commit)) {
      choices.push({
        name: this.CONF.i18n.git.message,
        value: 'git',
        description: this.CONF.i18n.git.description
      });
    }

    // 如果 配置中 存在 package，并且是对象，则显示 package 管理
    if (_isObj(this.CONF.package) && _isObj(this.CONF.package['manager'])) {
      choices.push({
        name: this.CONF.i18n.package.message,
        value: 'package',
        description: this.CONF.i18n.package.description
      });
    }

    // 如果 配置中 存在 changelog，并且是对象，则显示 changelog
    if (_isObj(this.CONF.changelog)) {
      choices.push({
        name: this.CONF.i18n.changelog.message,
        value: 'changelog',
        description: this.CONF.i18n.changelog.description
      });
    }

    // 如果 配置中 存在 help，并且是对象，则显示 help
    if (_isObj(this.CONF.i18n.help)) {
      choices.push({
        name: this.CONF.i18n.help.message,
        value: 'help',
        description: this.CONF.i18n.help.description
      });
    }

    choices.push({
      name: this.CONF.i18n.exit.message,
      value: 'exit'
    });

    const mainMenuConf = {
      message: this.CONF.i18n.select,
      choices
    };

    let state: TMenuType = 'main';

    while (state !== 'exit') {
      cs.clear.lastLine();
      state = menuState.get();

      switch (state) {
        case 'main':
          state = await command.prompt.select(mainMenuConf);
          menuState.set(state);
          break;
        case 'scripts':
          await scripts.getInstance(this.CONF, this.addBack, this.cmd).select();
          break;
        case 'git':
          await gitControl.getInstance(this.CONF, this.addBack, this.cmd).select();
          break;
        case 'package':
          await pm.getInstance(this.CONF, this.addBack, this.cmd).select();
          break;
        case 'changelog':
          await this.changelog();
          break;
        default:
          await this.help();
          break;
      }
    }
  }

  /**
   * 私有函数：命令
   * @param {string} code 命令代码
   * @param {string[]} args 命令参数
   * @param {string} commandPrint 命令输出替代代码
   * @returns {void} 无返回值
   */
  private cmd(code: string, args: string[], commandPrint?: string): Promise<void> {
    let command = `${pc.bold(pc.cyan(`${code} ${args.join(' ')}`))}\n`;

    console.log(`\n${pc.magenta('▶')} ${pc.cyan('runing: ')}${commandPrint ?? command}`);

    return new Promise((resolve, reject) => {
      const spawnedProcess = spawn(code, args, {
        stdio: 'inherit', // 这会将子进程的输出直接连接到当前进程
        shell: true // 使用系统的 shell 执行命令
      });

      // 命令代码
      command = `${pc.cyan('command: ')}${commandPrint ?? command}`;

      // 进程关闭时
      spawnedProcess.on('close', (code) => {
        if (code === 0) {
          console.log(`\n${pc.green('✔')} ${command}`);
          resolve();
        } else {
          console.log(`\n${pc.red('✖')} ${command}`);
          cs.error(`命令执行失败，退出码：${code}`, `Command execution failed, exit code: ${code}`);
          reject();
        }
      });
    });
  }

  /**
   * 私有函数：帮助
   * @returns {void} 无返回值
   */
  private async help(): Promise<void> {
    header();
    help();
    console.log('\n\n');
    menuState.set('main');
  }

  /**
   * 私有函数：给选择器添加返回上一级
   * @param {any[]} choices 选择器
   * @param {string} sep 分隔符
   * @returns {void} 无返回值
   */
  private addBack(choices: any[], sep?: string): void {
    choices.push({
      name: this.CONF.i18n.back.message,
      value: '..',
      description: this.CONF.i18n.back.description
    });
    choices.push(command.prompt.separator(sep));
  }

  /**
   * 私有函数：changelog
   * @returns {void} 无返回值
   */
  private async changelog(): Promise<void> {}
}

export default questions;
