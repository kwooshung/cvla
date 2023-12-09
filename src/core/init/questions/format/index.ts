import { TPackageJsonData } from '@/interface';
import { command } from '@/utils';

/**
 * 格式化指定的文件或目录
 * @param config 项目的 package.json 配置数据
 * @param files 要格式化的文件或目录路径（字符串或字符串数组）
 */
const format = (config: TPackageJsonData, files: string | string[]) => {
  try {
    // 将单个文件路径转换为数组，以统一处理
    const filePaths = Array.isArray(files) ? files : [files];
    // 将文件路径数组转换为空格分隔的字符串
    const filesString = `"${filePaths.join('" "')}"`;

    if (config !== false && config !== 'default') {
      if (config?.dependencies?.eslint || config?.devDependencies?.eslint || config?.peerDependencies?.eslint) {
        command.execute(`npx eslint ${filesString} --fix`);
      }

      if (config?.dependencies?.prettier || config?.devDependencies?.prettier || config?.peerDependencies?.prettier) {
        command.execute(`npx prettier --write ${filesString}`);
      }
    }
  } catch (e) {
    console.error(e);
  }
};

export default format;
