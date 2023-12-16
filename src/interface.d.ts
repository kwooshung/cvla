import { Separator } from '@inquirer/prompts';

/**
 * 接口：package.json 文件的数据结构
 */
interface IPackageJsonData {
  [key: string]: any;
}

/**
 * 类型：package.json 文件的数据结构
 */
type TPackageJsonData = IPackageJsonData | false | 'default';

/**
 * 接口 > package.json 文件的数据结构 和 缩进
 */
interface IPackageJson {
  /**
   * @property {IPackageJsonData} data package.json 文件的内容
   */
  data: TPackageJsonData;
  /**
   * @property {string} indentation package.json 文件的缩进
   */
  indentation: string;
}

/**
 * 接口：单个提交类型的结构
 */
interface ICommitType {
  /**
   * 表情符号，用于视觉标识
   */
  emoji?: string;
  /**
   * 提交类型的名称
   */
  name: string;
  /**
   * 提交类型的描述
   */
  description: string;
}

/**
 * 接口：提交范围的数组结构
 */
interface ICommitScope {
  /**
   * 提交类型的名称
   */
  name: string;
  /**
   * 提交类型的描述
   */
  description: string;
}

/**
 * 类型：提交范围的数据类型
 */
type TCommitScope = ICommitScope[] | false | 'default';

/**
 * 接口：提交翻译数据类型
 */
interface ICommitSubmit {
  /**
   * 提交原始语言
   */
  origin: string;
  /**
   * 提交后，翻译的目标语言
   */
  target: string;
}

/**
 * 类型：提交翻译数据类型
 */
type TCommitSubmit = ICommitSubmit | false | 'default';

/**
 * 类型：配置 > commit
 */
type TConfigCommit =
  | {
      types?: ICommitType[];
      scopes?: TCommitScope;
      submit?: TCommitSubmit;
    }
  | false
  | 'default';

/**
 * 类型：变更日志文件配置
 */
type TChangelogFileConfig =
  | {
      /**
       * CHANGELOG 文件中记录的条数，0表示不限制，全部记录；默认 10 条，表示每个文件最多记录 10 条，且自动分页，超过 limit 条则自动创建新的 CHANGELOG 文件，文件名为 md5{content}.md，以此类推；
       * 若是没有满足 limit 条数，则会将所有的日志都存放在这个目录中的 index.md 文件中；
       * 当有不同翻译版本时，会依据语言代码自动创建对应目录，例如：zh-CN/index.md、en/index.md、等；
       * 你可以在项目根目录下创建一个 CHANGELOG.md 文件，链接到这个目录中的 index.md 文件
       */
      limit?: number;
      /**
       * 日志存储的目录
       */
      save?: string;
    }
  | false
  | 'default';

/**
 * 类型：变更日志翻译配置
 */
type TChangelogTranslateConfig =
  | {
      /**
       * 原始语言
       */
      origin: string;
      /**
       * 目标语言，可以是一个字符串或字符串数组
       */
      target: string | string[];
      /**
       * 说明文字，如果为 false，则不显示翻译声明
       */
      statement?: string | false | 'default';
    }
  | false
  | 'default';

/**
 * 类型：变更日志模板配置
 */
type TChangelogTemplateConfig =
  | {
      /**
       * 每个模版前的内容
       */
      before: string;
      /**
       * 每个模版的内容
       */
      content: string;
      /**
       * commit url
       */
      commiturl: string;
      /**
       * 每个版本之间的分隔符
       */
      separator: string;
      /**
       * 每个模版后的内容
       */
      after: string;
    }
  | false
  | 'default';

/**
 * 类型：Git消息解析结构
 */
type TCommitCategory = {
  /**
   * 完整的类型
   */
  full: string;
  /**
   * 表情符号和类型
   */
  emojiOrType: string;
  /**
   * 表情符号，用于视觉标识
   */
  emoji: string;
  /**
   * 类型
   */
  type: string;
  /**
   * 范围
   */
  scope: string;
  /**
   * 信息
   */
  message: string;
};

/**
 * 类型：Git 提交信息
 */
type TGitMessage = {
  /**
   * 提交 ID
   */
  id: string;
  /**
   * 提交信息
   */
  message: string;
};

/**
 * 类型：日志信息
 */
type TGitMessageToChangeLog = {
  /**
   * 名称，tag版本号
   */
  name: string;
  /**
   * 日期
   */
  date: string;
  /**
   * 时间
   */
  time: string;
  /**
   * 消息列表
   */
  list: TGitMessage[];
};

/**
 * 类型：包管理器命令
 */
