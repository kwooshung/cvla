import { Octokit } from '@octokit/rest';
import { isUndefined as _isUn, isPlainObject as _isObj, isArray as _isArr, isString as _isStr, isBoolean as _isBool } from 'lodash-es';
import { IConfig, TChangeLog, TGitMessageToChangeLog, ILanguage, TReleaseResult, TRelease } from '@/interface';
import { convert, git, translate } from '@/utils';

/**
 * 类：日志记录
 */
class release {
  /**
   * 私有属性：单例对象
   */
  private static instance: release;

  /**
   * 私有属性：配置信息
   */
  private CONF: IConfig;

  /**
   * 私有属性：GitHub Api 对象
   */
  private OCTOKIT: Octokit;

  /**
   * 私有属性：是否启用翻译
   */
  private IsTranslate = false;

  /**
   * 私有属性：翻译原始语言
   */
  private translateOrigin: string = '';

  /**
   * 私有属性：翻译目标语言
   */
  private translateTargets: string[] = [];

  /**
   * 私有属性：翻译语言列表
   */
  private translateLangs: string[] = [];

  /**
   * 构造函数
   * @param {IConfig} conf 配置信息
   */
  private constructor(conf: IConfig) {
    this.CONF = conf;

    this.OCTOKIT = new Octokit({ auth: process.env.GITHUB_TOKEN });

    this.IsTranslate =
      _isObj(this.CONF.changelog['translate']) &&
      _isStr(this.CONF.changelog['translate'].origin) &&
      (_isStr(this.CONF.changelog['translate'].target) || _isArr(this.CONF.changelog['translate'].target)) &&
      [this.CONF.changelog['translate'].origin, this.CONF.changelog['translate'].target].flat().length > 0;

    if (this.IsTranslate) {
      this.translateOrigin = this.CONF.changelog['translate'].origin;
      this.translateTargets = [this.CONF.changelog['translate'].target].flat();
      this.translateLangs = [this.translateOrigin, this.translateTargets].flat();
    }
  }

  /**
   * 提供一个静态方法用于获取类的实例，用于直接执行内部函数
   * @param {IConfig} conf 配置信息
   * @returns {Promise<release>} release 类的实例
   */
  public static getInstance(conf: IConfig): release {
    if (_isObj(conf) && !_isBool(conf)) {
      return release.instance ?? new release(conf);
    }
  }

  /**
   * 停留时间
   * @param {number} [ms = 10] 停留时间
   */
  private delay(ms: number = 10) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * 私有函数：release > 获取仓库所有者
   * @returns {string} 仓库所有者
   */
  private getRepoOwner(): string {
    const repo = process.env.GITHUB_REPOSITORY;
    if (repo) {
      return repo.split('/')[0];
    }
    return '';
  }

  /**
   * 私有函数：release > 获取仓库名
   * @returns {string} 仓库名
   */
  private getRepoName(): string {
    const repo = process.env.GITHUB_REPOSITORY;
    if (repo) {
      return repo.split('/')[1];
    }
    return '';
  }

  /**
   * 私有函数：release > 获取仓库分支
   * @returns {string} 仓库分支
   */
  private getRepoBranch(): string {
    const ref = process.env.GITHUB_REF;
    if (ref) {
      return ref.split('/')[2];
    }
    return '';
  }

  /**
   * 私有函数：release > 获取所有已发布的标签
   * @returns {Promise<string[]>} 标签列表
   */
  private async getReleasedTags(): Promise<string[]> {
    try {
      let page = 1;
      const owner = this.getRepoOwner();
      const repo = this.getRepoName();
      const allReleasedTags: string[] = [];
      let releases: any;

      do {
        releases = await this.OCTOKIT.repos.listReleases({ owner, repo, per_page: 100, page });
        allReleasedTags.push(...releases.data.map((release: { tag_name: string }) => release.tag_name));
        page++;
      } while (releases.data.length === 100); // 如果一页满载（100个条目），则可能还有更多页面

      return allReleasedTags;
    } catch (error) {
      console.error('Error fetching released tags:', error);
      throw error;
    }
  }

