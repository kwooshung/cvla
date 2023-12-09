import pc from 'picocolors';
import ora from 'ora';
import progress from 'cli-progress';

import { isUndefined as _isUn, isString as _isStr } from 'lodash-es';
import { TGitCustomField, IGitCommitData, IConfig } from '@/interface';
import { translate } from '@/utils';

/**
 * 类：Git提交信息
 */
class commit {
  /**
   * 私有属性：提交信息数据
   */
  private data: IGitCommitData;

  /**
   * 私有属性：配置信息
   */
  private CONF: IConfig;

  /**
   * 构造函数
   * @param {IGitCommitData} data 提交信息数据
   * @param {IConfig} conf 配置信息
   */
  constructor(data: IGitCommitData, conf: IConfig) {
    this.data = data;
    this.CONF = conf;
  }

  /**
   * 私有函数：构建提交类型字符串。
   * @returns {string} 提交类型字符串。
   */
  private buildType(): string {
    const { type, scope } = this.data;
    return `${type}${scope ? `(${scope})` : ''}`;
  }

  /**
   * 私有函数：构建提交主题字符串。
   * @returns {string} 提交主题字符串。
   */
  private buildSubject(): string {
    return this.data.subject;
  }

  /**
   * 私有函数：构建正文字符串。
   * @returns {string} 正文字符串。
   */
  private buildBody(): string {
    return this.data.body?.replace(/\s*\|\s*/g, '\n') || '';
  }

  /**
   * 私有函数：构建BREAKING CHANGE字符串。
   * @returns {string} BREAKING CHANGE字符串。
   */
  private buildBreakingChange(): string {
    return this.data.breaking ? `${this.CONF.i18n.git.commit.breaking.field}${this.data.breaking}` : '';
  }

  /**
   * 私有函数：从字符串中提取Issue编号。
   * @param {string} str 包含Issue编号的字符串。
   * @returns {string[]} 解析出的Issue编号数组。
   */
  private parseIssues(str: string): string[] {
    const regex = /(\d+)/g;
    let match: string[];
    const numbers: string[] = [];

    while ((match = regex.exec(str)) !== null) {
      numbers.push(`#${match[1]}`);
    }

    return numbers;
  }

  /**
   * 私有函数：构建关闭Issue的字符串。
   * @returns {string} 关闭Issue的字符串。
   */
  private buildCloseIssues(): string {
    if (this.data.issues && this.data.issues.length > 0) {
      const closeIssues = this.data.issues.map((issue) => {
        const issueIds = this.parseIssues(issue.ids);
        return `${issue.close}: ${issueIds.join(', ')}`;
      });
      return closeIssues.join('\n');
    }
    return '';
  }

  /**
   * 私有函数：构建自定义字段字符串。
   * @param {TGitCustomField[]} fields 自定义字段数组。
   * @returns {string} 自定义字段组合成的字符串。
   */
  private buildCustomFields(fields: TGitCustomField[]): string {
    return fields.map((field) => (field.field ? `${field.field}${field.value}` : field.value)).join('\n\n');
  }

  /**
   * 私有函数：构建完整的提交信息。
   * @returns {string} 提交信息字符串。
   */
  private buildMessage(): string {
    const type = this.buildType();
    const subject = this.buildSubject();
    const body = this.buildBody();
    const breaking = this.buildBreakingChange();
    const closeIssues = this.buildCloseIssues();
    const customFields = this.buildCustomFields(this.data.custom || []);

    // 使用数组来存储各个部分的信息
    const messageParts: string[] = [];

    // 添加类型和主题
    messageParts.push(`${type}: ${subject}`);

    // 添加正文
    body && messageParts.push(body);

    // 添加BREAKING CHANGE
    breaking && messageParts.push(breaking);

    // 添加关闭Issue
    closeIssues && messageParts.push(closeIssues);

    // 添加自定义字段
    customFields && messageParts.push(customFields);

    // 使用换行符连接各个部分
    return messageParts.join('\n\n');
  }

  /**
   * 公开函数：翻译提交信息
   * @returns {Promise<boolean>} 翻译结果。true：成功；false：失败。
   */
  public async translate(): Promise<boolean> {
    let result = false;
    const origin = this.CONF.commit['submit'].origin;
    const target = this.CONF.commit['submit'].target;

    if (!_isUn(origin) && _isStr(origin) && !_isUn(target) && _isStr(target)) {
      const spinner = ora(pc.cyan(this.CONF.i18n.git.commit.translate.connect.message));
      spinner.start();
      const resultCheck = await translate.check();

      if (resultCheck) {
        spinner.succeed(this.CONF.i18n.git.commit.translate.connect.success);
        spinner.stop();

        const errors = [];

        try {
          const processBar = new progress.SingleBar(
            {
              format: `${pc.cyan(this.CONF.i18n.git.commit.translate.process.message)} ${pc.cyan('{bar}')} {percentage}% | {value}/{total}`
            },
            progress.Presets.shades_classic
          );

          let customLen = 0;

          for (const val of this.data.custom) {
            if (val.type === 'input') {
              customLen++;
            }
          }

          processBar.start(3 + customLen, 0);

          processBar.increment(1);
          this.data.subject = await translate.text(this.data.subject, target, origin);
          await translate.delay();

          processBar.increment(1);
          this.data.body = await translate.text(this.data.body, target, origin);
          await translate.delay();

          processBar.increment(1);
          this.data.breaking = await translate.text(this.data.breaking, target, origin);
          await translate.delay();

          if (customLen > 0) {
            for (const val of this.data.custom) {
              // 如果是输入类型，则翻译
              if (val.type === 'input') {
                processBar.increment(1);
                val.value = await translate.text(val.value, target, origin);
                await translate.delay();
              }
            }
          }

          processBar.stop();

          if (errors.length <= 0) {
            result = true;
            console.log(pc.green(this.CONF.i18n.git.commit.translate.process.success));
          } else {
            console.log(pc.red(this.CONF.i18n.git.commit.translate.process.fail));
          }
        } catch (e) {
          errors.push(e);
        }
      } else {
        spinner.fail(this.CONF.i18n.git.commit.translate.connect.message.fail);
        spinner.stop();
      }
    } else {
      console.log(pc.red(this.CONF.i18n.git.commit.translate.error.config));
    }

    return result;
  }

  /**
   * 公开函数：获取Git提交命令。
   * @returns {string} Git提交命令字符串。
   */
  public async generate(): Promise<string> {
    const commitMessage = this.buildMessage();
    return commitMessage;
  }
}

export default commit;