type TpackageManagerCommands = Record<string, string> | false | 'default';

/**
 * 包管理器配置
 */
interface IPackageManagerConfig {
  /**
   * 管理器类型
   */
  type?: string;
  registry?: string;
  /**
   * 包管理器命令
   */
  commands?: TpackageManagerCommands;
}

/**
 * 类型：配置 > package
 */
type TConfigPackage =
  | {
      scripts?: Record<string, string> | false | 'default';
      manager?: IPackageManagerConfig;
    }
  | false
  | 'default';

/**
 * 类型：配置 > 版本控制配置
 */
type TConfigVersion =
  | {
      /**
       * 版本号校验规则
       */
      validate?: RegExp | false | 'default';
      /**
       * 是否自动更新 package.json 中的版本号
       */
      package?: boolean;
    }
  | false
  | 'default';

/**
 * 类型：配置 > changelog
 */
type TConfigChangelog =
  | {
      file?: TChangelogFileConfig;
      translate?: TChangelogTranslateConfig;
      template?: TChangelogTemplateConfig;
      poweredby?: boolean;
    }
  | false
  | 'default';

/**
 * 接口：配置
 */
interface IConfig {
  commit?: TConfigCommit;
  package?: TConfigPackage;
  version?: TConfigVersion;
  changelog?: TConfigChangelog;
  i18n?: any;
}

/**
 * 接口：返回配置信息
 */
interface IConfigResult {
  /**
   * 配置信息
   */
  config: IConfig;
  /**
   * 配置文件的路径
   */
  path: string;
}

/**
 * 类型：返回配置信息
 */
type TConfigResult = IConfigResult | false;

/**
 * 类型：语言名称列表
 */
type TLangName =
  | 'afrikaans'
  | 'albanian'
  | 'amharic'
  | 'arabic'
  | 'armenian'
  | 'assamese'
  | 'aymara'
  | 'azerbaijani'
  | 'bambara'
  | 'basque'
  | 'belarusian'
  | 'bengali'
  | 'bhojpuri'
  | 'bosnian'
  | 'bulgarian'
  | 'catalan'
  | 'cebuano'
  | 'chineseSimplified'
  | 'chineseTraditionalTW'
  | 'corsican'
  | 'croatian'
  | 'czech'
  | 'danish'
  | 'dhivehi'
  | 'dogri'
  | 'dutch'
  | 'english'
  | 'esperanto'
  | 'estonian'
  | 'ewe'
  | 'filipino'
  | 'finnish'
  | 'french'
  | 'frisian'
  | 'galician'
  | 'georgian'
  | 'german'
  | 'greek'
  | 'guarani'
  | 'gujarati'
  | 'haitianCreole'
  | 'hausa'
  | 'hawaiian'
  | 'hebrew'
  | 'hindi'
  | 'hmong'
  | 'hungarian'
  | 'icelandic'
  | 'igbo'
  | 'ilocano'
  | 'indonesian'
  | 'irish'
  | 'italian'
  | 'japanese'
  | 'javanese'
  | 'kannada'
  | 'kazakh'
  | 'khmer'
  | 'kinyarwanda'
  | 'konkani'
  | 'korean'
  | 'krio'
  | 'kurdish'
  | 'kurdishSorani'
  | 'kyrgyz'
  | 'lao'
  | 'latin'
  | 'latvian'
  | 'lingala'
  | 'lithuanian'
  | 'luganda'
  | 'luxembourgish'
  | 'macedonian'
  | 'maithili'
  | 'malagasy'
  | 'malay'
  | 'malayalam'
  | 'maltese'
  | 'maori'
  | 'marathi'
  | 'meitei'
  | 'mizo'
  | 'mongolian'
  | 'myanmar'
  | 'nepali'
  | 'norwegian'
  | 'nyanja'
  | 'odia'
  | 'oromo'
  | 'pashto'
  | 'persian'
  | 'polish'
  | 'portuguese'
  | 'punjabi'
  | 'quechua'
  | 'romanian'
  | 'russian'
  | 'samoan'
  | 'sanskrit'
  | 'scottishGaelic'
  | 'sepedit'
  | 'serbian'
  | 'sesotho'
  | 'shona'
  | 'sindhi'
  | 'sinhala'
  | 'slovak'
  | 'slovenian'
  | 'somali'
  | 'spanish'
  | 'sundanese'
  | 'swahili'
  | 'swedish'
  | 'tagalog'
  | 'tajik'
  | 'tamil'
  | 'tatar'
  | 'telugu'
  | 'thai'
  | 'tigrinya'
  | 'tsonga'
  | 'turkish'
  | 'turkmen'
  | 'twi'
  | 'ukrainian'
  | 'urdu'
  | 'uighur'
  | 'uzbek'
  | 'vietnamese'
  | 'welsh'
  | 'xhosa'
  | 'yiddish'
  | 'yoruba'
  | 'zulu';

