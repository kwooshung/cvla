import pc from 'picocolors';
import { Octokit } from '@octokit/rest';
import { isUndefined as _isUn, isPlainObject as _isObj, isArray as _isArr, isString as _isStr, isBoolean as _isBool } from 'lodash-es';
import { IConfig, ILanguage, TRelease } from '@/interface';
import { convert, translate, io, console as cs } from '@/utils';

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
   * 私有函数：release > 获取所有仓库中的标签
   * @returns {Promise<string[]>} 标签列表
   */
  private async getAllTags(): Promise<string[]> {
    try {
      let page = 1;
      const owner = this.getRepoOwner();
      const repo = this.getRepoName();
      const allTags: string[] = [];
      let localtags: any;
      do {
        localtags = await this.OCTOKIT.repos.listTags({ owner, repo, per_page: 100, page });
        allTags.push(...localtags.data.map((localtag: { name: string }) => localtag.name));
        page++;
      } while (localtags.data.length === 100); // 如果一页满载（100个条目），则可能还有更多页面

      return allTags;
    } catch (error) {
      cs.error('获取仓库中的标签时出错：', 'Error fetching released tags:');
      console.error(error);
      throw error;
    }
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
      cs.error('获取已发布的标签时出错：', 'Error fetching released tags:');
      console.error(error);
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
   * 私有函数：release > IO > 获得日志模板文件名
   * @param {string} [langcode = ''] 语言代码
   * @returns {string} 日志模板文件名
   */
  private getLogFilename(langcode: string = ''): string {
    langcode = langcode.toLowerCase().trim();
    const save = this.CONF.changelog['file'].save ?? '';
    const filename = `${save}/CHANGELOG${langcode ? `.${langcode}` : ''}.md`;
    return filename;
  }

  /**
   * 公开函数：release > 发布
   * @returns {Promise<void>} 无返回值
   */
  public async release(): Promise<void> {
    // 如果启用了 release 和 changelog，才能发布
    if (
      this.CONF['release'] &&
      this.CONF['release']['subject'] &&
      this.CONF['changelog'] &&
      this.CONF['changelog']['template'] &&
      this.CONF['changelog']['template']['content'] &&
      this.CONF['changelog']['template']['logs'] &&
      this.CONF['changelog']['template']['logs']['title'] &&
      this.CONF['changelog']['template']['logs']['title']['standard'] &&
      this.CONF['changelog']['template']['logs']['title']['other'] &&
      this.CONF['changelog']['template']['logs']['item'] &&
      this.CONF['changelog']['template']['logs']['commitlink'] &&
      this.CONF['changelog']['template']['logs']['commitlink']['text'] &&
      this.CONF['changelog']['template']['logs']['commitlink']['url']
    ) {
      /**
       * 获得仓库的所有标签，按照版本号从小到大排序，也就是最新的版本在最后
       */
      const tags = await this.getAllTags();
      console.log('alltags', tags);

      // 本地测试用
      // const tags = await git.tag.get.all(true);

      // 获得仓库的所有发布标签
      const releasedTags = await this.getReleasedTags();
      console.log('releasedTags', releasedTags);

      // 本地测试用
      // const releasedTags = [];

      // 将 releasedTags 数组转换为 Set 以提高查找效率
      const releasedTagsSet = new Set(releasedTags);
      // 使用 filter 方法过滤出 tags 数组中不在 releasedTagsSet 中的元素
      const unreleasedTags = tags.filter((tag) => !releasedTagsSet.has(tag.trim()));

      if (unreleasedTags.length > 0) {
        // 列表
        const list: TRelease[] = [];

        for (const tag of unreleasedTags) {
          const changelog: TRelease = {
            tag,
            logs: {}
          };

          if (this.IsTranslate) {
            // 读取日志文件内容
            const contents: Record<string, string> = {};

            for (const langcode of this.translateLangs) {
              const filename = this.getLogFilename(langcode);

              // 如果内容列表中不存在，那么就读取
              _isUn(contents[filename]) && (contents[filename] = await io.read(filename));

              // 获取日志内容
              const tagContent = await this.getContents(tag, contents[filename]);

              // 如果内容列表中存在
              if (tagContent) {
                // 如果对应的标签不存在，那么就创建标签对象
                changelog.logs[langcode] = tagContent;
              }
            }
          } else {
            const filename = this.getLogFilename();
            const content = await io.read(filename);

            // 获取日志内容
            const tagContent = await this.getContents(tag, content);

            // 如果内容列表中存在
            if (tagContent) {
              // 如果对应的标签不存在，那么就创建标签对象
              changelog.logs = tagContent;
            }
          }

          list.push(changelog);
        }

        if (list.length > 0) {
          // 标题模板
          const subjectTemplate = this.CONF.release['subject'];
          // 获取仓库拥有者
          const owner = this.getRepoOwner();
          // 获取仓库名
          const repo = this.getRepoName();
          // 获取仓库分支
          const branch = this.getRepoBranch();

          // 如果存在这些配置，那么就发布
          if (subjectTemplate && owner && repo && branch) {
            await this.publish(subjectTemplate, 'owner', 'repo', 'branch', list);
          }
        }
      }
    } else {
      const list = [];
      list.push(pc.bold(pc.red('✖ Clvar：')));
      list.push(pc.red('  zh-CN：您还未开启 `release`功能，或没有开启 `日志功能` 相关功能，特别是日志模板相关配置，如下参数必须存在。'));
      list.push(pc.red('  en: The release feature or log functionality, particularly log template configurations, have not been activated. The following parameters are required.'));
      list.push(pc.dim('=================================================='));
      list.push(pc.cyan('  release'));
      list.push(pc.cyan('  release.subject'));
      list.push(pc.cyan('  changelog.template.content'));
      list.push(pc.cyan('  changelog.template.logs.title.standard'));
      list.push(pc.cyan('  changelog.template.logs.title.other'));
      list.push(pc.cyan('  changelog.template.logs.item'));
      list.push(pc.cyan('  changelog.template.logs.commitlink.text'));
      list.push(pc.cyan('  changelog.template.logs.commitlink.url'));
      console.log(list.join('\n'));
    }
  }

  /**
   * 私有函数：release > 获取日志内容
   * @param {string} tag 标签
   * @param {string} content 日志内容
   * @returns {Promise<string>} 日志内容
   */
  private async getContents(tag: string, content: string): Promise<string> {
    if (content) {
      // 获取日志模板，目前默认是 '## 🎉 {{tag}} `{{date}}`\n{{logs}}'，日志生成的也是这个格式的。
      const logTemplate = this.CONF['changelog']['template']['content'];

      // eslint-disable-next-line prettier/prettier, no-useless-escape
      const version =
        '(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?';
      const date = '\\d{4}-\\d{2}-\\d{2}';
      const time = '\\d{2}:\\d{2}:\\d{2}';
      const logs = '([\\s\\S]*?)';

      // 当前版本的正则表达式
      const currentStrRegex = convert.replaceTemplate(logTemplate, {
        tag,
        date,
        time,
        logs
      });

      // 下一个版本的正则表达式
      const nextStrRegex = convert
        .replaceTemplate(logTemplate, {
          tag: version,
          date,
          time,
          logs: ''
        })
        .trimEnd();

      // 完整的版本号正则表达式，可获取当前版本和下一个版本的之间的日志内容
      const tagRegex = new RegExp(`^${currentStrRegex}${nextStrRegex}$`, 'm');

      // 获取当前版本号的日志内容
      const matchResult = content.match(tagRegex);

      // 匹配到版本号，返回当前版本的日志内容
      if (matchResult) {
        return matchResult[1].trim();
      }
      // 未匹配到版本号，尝试从当前版本匹配到文件尾部
      else {
        const currentMatch = content.match(new RegExp(`^${currentStrRegex}([\\s\\S]*)$`, 'm'));
        return (currentMatch?.[2] ?? '').trim();
      }
    }

    return content;
  }

  /**
   * 私有函数：release > 发布
   * @param {string} subjectTemplate 标题模板
   * @param {string} owner 仓库所有者
   * @param {string} repo 仓库名
   * @param {string} branch 仓库分支
   * @param {TRelease[]} list 列表
   * @returns {Promise<void>} 无返回值
   */
  private async publish(subjectTemplate: string, owner: string, repo: string, branch: string, list: TRelease[]): Promise<void> {
    for (const changelog of list) {
      const body: string[] = [];
      // 如果是翻译，并且不是字符串，并且是对象，那么就是多语言
      if (this.IsTranslate && !_isStr(changelog.logs) && _isObj(changelog.logs)) {
        for (const lang in changelog.logs) {
          if (Object.prototype.hasOwnProperty.call(changelog.logs, lang)) {
            const logs = changelog.logs[lang];
            _isStr(logs) && body.push(logs);
          }
        }
      } else if (!this.IsTranslate && _isStr(changelog.logs) && !_isObj(changelog.logs)) {
        body.push(changelog.logs);
      }

      if (body.length > 0) {
        const name = convert.replaceTemplate(subjectTemplate, { tag: changelog.tag });
        this.CONF['release']['poweredby'] && body.push(`> This [Changelog](../../blob/${branch}/CHANGELOG.md), Powered by @kwooshung /[cvlar](https://github.com/kwooshung/cvlar/)`);

        console.log({
          owner,
          repo,
          tag_name: changelog.tag,
          name,
          body: body.join('\n\n---\n\n')
        });

        // await this.OCTOKIT.repos.createRelease({
        //   owner,
        //   repo,
        //   tag_name: changelog.tag,
        //   name,
        //   body: body.join('\n\n---\n\n')
        // });
      }
    }

    console.log(pc.green('✔ SUCCESS !!!'));
  }
}

export default release;
