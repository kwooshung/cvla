import pc from 'picocolors';
import { isUndefined as _isUn, isArray as _isArr } from 'lodash-es';
import { IResultConfigCommit, TConfigRelease } from '@/interface';
import { command } from '@/utils';
import { get } from '../../locales';

/**
 * 初始化 发布
 * @param {IResultConfigCommit} configCommit commit 配置
 * @returns {Promise<TConfigRelease>} release 配置
 */
const release = async (configCommit: IResultConfigCommit): Promise<TConfigRelease> => {
  // 标题
  command.prompt.title(get('release.title'));

  let config: TConfigRelease = false;

  if (
    await command.prompt.select({
      message: get('release.message'),
      choices: [
        {
          name: get('enabled'),
          value: true,
          description: get('release.description')
        },
        {
          name: get('disabled'),
          value: false
        }
      ]
    })
  ) {
    config = {
      subject: '🎉 {{tag}}',
      pushTagMessage: {
        type: 'release',
        scope: 'tag',
        subject: '{{tag}}'
      },
      poweredby: true
    };

    // 发布页面，tag版本标题模板
    config.subject = await command.prompt.input({
      message: get('release.subject.message'),
      default: config.subject
    });

    // 给仓库创建tag时，会自动生成日志，此时tag是不会包含新的日志的，因此需要提交这些变化的文件到仓库。是否设置对应配置项？
    if (
      await command.prompt.select({
        message: get('release.pushTagMessage.message'),
        choices: [
          {
            name: get('yes'),
            value: true,
            description: get('release.pushTagMessage.description.yes')
          },
          {
            name: get('no'),
            value: false,
            description: get('release.pushTagMessage.description.no')
          }
        ]
      })
    ) {
      if (_isArr(configCommit.config['types'])) {
        const typesChoices = [];

        for (const val of configCommit.config['types']) {
          typesChoices.push({
            name: `${pc.bold(val.name)}     ${pc.dim(val.description)}`,
            value: val.name,
            description: pc.green(`${!_isUn(val.emoji) ? val.emoji : ''}  ${pc.bold(val.name)} ${val.description}`),
            descriptionDim: false
          });
        }

        // 选择提交类型
        config.pushTagMessage.type = await command.prompt.select({
          message: get('release.pushTagMessage.type.message'),
          choices: typesChoices
        });
      }

      if (_isArr(configCommit.config['scopes'])) {
        const scopesChoices = [];

        let emoji = '';

        for (const val of configCommit.config['types']) {
          if (val.name === config.pushTagMessage.type) {
            emoji = val.emoji;
            break;
          }
        }

        for (const val of configCommit.config['scopes']) {
          scopesChoices.push({
            name: `${pc.bold(val.name)}     ${pc.dim(val.description)}`,
            value: val.name,
            description: pc.green(`${pc.dim(`${emoji}${config.pushTagMessage.type}`)}(${val.name})`),
            descriptionDim: false
          });
        }

        // 选择提交范围
        config.pushTagMessage.scope = await command.prompt.select({
          message: get('release.pushTagMessage.scope.message'),
          choices: scopesChoices
        });
      }

      // 输入提交标题，可用 `tag` 变量
      config.pushTagMessage.subject = await command.prompt.input({
        message: get('release.pushTagMessage.subject.message'),
        default: '{{tag}}'
      });
    }

    // 通过 Github Acitons 自动发布后，将在最后显示项目链接，同时连接到所有 日志
    config.poweredby = await command.prompt.select({
      message: get('release.poweredby.message'),
      choices: [
        {
          name: get('yes'),
          value: true,
          description: get('changelog.poweredby.description')
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

export default release;
