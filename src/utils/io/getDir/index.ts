import fs from 'fs/promises';
import path from 'path';

// 过滤类型
type FilterType = 'all' | 'file' | 'dir';

/**
 * 获取目录下的所有文件或目录
 * @param {string} dirPath 目录路径
 * @param {boolean} [includeSubDirs = false] 是否包含子目录
 * @param {FilterType} [filter = 'all'] 过滤类型
 * @returns {Promise<string[]>} 文件或目录路径数组
 */
const getDir = async (dirPath: string, includeSubDirs: boolean = false, filter: FilterType = 'all'): Promise<string[]> => {
  // 结果
  let results: string[] = [];

  // 读取目录
  const items = await fs.readdir(dirPath, { withFileTypes: true });

  // 遍历目录
  for (const item of items) {
    const fullPath = path.join(dirPath, item.name);

    // 判断是否为目录
    if (item.isDirectory()) {
      if (filter === 'dir' || filter === 'all') {
        results.push(fullPath);
      }

      // 判断是否包含子目录
      if (includeSubDirs) {
        const subDirContents = await getDir(fullPath, includeSubDirs, filter);
        results = results.concat(subDirContents);
      }
    }
    // 判断是否为文件
    else if (item.isFile() && (filter === 'file' || filter === 'all')) {
      results.push(fullPath);
    }
  }

  return results;
};

export default getDir;