  /**
   * 私有函数：release > 翻译并替换链接占位符
   * @param {string} content 日志内容
   * @param {string} [from] 原始语言
   * @param {string} [to] 目标语言
   * @returns {Promise<string>} 日志内容
   */
  private async translate(content: string, from?: string | ILanguage, to?: string | ILanguage): Promise<string> {
    // 翻译文本
    const translatedContent = await translate.text(content, to, from);

    await this.delay(10);

    return translatedContent;
  }

  /**
   * 公开函数：release > 发布
   * @returns {Promise<void>} 无返回值
   */
  public async release(): Promise<void> {
    // 如果启用了 release 和 changelog，才能发布
    if (this.CONF['release'] && this.CONF['changelog'] && this.CONF['changelog']['template']) {
      // 标题模板
      const subjectTemplate = this.CONF.release['subject'];
      // 获取仓库拥有者
      const owner = this.getRepoOwner();
      // 获取仓库名
      const repo = this.getRepoName();
      /**
       * 获得仓库的所有标签，按照版本号从小到大排序，也就是最新的版本在最后
       */
      const tags = await git.tag.get.all(true);
      // 获得仓库的所有发布标签
      const releasedTags = await this.getReleasedTags();
      // 将 releasedTags 数组转换为 Set 以提高查找效率
      const releasedTagsSet = new Set(releasedTags);
      // 使用 filter 方法过滤出 tags 数组中不在 releasedTagsSet 中的元素
      const unreleasedTags = tags.filter((tag) => !releasedTagsSet.has(tag.trim()));

      if (unreleasedTags.length > 0) {
        const contents: TRelease[] = await this.readMessages(unreleasedTags);

        if (contents.length > 0) {
          for (const content of contents) {
            const name = convert.replaceTemplate(subjectTemplate, { tag: content.tag, date: content.date, time: content.time });
            const body: string[] = [];

            // 如果不是字符串，并且是对象，那么就是多语言
            if (!_isStr(content.logs) && _isObj(content.logs)) {
              for (const lang in content.logs) {
                if (Object.prototype.hasOwnProperty.call(content.logs, lang)) {
                  const logs = content.logs[lang];
                  _isStr(logs) && body.push(logs);
                }
              }
            }
            // 如果是字符串，那么就是单语言
            else if (_isStr(content.logs)) {
              body.push(content.logs);
            }

            if (body.length > 0) {
              this.CONF['release']['poweredby'] && body.push(`This [Changelog](../../blob/${this.getRepoBranch()}/CHANGELOG.md), Powered by @kwooshung /[cvlar](https://github.com/kwooshung/cvlar/)`);

              await this.OCTOKIT.repos.createRelease({
                owner,
                repo,
                tag_name: content.tag,
                name,
                body: body.join('\n\n---\n\n')
              });
            }
          }
        }
      }
    }
  }

