import { isPlainObject as _isObj, isString as _isStr } from 'lodash-es';
import { IConfig } from '@/interface';
import { command, console as cs } from '@/utils';
import menuState from '../_state';

/**
 * 类：调用并执行脚本
 */
class scripts {
  /**
   * 私有属性：单例对象
   */
  private static instance: scripts;

  /**
   * 私有属性：配置信息
   */
  private CONF: IConfig;

  /**
   * 私有函数：返回
   * @param {any[]} choices 选项
   * @param {string} [sep = ''] 分隔符
   */
  private addBack: (choices: any[], sep?: string) => void;

  /**
   * 私有函数：命令
   */
  private cmd: (type: string, args: string[]) => Promise<void>;

  /**
   * 构造函数
   * @param {IConfig} conf 配置信息
   * @param {Function} addBack 添加返回菜单
   * @param {Function} cmd 命令
   */
  private constructor(conf: IConfig, addBack: (choices: any[], sep?: string) => void, cmd: (type: string, args: string[]) => Promise<void>) {
    this.CONF = conf;
    this.addBack = addBack;
    this.cmd = cmd;
  }

  /**
   * 提供一个静态方法用于获取类的实例
   * @param {IConfig} conf 配置信息
   * @param {Function} addBack 添加返回菜单
   * @param {Function} cmd 命令
   */
  public static getInstance(conf: IConfig, addBack: (choices: any[], sep?: string) => void, cmd: (type: string, args: string[]) => Promise<void>): scripts {
    return scripts.instance ?? new scripts(conf, addBack, cmd);
  }

  /**
   * 私有函数：脚本 > 选择
   * @returns {void} 无返回值
   */
  public async select(): Promise<void> {
    cs.clear.lastLine();

    const choices = [];

    // 遍历 package.scripts
    for (const key in this.CONF.package['scripts']) {
      if (Object.prototype.hasOwnProperty.call(this.CONF.package['scripts'], key)) {
        const val = this.CONF.package['scripts'][key];

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

    await this.run(
      await command.prompt.select({
        message: this.CONF.i18n.scripts.select.message,
        choices
      })
    );
  }

  /**
   * 私有函数：脚本 > 运行
   * @param {string} code 脚本代码
   * @returns {void} 无返回值
   */
  private async run(code: string): Promise<void> {
    cs.clear.lastLine();

    if (code === '..') {
      menuState.set('main');
    } else {
      this.CONF.package['manage'];

      // 如果 配置中 存在 package.manager，则显示 package 管理
      if (_isObj(this.CONF.package['manager'])) {
        menuState.set('exit');
        await this.cmd(this.CONF.package['manager'].type, ['run', code]);
      }
    }
  }
}

export default scripts;
