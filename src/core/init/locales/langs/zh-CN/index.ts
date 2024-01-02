import pc from 'picocolors';
import { version } from '@/utils';

const lang = {
  colon: '：',
  yes: '是',
  no: '否',
  enabled: '启用',
  disabled: '禁用',
  fileExists: '{0} 已存在，是否覆盖？',
  filesExists: '{0} 已存在，是否覆盖？',
  recommend: pc.green('推荐'),
  checkbox: {
    instructions: '按<空格>进行选择，按<a>切换全部，按<i>反转选择，按<回车>确认选择'
  },
  exits: {
    message: '检测到已存在配置文件，是否覆盖？',
    description: {
      yes: '配置完毕后，会覆盖原有配置文件',
      no: '会退出'
    }
  },
  basic: {
    title: '基础',
    standard: {
      message: '你打算使用那种规范？'
    },
    extension: {
      message: '配置文件的扩展名？'
    }
  },
  commit: {
    title: '提交',
    message: 'commit 提交功能',
    lint: {
      message: 'commitlint 规范',
      standalone: {
        message: `检测到 ${pc.green('commitlint')} 已安装，建议将 ${pc.green('commit type/scope')} 独立为单文件，方便统一配置，是否独立？`
      },
      emoji: {
        message: 'emoji 表情？'
      },
      lang: {
        message: `${pc.green('commit type/scope')} 的说明，打算使用什么语言？`,
        other: {
          message: '其他？',
          check: {
            message: `由于 ${pc.green('其他语言')} 将使用 ${pc.green('Google翻译')}，是否检查连接状态？`,
            success: `连接成功（${pc.green('✔')}），你想翻译到什么语言？`,
            fail: {
              message: `连接失败（${pc.red('✖')}），您只能从下方的列表中选择一个语言？`,
              description: '后续也可以在配置文件中修改成你需要的任何语言'
            }
          },
          translateing: pc.green('! 翻译进度：')
        },
        scope: {
          message: `${pc.green('commit scope')}，是否启用？`
        }
      }
    },
    content: {
      message: `由于 ${pc.green('commit type/scope')} 的说明，没有使用 ${pc.blue('英文')} ，是否将 ${pc.yellow('每次的提交')} 内容通过 ${pc.blue('Google翻译')} 成 ${pc.blue(
        '英文'
      )} 版本，以便全球程序员阅读？`,
      discription: '当然，通过机器翻译，可能会有不准确的地方',
      confirm: {
        message: `为了保证翻译的准确性，您确定每次 ${pc.green('commit message')} 的内容，均使用 ${pc.green('{0}')} 书写吗？`,
        description: '后续也可以在配置文件中修改成你需要的任何语言',
        other: {
          message: '那么，你想把什么语言翻译到英文？'
        }
      }
    },
    save: {
      message: `你打算将 ${pc.green('commit type/scope')}，保存到哪里？`,
      success: {
        message: `${pc.green('✔')} 保存成功，路径为：{0}`
      },
      fail: {
        message: `保存失败，是否重新保存？`
      }
    }
  },
  package: {
    title: '包管理',
    message: '包管理功能',
    description: `对包管理提供 ${pc.blue('终端界面菜单')}，优点如下：\n  1. 提升效率，优化操作，对新手友好，仅需记住一个命令 ${pc.blue(
      'cvlar'
    )} 即可；\n  2. 安装依赖、卸载依赖、更新依赖、查看依赖、查看依赖更新日志等；\n  3. scripts 管理，可对命令起别名，可通过界面选择命令；\n  ...`,
    scripts: {
      select: {
        message: '选择需要接管的 scripts？',
        error: '至少选择一个'
      }
    },
    manager: {
      message: '包管理器',
      type: {
        message: '管理器类型？',
        auto: '自动判断',
        description: '也可后续在配置文件中修改'
      },
      registry: {
        message: '依赖源？',
        description: '只影响通过此工具安装的依赖，也可后续在配置文件中修改',
        auto: {
          message: '使用包管理器的默认源',
          description: '也可后续在配置文件中修改'
        }
      },
      commands: {
        install: '安装',
        update: '更新',
        uninstall: '卸载',
        outdated: '列出过时的包',
        list: '查看列表',
        info: '查看信息',
        search: '搜索',
        login: '登录',
        publish: '发布'
      }
    }
  },
  version: {
    title: '版本管理',
    message: '版本管理功能',
    description: '启用本号升级功能，可对版本号进行 升级，指定版本号，撤销版本号等操作',
    validate: {
      message: '是否使用默认版本号校验规则？',
      description: `默认规则：${version.regex.toString()}\n      例如：${version.example}`,
      change: {
        message: `请输入新的校验规则，或者直接 ${pc.green('回车')} 使用 ${pc.yellow('默认规则')}？`
      }
    },
    package: {
      message: `修改 package.json 中的版本号${pc.green('（推荐）')}？`
    }
  },
  changelog: {
    title: '日志',
    message: '生成 changelog？',
    description: '启用 changelog 功能，可根据 commit 信息生成 changelog',
    file: {
      message: '是否配置，文件存储规则？',
      limit: {
        message: '记录多少个版本号的日志？',
        description: '默认为 10，不是只能写10行日志，而是10个版本的记录'
      },
      save: {
        message: '保存日志的目录？',
        description: '默认为 ./changelogs'
      }
    },
    translate: {
      message: '是否启用翻译？',
      origin: {
        message: {
          auto: `${pc.green('✔')} ${pc.yellow('提交信息（commit message）')} 将使用 ${pc.green('{0}')} 书写，并且自动翻译为 ${pc.green('英文')}；而日志又通过 ${pc.yellow(
            '提交信息（commit message）'
          )} 生成，因此日志原始内容就为：${pc.blue('{0}')}`,
          manual: `日志原始语言是什么？也就是你的 ${pc.yellow('提交信息（commit message）')} 是用什么语言书写？`
        },
        description: '默认为 zh-CN'
      },
      target: {
        message: `目标语言？`,
        description: '默认为 英文'
      },
      statement: {
        message: '翻译声明？',
        description:
          '    说明：将会根据不同的语言，显示不同的翻译声明，声明内容为：“以下内容由 Google翻译 自动翻译，可能存在不准确之处”\n  效果预览：> 🚩 以下内容由 Google翻译 自动翻译，可能存在不准确之处',
        content: {
          message: '声明开头内容？'
        }
      }
    },
    template: {
      message: '是否配置模板？',
      content: {
        message: '每条日志，内容模版（留空则使用默认模版）？'
      },
      logs: {
        title: {
          standard: {
            message: '标准日志标题模板，支持 `type`、`scope`、`date`, `time` 变量（默认模板适用于空白）'
          },
          other: {
            message: '非标准日志标题模板，适用于无法通过`提交类型`分类的日志'
          }
        },
        item: {
          message: '每条日志，内容模版，可用 `message`、`date`, `time`、`commitlink` 变量（留空则使用默认模版）？'
        },
        commitlink: {
          message: '每条日志，是否都在尾部加入 commit link？',
          plateforms: {
            message: '你的代码托管平台？',
            other: {
              message: '其他地址？',
              input: {
                message: '请输入完整的 url 模版'
              }
            }
          },
          author: '作者名',
          repository: '仓库名，支持 `author`、`repository`、`id` 变量'
        }
      }
    }
  },
  release: {
    title: 'Github 发布版本',
    message: '通过 Github Acitons 自动发布？',
    description: '启用 Github 发布版本 功能，可通过 Github Acitons 自动发布版本，需要Changelog 功能开启有效',
    subject: {
      message: '发布页面，tag版本标题模板'
    },
    pushTagMessage: {
      message: '给仓库创建tag时，会自动生成日志，此时tag是不会包含新的日志的，因此需要提交这些变化的文件到仓库。是否设置对应配置项？',
      description: {
        yes: '将分别设置 `type`、`scope`、`subject` 配置项',
        no: '将使用默认配置项'
      },
      type: {
        message: '选择提交类型'
      },
      scope: {
        message: '选择提交范围'
      },
      subject: {
        message: '输入提交标题，可用 `tag` 变量',
        description: '例如：新版本 {{tag}}，则表示：新版本 1.0.0'
      }
    },
    lang: {
      subject: {
        message: 'Github Release 发布，多语言内容所使用的标题'
      },
      separator: {
        message: 'Github Release 发布，多语言内容的分隔符'
      }
    },
    poweredby: {
      message: `通过 ${pc.green('Github Acitons')} 自动发布后，将在最后插入 ${pc.green('查看所有日志')} 的链接？`,
      description:
        "在 'Github Release' 内容中，每条 'Release' 的最后，加入如下md代码：\n    ------------------------------------------------------------------------------------------------------------------------\n    - This [Changelog](/CHANGELOG.md), Powered by @kwooshung /[cvlar](https://github.com/kwooshung/cvlar/)\n    ------------------------------------------------------------------------------------------------------------------------\n    其中，CHANGELOG.md 表示当前 您仓库中 'Changelog' 入口文件的相对路径\n    参考：https://github.com/kwooshung/cvlar/releases"
    }
  },
  save: {
    title: '保存',
    message: `你打算将 ${pc.green('配置文件')}，保存到哪里？`,
    filename: {
      message: '你希望配置文件的文件名是什么？'
    },
    success: {
      message: `${pc.green('✔')} 保存成功，路径为：{0}`
    },
    fail: {
      message: `${pc.red('✖')} 保存失败({0}/{1})，是否重新保存？`,
      finally: `${pc.red('✖')} 保存失败，您可以根据文档，手动创建配置文件，以下是配置文件的内容：\n\n{0}`
    },
    ing: '正在保存...'
  }
};

export default lang;
