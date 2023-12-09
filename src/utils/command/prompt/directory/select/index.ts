import path from 'path';
import pc from 'picocolors';
import { command, console as cs, io } from '@/utils';

/**
 * 菜单式选择目录
 * @param {string} message 提示信息
 * @param {string} dir 目录
 * @returns {Promise<string>} 选择的目录
 */
const select = async (message: string, dir: string = '.', initialPath: string = ''): Promise<string> => {
  if (initialPath === '') {
    initialPath = path.resolve(dir);
  } else {
    cs.clear.lastLine();
  }

  const currentDir = path.resolve(dir); // 当前目录

  const list = [dir, ...(await io.getDir(dir, false, 'dir'))];

  const choices = [];
  for (const item of list) {
    const absolutePath = initialPath;
    const relativePath = path.relative(initialPath, item);
    choices.push({
      name: `${pc.gray(absolutePath)}${pc.bold(`${path.sep}${relativePath}${relativePath !== '' && item === list[0] ? path.sep : ''}`)}`, // 基础目录灰色，子路径加粗显示
      value: relativePath
    });
  }

  // 添加返回上一级的选项，如果不是在初始根目录
  if (currentDir !== initialPath) {
    choices.push({
      name: `${pc.gray(currentDir)}${pc.bold(`${path.sep}..`)}`,
      value: '..'
    });
  }

  choices.push(command.prompt.separator());

  let result = await command.prompt.select({
    message,
    choices
  });

  if (result) {
    const isback = result === '..';

    if (isback) {
      result = path.join(currentDir, '..');
    }

    if (isback || (result !== list[0] && list.length > 1)) {
      return select(message, result, initialPath);
    }
  }

  return `.${path.sep}${result}`;
};

export default select;
