import fs from 'fs';
import path from 'path';
import exists from '../exists';
import createDir from '../createDir';

/**
 * 将内容写入指定的文件。
 * @param {string} filePath 文件路径。
 * @param {string} content 要写入的内容。
 * @param {boolean} append 是否追加（默认为 false）。
 * @param {boolean} overwriteIfExists 如果文件已存在，是否覆盖（默认为 false）。
 * @returns {Promise<boolean>} 如果写入成功，则返回 true；否则返回 false。
 */
const write = async (filePath: string, content: string, append: boolean = false, overwriteIfExists: boolean = false): Promise<boolean> => {
  const absPath = path.normalize(filePath);

  // 获取目标文件夹路径
  const dirPath = path.dirname(absPath);

  // 创建目标文件夹，支持多层文件夹
  await createDir(dirPath);

  // 检查文件是否存在
  const fileExists = await exists(absPath);

  // 如果文件不存在，或者允许覆盖，则直接写入
  if (!fileExists || overwriteIfExists) {
    await fs.promises.writeFile(absPath, content, 'utf8');
  } else if (append) {
    // 如果文件存在且append为true，则在文件尾部追加
    await fs.promises.appendFile(absPath, content, 'utf8');
  } else {
    return false; // 文件已存在且不覆盖也不追加，则返回 false
  }

  return exists(absPath); // 写入成功，返回 true
};

export default write;
