import { IResultConfigCommit, TConfigChangelog } from '@/interface';
import { command, translate } from '@/utils';
import { get, choices } from '../../locales';

/**
 * 初始化 changelog
 * @param {IResultConfigCommit} configCommit commit 配置
 * @returns {Promise<TConfigChangelog>} changelog 配置
 */
const changelog = async (configCommit: IResultConfigCommit): Promise<TConfigChangelog> => {
  // 标题
  command.prompt.title(get('changelog.title'));

  let config: TConfigChangelog = false;

  if (
    await command.prompt.select({
      message: get('changelog.message'),
      choices: [
        {
          name: get('enabled'),
          value: true,
          description: get('changelog.description')
        },
        {
          name: get('disabled'),
          value: false
        }
      ]
    })
  ) {
    config = {
      file: {
        limit: 10,
        history: './changelogs',
        save: './changelog'
      },
      translate: {
        origin: 'zh-CN',
        target: 'en',
        statement: '> 🚩 '
      },
      template: {
        before: '',
        content: '',
        separator: '',
        after: ''
      }
    };

    // 是否配置文件存储规则
    config.file = await command.prompt.select({
      message: get('changelog.file.message'),
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

    if (config.file) {
      config.file = {
        limit: 10,
        history: './changelogs',
        save: './changelog'
      };

      // 记录多少个版本号的日志
      config.file.limit = await command.prompt.input({
        message: get('changelog.file.limit.message'),
        default: 10
      });

      // 历史日志存储的目录
      config.file.history = await command.prompt.input({
        message: get('changelog.file.history.message'),
        default: './changelogs'
      });

      // 保存日志的文件名
      config.file.save = await command.prompt.input({
        message: get('changelog.file.save.message'),
        default: './changelog'
      });
    }

    // 是否启用翻译
    config.translate = await command.prompt.select({
      message: get('changelog.translate.message'),
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

    if (config.translate) {
      config.translate = {
        origin: 'zh-CN',
        target: 'en',
        statement: '> 🚩 '
      };

      // 原始语言，如果启用了 自动翻译 commit 信息到英文，则默认语言就使用英文
      if (configCommit.contentEnglish) {
        config.translate.origin = translate.lang.english.code;
        console.log(`${get('changelog.translate.origin.message.auto', translate.getNameByCode(config.translate.origin))}`);
      }
      // 否则，就询问，原始语言是什么
      else {
        config.translate.origin = await choices.select('changelog.translate.origin.message.manual', configCommit.messageLangCode);
      }

      // 如果启用了自动翻译 commit 信息到英文，那么就不能排除英文，而是排除需要翻译的原始语言
      if (configCommit.contentEnglish) {
        // 目标语言，不能出现原始语言
        config.translate.target = await choices.checkbox('changelog.translate.target.message', configCommit.config['submit'].origin, translate.lang.english.code);
      }
      // 否则，就默认选择英文，然后排除原始语言
      else {
        // 目标语言，不能出现原始语言
        config.translate.target = await choices.checkbox('changelog.translate.target.message', translate.lang.english.code, config.translate.origin);
      }

      // 声明
      if (
        await command.prompt.select({
          message: get('changelog.translate.statement.message'),
          choices: [
            {
              name: get('yes'),
              value: true,
              description: get('changelog.translate.statement.description')
            },
            {
              name: get('no'),
              value: false
            }
          ]
        })
      ) {
        config.translate.statement = await command.prompt.input({
          message: get('changelog.translate.statement.content.message'),
          default: '> 🚩 '
        });
      }
    }

    // 是否配置模板
    config.template = await command.prompt.select({
      message: get('changelog.template.message'),
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

    if (config.template) {
      config.template = {
        before: '',
        content: '',
        separator: '',
        after: ''
      };

      // 每个日志文件，页眉内容模版
      config.template.before = await command.prompt.input({
        message: get('changelog.template.before.message')
      });

      // 每条日志，内容模版
      config.template.content = await command.prompt.input({
        message: get('changelog.template.content.message'),
        default: '## 🎉 {{tag}} `{{date}}`\n{{logs}}'
      });

      // 每个版本之间的分隔符
      config.template.separator = await command.prompt.input({
        message: get('changelog.template.separator.message'),
        default: '\n\n---\n\n'
      });

      // 每个日志文件，页脚内容模版
      config.template.after = await command.prompt.input({
        message: get('changelog.template.after.message'),
        default: ''
      });
    }

    // 通过 Github Acitons 自动发布后，将在最后显示项目链接，同时连接到所有 日志
    config.poweredby = await command.prompt.select({
      message: get('changelog.poweredby.message'),
      choices: [
        {
          name: get('yes'),
          value: true,
          description: get('changelog.poweredby.description', `${`${(config.file && config.file['save']) ?? 'changelog'}`.replace(/\.md$/, '').replace(/^(\.|)\//, '')}.md`)
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

export default changelog;
