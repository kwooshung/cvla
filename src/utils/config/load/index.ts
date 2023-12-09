import { cosmiconfig } from 'cosmiconfig';
import { paramGet } from '@/utils/param';
import { IConfigResult } from '@/interface';

/**
 * 配置名称
 */
const confName = 'ks-cvlar';

/**
 * 基础，配置文件位置
 * @param {string} prefix 前缀
 * @param {string} [suffix = ''] 后缀
 */
const basePlaces = (prefix: string, suffix: string = '') => [
  `${prefix}${confName}${suffix}.js`,
  `${prefix}${confName}${suffix}.conf.js`,
  `${prefix}${confName}${suffix}.config.js`,
  `${prefix}${confName}${suffix}.mjs`,
  `${prefix}${confName}${suffix}.conf.mjs`,
  `${prefix}${confName}${suffix}.config.mjs`,
  `${prefix}${confName}${suffix}.cjs`,
  `${prefix}${confName}${suffix}.conf.cjs`,
  `${prefix}${confName}${suffix}.config.cjs`
];

/**
 * 搜索配置文件位置
 */
const searchPlaces = (() => {
  const comfigDir = `${paramGet(['cd', 'config-dir'])}/`;

  return [
    ...basePlaces(comfigDir),
    ...basePlaces(comfigDir, 'rc'),
    ...basePlaces(''),
    ...basePlaces('', 'rc'),
    ...basePlaces('.'),
    ...basePlaces('.', 'rc'),
    ...basePlaces('config/'),
    ...basePlaces('config/', 'rc'),
    ...basePlaces('.config/'),
    ...basePlaces('.config/', 'rc')
  ];
})();

/**
 * 配置文件名
 */
const filenames: string[] = [
  '.ks-cvlar',
  '.ks-cvlarrc',
  '.ks-cvlar.conf',
  '.ks-cvlarrc.conf',
  '.ks-cvlar.config',
  '.ks-cvlarrc.config',
  'ks-cvlar',
  'ks-cvlarrc',
  'ks-cvlar.conf',
  'ks-cvlarrc.conf',
  'ks-cvlar.config',
  'ks-cvlarrc.config'
];

/**
 * 加载配置文件
 * @returns {Promise<IConfigResult | false>} 配置文件
 */
const load = async (): Promise<IConfigResult | false> => {
  try {
    const conf = cosmiconfig(confName, { searchPlaces });
    const result = await conf.search();

    if (result === null) {
      return false;
    }
    return {
      config: result.config,
      path: result.filepath
    };
  } catch (e) {
    console.log(e);
    return false;
  }
};

export { filenames };
export default load;
