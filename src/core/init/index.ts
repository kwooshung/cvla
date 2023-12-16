import { isBoolean as _isBool } from 'lodash-es';

import { IConfigResult } from '@/interface';
import { package as packdata } from '@/utils';
import { basic, commit, package as _package, version, changelog, save } from './questions';

/**
 * 初始化
 * @param {IConfigResult | false} conf 配置文件
 * @returns {Promise<void>} 无返回值
 */
const init = async (conf: IConfigResult | false): Promise<void> => {
  // 配置：基础
  const configBase = await basic(conf);

  if (!_isBool(configBase)) {
    // 读取 package.json
    const packjson = packdata.read();

    // 配置：commit
    const configCommit = await commit(configBase);

    // 配置：package
    const configPackage = await _package(packjson.data);

    // 配置：version
    const configVersion = await version();

    // 配置：changelog
    const configChangelog = await changelog(configCommit, packjson.data);

    // 保存配置
    await save(configBase, configCommit, configPackage, configVersion, configChangelog, packjson.indentation, packjson.data, _isBool(conf) ? '' : conf.path);
  }
};

export default init;
