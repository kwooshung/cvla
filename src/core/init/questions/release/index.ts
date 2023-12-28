import { TConfigRelease } from '@/interface';
import { command } from '@/utils';
import { get } from '../../locales';

/**
 * 初始化 发布
 * @param {IResultConfigCommit} configCommit commit 配置
 * @returns {Promise<TConfigRelease>} release 配置
 */
const release = async (): Promise<TConfigRelease> => {
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
      poweredby: true
    };

    // 发布页面，tag版本标题模板
    config.subject = await command.prompt.input({
      message: get('release.subject.message'),
      default: config.subject
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
