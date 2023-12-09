import { promises as fs } from 'fs';
import path from 'path';
import exists from '../exists';

/**
 * 创建指定路径的文件夹，支持创建多级文件夹。
 * @param {string} dir 要创建的文件夹路径。
 * @returns {Promise<boolean>} 如果创建成功，则返回 true；否则返回 false。
 */
const createDir = async (dir: string): Promise<boolean> => {
  dir = path.normalize(dir);

  // 判断是否是文件路径
  const isFilePath = path.extname(dir) !== '';

  // 获取目录所在的目录路径，如果是文件路径，则取其父目录，否则默认为当前目录
  await fs.mkdir(isFilePath ? path.dirname(dir) : dir, { recursive: true });
  return await exists(dir);
};

export default createDir;
