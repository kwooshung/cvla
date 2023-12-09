import fs from 'fs';
import { IPackageJson } from '@/interface';
import basepath from '../basepath';

/**
 * 写入 package.json 文件
 * @description 将 package.json 文件内容写入 package.json 文件
 * @returns {void} 无返回值
 */
const write = (values: IPackageJson): void => {
  const jsonContent = JSON.stringify(values.data, null, values.indentation);
  fs.writeFileSync(basepath, jsonContent);
};

export default write;