  /**
   * 公开函数：changelog > 读取
   * @param {string[]} tags 需要生成日志的版本标签列表
   * @returns {Promise<TRelease[]>} 无返回值
   */
  private async readMessages(tags: string[]): Promise<TRelease[]> {
    let result: TRelease[] = [];
    const itemTemplate = this.CONF.changelog['template']?.logs?.item;
    const titleStandardTemplate = this.CONF.changelog['template']?.logs?.title?.standard;
    const titleOtherTemplate = this.CONF.changelog['template']?.logs?.title?.other;
    const commitlinkTextTemplate = this.CONF.changelog['template']?.logs?.commitlink?.text;
    const commitlinkUrlTemplate = this.CONF.changelog['template']?.logs?.commitlink?.url;

    const list: TGitMessageToChangeLog[] = await git.message.toChangeLog(tags);

    const changelogs: TChangeLog[] = [];

    for (const val of list) {
      const changelog: TChangeLog = {
        tag: val.tag,
        date: val.date,
        time: val.time,
        list: {}
      };

      if (_isArr(val.list)) {
        for (const log of val.list) {
          // 解析日志内容
          const { emojiOrType, emoji, type, scope, message } = git.message.parse(log.message);

          let key = '';
          // 如果存在，下方的key，是为了让其能够按照type分类
          if (emojiOrType) {
            const vars = { emoji, type, scope, date: log.date, time: log.time };
            key = convert.replaceTemplate(titleStandardTemplate, vars);
          } else {
            key = titleOtherTemplate;
          }

          // 如果启用了翻译，那么就翻译
          if (this.IsTranslate) {
            for (const lang of this.translateLangs) {
              // 翻译，如果原始语言与目标语言相同，那么就不翻译
              const messageTranslated = this.translateOrigin === lang ? message : await this.translate(message, this.translateOrigin, lang);

              // 生成日志内容
              const msg = convert.replaceTemplate(itemTemplate, {
                message: messageTranslated,
                date: log.date,
                time: log.time,
                commitlink: `[${convert.replaceTemplate(commitlinkTextTemplate, { id: log.id })}](${convert.replaceTemplate(commitlinkUrlTemplate, { id: log.id })})`
              });

              // 如果对应的语言不存在，那么就创建
              _isUn(changelog.list[lang]) && (changelog.list[lang] = {});

              // 如果对应的 key 不存在，那么就创建
              _isUn(changelog.list[lang][key]) && (changelog.list[lang][key] = []);

              changelog.list[lang][key].push(msg);
            }
          } else {
            // 生成日志内容
            const msg = convert.replaceTemplate(itemTemplate, {
              message,
              date: log.date,
              time: log.time,
              commitlink: `[${convert.replaceTemplate(commitlinkTextTemplate, { id: log.id })}](${convert.replaceTemplate(commitlinkUrlTemplate, { id: log.id })})`
            });

            _isUn(changelog.list[key]) && (changelog.list[key] = []);
            (changelog.list[key] as string[]).push(msg);
          }
        }
      }

      changelogs.push(changelog);
    }

    // 如果changelogs长度大于0，也就表示有内容，那么就生成changelog
    if (changelogs.length > 0) {
      result = await this.buildData(changelogs);
    }

    return result;
  }

  /**
   * 私有函数：release > 生成 > 数据
   * @param {TChangeLog[]} changelogs 日志列表
   * @returns {Promise<TRelease[]>} 日志内容
   */
  private async buildData(changelogs: TChangeLog[]): Promise<TRelease[]> {
    const result: TRelease[] = [];

    for (const changelog of changelogs) {
      const logs: TReleaseResult = await this.buildContent(changelog);

      result.push({
        tag: changelog.tag,
        date: changelog.date,
        time: changelog.time,
        logs
      });
    }

    return result;
  }

  /**
   * 私有函数：release > 生成 > 内容
   * @param {TChangeLog} changelog 日志
   * @returns {TReleaseResult} 日志内容
   */
  private async buildContent(changelog: TChangeLog): Promise<TReleaseResult> {
    if (this.IsTranslate) {
      const result = {};

      for (const lang of this.translateLangs) {
        result[lang] = await this.buildContentItems(changelog, lang);
      }
      return result;
    }

    return await this.buildContentItems(changelog);
  }

  /**
   * 私有函数：release > 生成 > 内容
   * @param {TChangeLog} changelog 日志
   * @param {string} [lang=''] 语言，如果为空，那么就是没有翻译
   * @returns {Promise<TRelease>} 日志内容
   */
  private async buildContentItems(changelog: TChangeLog, lang: string = ''): Promise<string> {
    let logs = '';

    const list = lang ? changelog.list[lang] : changelog.list;

    if (!_isUn(list)) {
      const content = [];

      for (const key in list) {
        if (Object.prototype.hasOwnProperty.call(list, key)) {
          const items = list[key];

          if (!_isUn(items) && _isArr(items)) {
            content.push(key);
            content.push(items.join('\n'));
          }
        }
      }

      logs = content.join('\n').trim();
    }

    return logs;
  }
}

export default release;
