import path from 'path';
import pc from 'picocolors';
import { isBoolean as _isBool, isString as _isString, isArray as _isArray, isPlainObject as _isObj } from 'lodash-es';
import { IConfig, IResultConfigBase, IResultConfigCommit, TConfigChangelog, TConfigPackage, TConfigRelease, TConfigVersion, TPackageJsonData } from '@/interface';
import { command, io } from '@/utils';
import { filenames } from '@/utils/config/load';
import { get } from '../../locales';
import { list, serialize } from './comment';
import i18nConfig from '../i18n';
import format from '../format';

// 需要格式化的文件
const formatDirs: string[] = [];

/**
 * 计算第一个文件相对于第二个文件的相对路径，并确保格式适合 TypeScript 导入
 * @param firstFilePath 第一个文件路径
 * @param secondFilePath 第二个文件路径
 * @returns {string} 第一个文件相对于第二个文件的处理后的相对路径
 */
const calculateRelativePath = (firstFilePath: string, secondFilePath: string): string => {
  // 将两个路径转换为绝对路径
  const absoluteFirstPath = path.resolve(firstFilePath);
  const absoluteSecondPath = path.resolve(secondFilePath);

  // 确定第二个路径是文件还是目录
  const secondPathIsDirectory = secondFilePath.endsWith('/');

  // 计算相对路径
  let relativePath = secondPathIsDirectory ? path.relative(absoluteSecondPath, absoluteFirstPath) : path.relative(path.dirname(absoluteSecondPath), absoluteFirstPath);

  // 处理特殊情况，确保输出为 './'
  relativePath === '' && (relativePath = './');

  // 将路径标准化为 POSIX 风格，并确保以 '/' 结尾
  relativePath = path.posix.normalize(relativePath).replace(/\\/g, '/');
  !relativePath.endsWith('/') && (relativePath = `${relativePath}/`);

  // 如果路径不是以 './', '../', 或 '/' 开头的，则添加 './'
  if (!relativePath.startsWith('./') && !relativePath.startsWith('../') && !relativePath.startsWith('/')) {
    relativePath = `./${relativePath}`;
  }

  return relativePath;
};

/**
 * 生成配置
 * @param {string} saveDir 完整的配置文件保存路径
 * @param {IResultConfigBase} base base 配置
 * @param {IResultConfigCommit} commit commit 配置
 * @param {TConfigPackage} pack package 配置
 * @param {TConfigVersion} version version 配置
 * @param {TConfigChangelog} changelog changelog 配置
 * @param {string} indentation 缩进
 * @returns {Promise<boolean>} 是否保存成功
 */
const build = async (
  saveDir: string,
  base: IResultConfigBase,
  commit: IResultConfigCommit,
  pack: TConfigPackage,
  version: TConfigVersion,
  changelog: TConfigChangelog,
  release: TConfigRelease,
  indentation: string
): Promise<string> => {
  // 计算相对路径
  const fileRelativePath = calculateRelativePath(commit.saveDir, saveDir);

  // 配置代码
  const code = [];

  // 如果是独立模式
  if (commit.standalone) {
    commit.saveDir = commit.saveDir.replace('.\\', '');

    // 设置需要格式化的文件
    const rootPath = calculateRelativePath(commit.saveDir, './');
    formatDirs.push(`${rootPath}ks-cvlar.types.${base.extension}`);
    formatDirs.push(`${rootPath}ks-cvlar.scopes.${base.extension}`);

    // 如果规范是默认值 或是 标准规范（ESM 规范）
    if ((_isString(base.standard) && base.standard === 'default') || (_isBool(base.standard) && base.standard)) {
      code.push(`import cvlarTypes from '${`${fileRelativePath}ks-cvlar.types.${base.extension}`}';\n`);

      _isObj(commit.config) && _isArray(commit.config['scopes']) && code.push(`import cvlarScopes from '${`${fileRelativePath}ks-cvlar.scopes.${base.extension}`}';\n`);
    }
    // 否则就不是通用规范，即 CommonJS(CJS) 规范
    else {
      const ext = base.extension === 'cjs' ? '.cjs' : '';
      code.push(`const cvlarTypes = require('${`${fileRelativePath}ks-cvlar.types${ext}`}');\n`);

      _isObj(commit.config) && _isArray(commit.config['scopes']) && code.push(`const cvlarScopes = require('${`${fileRelativePath}ks-cvlar.scopes${ext}`}');\n`);
    }

    // 如果 commit.config 是 普通的 object
    if (_isObj(commit.config)) {
      // 如果 commit.config.types 是 array
      _isArray(commit.config['types']) && (commit.config['types'] = '$TcvlarTypesT$');
      // 如果 commit.config.scopes 是 array
      _isArray(commit.config['scopes']) && (commit.config['scopes'] = '$TcvlarScopesT$');
    }
  }

  // 合并成配置对象
  const config: IConfig = {
    commit: commit.config,
    package: pack,
    version,
    changelog,
    release,
    i18n: i18nConfig[base.lang.code]
  };

  // 配置注释，根据语言
  const comments = list[base.lang.code];

  code.push('\n/**\n');
  code.push(` * ${comments['common'][0]}\n`);
  code.push(` * ${comments['common'][1]}\n`);
  code.push(` * ${comments['common'][2]}\n`);
  code.push(` */\n`);

  // 导出配置
  code.push('export default ');

  // 序列化配置，增加注释说明
  code.push(serialize(config, comments, indentation));

  return code.join('');
};

