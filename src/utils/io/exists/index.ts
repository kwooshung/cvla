import fs from 'fs';
import path from 'path';

/**
 * 检查单个路径是否存在。
 * @param {string} p 要检查的路径。
 * @returns {Promise<boolean>} 路径存在则返回 `true`，否则返回 `false`。
 */
const checkPathExists = async (p: string): Promise<boolean> => {
  try {
    await fs.promises.access(p, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * 检查指定路径的文件或文件夹是否存在。
 * @param {string | string[]} paths 要检查的路径，可以是单个路径字符串或路径字符串数组。
 * @returns {Promise<boolean>} 如果所有路径存在，则返回 `true`，否则返回 `false`。
 */
const exists = async (paths: string | string[]): Promise<boolean> => {
  const normalizedPaths = Array.isArray(paths) ? paths.map((p) => path.normalize(p)) : [path.normalize(paths)];
  const results = await Promise.all(normalizedPaths.map(checkPathExists));
  return results.every((result) => result);
};

export default exists;
