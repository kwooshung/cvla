import { IResultConfigCommit, TConfigChangelog, TPackageJsonData } from '@/interface';
import { command, convert, translate } from '@/utils';
import { get, choices } from '../../locales';

/**
 * 初始化 changelog
 * @param {IResultConfigCommit} configCommit commit 配置
 * @param {TPackageJsonData} packjson package.json 数据
 * @returns {Promise<TConfigChangelog>} changelog 配置
 */
const changelog = async (configCommit: IResultConfigCommit, packjson: TPackageJsonData): Promise<TConfigChangelog> => {
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
        save: './changelog'
      },
      translate: {
        origin: 'zh-CN',
        target: 'en'
      },
      template: {
        content: '## 🎉 {{tag}} `{{date}}`\n{{logs}}\n\n----\n\n',
        logs: {
          title: {
            standard: '',
            other: '### Other'
          },
          item: '- {{message}} ({{commitlink}})',
          commitlink: {
            text: '#{{id-7}}',
            url: 'https://github.com/kwooshung/cvlar/commit/{{id}}'
          }
        }
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
        save: './changelogs'
      };

      // 记录多少个版本号的日志
      // config.file.limit = await command.prompt.input({
      //   message: get('changelog.file.limit.message'),
      //   default: 10
      // });

      // 保存日志的目录
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
        target: 'en'
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

      // 如果只有一个目标语言，那么就不是数组，而是字符串
      config.translate.target.length === 1 && (config.translate.target = config.translate.target[0]);
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
        content: '## 🎉 {{tag}} `{{date}}`\n{{logs}}\n\n----\n\n',
        logs: {
          title: {
            standard: '### {{emoji}} {{Type}}',
            other: '### Other'
          },
          item: '- {{message}} ({{commiturl}})',
          commitlink: {
            text: '#{{id[substr:7]}}',
            url: 'https://github.com/kwooshung/cvlar/commit/{{id}}'
          }
        }
      };

      // 每条日志，内容模版
      config.template.content = await command.prompt.input({
        message: get('changelog.template.content.message'),
        default: '## 🎉 {{tag}} `{{date}}`\n{{logs}}\n\n----\n\n'
      });

      // 每条日志，标题模版：标准的标题模版，也就是 提交类型存在时的模版
      config.template.logs.title.standard = await command.prompt.input({
        message: get('changelog.template.logs.title.standard.message'),
        default: '### {{emoji}} {{Type}}'
      });

      // 每条日志，标题模版：其他标题模版，也就是 提交类型不存在时的模版
      config.template.logs.title.other = await command.prompt.input({
        message: get('changelog.template.logs.title.other.message'),
        default: '### Other'
      });

      // 每条日志，内容模版
      config.template.logs.item = await command.prompt.input({
        message: get('changelog.template.logs.item.message'),
        default: '- {{message}} ({{commiturl}})'
      });

      // 每条日志，是否都在尾部加入 commit url
      const isCommitUrl = await command.prompt.select({
        message: get('changelog.template.logs.commitlink.message'),
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

      // 如果是，则询问代码托管平台
      if (isCommitUrl) {
        const plateforms = await command.prompt.select({
          message: get('changelog.template.logs.commitlink.plateforms.message'),
          choices: [
            {
              name: 'github.com',
              value: 'github.com',
              description: `https://github.com/author/project-name/commit/id`
            },
            {
              name: 'gitee.com',
              value: 'gitee.com',
              description: `https://gitee.com/author/project-name/commit/id`
            },
            {
              name: 'gitlab.com',
              value: 'gitlab.com',
              description: `https://gitlab.com/author/project-name/commit/id`
            },
            {
              name: 'bitbucket.org',
              value: 'bitbucket.org',
              description: `https://bitbucket.org/author/project-name/commits/id`
            },
            {
              name: get('changelog.template.logs.commitlink.other.message'),
              value: 'other'
            }
          ]
        });

        if (plateforms === 'other') {
          config.template.logs.commitlink.url = await command.prompt.input({
            message: get('changelog.template.logs.commitlink.other.input.message'),
            default: `https://example.com/{{author}}/{{repository}}/commit/{{id}}`
          });
        } else {
          switch (plateforms) {
            case 'gitee.com':
              config.template.logs.commitlink.url = `https://gitee.com/{{author}}/{{project}}/commit/{{id}}`;
              break;
            case 'gitlab.com':
              config.template.logs.commitlink.url = `https://gitlab.com/{{author}}/{{project}}/commit/{{id}}`;
              break;
            case 'bitbucket.org':
              config.template.logs.commitlink.url = `https://bitbucket.org/{{author}}/{{project}}/commits/{{id}}`;
              break;
            default:
              config.template.logs.commitlink.url = `https://github.com/{{author}}/{{project}}/commit/{{id}}`;
              break;
          }
        }

        // 作者名
        const author = await command.prompt.input({
          message: get('changelog.template.logs.commitlink.author'),
          default: packjson['author'] ?? ''
        });

        // 仓库名
        const repository = await command.prompt.input({
          message: get('changelog.template.logs.commitlink.repository'),
          default: packjson['name'] ?? ''
        });

        config.template.logs.commitlink.url = convert.replaceTemplate(config.template.logs.commitlink.url, {
          author,
          repository
        });
      }
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
