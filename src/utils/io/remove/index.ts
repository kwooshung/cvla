import fs from 'fs/promises';
import path from 'path';

/**
 * 递归删除指定路径的文件或文件夹及其内容。
 * @param {string} dir 要删除的文件或文件夹路径。
 * @param {boolean} [includeSubDirs = true] 是否包含子文件夹。
 * @returns {Promise<boolean>} 如果删除成功，则返回 true；否则返回 false。
 */
const remove = async (dir: string, includeSubDirs: boolean = true): Promise<boolean> => {
  try {
    const normalizedDir = path.normalize(dir);
    const stat = await fs.stat(normalizedDir);

    if (stat.isDirectory()) {
      const files = await fs.readdir(normalizedDir);

      for (const file of files) {
        const curPath = path.join(normalizedDir, file);
        const curStat = await fs.stat(curPath);

        if (curStat.isDirectory() && includeSubDirs) {
          await remove(curPath, includeSubDirs);
        } else if (curStat.isFile()) {
          await fs.unlink(curPath);
        }
      }

      await fs.rmdir(normalizedDir);
    } else if (stat.isFile()) {
      await fs.unlink(normalizedDir);
      return true;
    }

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export default remove;
