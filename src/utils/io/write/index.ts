import fs from 'fs';
import path from 'path';
import exists from '../exists';
import createDir from '../createDir';

/**
 * 将内容写入指定的文件。
 * @param {string} filePath 文件路径。
 * @param {string} content 要写入的内容。
 * @param {boolean} overwriteIfExists 如果文件已存在，是否覆盖（默认为 false）。
 * @returns {Promise<boolean>} 如果写入成功，则返回 true；否则返回 false。
 */
const write = async (filePath: string, content: string, overwriteIfExists: boolean = false): Promise<boolean> => {
  const absPath = path.normalize(filePath);

  // 如果文件已存在且不允许覆盖，则返回 false
  if ((await exists(absPath)) && !overwriteIfExists) {
    return false;
  }

  // 获取目标文件夹路径
  const dirPath = path.dirname(absPath);

  // 创建目标文件夹，支持多层文件夹
  await createDir(dirPath);

  // 写入文件内容
  await fs.promises.writeFile(absPath, content, 'utf8');

  return exists(absPath); // 写入成功，返回 true
};

export default write;
