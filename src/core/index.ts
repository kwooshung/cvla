import pc from 'picocolors';
import { config, param, console as cs } from '@/utils';
import header from '@/core/header';
import help from '@/core/help';
import init from '@/core/init';
import run from '@/core/run';

/**
 * 处理用户退出
 * @param {any} error 错误信息
 */
const handleUserExit = async (error: { status: string }) => error.status === 'ERR_UNHANDLED_REJECTION' && console.log(pc.green('Clvar：已退出（Exited）'));
process.on('uncaughtException', handleUserExit);

/**
 * 主函数
 * @returns {Promise<void>} 无返回值
 */
const main = async (): Promise<void> => {
  // 如果是 -v 或 -version 参数，则显示版本信息
  if (param.exists(['v', 'version'])) {
    header(true);
  } else {
    // 如果是 -h 或 -help 参数，则显示帮助信息
    if (param.exists(['h', 'help'])) {
      header();
      help();
    }
    // 如果是 -i 或 -init 参数，则初始化配置文件
    else if (param.exists(['i', 'init'])) {
      header();
      init(await config.load());
    }
    // 如果是 -r 或 -release 参数，则执行菜单
    else if (param.exists(['r', 'release'])) {
      run(await config.load(), true);
    }
    // 否则，执行菜单
    else {
      cs.clear.all();
      // 如果没有参数 或者 存在 -c 或 -config 参数，则加载配置并执行
      if (process.argv.length === 2 || param.exists(['c', 'config'])) {
        run(await config.load());
      } else {
        cs.error('未知的参数，请使用 -h 或 -help 查看帮助。', 'unknown parameters, please use -h or -help to read the instructions.');
      }
    }
  }
};

export default main;
