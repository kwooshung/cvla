import child_process from 'child_process';
import util from 'util';
import iconv from 'iconv-lite';

// 将 child_process.exec 转换为 Promise 形式
const execPromise = util.promisify(child_process.exec);

/**
 * 执行命令
 * @description 执行命令并返回结果，如果命令执行失败则退出进程
 * @param {string} command 要执行的命令
 * @param {string} encoding 编码
 * @returns {Promise<{ stdout: string; stderr: string }>} 命令执行结果
 */
const execute = async (command: string, encoding: string = 'gbk'): Promise<{ stdout: string; stderr: string }> => {
  try {
    const { stdout, stderr } = await execPromise(command, { encoding: 'buffer' });

    return {
      stdout: iconv.decode(stdout, encoding),
      stderr: iconv.decode(stderr, encoding)
    };
  } catch (e) {
    throw iconv.decode(e.stderr, encoding);
  }
};

export default execute;
