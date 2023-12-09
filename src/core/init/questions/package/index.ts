import { isPlainObject as _isObj } from 'lodash-es';

import { IPackageJsonData, TConfigPackage, TPackageJsonData } from '@/interface';
import { command, registry, console as cs } from '@/utils';
import { get } from '../../locales';

const registryList = registry.list;

/**
 * 初始化 package
 * @param {TPackageJsonData} packjson package.json 数据
 * @returns {Promise<TConfigPackage>} package 配置
 */
const packageFn = async (packjson: TPackageJsonData): Promise<TConfigPackage> => {
  // 标题
  command.prompt.title(get('package.title'));

  let config: TConfigPackage = false; // 配置
  packjson = packjson as IPackageJsonData;

  if (
    await command.prompt.select({
      message: get('package.message'),
      choices: [
        {
          name: get('enabled'),
          value: true,
          description: get('package.description')
        },
        {
          name: get('disabled'),
          value: false
        }
      ]
    })
  ) {
    config = {
      scripts: {},
      manager: {
        type: 'auto',
        registry: '',
        commands: {}
      }
    };

    // 数据存在
    if (_isObj(packjson)) {
      // 读取 package.json
      if (packjson.scripts) {
        // 读取 scripts
        const scripts = Object.keys(packjson.scripts);
        const choices = [];

        for (const script of scripts) {
          // 过滤掉自己：cvlar
          if (script.includes('cvlar')) continue;
          choices.push({ name: script, value: script, checked: true });
        }

        // 选择需要接管的 scripts
        const selectScripts = await command.prompt.checkbox({
          message: get('package.scripts.select.message'),
          choices,
          instructions: get('checkbox.instructions'),
          validate: (items: any): boolean | string | Promise<string | boolean> => {
            if (items.length === 0) {
              return get('package.scripts.select.error');
            }

            return true;
          }
        });

        // 将选择的 scripts 添加到配置中
        for (const script of selectScripts) {
          config.scripts[script] = script;
        }

        // 如果启用包管理
        if (
          await command.prompt.select({
            message: get('package.manager.message'),
            choices: [
              {
                name: get('enabled'),
                value: true
              },
              {
                name: get('disabled'),
                value: false
              }
            ]
          })
        ) {
          // 包管理器类型
          config.manager.type = await command.prompt.select({
            message: get('package.manager.type.message'),
            choices: [
              {
                name: 'npm',
                value: 'npm'
              },
              {
                name: 'yarn',
                value: 'yarn'
              },
              {
                name: 'pnpm',
                value: 'pnpm'
              }
            ],
            default: config.manager.type
          });

          // 依赖源选项
          const registryChoices = [];

          registryChoices.push({
            name: get('package.manager.registry.auto.message'),
            value: 'auto',
            description: get('package.manager.registry.auto.description')
          });

          // 依赖源，列出所有源
          for (const registry of registryList) {
            registryChoices.push({
              name: `${registry.name} (${registry.value})`,
              value: registry.value,
              discription: get('package.manager.registry.description')
            });
          }

          config.manager.registry = await command.prompt.select({
            message: get('package.manager.registry.message'),
            choices: registryChoices
          });

          config.manager.commands = {
            install: get('package.manager.commands.install'),
            update: get('package.manager.commands.update'),
            uninstall: get('package.manager.commands.uninstall'),
            outdated: get('package.manager.commands.outdated'),
            list: get('package.manager.commands.list'),
            info: get('package.manager.commands.info'),
            search: get('package.manager.commands.search'),
            login: get('package.manager.commands.login'),
            publish: get('package.manager.commands.publish')
          };
        }
      } else {
        cs.error('未检测到 scripts 字段。', 'No scripts field detected.');
      }
    } else {
      cs.error('未检测到 package.json 文件。', 'No package.json file detected.');
    }
  }

  return config;
};

export default packageFn;
