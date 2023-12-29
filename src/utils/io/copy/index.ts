import fs from 'fs/promises';
import path from 'path';
import createDir from '../createDir';

/**
 * 复制文件到新位置。
 * @param {string} source 源文件路径。
 * @param {string} target 目标文件路径。
 * @returns {Promise<boolean>} 如果复制成功，则返回 true；否则返回 false。
 */
const copy = async (source: string, target: string): Promise<boolean> => {
  try {
    const normalizedSource = path.normalize(source);
    const normalizedTarget = path.normalize(target);
    await createDir(normalizedTarget);

    // 检查源文件和目标文件是否相同
    if (normalizedSource !== normalizedTarget) {
      await fs.copyFile(normalizedSource, normalizedTarget, fs.constants.COPYFILE_EXCL);
    }

    return true;
  } catch {
    return false;
  }
};

export default copy;
