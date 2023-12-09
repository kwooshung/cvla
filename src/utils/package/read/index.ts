import fs from 'fs';
import detectIndent from 'detect-indent';
import { IPackageJson } from '@/interface';
import basepath from '../basepath';

/**
 * 读取 package.json 文件
 * @description 读取 package.json 文件内容，并返回 package.json 文件内容 和 缩进
 * @returns {object} package.json 文件内容
 */
const read = (): IPackageJson => {
  const content = fs.readFileSync(basepath, 'utf-8');

  if (content) {
    return {
      data: JSON.parse(content),
      indentation: detectIndent(content).indent
    };
  }

  return {
    data: false,
    indentation: '  '
  };
};

export default read;
