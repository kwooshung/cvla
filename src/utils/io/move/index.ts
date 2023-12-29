import path from 'path';
import remove from '../remove';
import copy from '../copy';

/**
 * 移动文件或目录到新位置。
 * @param {string} source 源文件或目录路径。
 * @param {string} target 目标文件或目录路径。
 * @returns {Promise<boolean>} 如果移动成功，则返回 true；否则返回 false。
 */
const move = async (source: string, target: string): Promise<boolean> => {
  try {
    const normalizedSource = path.normalize(source);
    const normalizedTarget = path.normalize(target);

    if (await copy(normalizedSource, normalizedTarget)) {
      return await remove(normalizedSource);
    }

    return false;
  } catch {
    return false;
  }
};

export default move;
