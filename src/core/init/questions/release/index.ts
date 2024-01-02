import pc from 'picocolors';
import { isArray as _isArr } from 'lodash-es';
import { IResultConfigCommit, TConfigRelease } from '@/interface';
import { command } from '@/utils';
import { get } from '../../locales';

/**
 * 对字符串数组进行对齐。
 * 计算数组中字符串的最大长度，并为每个字符串添加足够的空格以对齐。
 * @param {string[]} arr 字符串数组。
 * @returns {string[]} 对齐后的字符串数组。
 */
const alignStrings = (arr: string[]): string[] => {
  const maxLength = Math.max(...arr.map((str) => str.length));
  return arr.map((str) => str + ' '.repeat(maxLength - str.length));
};

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
      lang: {
        subject: '## 🌐 {{name}}({{code}})',
        separator: '\n\n'
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
        const choices = [];

        let aligns: string[] = [];
        for (const val of configCommit.config['types']) {
          const align = [];
          align.push(val.name);
          aligns.push(align.join(''));
        }

        aligns = alignStrings(aligns);

        for (const [index, val] of aligns.entries()) {
          const item = configCommit.config['types'][index];
          choices.push({
            name: `${pc.bold(val)}     ${pc.dim(item.description)}`,
            value: item.name,
            description: pc.green(`${item.emoji}  ${pc.bold(item.name)} ${item.description}`),
            descriptionDim: false
          });
        }

        choices.push(command.prompt.separator());

        // 选择提交类型
        config.pushTagMessage.type = await command.prompt.select({
          message: get('release.pushTagMessage.type.message'),
          choices: choices
        });
      }

      if (_isArr(configCommit.config['scopes'])) {
        let emoji = '';
        const choices = [];
        let aligns: string[] = [];

        for (const val of configCommit.config['types']) {
          if (val.name === config.pushTagMessage.type) {
            emoji = val.emoji;
            break;
          }
        }

        for (const val of configCommit.config['scopes']) {
          const align = [];
          align.push(val.name);
          aligns.push(align.join(''));
        }

        aligns = alignStrings(aligns);

        for (const [index, val] of aligns.entries()) {
          const item = configCommit.config['scopes'][index];
          const select = {
            name: `${pc.bold(val)}     ${pc.dim(item.description)}`,
            value: item.name,
            description: pc.green(`${pc.dim(`${emoji}${config.pushTagMessage.type}`)}(${item.name})`),
            descriptionDim: false
          };

          choices.push(select);
        }

        choices.push(command.prompt.separator());

        // 选择提交范围
        config.pushTagMessage.scope = await command.prompt.select({
          message: get('release.pushTagMessage.scope.message'),
          choices: choices
        });
      }

      // 输入提交标题，可用 `tag` 变量
      config.pushTagMessage.subject = await command.prompt.input({
        message: get('release.pushTagMessage.subject.message'),
        default: '{{tag}}'
      });
    }

    // Github Release 发布，多语言内容所使用的标题
    config.lang.subject = await command.prompt.input({
      message: get('release.lang.subject.message'),
      default: config.lang.subject
    });

    // Github Release 发布，多语言内容的分隔符
    config.lang.separator = await command.prompt.input({
      message: get('release.lang.separator.message'),
      default: config.lang.separator
    });

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
