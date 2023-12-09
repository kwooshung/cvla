import { mergeWith as _mw, isPlainObject as _isObj, isBoolean as _isBool, isString as _isStr, isRegExp as _isRegExp, isUndefined as _isUnd } from 'lodash-es';
import { IConfig, TpackageManagerCommands } from '@/interface';

type TCustomizer = object | string | boolean | 'default';

/**
 * 移除值为 false 的字段
 * @param {any} obj 对象
 * @returns {any} 处理后的对象
 */
const removeFalse = (obj: any): any => {
  Object.keys(obj).forEach((key) => {
    if (_isBool(obj[key]) && !obj[key]) {
      delete obj[key]; // 删除值为 false 的字段
    } else if (_isObj(obj[key])) {
      obj[key] = removeFalse(obj[key]); // 递归处理嵌套对象
    }
  });
  return obj;
};

/**
 * 按照最终的配置的顺序对用户配置和默认配置进行排序
 * @param {IConfig} final 最终的配置
 * @param {TpackageManagerCommands} userCmds 用户命令
 * @param {TpackageManagerCommands} defCmds 默认命令
 * @returns {any} 排序后的配置
 */
const sortPackageCommands = (final: IConfig, userCmds: TpackageManagerCommands, defCmds: TpackageManagerCommands): any => {
  if (!_isBool(userCmds) && _isObj(defCmds)) {
    final.package['manager'].commands = userCmds === 'default' || _isUnd(userCmds) ? defCmds : userCmds;
  }

  return final;
};

/**
 * 自定义合并逻辑
 * @param {TCustomizer} def 默认配置
 * @param {TCustomizer} user 用户配置
 * @returns {TCustomizer} 合并后的配置
 */
const customizer = (def: TCustomizer, user: TCustomizer): TCustomizer => {
  if (_isBool(user) && !user) {
    return; // 忽略此字段
  }

  if (user === 'default' || _isUnd(user)) {
    return def;
  }

  if (_isStr(user)) {
    return user;
  }

  // 检查是否为正则表达式，如果是，则直接返回
  if (_isRegExp(user)) {
    return user;
  }

  if (_isObj(user)) {
    return _mw({}, def, user, customizer);
  }

  return user;
};

/**
 * 获取 conf.package.manager.commands 命令
 * @param {IConfig} conf 配置
 * @returns {TpackageManagerCommands} 命令
 */
const getCommands = (conf: IConfig): TpackageManagerCommands => {
  let cmd: TpackageManagerCommands = undefined;

  if (_isObj(conf) && _isObj(conf.package) && _isObj(conf.package['manager'])) {
    if (_isStr(conf.package['manager'].commands) && conf.package['manager'].commands === 'default') {
      cmd = 'default';
    } else if (_isObj(conf.package['manager'].commands)) {
      cmd = conf.package['manager'].commands;
    }
  }

  return cmd;
};

/**
 * 合并配置
 * @param {IConfig} def 默认配置
 * @param {IConfig} user 用户配置
 * @returns {IConfig} 合并后的配置
 */
const merge = (def: IConfig, user: IConfig): IConfig => sortPackageCommands(removeFalse(_mw({}, def, user, customizer)), getCommands(user), getCommands(def));

export default merge;