/**
 * 保存配置
 * @param {IResultConfigBase} base base 配置
 * @param {IResultConfigCommit} commit commit 配置
 * @param {TConfigPackage} pack package 配置
 * @param {TConfigVersion} version version 配置
 * @param {TConfigChangelog} changelog changelog 配置
 * @param {string} indentation 缩进
 * @param {TPackageJsonData} packjson package.json 配置数据
 * @param {string} saveDir 保存目录
 * @returns {Promise<boolean>} 是否保存成功
 */
const save = async (
  base: IResultConfigBase,
  commit: IResultConfigCommit,
  pack: TConfigPackage,
  version: TConfigVersion,
  changelog: TConfigChangelog,
  release: TConfigRelease,
  indentation: string,
  packjson: TPackageJsonData,
  saveDir: string
): Promise<boolean> => {
  // 标题
  command.prompt.title(get('save.title'));

  // 如果 saveDir 不存在，或 不是覆盖模式，需要提问，配置文件保存到哪里
  if (!(saveDir || base.overwrite)) {
    // 保存配置的路径，如果是覆盖模式，则直接使用 saveDir，否则需要选择
    saveDir = base.overwrite ? saveDir : await command.prompt.directory.select(get('save.message'));

    // 如果选择了路径，则询问文件名称
    const fileNameChoices: any = filenames.map((item) => {
      item = `${item}.${base.extension}`;
      return { name: item, value: item };
    });
    fileNameChoices.push(command.prompt.separator());

    const filename: string = await command.prompt.select({
      message: get('save.filename.message'),
      choices: fileNameChoices,
      default: filenames[0]
    });

    saveDir = path.join(saveDir, filename);
  }

  // 设置需要格式化的文件
  formatDirs.push(path.posix.normalize(saveDir).replace(/\\/g, '/'));

  // 生成配置内容
  const content = (await build(saveDir, base, commit, pack, version, changelog, release, indentation)).replace(/['"]?\$T(.*?)T\$['"]?/g, '$1');

  // 保存失败次数
  let failCount = 0;
  // 最大失败次数
  const failCountMax = 3;
  // 保存结果
  let saveSuccess = true;

  // 保存配置文件
  // eslint-disable-next-line no-constant-condition
  while (true) {
    saveSuccess = await io.write(saveDir, content, true);

    if (!saveSuccess && failCount < failCountMax) {
      if (
        command.prompt.select({
          message: get('save.fail.message', `${failCount++}`, `${failCountMax}`),
          choices: [
            {
              name: get('yes'),
              value: true
            },
            {
              name: get('no'),
              value: false
            }
          ]
        })
      ) {
        continue;
      }
    }
    break;
  }

  if (saveSuccess) {
    format(packjson, formatDirs);
    console.log(get('save.success.message', pc.blue(saveDir)));
  } else {
    console.log(get('save.fail.finally', pc.blue(saveDir), pc.green(content)));
  }

  // 保存结果
  return saveSuccess;
};

export default save;
