const list = {
  common: [
    "以下所有配置项，均支持此种配置，如：开启配置：只赋值 'default'、'{}' 或 '无此项配置' 即可，这将启用 '默认配置'; ",
    "关闭配置：只需要赋值 'false' 即可;",
    "推荐使用命令 'cvlar i' 初始化配置文件"
  ],
  commit: 'Git提交，方便在菜单中选择性提交内容',
  'commit.type': [
    'Git提交类型，赋值数组，如下所示：',
    '[',
    '  {',
    "    emoji:'✨', 可选：不设置表示不启用表情",
    "    name:'Feature', 必须：提交类型名称，将作为 Git 提交消息的一部分，如：✨Feature(Scopes)：新特性",
    "    description:'新特性' 必须：用于在菜单中做备注说明，不会出现在 Git 提交消息中",
    '  },',
    '  {',
    "    emoji:'🐛',",
    "    name:'Fix',",
    "    description:'修复Bug'",
    '  },',
    '  ...',
    ']'
  ],
  'commit.scope': [
    'Git提交范围，赋值数组，如下所示：',
    '[',
    '  {',
    "    name:'i18n', 必须：提交范围名称，将作为 Git 提交消息的一部分，如：✨Feature(i18n)：新特性",
    "    description:'国际化' 必须：用于在菜单中做备注说明，不会出现在 Git 提交消息中",
    '  },',
    '  {',
    "    name:'docs',",
    "    description:'文档更新'",
    '  },',
    '  ...',
    ']'
  ],
  'commit.submit': "使用自己的语言描述 'Git提交信息'，而后会通过 'Google翻译' 自动翻译成 '英语'，再执行 'Git提交'",
  'commit.submit.origin': ["你想通过什么语言来描述 'Git提交信息'", '  支持的语言列表：https://cloud.google.com/translate/docs/languages'],
  'commit.submit.target': ["你想将 'Git提交信息' 翻译成什么语言，支持的语言列表同上", '  支持的语言列表：https://cloud.google.com/translate/docs/languages'],
  package: '包管理，方便在菜单中选择性执行特定命令',
  'package.scripts': [
    'package.json 中的 scripts 配置项，赋值对象，如下所示：',
    '{',
    "  dev: 'npm run dev',",
    "  build: 'npm run build',",
    "  'test:watch': 'npm run build',",
    '  ...',
    '}',
    '',
    '格式说明：',
    "  key：必须，表示命令名称，必须和 'package.json' 中的 'scripts' 配置项中的 'key' 一致，否则无法正确执行命令",
    '  value：必须，表示命令描述，用于在菜单中做说明',
    '    空字符串，在菜单中，将直接使用key表示',
    '    非空字符串，在菜单中，将直接使用value表示'
  ],
  'package.manager': '包管理工具',
  'package.manager.type': ['包管理工具类型，赋值字符串，可赋值：', 'npm, yarn, pnpm, 等其他包管理工具的名称'],
  'package.manager.registry': [
    '依赖源，默认：auto，表示按照包管理工具的默认源，一般是：https://registry.npmjs.org',
    '注意：此配置不会影响全局或当前项目的依赖源，只会影响通过本工具安装的依赖时的依赖源'
  ],
  'package.manager.commands': [
    '包管理命令，格式说明：',
    "  key：必须，表示命令名称，例如 'npm install xxx'，'key' 就是 'install'",
    '  value：必须，表示命令描述，用于在菜单中做说明',
    '    空字符串，在菜单中，将直接使用key表示',
    '    非空字符串，在菜单中，将直接使用value表示',
    '注意：',
    '  1. 以下默认命令，均以 npm 为准，您可自行修改',
    '  2. 如果您使用的是 yarn 或 pnpm，可能会出现不兼容的情况，',
    '     您可以自行修改与之对应的命令即可',
    '  3. 新版本的 npm/yarn/pnpm 命令均互相兼容，',
    '     若出现不兼容的情况，自行修改下方命令或升级包管理工具'
  ],
  version: '版本管理，可用于升级、撤销 版本号，自动升级和提交',
  'version.validate': [
    '验证版本号的正则表达式，正则对象',
    '  正则说明：https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string',
    '  正则演示：https://regex101.com/r/vkijKf/1/'
  ],
  'version.package': '是否自动更新 package.json 中的版本号，布尔类型，默认：true',
  changelog: '日志，自动根据 Git 提交记录生成日志',
  'changelog.file': '日志文件相关配置',
  'changelog.file.limit': [
    'CHANGELOG 文件中记录版本的条数',
    '  0表示不限制，全部记录; ',
    '  默认 10 条版本号的日志（不是只能写10行日志，而是10个版本的记录）',
    '  表示每个文件最多记录 10 条，且自动分页',
    '  超过 10 条则自动创建新的 CHANGELOG 文件，文件名为 md5(content).md，以此类推',
    '',
    '  若是没有满足 limit 条数，则会将所有的日志都存放在这个目录中的 index.md 文件中；',
    '  当有不同翻译版本时，会依据语言代码自动创建对应目录，例如：zh-CN/index.md、en/index.md、等；',
    '  你可以在项目根目录下创建一个 CHANGELOG.md 文件，链接到这个目录中的 index.md 文件；',
    '',
    '  如果已应用此配置，并且生成了日志，它只会影响后续生成的日志',
    '  如果想要全部应用新的配置',
    '    使用 `日志管理` 功能，`重新生成日志` 或 `清理日志` 后，再 `重新生成`'
  ],
  'changelog.save': '日志存储的目录',
  'changelog.translate': '日志翻译相关配置',
  'changelog.translate.origin': ["CHANGELOG 文件的原始语言，default 'zh-CN'", '  支持的语言列表：https://cloud.google.com/translate/docs/languages'],
  'changelog.translate.target': ["CHANGELOG 文件的目标语言，default 'en'，可以是数组，表示翻译成多种语言", '  支持的语言列表：https://cloud.google.com/translate/docs/languages'],
  'changelog.translate.statement': [
    '翻译声明开头标记，默认值：> 🚩',
    "支持 'md语法'",
    "  仅在 '通过翻译工具翻译时'，才会在译文开头添加此声明",
    '  例如：',
    '    以下内容由 Google翻译 自动翻译，可能存在不准确之处',
    "    此声明文案，也会被 '翻译工具' 翻译成不同版本",
    '  参考：https://github.com/kwooshung/cvlar/releases'
  ],
  'changelog.template': '日志模板相关配置',
  'changelog.template.before': 'CHANGELOG 文件的头部模板，支持 md 语法',
  'changelog.template.content': ['CHANGELOG 文件的内容模板，支持 md 语法', '  默认值：', '    ## 🎉 {{tag}} `{{date}}`', '    {{logs}}', '  日志会按照提交类型顺序分类'],
  'changelog.template.separator': 'CHANGELOG 文件中，每个版本日志之间的分隔符，支持 md 语法',
  'changelog.template.after': 'CHANGELOG 文件的尾部模板，支持 md 语法',
  'changelog.poweredby': [
    '布尔类型，默认：true',
    "是否在 'Github Release' 内容中，每条 'Release' 的最后，加入如下md代码：",
    '  This [Changelog](/{0}), Powered by @kwooshung / [cvlar](https://github.com/kwooshung/cvlar/)',
    "  其中，{0} 表示当前 您仓库中 'Changelog' 入口文件的相对路径",
    '  参考：https://github.com/kwooshung/cvlar/releases'
  ],
  i18n: ['用于此工具提示信息的国际化配置', '可自定义任何语言，以下内容根据内容自行翻译需要的语言即可']
};

export default list;
