import { TConfigVersion } from '@/interface';
import { command, version as _version } from '@/utils';
import { get } from '../../locales';

/**
 * 初始化 version
 * @returns {Promise<void>} 无返回值
 */
const version = async (): Promise<TConfigVersion> => {
  // 标题
  command.prompt.title(get('version.title'));

  let config: TConfigVersion = false;

  const versionManage = await command.prompt.select({
    message: get('version.message'),
    choices: [
      {
        name: get('enabled'),
        value: true,
        description: get('version.description')
      },
      {
        name: get('disabled'),
        value: false
      }
    ]
  });

  if (versionManage) {
    config = {
      validate: 'default',
      package: true
    };

    if (
      !(await command.prompt.select({
        message: get('version.validate.message'),
        choices: [
          {
            name: get('yes'),
            value: true,
            description: get('version.validate.description')
          },
          {
            name: get('no'),
            value: false
          }
        ]
      }))
    ) {
      // 是否输入新的规则
      config.validate = await command.prompt.input({
        message: get('version.validate.change.message'),
        default: 'default'
      });
    }

    config.package = await command.prompt.select({
      message: get('version.package.message'),
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
    });
  }

  return config;
};

export default version;
