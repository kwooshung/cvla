import { IConfig } from '@/interface';
import { types, scopes } from '..';

const user: IConfig = {
  commit: {
    types: types['zh-CN'],
    scopes: scopes['zh-CN']
  },
  package: {
    scripts: {},
    manager: {
      type: 'pnpm',
      registry: 'auto',
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
    package: true
  },
  changelog: {
    file: {
      save: './changelogs'
    },
    translate: {
      origin: 'en',
      target: ['zh-CN']
    },
    template: {
      content: '## 🎉 {{tag}} `{{date}}`\n{{logs}}',
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
    }
  },
  release: {
    subject: '🎉 {{tag}}',
    pushTagMessage: {
      type: 'release',
      scope: 'tag',
      subject: '{{tag}}'
    },
    poweredby: true
  },
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
      commit: {
        message: '提交代码',
        description: '提交代码到 Git 仓库',
        select: {
          message: '主菜单 > 版本控制'
        },
        type: {
          message: '选择提交类型'
        },
        scope: {
          message: '选择修改范围'
        },
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
        body: {
          message: '长说明',
          description: '使用 "|" 换行',
          required: false,
          requiredMessage: '长说明不能为空'
        },
        breaking: {
          message: 'BREAKING CHANGES（破坏性变更，不向下兼容）',
          field: 'BREAKING CHANGE: ',
          required: false,
          requiredMessage: '长说明不能为空'
        },
        custom: [],
        issues: {
          message: '是否需要关闭 issue？',
          default: false,
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
        complate(val: string) {
          return { fail: false, val };
        },
        confirm: {
          message: '请确认最终信息正确？',
          yes: '正确，直接提交',
          no: '不准确，使用 `文本编辑器` 修改后提交',
          editor: {
            message: '按下 <回车> 键，打开 `文本编辑器`，修改后保存并关闭，即可提交'
          }
        },
        push: {
          message: '是否推送到远程仓库？',
          default: false
        },
        tag: {
          message: '是否需要打标签？',
          default: false
        }
      },
      version: {
        message: '版本号',
        description: '版本号管理，可用于升级、撤销 版本号，自动升级和提交',
        select: {
          message: '请选择操作'
        },
        upgrade: {
          message: '升级版本（自动）',
          description: '选择 主版本号、次版本号 或 补丁版本号，自动根据 当前版本号，计算下个版本号',
          type: {
            message: '您打算升级哪个版本',
            major: {
              message: '主要',
              description: '一般引入了不向后兼容的 API 更改或重大功能更改。'
            },
            minor: {
              message: '次要',
              description: '新的向后兼容功能，建议在确定新功能对项目有用时进行更新。'
            },
            patch: {
              message: '补丁',
              description: '通常用于小的错误修复和更新，不影响软件的主要功能和向后兼容性。'
            }
          }
        },
        specify: {
          message: '升级版本（指定）',
          description: '完全由您自定义，但是也得符合语义化版本规范（SemVer）',
          input: {
            message: '请输入版本号：'
          }
        },
        downgrade: {
          message: '降级版本（回退/撤销）',
          description: '撤销指定版本号，仅撤销版本，不会对文件产生修改',
          select: {
            message: '请选择要撤销的版本号',
            confirm: {
              message: '是否修改 package.json 中的版本号？',
              default: true,
              remote: {
                message: '是否删除远程仓库中的 tag？',
                default: false
              },
              change: {
                message: '您想使用哪个版本号 package.json 中？',
                descriptions: {
                  auto: '自动计算前一个版本，但在以往的tags中，可能不存在这个版本号',
                  prevtag: '将使用前一个tag作为版本号'
                },
                specify: {
                  message: '指定版本号'
                }
              }
            },
            error: {
              no: '没有可撤销的版本号，请重新选择'
            }
          }
        },
        flag: {
          message: '是否添加发布标识符？',
          description: '可能是 稳定版本 或 预发布版本',
          select: {
            message: '选择发布标识符',
            choices: [
              {
                name: '预览版 (alpha)',
                value: 'alpha',
                description: '{0}，预览版，主要用于内部测试，可能包含很多BUG，功能不全，存在很多错误'
              },
              {
                name: '测试版 (beta)',
                value: 'beta',
                description: '{0}，该版本任然存在很多BUG，但是相对alpha版要稳定一些，会不断增加新功能'
              },
              {
                name: '候选版本 (rc)',
                value: 'rc',
                description: '{0}，这个版本接近最终产品，主要目的是查找可能的遗漏的问题。如果没有发现重大问题，这个版本可能就会成为最终发布的版本。'
              },
              {
                name: '正式版本 (stable)',
                value: 'stable',
                description: '{0}，正式版本，该版本相对稳定，基本不会再修改代码，除非发现BUG，或者出现新的需求'
              }
            ]
          },
          iterations: {
            message: {
              no: '当前版本号：{0}，不存在预发号，确认使用 {1} 作为预发版本号？',
              add: '当前版本号：{0}，预发版本类型为{1}，迭代号为：{2}，是否使用 {3} 作为预发版本号？'
            },
            input: {
              message: '请输入迭代版本号：',
              validate: (val: any) => {
                val = val.trim();
                if (val.length <= 0) {
                  return '迭代版本号不能为空';
                } else if (!val.test(/([1-9]\d*)/)) {
                  return '迭代版本号格式不正确';
                }
                return true;
              }
            }
          }
        },
        annotate: {
          message: '是否添加说明？',
          no: '无说明',
          short: '短说明',
          long: '长说明（将使用文本编辑器打开）',
          default: ''
        },
        file: {
          message: '是否更新 package.json 中的版本号？',
          default: true
        },
        push: {
          message: '是否推送 tags 到远程仓库？',
          default: true
        },
        error: {
          exists: '当前版本号 {0} 已存在，请重新输入',
          format: '版本号格式不符合 Semver语义化标准，请重新输入'
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
                symbol: '▇',
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
            size: 10,
            range: 10,
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
      message: '日志管理',
      title: '主菜单 > 日志管理',
      build: {
        message: '生成日志',
        description: '自动计算需要生成的日志',
        success: '生成日志成功',
        error: '生成日志失败，是否重试？',
        translate: {
          check: {
            message: '由于 其他语言 将使用 Google翻译，是否检查连接状态？',
            success: '连接 Google翻译 成功',
            fail: '连接失败',
            retry: '是否重试？',
            error: '无法连接 Google翻译，暂时不能生成日志'
          },
          fail: {
            retry: '翻译失败，是否重试？'
          },
          translateing: '翻译进度：'
        }
      },
      rebuild: {
        message: '重新生成',
        description: '将会删除之前生成的所有日志文件，重新生成日志文件',
        confirm: {
          message: '此操作可能需要较长的时间，是否继续？',
          description: '此操作将会删除之前生成的所有日志文件，并重新生成，可能需要一定的时间'
        }
      },
      clean: {
        message: '清理日志',
        description: '删除之前生成的所有日志文件',
        confirm: {
          message: '此操作将会删除之前生成的所有日志文件，是否继续？',
          description: '此过程不可逆'
        },
        retry: {
          message: '清理日志失败，是否重试？',
          default: true
        }
      },
      loading: {
        git: {
          tag: {
            reading: '正在读取本地 git 仓库 tag ...',
            success: '读取本地 git 仓库 tag 成功',
            retry: {
              message: '读取 tag 失败，是否重试？',
              default: true
            }
          },
          messages: {
            reading: '正在读取本地 git 仓库提交消息 ...',
            success: '读取本地 git 仓库 提交消息 成功',
            retry: {
              message: '读取 提交信息 失败，是否重试？',
              default: true
            }
          }
        },
        history: {
          diffing: '正在对比 ...',
          done: {
            success: {
              build: '开始生成日志 ...',
              no: '没有需要生成的日志'
            },
            fail: {
              message: '没有找到记录文件 {0}，是否生成所有日志？',
              description: '这将会清理掉之前生成的所有日志文件，并重新生成，可能需要一定的时间',
              default: true
            }
          }
        },
        build: {
          message: '正在生成日志 ...',
          success: '生成日志成功',
          fail: '生成日志失败，是否重试？'
        },
        translate: {
          connect: {
            message: '正在连接 Google翻译，并检查是否可用...',
            success: '连接 Google翻译 成功',
            fail: '连接 Google翻译 失败'
          },
          process: {
            message: '正在翻译日志 ...',
            success: '翻译成功',
            fail: '翻译失败，错误信息如下：'
          }
        },
        write: {
          message: '正在写入日志文件 ...',
          success: '写入日志成功',
          retry: '写入日志失败，是否重试？',
          fail: '写入日志失败'
        },
        clean: {
          message: '正在清理日志 ...',
          success: '清理日志成功'
        }
      }
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

export default user;