/**
 * 接口：语言 > 名称和代码，是 google 翻译器和 yandex 翻译器的共同支持的
 */
interface ILanguage {
  /**
   * 语言名称
   */
  name: string;
  /**
   * 语言代码
   */
  code: string;
}

/**
 * 类型：选择项 > 列表
 */
type TSelectChoice<Value> = {
  value: Value;
  name?: string;
  description?: string;
  disabled?: boolean | string;
  type?: never;
};

/**
 * 类型：选择项 > 数组
 */
type TSelectChoices<Value> = Separator | TSelectChoice<Value>;

/**
 * 类型：选择项 > 复选框
 */
type TCheckboxChoice<Value> = {
  name?: string;
  value: Value;
  disabled?: boolean | string;
  checked?: boolean;
  type?: never;
};

/**
 * 类型：选择项数组
 */
type TCheckboxChoices<Value> = Separator | TCheckboxChoice<Value>;

/**
 * 接口：提示信息 > 选择
 */
interface ISelectOptions {
  /**
   * 信息
   */
  message: string;
  /**
   * 选择项数组
   */
  choices: TSelectChoices<unknown>[];
  /**
   * 每页显示的选项个数
   */
  pageSize?: number;
  /**
   * 是否循环
   */
  loop?: boolean;
  /**
   * 默认值
   */
  default?: unknown;
  /**
   * 说明是否暗色调
   */
  descriptionDim?: boolean;
}

/**
 * 接口：提示信息 > 复选框
 */
interface ICheckboxOptions {
  /**
   * 信息
   */
  message: string;
  /**
   * 选择项数组
   */
  choices: TCheckboxChoices<unknown>[];
  /**
   * 每页显示的选项个数
   */
  pageSize?: number;
  /**
   * 是否循环
   */
  loop?: boolean;
  /**
   * 提示
   */
  instructions: string;
  /**
   * 校验
   * @param {ReadonlyArray<TCheckboxChoices<unknown>>} items 选择项数组
   * @returns {boolean | string | Promise<string | boolean>} 校验结果
   */
  validate?: (items: ReadonlyArray<TCheckboxChoices<unknown>>) => boolean | string | Promise<string | boolean>;
}

/**
 * 接口：提示信息 > 输入框
 */
interface IInputOptions {
  /**
   * 提示信息
   */
  message: string;
  /**
   * 默认值
   */
  default?: string | number | boolean | RegExp;
  /**
   * 转换器
   */
  transformer?: (value: string, { isFinal }: { isFinal: boolean }) => string;
  /**
   * 验证器
   */
  validate?: (value: string) => boolean | string | Promise<string | boolean>;
}

/**
 * 接口：提示信息 > 编辑器
 */
interface IEditorOptions {
  /**
   * 提示信息
   */
  message: string;
  /**
   * 默认值
   */
  default?: string;
  /**
   * 验证器
   */
  validate?: (value: string) => boolean | string | Promise<string | boolean>;
  /**
   * 后缀，扩展名
   */
  postfix?: string;
  /**
   * 是否等待用户输入，如果为 `true`，则需要用户按回车键才会继续执行。
   */
  waitForUseInput?: boolean;
}

/**
 * 接口：返回结果 > 配置 > 基础
 */
interface IResultConfigBase {
  /**
   * 语言
   */
  lang: ILanguage;
  /**
   * 如果配置文件存在，是否覆盖
   */
  overwrite: boolean;
  /**
   * 规范：mjs（ES Modules）或 cjs（CommonJS）
   */
  standard: boolean;
  /**
   * 配置文件扩展名
   */
  extension: string;
}

/**
 * 接口：返回结果 > 配置 > 提交信息
 */
interface IResultConfigCommit {
  /**
   * 是否独立 commit type 和 commit scope 为单独文件
   */
  standalone: boolean;
  /**
   * 是否使用英文
   */
  contentEnglish: boolean;
  /**
   * 所使用的语言
   */
  messageLangCode: string;
  /**
   * 保存的目录
   */
  saveDir: string;
  /**
   * 配置
   */
  config: TConfigCommit;
}

/**
 * 类型：Git > 自定义字段
 */
