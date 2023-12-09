import cvlarTypes from './scripts/ks-cvlar.types.mjs';
import cvlarScopes from './scripts/ks-cvlar.scopes.mjs';

/**
 * 以下所有配置项，均支持此种配置，如：开启配置：只赋值 'default'、'{}' 或 '无此项配置' 即可，这将启用 '默认配置';
 * 关闭配置：只需要赋值 'false' 即可;
 * 推荐使用命令 'cvlar i' 初始化配置文件
 */
export default {
  // Git提交，方便在菜单中选择性提交内容
  commit: {
    types: cvlarTypes,
    scopes: cvlarScopes,
    // 使用自己的语言描述 'Git提交信息'，而后会通过 'Google翻译' 自动翻译成 '英语'，再执行 'Git提交'
    submit: {
      /**
       * 你想通过什么语言来描述 'Git提交信息'
       *   支持的语言列表：https://cloud.google.com/translate/docs/languages
       */
      origin: 'zh-CN',
      /**
       * 你想将 'Git提交信息' 翻译成什么语言，支持的语言列表同上
       *   支持的语言列表：https://cloud.google.com/translate/docs/languages
       */
      target: 'en'
    }
  },
  // 包管理，方便在菜单中选择性执行特定命令
  package: {
    /**
     * package.json 中的 scripts 配置项，赋值对象，如下所示：
     * {
     *   dev: 'npm run dev',
     *   build: 'npm run build',
     *   'test:watch': 'npm run build',
     *   ...
     * }
     *
     * 格式说明：
     *   key：必须，表示命令名称，必须和 'package.json' 中的 'scripts' 配置项中的 'key' 一致，否则无法正确执行命令
     *   value：必须，表示命令描述，用于在菜单中做说明
     *     空字符串，在菜单中，将直接使用key表示
     *     非空字符串，在菜单中，将直接使用value表示
     */
    scripts: {
      prepare: 'prepare',
      dev: 'dev',
      build: 'build',
      eslint: 'eslint',
      test: 'test',
      'test:ci': 'test:ci',
      'test:watch': 'test:watch'
    },
    // 包管理工具
    manager: {
      /**
       * 包管理工具类型，赋值字符串，可赋值：
       * npm, yarn, pnpm, 等其他包管理工具的名称
       */
      type: 'pnpm',
      /**
       * 依赖源，默认：auto，表示按照包管理工具的默认源，一般是：https://registry.npmjs.org
       * 注意：此配置不会影响全局或当前项目的依赖源，只会影响通过本工具安装的依赖时的依赖源
       */
      registry: 'auto',
      /**
       * 包管理命令，格式说明：
       *   key：必须，表示命令名称，例如 'npm install xxx'，'key' 就是 'install'
       *   value：必须，表示命令描述，用于在菜单中做说明
       *     空字符串，在菜单中，将直接使用key表示
       *     非空字符串，在菜单中，将直接使用value表示
       * 注意：
       *   1. 以下默认命令，均以 npm 为准，您可自行修改
       *   2. 如果您使用的是 yarn 或 pnpm，可能会出现不兼容的情况，
       *      您可以自行修改与之对应的命令即可
       *   3. 新版本的 npm/yarn/pnpm 命令均互相兼容，
       *      若出现不兼容的情况，自行修改下方命令或升级包管理工具
       */
      commands: {
        install: '安装',
        uninstall: '卸载',
        update: '更新',
        outdated: '检查是否过时',
        list: '查看列表',
        info: '查看信息',
        search: '搜索',
        login: '登录',
        publish: '发布'
      }
    }
  },
  // 版本管理，可用于升级、撤销 版本号，自动升级和提交
  version: {
    /**
     * 验证版本号的正则表达式，正则对象
     *   正则说明：https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
     *   正则演示：https://regex101.com/r/vkijKf/1/
     */
    validate: 'default',
    // 是否自动更新 package.json 中的版本号，布尔类型，默认：true
    package: true
  },
  // 日志，自动根据 Git 提交记录生成日志
  changelog: {
    // 日志文件相关配置
    file: {
      /**
       * CHANGELOG 文件中记录版本的条数
       *   0表示不限制，全部记录;
       *   默认 10 条版本号的日志（不是只能写10行日志，而是10个版本的记录）
       *   表示每个文件最多记录 10 条，且自动分页
       *   超过 10 条则自动创建新的 CHANGELOG 文件，文件名为 md5(content).md，以此类推
       *
       *   如果已应用此配置，并且生成了日志，它只会影响后续生成的日志
       *   如果想要全部应用新的配置
       *     需要先删除 history 目录下的所有文件以及 save 中指定的文件
       */
      limit: '10',
      history: './changelogs',
      save: './changelog'
    },
    // 日志翻译相关配置
    translate: {
      /**
       * CHANGELOG 文件的原始语言，default 'zh-CN'
       *   支持的语言列表：https://cloud.google.com/translate/docs/languages
       */
      origin: 'en',
      /**
       * CHANGELOG 文件的目标语言，default 'en'，可以是数组，表示翻译成多种语言
       *   支持的语言列表：https://cloud.google.com/translate/docs/languages
       */
      target: ['zh-CN', 'zh-TW', 'ru', 'ja', 'ko'],
      /**
       * 翻译声明开头标记，默认值：> 🚩
       * 支持 'md语法'
       *   仅在 '通过翻译工具翻译时'，才会在译文开头添加此声明
       *   例如：
       *     以下内容由 Google翻译 自动翻译，可能存在不准确之处
       *     此声明文案，也会被 '翻译工具' 翻译成不同版本
       *   参考：https://github.com/kwooshung/cvlar/releases
       */
      statement: '> 🚩 '
    },
    // 日志模板相关配置
    template: {
      // CHANGELOG 文件的头部模板，支持 md 语法
      before: '',
      /**
       * CHANGELOG 文件的内容模板，支持 md 语法
       *   默认值：
       *     ## 🎉 {{tag}} `{{date}}`
       *     {{logs}}
       *   日志会按照提交类型顺序分类
       */
      content: '## 🎉 {{tag}} `{{date}}`\\n{{logs}}',
      // CHANGELOG 文件中，每个版本日志之间的分隔符，支持 md 语法
      separator: '\\n\\n---\\n\\n',
      // CHANGELOG 文件的尾部模板，支持 md 语法
      after: ''
    },
    /**
     * 布尔类型，默认：true
     * 是否在 'Github Release' 内容中，每条 'Release' 的最后，加入如下md代码：
     *   This [Changelog](/{0}), Powered by @kwooshung / [cvlar](https://github.com/kwooshung/cvlar/)
     *   其中，{0} 表示当前 您仓库中 'Changelog' 入口文件的相对路径
     *   参考：https://github.com/kwooshung/cvlar/releases
     */
    poweredby: true
  },
  /**
   * 用于此工具提示信息的国际化配置
   * 可自定义任何语言，以下内容根据内容自行翻译需要的语言即可
   */
  i18n: {
    yes: '是',
    no: '否',
    choicesLimit: 15,
    checkbox: {
      instructions: '按<空格>进行选择，按<a>切换全部，按<i>反转选择，按<回车>确认选择'
    },
    select: '我想 ...',
    scripts: {
      message: '运行',
      description: '选择要运行的脚本',
      select: {
        message: '主菜单 > 运行 > 选择脚本'
      }
    },
    git: {
      message: 'Git',
      description: 'Git版本控制',
      select: {
        message: '主菜单 > 版本控制'
      },
      commit: {
        message: '提交代码',
        description: '提交代码到 Git 仓库',
        title: '主菜单 > 版本控制 > 提交代码',
        type: {
          message: '选择提交类型'
        },
        scope: {
          message: '选择修改范围'
        },
        //支持：transformer & validate
        subject: {
          message: '短说明',
          description: '不建议超过72个字符',
          validate: (val) => {
            val = val.trim();
            if (val.length <= 0) {
              return '短说明不能为空';
            } else if (val.length > 72) {
              return '短说明不能超过72个字符';
            }
            return true;
          }
        },
        //支持：transformer & validate
        body: {
          message: '长说明',
          description: '使用 "|" 换行',
          // 此处验证函数，若是开启，则 required, requiredMessage 不再生效，需自行处理逻辑
          // transformer: (val, {isFinal}) => {
          //   if (isFinal) {
          //     return val;
          //   }
          //   return val;
          // },
          // 此处验证函数，若是开启，则 required, requiredMessage 不再生效，需自行处理逻辑
          // validate: (val) => {
          // },
          required: false,
          requiredMessage: '长说明不能为空'
        },
        //支持：transformer & validate
        breaking: {
          message: 'BREAKING CHANGES（破坏性变更，不向下兼容）',
          field: 'BREAKING CHANGE: ',
          // 此处验证函数，若是开启，则 required, requiredMessage 不再生效，需自行处理逻辑
          // validate: (val) => {
          // },
          required: false,
          requiredMessage: '长说明不能为空'
        },
        issues: {
          message: '是否需要关闭 issue？',
          default: false, // true：自动选择是，false：自动选择否，默认：false
          close: {
            message: '选择关闭 issue 的关键词，支持多选',
            choices: [
              {
                name: '修复',
                value: 'fixes',
                description: '修复'
              },
              {
                name: '增强',
                value: 'resolves',
                description: '增强'
              },
              {
                name: '关闭',
                value: 'closes',
                description: '关闭'
              }
            ],
            number: {
              message: '{0} 的 issue 编号 (例如：#11 #17 #27)'
            }
          }
        },
        /**
         * 自定义字段，支持两种类型：input、select、checkbox
         * 以下定义内容为演示，可自行修改
         * 若不需要，可删除 'custom' 字段 或 将 'custom' 字段赋值为 'false'
         */
        custom: [
          {
            // 可选，字段不存在或为空或为false时，内容则为 'test1xxx'，否则为 'xxx'
            field: 'test1',
            // 类型，可选：'input'、'select'  默认 input
            type: 'input',
            // 提示信息
            message: '这是一个输入演示，随便输入点儿内容，并按下英文逗号试试',
            transformer: (val, { isFinal }) => {
              // 输入完成，按回车后，触发此函数，此处可做一些处理
              if (isFinal) {
                return val.split(' - ').join(', ');
              }
              // 输入中，每输入一个字符，都会触发此函数，此处可做一些处理
              else {
                return val.split(',').join(' - ');
              }
            },
            // 可选，此验证函数，若是存在，则 required, requiredMessage 不再生效，需自行处理逻辑
            validate: (val) => {
              if (val.length <= 0) {
                return '输入不能为空';
              }
              return true;
            }
            // required: false,
            // requiredMessage: 'xxx不能为空'
          },
          {
            field: 'test2: ', // 可选，字段不存在或为空或为false时，内容则为 'test2: xxx'，否则为 'xxx'
            type: 'select', // 类型，可选：'input'、'select'  默认 input
            message: '这是一个单选演示', // 提示信息
            choices: [
              {
                name: '选项1', // 选项名称
                value: 'a', // 选项值
                description: '说明1' // 扩展说明，为空或不存在时，不显示
              },
              {
                name: '选项2',
                value: 'b'
              },
              {
                name: '选项3',
                value: 'c',
                description: '说明3'
              },
              {
                name: '选项4',
                value: 'd',
                description: '说明4'
              },
              {
                name: '选项5',
                value: 'e',
                description: '说明5'
              },
              {
                name: '选项6',
                value: 'f',
                description: '说明6'
              },
              {
                name: '选项7',
                value: 'g',
                description: '说明7'
              },
              {
                name: '选项8',
                value: 'h',
                description: '说明8'
              },
              {
                name: '选项9',
                value: 'i',
                description: '说明9'
              },
              {
                name: '选项10',
                value: 'j',
                description: '说明10'
              },
              {
                name: '选项11',
                value: 'k',
                description: '说明11'
              },
              {
                name: '选项12',
                value: 'l',
                description: '说明12'
              },
              {
                name: '选项13',
                value: 'm',
                description: '说明13'
              },
              {
                name: '选项14',
                value: 'n',
                description: '说明14'
              },
              {
                name: '选项15',
                value: 'o',
                description: '说明15'
              },
              {
                name: '选项16',
                value: 'p',
                description: '说明16'
              },
              {
                name: '选项17',
                value: 'q',
                description: '说明17'
              },
              {
                name: '选项18',
                value: 'r',
                description: '说明18'
              },
              {
                name: '选项19',
                value: 's',
                description: '说明19'
              },
              {
                name: '选项20',
                value: 't',
                description: '说明20'
              }
            ],
            choicesLimit: 5, // 可选，否则使用上面定义的 i18n.itemLimit
            loop: false, // 可选，默认true，表示选项是循环显示的
            default: 'b' // 默认选中的选项值
          },
          {
            field: false,
            type: 'checkbox', // 类型，可选：'input'、'select'  默认 input
            message: '这是一个多选演示', // 提示信息
            choices: [
              {
                name: '选项1', // 选项名称
                value: 'm-a' // 选项值
              },
              {
                name: '选项2',
                value: 'm-b',
                description: '说明2',
                checked: true // 默认选中
              },
              {
                name: '选项3',
                value: 'm-c',
                description: '说明3'
              },
              {
                name: '选项4',
                value: 'm-d',
                description: '说明4'
              },
              {
                name: '选项5',
                value: 'm-e',
                description: '说明5'
              },
              {
                name: '选项6',
                value: 'm-f',
                description: '说明6'
              },
              {
                name: '选项7',
                value: 'm-g',
                description: '说明7'
              },
              {
                name: '选项8',
                value: 'm-h',
                description: '说明8'
              },
              {
                name: '选项9',
                value: 'm-i',
                description: '说明9'
              },
              {
                name: '选项10',
                value: 'm-j',
                description: '说明10'
              },
              {
                name: '选项11',
                value: 'm-k',
                description: '说明11'
              },
              {
                name: '选项12',
                value: 'm-l',
                description: '说明12'
              },
              {
                name: '选项13',
                value: 'm-m',
                description: '说明13'
              },
              {
                name: '选项14',
                value: 'm-n',
                description: '说明14'
              },
              {
                name: '选项15',
                value: 'm-o',
                description: '说明15'
              },
              {
                name: '选项16',
                value: 'm-p',
                description: '说明16'
              },
              {
                name: '选项17',
                value: 'm-q',
                description: '说明17'
              },
              {
                name: '选项18',
                value: 'm-r',
                description: '说明18'
              },
              {
                name: '选项19',
                value: 'm-s',
                description: '说明19'
              },
              {
                name: '选项20',
                value: 'm-t',
                description: '说明20'
              }
            ],
            loop: true // 可选，默认true，表示选项是循环显示的
          }
        ],
        translate: {
          connect: {
            message: '正在连接 Google翻译，并检查是否可用...',
            success: '连接 Google翻译 成功',
            fail: '连接 Google翻译 失败'
          },
          process: {
            message: '正在翻译提交信息：',
            success: '翻译成功',
            fail: '翻译失败，错误信息如下：'
          },
          error: {
            config: 'commit.submit 配置项错误'
          }
        },
        /**
         * 生成提交信息后，触发此函数，可自行处理提交信息的格式
         * 返回值，是一个对象，包含两个属性，fail、val：
         *  fail：true时，则不会继续执行提交操作，
         *  val：提交信息
         * 也可用于自定义提示信息
         */
        complate(val) {
          return { fail: false, val };
        },
        confirm: {
          message: '请确认最终信息正确？',
          yes: '正确，直接提交',
          no: '不准确，使用 `文本编辑器` 修改后提交',
          editor: {
            message: '按下 <回车> 键，打开 `文本编辑器`，修改后保存并关闭，即可提交'
          }
        }
      },
      version: {
        message: '版本号',
        description: '版本号管理，可用于升级、撤销 版本号，自动升级和提交',
        select: {
          message: '主菜单 > 版本控制 > 版本号'
        },
        category: {
          major: {
            message: '主要更新',
            description: '可能引入了不向后兼容的 API 更改或重大功能更改。'
          },
          minor: {
            message: '次要更新',
            description: '新的向后兼容功能，建议在确定新功能对项目有用时进行更新。'
          },
          patch: {
            message: '补丁更新',
            description: '通常用于小的错误修复和更新，不影响软件的主要功能和向后兼容性。'
          },
          prerelease: {
            message: '预发布',
            description: '预发布版本，可能包含新功能，也可能包含错误修复。'
          },
          nonsemver: {
            message: '不符合语义化版本规范',
            description: '表示包的版本号不符合语义化版本规范（SemVer），通常是版本号小于 1.0.0。这些版本可能不稳定，会引入较大的更改，因此需要谨慎使用。'
          }
        }
      }
    },
    package: {
      message: '包管理',
      description: '安装，更新，卸载，查看，登录，发布 等',
      dependencies: '↓↓↓↓↓ [生产依赖] ↓↓↓↓↓',
      devDependencies: '↓↓↓↓↓ [开发依赖] ↓↓↓↓↓',
      commands: {
        message: '主菜单 > 包管理 > 选择命令',
        install: {
          message: '包名：',
          description: `格式：vue react | vite vitest\n说明：\n    · '|' 左边表示 'dependencies，右边表示 'devDependencies'\n    · 若是单独安装 'dependencies'，则不需要 '|'\n    · 若是单独安装 'devDependencies'，只需 '| vite vitest'`,
          error: {
            format: '格式错误，请重新输入'
          }
        },
        uninstall: {
          message: '选择要卸载的包'
        },
        update: {
          message: '选择要更新的包',
          loadings: {
            reading: '正在读取 package.json 文件 ...',
            request: '正在拉取 https://registry.npmjs.org ...',
            analysing: '正在分析依赖 ... {0}'
          },
          error: {
            noUpdate: '没有更新的包，是否重新检查？',
            nonSelect: '请先选择要更新的包'
          },
          dev: '开发依赖',
          prod: '生产依赖',
          category: {
            major: {
              message: '主要更新',
              description: '可能引入了不向后兼容的 API 更改或重大功能更改。建议在更新之前仔细查看更新日志和文档，确保新版本不会破坏项目。'
            },
            minor: {
              message: '次要更新',
              description: '新的向后兼容功能，建议在确定新功能对项目有用时进行更新。'
            },
            patch: {
              message: '补丁更新',
              description: '通常用于小的错误修复和更新，不影响软件的主要功能和向后兼容性。'
            },
            prerelease: {
              message: '预发布',
              description: '预发布版本，可能包含新功能，也可能包含错误修复。请慎重更新。'
            },
            nonsemver: {
              message: '不符合语义化版本规范',
              description: '表示包的版本号不符合语义化版本规范（SemVer），通常是版本号小于 1.0.0。这些版本可能不稳定，会引入较大的更改，因此需要谨慎使用。'
            }
          }
        },
        list: {
          dependencies: '生产依赖',
          devDependencies: '开发依赖'
        },
        info: {
          message: '选择要查看详情的包',
          link: '主页：',
          other: '还要查看其他包的信息吗？'
        },
        search: {
          message: '搜索包名：',
          loading: '正在从 https://www.npmjs.com/ 拉取搜索数据，请稍等...',
          result: {
            date: {
              format: 'YYYY-MM-DD HH:mm:ss',
              second: '秒前',
              seconds: '秒前',
              minute: '分钟前',
              minutes: '分钟前',
              hour: '小时前',
              hours: '小时前',
              day: '天前',
              days: '天前',
              week: '周前',
              weeks: '周前',
              month: '月前',
              months: '月前'
            },
            flags: {
              insecure: {
                yes: '不安全：',
                no: '安全'
              },
              unstable: {
                yes: '不稳定',
                no: '稳定'
              }
            },
            score: {
              final: '综合：',
              quality: '质量：',
              popularity: '欢迎：',
              maintenance: '维护：',
              process: {
                // symbol: ['-', '.'],
                length: 50,
                activeBold: false
              }
            },
            fields: {
              author: '作者：',
              keywords: '关键词：',
              description: '描述：'
            },
            error: {
              empty: '请输入搜索内容',
              abnormal: '搜索出现异常，请重试，错误信息如下：'
            }
          },
          pagination: {
            message: '找到了 {0} 条结果，每页 {1} 条，总共 {2} 页，当前第 {3} 页，你打算：',
            size: 10, // 每页条数
            range: 10, // 页码范围
            next: '下一页',
            prev: '上一页',
            n: '第 {0} 页',
            first: '首页',
            last: '尾页',
            goto: {
              jump: '跳转指定页',
              message: '请输入页码：',
              error: '页码格式错误，请重新输入'
            },
            delimiter: {
              keyword: '关键词：',
              result: '结果：',
              pageSize: '每页：',
              pageTotal: '总页：',
              pageCurrent: '当前：'
            },
            error: {
              format: '格式错误，请重新输入'
            }
          },
          error: {
            input: '请输入搜索内容'
          }
        }
      }
    },
    changelog: {
      message: '日志管理'
    },
    help: {
      message: '帮助',
      description: '查看帮助信息'
    },
    back: {
      message: '..',
      description: '返回上级菜单'
    },
    exit: {
      message: '退出'
    }
  }
};