type TGitCustomField = {
  type: string;
  field?: string;
  value: string;
};

/**
 * 类型：Git > issue
 */
type TGitIssue = {
  close: string;
  ids: string;
};

/**
 * 接口：Git > 提交信息
 */
interface IGitCommitData {
  type: string;
  scope?: string;
  subject: string;
  body?: string;
  breaking?: string;
  custom?: TGitCustomField[];
  issues?: TGitIssue[];
}

/**
 * 接口：包版本标准
 */
interface IPackageVersionSemverStandard {
  /**
   * 版本号
   */
  version: string;
  /**
   * 非语义化版本号
   */
  standard: boolean;
}

/**
 * 接口：包版本号信息
 */
interface IPackagesVersions {
  /**
   * 补丁更新
   */
  patch: IPackageVersionSemverStandard;
  /**
   * 次要更新
   */
  minor: IPackageVersionSemverStandard;
  /**
   * 主要更新
   */
  major: IPackageVersionSemverStandard;
  /**
   * 最新预发布版本
   */
  prerelease: IPackageVersionSemverStandard;
  /**
   * 缺失
   */
  missing: boolean;
  /**
   * 无更新
   */
  no: boolean;
}

/**
 * 接口：包版本号信息
 */
interface IPackagesVersions {
  /**
   * 当前版本
   */
  current: IPackageVersionSemverStandard;
  /**
   * 主要更新
   */
  major: IPackageVersionSemverStandard;
  /**
   * 次要更新
   */
  minor: IPackageVersionSemverStandard;
  /**
   * 补丁更新
   */
  patch: IPackageVersionSemverStandard;
  /**
   * 缺失
   */
  missing: boolean;
  /**
   * 无更新
   */
  no: boolean;
}

/**
 * 接口：包版本更新信息列表
 */
interface IPackagesListUpdate {
  name: string;
  version: IPackagesVersions;
}

/**
 * 接口：包版本依赖类型信息列表
 */
interface IPackagesCategoryUpdate {
  /**
   * 依赖：生产环境
   */
  prod: IPackagesListUpdate[];
  /**
   * 依赖：开发环境
   */
  dev: IPackagesListUpdate[];
}

/**
 * 类型：包版本类型
 * - major 主要更新，比如：1.0.0 -> 2.0.0
 * - minor 次要更新，比如：1.0.0 -> 1.1.0
 * - patch 补丁更新，比如：1.0.0 -> 1.0.1
 * - prerelease 预发布版本，比如：1.0.0 -> 1.0.1-beta.1、1.0.0 -> 1.0.1-rc.1、等
 * - non-semver 非语义化版本，比如：1.0.01、1-1-1、等
 */
type TPackageVersionType = 'major' | 'minor' | 'patch' | 'prerelease' | 'nonsemver';

/**
 * 接口：包版本更新信息列表
 */
interface IPackagesUpdateInfos {
  /**
   * 包名
   */
  package: string;
  /**
   * 版本号类类型
   */
  type: TPackageVersionType;
  /**
   * 当前版本
   */
  current: string;
  /**
   * 版本：更新版本
   */
  version: string;
  /**
   * 是否开发依赖
   */
  devDep: boolean;
}

/**
 * 类型：菜单类型
 */
type TMenuType = 'main' | 'scripts' | 'git' | 'package' | 'changelog' | 'exit';

export {
  IPackageJsonData,
  TPackageJsonData,
  IPackageJson,
  ICommitType,
  ICommitScope,
  TCommitScope,
  ICommitSubmit,
  TCommitSubmit,
  TConfigCommit,
  TChangelogFileConfig,
  TChangelogTranslateConfig,
  TChangelogTemplateConfig,
  TCommitCategory,
  TGitMessage,
  TGitMessageToChangeLog,
  TpackageManagerCommands,
  IPackageManagerConfig,
  TConfigPackage,
  TConfigVersion,
  TConfigChangelog,
  IConfig,
  IConfigResult,
  TConfigResult,
  TLangName,
  ILanguage,
  TSelectChoice,
  TSelectChoices,
  TCheckboxChoice,
  TCheckboxChoices,
  ISelectOptions,
  ICheckboxOptions,
  IInputOptions,
  IEditorOptions,
  IResultConfigBase,
  IResultConfigCommit,
  TGitIssue,
  TGitCustomField,
  IGitCommitData,
  IPackageVersionSemverStandard,
  IPackagesVersions,
  IPackagesListUpdate,
  IPackagesCategoryUpdate,
  TPackageVersionType,
  IPackagesUpdateInfos,
  TMenuType
};
